const API_BASE = "/api";
const TOKEN_KEY = "pico-lms-token";

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || `API request failed: ${response.status}`);
  return response.json();
}

export async function createGuest(name) { const result = await request("/auth/guest", { method: "POST", body: JSON.stringify({ name }) }); localStorage.setItem(TOKEN_KEY, result.token); return result; }
export async function syncProgress(levelId, payload) { return request(`/progress/${levelId}`, { method: "POST", body: JSON.stringify(payload) }); }
export async function recordAttempt(payload) { return request("/attempts", { method: "POST", body: JSON.stringify(payload) }); }
export async function recordActivity(payload) { return request("/activity", { method: "POST", body: JSON.stringify(payload) }); }
export async function resetRemoteProgress() { return request("/me/progress", { method: "DELETE" }); }
export function hasSession() { return Boolean(localStorage.getItem(TOKEN_KEY)); }
