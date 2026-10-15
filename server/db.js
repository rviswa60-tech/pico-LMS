import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { LEVELS } from "../src/data/levels.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, "pico.sqlite"));
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL,
    email TEXT,
    password_hash TEXT,
    email_verified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS course_progress (
    user_id INTEGER NOT NULL,
    level_id TEXT NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    hints_used INTEGER NOT NULL DEFAULT 0,
    had_error INTEGER NOT NULL DEFAULT 0,
    completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, level_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    level_id TEXT,
    kind TEXT NOT NULL,
    passed INTEGER NOT NULL DEFAULT 0,
    score INTEGER,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

function addColumnIfMissing(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((item) => item.name === column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

// Safe additive migrations for databases created by the earlier guest-only build.
addColumnIfMissing("users", "email", "TEXT");
addColumnIfMissing("users", "password_hash", "TEXT");
addColumnIfMissing("users", "email_verified", "INTEGER NOT NULL DEFAULT 0");
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email) WHERE email IS NOT NULL");

export function seedCourse() {
  db.exec("CREATE TABLE IF NOT EXISTS course_levels (id TEXT PRIMARY KEY, title TEXT NOT NULL, has_content INTEGER NOT NULL, content_json TEXT)");
  const insert = db.prepare("INSERT OR IGNORE INTO course_levels (id, title, has_content, content_json) VALUES (?, ?, ?, ?)");
  for (const level of LEVELS) insert.run(level.id, level.title, level.content ? 1 : 0, JSON.stringify(level.content || null));
}
seedCourse();

export const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

export function createUser(displayName) {
  const result = db.prepare("INSERT INTO users (display_name) VALUES (?)").run(displayName.trim().slice(0, 40));
  return getUser(Number(result.lastInsertRowid));
}

export function createAccount({ displayName, email, passwordHash }) {
  const result = db.prepare("INSERT INTO users (display_name, email, password_hash) VALUES (?, ?, ?)").run(displayName.trim().slice(0, 80), normalizeEmail(email), passwordHash);
  return getUser(Number(result.lastInsertRowid));
}

export function getUser(id) {
  return db.prepare("SELECT id, display_name, email, email_verified, created_at FROM users WHERE id = ?").get(id);
}

export function getUserWithPasswordByEmail(email) {
  return db.prepare("SELECT id, display_name, email, password_hash, email_verified, created_at FROM users WHERE email = ?").get(normalizeEmail(email));
}

export function createSession({ id, userId, expiresAt }) {
  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(id, userId, expiresAt);
}

export function getSessionUser(sessionId) {
  const row = db.prepare("SELECT sessions.user_id, sessions.expires_at FROM sessions WHERE sessions.id = ?").get(sessionId);
  if (!row || new Date(row.expires_at).getTime() <= Date.now()) {
    if (row) db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
    return null;
  }
  return getUser(row.user_id);
}

export function deleteSession(sessionId) { db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId); }
export function deleteUserSessions(userId) { db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId); }

export function createPasswordReset(tokenHash, userId, expiresAt) {
  db.prepare("DELETE FROM password_reset_tokens WHERE user_id = ? OR expires_at <= CURRENT_TIMESTAMP").run(userId);
  db.prepare("INSERT INTO password_reset_tokens (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(tokenHash, userId, expiresAt);
}

export function consumePasswordReset(tokenHash) {
  const row = db.prepare("SELECT token_hash, user_id, expires_at, used_at FROM password_reset_tokens WHERE token_hash = ?").get(tokenHash);
  if (!row || row.used_at || new Date(row.expires_at).getTime() <= Date.now()) return null;
  db.prepare("UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE token_hash = ?").run(tokenHash);
  return row;
}

export function updatePassword(userId, passwordHash) {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, userId);
  deleteUserSessions(userId);
}

export function getProgress(userId) {
  const rows = db.prepare("SELECT level_id, xp, hints_used, had_error, completed_at FROM course_progress WHERE user_id = ? ORDER BY completed_at").all(userId);
  return { rows, completed: rows.map((row) => row.level_id), xp: rows.reduce((sum, row) => sum + row.xp, 0), hintsUsed: rows.reduce((sum, row) => sum + row.hints_used, 0) };
}

export function getDashboard(userId) {
  const progress = getProgress(userId);
  const activity = db.prepare("SELECT type, created_at FROM activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 30").all(userId);
  const attempts = db.prepare("SELECT kind, passed, score, created_at FROM attempts WHERE user_id = ? ORDER BY created_at DESC LIMIT 30").all(userId);
  return { ...progress, activity, attempts, streak: calculateStreak(activity) };
}

function calculateStreak(activity) {
  const days = new Set(activity.map((row) => row.created_at.slice(0, 10)));
  if (!days.size) return 0;
  let count = 0;
  const day = new Date();
  while (days.has(day.toISOString().slice(0, 10))) { count += 1; day.setUTCDate(day.getUTCDate() - 1); }
  return count;
}

export function levelsForUser(userId) {
  const progress = getProgress(userId);
  const levels = db.prepare("SELECT id, title, has_content FROM course_levels ORDER BY CAST(SUBSTR(id, 2) AS INTEGER)").all();
  return levels.map((level, index) => ({ ...level, completed: progress.completed.includes(level.id), unlocked: index === 0 || progress.completed.includes(levels[index - 1].id) }));
}
