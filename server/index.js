import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db, createUser, getUser, getProgress, getDashboard, levelsForUser } from "./db.js";

const PORT = Number(process.env.PORT || 8787);
const SECRET = process.env.PICO_AUTH_SECRET || "pico-local-development-secret";
const root = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.join(root, "..", "dist");
const json = (value) => JSON.stringify(value);
const headers = { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "http://localhost:5173", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS" };

function encode(value) { return Buffer.from(JSON.stringify(value)).toString("base64url"); }
function tokenFor(user) { const body = encode({ sub: user.id, name: user.display_name, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 }); const signature = crypto.createHmac("sha256", SECRET).update(body).digest("base64url"); return `${body}.${signature}`; }
function userFromRequest(req) {
  const raw = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!raw) return null;
  try { const [body, signature] = raw.split("."); const expected = crypto.createHmac("sha256", SECRET).update(body).digest("base64url"); if (signature !== expected) return null; const payload = JSON.parse(Buffer.from(body, "base64url")); if (payload.exp < Date.now()) return null; return getUser(payload.sub); } catch { return null; }
}
async function readBody(req) { let raw = ""; for await (const chunk of req) raw += chunk; return raw ? JSON.parse(raw) : {}; }
function send(res, status, body) { res.writeHead(status, headers); res.end(json(body)); }
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
function auth(req, res) { const user = userFromRequest(req); if (!user) { send(res, 401, { error: "Authentication required" }); return null; } return user; }

async function route(req, res) {
  if (req.method === "OPTIONS") { res.writeHead(204, headers); return res.end(); }
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === "GET" && url.pathname === "/api/health") return send(res, 200, { ok: true, service: "pico-lms-api", time: new Date().toISOString() });
    if (req.method === "POST" && url.pathname === "/api/auth/guest") {
      const body = await readBody(req); if (!body.name?.trim()) return send(res, 400, { error: "Name is required" });
      const user = createUser(body.name); return send(res, 201, { token: tokenFor(user), user, dashboard: getDashboard(user.id) });
    }
    if (req.method === "GET" && !url.pathname.startsWith("/api/") && (await serveStatic(res, url.pathname))) return;
    const user = auth(req, res); if (!user) return;
    if (req.method === "GET" && url.pathname === "/api/me") return send(res, 200, { user, dashboard: getDashboard(user.id) });
    if (req.method === "GET" && url.pathname === "/api/dashboard") return send(res, 200, getDashboard(user.id));
    if (req.method === "GET" && url.pathname === "/api/levels") return send(res, 200, { levels: levelsForUser(user.id) });
    if (req.method === "POST" && url.pathname.startsWith("/api/progress/")) {
      const levelId = url.pathname.split("/").pop(); const body = await readBody(req);
      const level = db.prepare("SELECT id FROM course_levels WHERE id = ?").get(levelId); if (!level) return send(res, 404, { error: "Level not found" });
      db.prepare(`INSERT INTO course_progress (user_id, level_id, xp, hints_used, had_error) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, level_id) DO UPDATE SET xp = MAX(course_progress.xp, excluded.xp), hints_used = course_progress.hints_used + excluded.hints_used, had_error = MAX(course_progress.had_error, excluded.had_error), completed_at = CURRENT_TIMESTAMP`).run(user.id, levelId, Math.max(0, Number(body.xp || 0)), Math.max(0, Number(body.hintsUsed || 0)), body.hadError ? 1 : 0);
      db.prepare("INSERT INTO activity (user_id, type, metadata) VALUES (?, ?, ?)").run(user.id, "level_completed", JSON.stringify({ levelId }));
      return send(res, 200, getDashboard(user.id));
    }
    if (req.method === "POST" && url.pathname === "/api/attempts") {
      const body = await readBody(req); db.prepare("INSERT INTO attempts (user_id, level_id, kind, passed, score, metadata) VALUES (?, ?, ?, ?, ?, ?)").run(user.id, body.levelId || null, body.kind || "unknown", body.passed ? 1 : 0, body.score == null ? null : Number(body.score), JSON.stringify(body.metadata || {})); return send(res, 201, { ok: true });
    }
    if (req.method === "POST" && url.pathname === "/api/activity") { const body = await readBody(req); db.prepare("INSERT INTO activity (user_id, type, metadata) VALUES (?, ?, ?)").run(user.id, body.type || "session", JSON.stringify(body.metadata || {})); return send(res, 201, { ok: true }); }
    if (req.method === "DELETE" && url.pathname === "/api/me/progress") { db.prepare("DELETE FROM course_progress WHERE user_id = ?").run(user.id); db.prepare("DELETE FROM attempts WHERE user_id = ?").run(user.id); db.prepare("DELETE FROM activity WHERE user_id = ?").run(user.id); return send(res, 200, { ok: true }); }
    if (req.method === "GET" && !url.pathname.startsWith("/api/") && (await serveStatic(res, "/index.html"))) return;
    send(res, 404, { error: "Not found" });
  } catch (error) { console.error(error); send(res, 500, { error: "Internal server error" }); }
}

const server = http.createServer(route);
server.listen(PORT, () => console.log(`Pico Labs API running at http://localhost:${PORT}`));

process.on("SIGINT", () => { db.close(); server.close(() => process.exit(0)); });
