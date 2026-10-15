const API_BASE = "/api";

function readCookie(name) {
  return document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1) || "";
}

export async function getCsrf() {
  const response = await fetch(`${API_BASE}/auth/csrf`, { credentials: "include" });
  if (!response.ok) throw new Error("Could not start a secure session.");
  const data = await response.json();
  return data.csrfToken || readCookie("pico_csrf");
}

async function request(path, options = {}) {
  const method = options.method || "GET";
  const headers = { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) };
  if (method !== "GET") headers["X-CSRF-Token"] = await getCsrf();
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error || `Request failed: ${response.status}`); error.status = response.status; throw error; }
  return data;
}

export async function getCurrentUser() { return request("/me"); }
export async function registerAccount(payload) { return request("/auth/register", { method: "POST", body: JSON.stringify(payload) }); }
export async function loginAccount(payload) { return request("/auth/login", { method: "POST", body: JSON.stringify(payload) }); }
export async function logoutAccount() { return request("/auth/logout", { method: "POST" }); }
export async function requestPasswordReset(email) { return request("/auth/request-reset", { method: "POST", body: JSON.stringify({ email }) }); }
export async function resetPassword(token, password) { return request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }); }
export async function syncProgress(levelId, payload) { return request(`/progress/${levelId}`, { method: "POST", body: JSON.stringify(payload) }); }
export async function recordAttempt(payload) { return request("/attempts", { method: "POST", body: JSON.stringify(payload) }); }
export async function recordActivity(payload) { return request("/activity", { method: "POST", body: JSON.stringify(payload) }); }
export async function resetRemoteProgress() { return request("/me/progress", { method: "DELETE" }); }
export async function getAssessment(gateAfter) { return request(`/assessments/${gateAfter}`); }
export async function submitAssessment(gateAfter, payload) { return request(`/assessments/${gateAfter}/submit`, { method: "POST", body: JSON.stringify(payload) }); }
