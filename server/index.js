import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  db, createUser, createAccount, getUser, getUserWithPasswordByEmail, normalizeEmail,
  createSession, getSessionUser, deleteSession, deleteUserSessions, createPasswordReset,
  consumePasswordReset, updatePassword, getProgress, getDashboard, levelsForUser,
  assessmentAttempts, recordAssessmentAttempt,
} from "./db.js";
import { LEVELS } from "../src/data/levels.js";

const PORT = Number(process.env.PORT || 8787);
const SESSION_DAYS = 30;
const RESET_MINUTES = 30;
const root = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.join(root, "..", "dist");
const rateBuckets = new Map();
const ASSESSMENT_GATES = [3, 6, 9, 12, 15, 18];
const json = (value) => JSON.stringify(value);

function responseHeaders(req) {
  const origin = req.headers.origin;
  const allowed = origin === "http://localhost:5173" || origin === "http://127.0.0.1:5173";
  return {
    "Content-Type": "application/json; charset=utf-8",
    ...(allowed ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Credentials": "true" } : {}),
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  };
}

function send(req, res, status, body, extra = {}) { res.writeHead(status, { ...responseHeaders(req), ...extra }); res.end(json(body)); }
function parseCookies(req) { return Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map((part) => { const index = part.indexOf("="); return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())]; })); }
function setCookies(res, values) { res.setHeader("Set-Cookie", values); }
function cookie(name, value, options = {}) { const parts = [`${name}=${encodeURIComponent(value)}`, "Path=/", "SameSite=Lax"]; if (options.httpOnly) parts.push("HttpOnly"); if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`); if (process.env.NODE_ENV === "production") parts.push("Secure"); return parts.join("; "); }
function randomToken(bytes = 32) { return crypto.randomBytes(bytes).toString("base64url"); }
function hashToken(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function safeUser(user) { return user ? { id: user.id, name: user.display_name, email: user.email, emailVerified: Boolean(user.email_verified), createdAt: user.created_at } : null; }

function hashPassword(password) { const salt = crypto.randomBytes(16).toString("hex"); const hash = crypto.scryptSync(password, salt, 64).toString("hex"); return `scrypt$${salt}$${hash}`; }
function verifyPassword(password, encoded) {
  try { const [, salt, stored] = encoded.split("$"); const actual = crypto.scryptSync(password, salt, 64).toString("hex"); return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(stored, "hex")); } catch { return false; }
}
function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email)); }
function validPassword(password) { return typeof password === "string" && password.length >= 8 && password.length <= 128; }
function rateLimit(req, key, max = 8, windowMs = 60_000) {
  const address = req.socket.remoteAddress || "unknown";
  const bucketKey = `${key}:${address}`;
  const now = Date.now();
  const bucket = rateBuckets.get(bucketKey) || { count: 0, start: now };
  if (now - bucket.start > windowMs) { bucket.count = 0; bucket.start = now; }
  bucket.count += 1; rateBuckets.set(bucketKey, bucket);
  return bucket.count <= max;
}

async function readBody(req) { let raw = ""; for await (const chunk of req) { raw += chunk; if (raw.length > 100_000) throw new Error("Request too large"); } return raw ? JSON.parse(raw) : {}; }
function csrfToken(req, res) { const current = parseCookies(req).pico_csrf || randomToken(24); if (!parseCookies(req).pico_csrf) setCookies(res, [cookie("pico_csrf", current, { maxAge: 3600 })]); return current; }
function csrfValid(req) { const cookies = parseCookies(req); const header = req.headers["x-csrf-token"]; if (!cookies.pico_csrf || !header) return false; const expected = Buffer.from(cookies.pico_csrf); const actual = Buffer.from(String(header)); return expected.length === actual.length && crypto.timingSafeEqual(expected, actual); }
function requireCsrf(req, res) { if (!csrfValid(req)) { send(req, res, 403, { error: "Your security token expired. Refresh and try again." }); return false; } return true; }
function issueSession(user, res) { const id = randomToken(32); const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString(); createSession({ id, userId: user.id, expiresAt }); setCookies(res, [cookie("pico_session", id, { httpOnly: true, maxAge: SESSION_DAYS * 86400 })]); }
function clearSession(req, res) { const sessionId = parseCookies(req).pico_session; if (sessionId) deleteSession(sessionId); setCookies(res, [cookie("pico_session", "", { httpOnly: true, maxAge: 0 }), cookie("pico_csrf", "", { maxAge: 0 })]); }
function auth(req, res) { const sessionId = parseCookies(req).pico_session; const user = sessionId ? getSessionUser(sessionId) : null; if (!user) { send(req, res, 401, { error: "Authentication required" }); return null; } return user; }

function assessmentQuestions(gateAfter) {
  const levels = LEVELS.slice(Math.max(0, gateAfter - 3), gateAfter);
  const questions = levels.flatMap((level) => [
    level.content?.challenge ? { level, kind: "challenge", problem: level.content.challenge } : null,
    level.content?.boss ? { level, kind: "boss", problem: level.content.boss } : null,
  ].filter(Boolean));
  return questions.slice(0, 5).map(({ level, kind, problem }, index) => ({
    id: `${level.id}-${kind}-assessment`,
    levelId: level.id,
    type: "coding",
    difficulty: index + 1,
    difficultyLabel: ["Foundation", "Core", "Applied", "Advanced", "Stretch"][index],
    title: problem.title || problem.name,
    prompt: problem.prompt,
    starter: problem.starter,
    sampleOutput: problem.expected,
    topic: level.title,
    // expected output, rules and hidden tests deliberately stay server-side
    grader: { expected: problem.expected, rules: problem.rules || [], assertions: problem.assertions || [] },
  }));
}

async function serveStatic(res, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(distRoot, `.${requested}`);
  if (!filePath.startsWith(path.resolve(distRoot))) return false;
  try {
    const content = await fs.readFile(filePath);
    const type = filePath.endsWith(".html") ? "text/html; charset=utf-8" : filePath.endsWith(".css") ? "text/css; charset=utf-8" : filePath.endsWith(".js") ? "text/javascript; charset=utf-8" : "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable" }); res.end(content); return true;
  } catch { return false; }
}

async function route(req, res) {
  if (req.method === "OPTIONS") { res.writeHead(204, responseHeaders(req)); return res.end(); }
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === "GET" && url.pathname === "/api/health") return send(req, res, 200, { ok: true, service: "pico-lms-api", time: new Date().toISOString() });
    if (req.method === "GET" && url.pathname === "/api/auth/csrf") return send(req, res, 200, { csrfToken: csrfToken(req, res) });
    if (req.method === "GET" && !url.pathname.startsWith("/api/") && (await serveStatic(res, url.pathname))) return;

    if (req.method === "POST" && url.pathname === "/api/auth/register") {
      if (!rateLimit(req, "register") || !requireCsrf(req, res)) return;
      const body = await readBody(req); const name = String(body.name || "").trim(); const email = normalizeEmail(body.email); const password = body.password;
      if (name.length < 2 || name.length > 80) return send(req, res, 400, { error: "Enter your full name." });
      if (!validEmail(email)) return send(req, res, 400, { error: "Enter a valid email address." });
      if (!validPassword(password)) return send(req, res, 400, { error: "Password must be between 8 and 128 characters." });
      if (body.termsAccepted !== true) return send(req, res, 400, { error: "Accept the Terms and Privacy Policy to continue." });
      if (getUserWithPasswordByEmail(email)) return send(req, res, 409, { error: "An account with this email already exists. Try signing in instead." });
      const user = createAccount({ displayName: name, email, passwordHash: hashPassword(password) }); issueSession(user, res);
      return send(req, res, 201, { user: safeUser(user), dashboard: getDashboard(user.id) });
    }
    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      if (!rateLimit(req, "login") || !requireCsrf(req, res)) return;
      const body = await readBody(req); const account = getUserWithPasswordByEmail(body.email);
      if (!account || !account.password_hash || !verifyPassword(body.password, account.password_hash)) return send(req, res, 401, { error: "Email or password is incorrect." });
      const user = getUser(account.id); issueSession(user, res); return send(req, res, 200, { user: safeUser(user), dashboard: getDashboard(user.id) });
    }
    if (req.method === "POST" && url.pathname === "/api/auth/guest") {
      if (!requireCsrf(req, res)) return;
      const body = await readBody(req); if (!body.name?.trim()) return send(req, res, 400, { error: "Name is required" });
      const user = createUser(body.name); issueSession(user, res); return send(req, res, 201, { user: safeUser(user), dashboard: getDashboard(user.id) });
    }
    if (req.method === "POST" && url.pathname === "/api/auth/request-reset") {
      if (!rateLimit(req, "reset", 5) || !requireCsrf(req, res)) return;
      const body = await readBody(req); const account = getUserWithPasswordByEmail(body.email); const response = { ok: true, message: "If an account matches that email, recovery instructions are on the way." };
      if (account) { const raw = randomToken(32); createPasswordReset(hashToken(raw), account.id, new Date(Date.now() + RESET_MINUTES * 60000).toISOString()); if (process.env.NODE_ENV !== "production") response.devResetToken = raw; }
      return send(req, res, 200, response);
    }
    if (req.method === "POST" && url.pathname === "/api/auth/reset-password") {
      if (!rateLimit(req, "reset-complete", 8) || !requireCsrf(req, res)) return;
      const body = await readBody(req); if (!validPassword(body.password)) return send(req, res, 400, { error: "Password must be between 8 and 128 characters." });
      const reset = consumePasswordReset(hashToken(body.token)); if (!reset) return send(req, res, 400, { error: "That recovery link is invalid or expired. Request a new one." });
      updatePassword(reset.user_id, hashPassword(body.password)); const user = getUser(reset.user_id); issueSession(user, res); return send(req, res, 200, { user: safeUser(user), dashboard: getDashboard(user.id) });
    }
    if (req.method === "POST" && url.pathname === "/api/auth/logout") { if (!requireCsrf(req, res)) return; clearSession(req, res); return send(req, res, 200, { ok: true }); }

    const user = auth(req, res); if (!user) return;
    if (req.method === "GET" && url.pathname === "/api/me") return send(req, res, 200, { user: safeUser(user), dashboard: getDashboard(user.id) });
    if (req.method === "GET" && url.pathname === "/api/dashboard") return send(req, res, 200, getDashboard(user.id));
    if (req.method === "GET" && url.pathname === "/api/levels") return send(req, res, 200, { levels: levelsForUser(user.id) });
    if (req.method === "GET" && url.pathname.startsWith("/api/assessments/")) {
      const gateAfter = Number(url.pathname.split("/").pop());
      if (!ASSESSMENT_GATES.includes(gateAfter)) return send(req, res, 404, { error: "Assessment not found" });
      const progress = getProgress(user.id);
      if (!progress.completed.includes(`L${gateAfter}`)) return send(req, res, 403, { error: "Complete the prerequisite modules first." });
      return send(req, res, 200, { gateAfter, title: `Python competency test after Module ${gateAfter}`, passPolicy: { codingQuestions: 5, codingQuestionsRequired: 5 }, questions: assessmentQuestions(gateAfter).map(({ grader, ...question }) => question), attempts: assessmentAttempts(user.id, gateAfter) });
    }
    if (req.method === "POST" && url.pathname.startsWith("/api/assessments/") && url.pathname.endsWith("/submit")) {
      if (!requireCsrf(req, res) || !rateLimit(req, "assessment-submit", 10)) return;
      const parts = url.pathname.split("/"); const gateAfter = Number(parts[3]);
      if (!ASSESSMENT_GATES.includes(gateAfter)) return send(req, res, 404, { error: "Assessment not found" });
      const progress = getProgress(user.id);
      if (!progress.completed.includes(`L${gateAfter}`)) return send(req, res, 403, { error: "Complete the prerequisite modules first." });
      const body = await readBody(req); const questions = assessmentQuestions(gateAfter); const answers = body.answers || {};
      const verifiedQuestionIds = Array.isArray(body.verifiedQuestionIds) ? body.verifiedQuestionIds : [];
      const objectiveScore = verifiedQuestionIds.filter((id) => questions.some((question) => question.id === id)).length;
      const objectiveTotal = questions.length; const codingPassed = process.env.PICO_EXECUTOR_TRUSTED === "1" && objectiveScore === objectiveTotal;
      const passed = codingPassed;
      const attempt = recordAssessmentAttempt({ userId: user.id, gateAfter, objectiveScore, objectiveTotal, codingPassed, passed, answers: Object.fromEntries(Object.keys(answers).map((id) => [id, { submitted: Boolean(String(answers[id] || "").trim()) }])) });
      return send(req, res, 201, { attempt, passed, nextUnlocked: passed ? `L${gateAfter + 1}` : null, feedback: passed ? "Competency confirmed. The next module is unlocked." : "Every coding question must pass its visible and hidden tests before the next module unlocks." });
    }
    if (req.method === "POST" && url.pathname.startsWith("/api/progress/")) {
      if (!requireCsrf(req, res)) return;
      const levelId = url.pathname.split("/").pop(); const body = await readBody(req); const levelNumber = Number(levelId.replace("L", ""));
      const level = db.prepare("SELECT id FROM course_levels WHERE id = ?").get(levelId); if (!level) return send(req, res, 404, { error: "Level not found" });
      const access = levelsForUser(user.id).find((item) => item.id === levelId);
      if (!access?.unlocked) return send(req, res, 403, { error: levelNumber > 3 ? "Pass the competency check before unlocking this module." : "Complete the previous module before unlocking this one." });
      db.prepare(`INSERT INTO course_progress (user_id, level_id, xp, hints_used, had_error) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, level_id) DO UPDATE SET xp = MAX(course_progress.xp, excluded.xp), hints_used = course_progress.hints_used + excluded.hints_used, had_error = MAX(course_progress.had_error, excluded.had_error), completed_at = CURRENT_TIMESTAMP`).run(user.id, levelId, Math.max(0, Number(body.xp || 0)), Math.max(0, Number(body.hintsUsed || 0)), body.hadError ? 1 : 0);
      db.prepare("INSERT INTO activity (user_id, type, metadata) VALUES (?, ?, ?)").run(user.id, "level_completed", JSON.stringify({ levelId })); return send(req, res, 200, getDashboard(user.id));
    }
    if (req.method === "POST" && url.pathname === "/api/attempts") { if (!requireCsrf(req, res)) return; const body = await readBody(req); db.prepare("INSERT INTO attempts (user_id, level_id, kind, passed, score, metadata) VALUES (?, ?, ?, ?, ?, ?)").run(user.id, body.levelId || null, body.kind || "unknown", body.passed ? 1 : 0, body.score == null ? null : Number(body.score), JSON.stringify(body.metadata || {})); return send(req, res, 201, { ok: true }); }
    if (req.method === "POST" && url.pathname === "/api/activity") { if (!requireCsrf(req, res)) return; const body = await readBody(req); db.prepare("INSERT INTO activity (user_id, type, metadata) VALUES (?, ?, ?)").run(user.id, body.type || "session", JSON.stringify(body.metadata || {})); return send(req, res, 201, { ok: true }); }
    if (req.method === "DELETE" && url.pathname === "/api/me/progress") { if (!requireCsrf(req, res)) return; db.prepare("DELETE FROM course_progress WHERE user_id = ?").run(user.id); db.prepare("DELETE FROM attempts WHERE user_id = ?").run(user.id); db.prepare("DELETE FROM activity WHERE user_id = ?").run(user.id); return send(req, res, 200, { ok: true }); }
    if (req.method === "GET" && !url.pathname.startsWith("/api/") && (await serveStatic(res, "/index.html"))) return;
    send(req, res, 404, { error: "Not found" });
  } catch (error) { console.error(error); send(req, res, 500, { error: "Internal server error" }); }
}

const server = http.createServer(route);
server.listen(PORT, () => console.log(`Pico Labs API running at http://localhost:${PORT}`));
process.on("SIGINT", () => { db.close(); server.close(() => process.exit(0)); });
