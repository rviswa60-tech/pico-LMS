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
`);

export function seedCourse() {
  db.exec(`CREATE TABLE IF NOT EXISTS course_levels (id TEXT PRIMARY KEY, title TEXT NOT NULL, has_content INTEGER NOT NULL, content_json TEXT)`);
  const insert = db.prepare(`INSERT OR IGNORE INTO course_levels (id, title, has_content, content_json) VALUES (?, ?, ?, ?)`);
  for (const level of LEVELS) insert.run(level.id, level.title, level.content ? 1 : 0, JSON.stringify(level.content || null));
}

seedCourse();

export function createUser(displayName) {
  const result = db.prepare("INSERT INTO users (display_name) VALUES (?)").run(displayName.trim().slice(0, 40));
  return getUser(Number(result.lastInsertRowid));
}

export function getUser(id) {
  return db.prepare("SELECT id, display_name, created_at FROM users WHERE id = ?").get(id);
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
  return db.prepare("SELECT id, title, has_content FROM course_levels ORDER BY CAST(SUBSTR(id, 2) AS INTEGER)").all().map((level) => ({ ...level, completed: progress.completed.includes(level.id) }));
}
