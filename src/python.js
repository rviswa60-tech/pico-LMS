// Runs real Python in the browser using Pyodide (WebAssembly).
// The runtime (~10 MB) is fetched from a CDN on first use, then cached by the browser.

const BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
let pyPromise = null;

export function getPyodide() {
  if (!pyPromise) {
    pyPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = BASE + "pyodide.js";
      s.onload = async () => {
        try {
          resolve(await window.loadPyodide({ indexURL: BASE }));
        } catch (e) {
          reject(e);
        }
      };
      s.onerror = () =>
        reject(new Error("Could not load the Python runtime. Check your internet connection."));
      document.head.appendChild(s);
    });
    pyPromise.catch(() => {
      pyPromise = null; // allow retry
    });
  }
  return pyPromise;
}

function parseError(e) {
  const msg = String(e && e.message ? e.message : e);
  const lines = msg.trim().split("\n");
  const summary = lines[lines.length - 1];
  const matches = [...msg.matchAll(/File "<exec>", line (\d+)/g)];
  const line = matches.length ? Number(matches[matches.length - 1][1]) : null;
  return { summary, line, full: msg };
}

/**
 * Runs `code`, then (optionally) `assertions` in the same namespace.
 * Returns { ok, output, error?, assertionError? }.
 */
export async function runPython(code, { assertions } = {}) {
  let py;
  try {
    py = await getPyodide();
  } catch (e) {
    return { ok: false, output: "", error: { summary: e.message, line: null, full: e.message } };
  }
  let output = "";
  py.setStdout({ batched: (s) => (output += s + "\n") });
  py.setStderr({ batched: (s) => (output += s + "\n") });
  const globals = py.globals.get("dict")();
  try {
    await py.runPythonAsync(code, { globals });
    let assertionError = null;
    if (assertions) {
      try {
        await py.runPythonAsync(assertions, { globals });
      } catch (e) {
        assertionError = parseError(e);
      }
    }
    return { ok: true, output, assertionError };
  } catch (e) {
    return { ok: false, output, error: parseError(e) };
  } finally {
    globals.destroy();
  }
}
