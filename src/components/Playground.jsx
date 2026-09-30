import { useRef, useState } from "react";
import { runPython } from "../python.js";

function CodeEditor({ value, onChange, onRun, errorLine }) {
  const trap = useRef(true); // Esc releases the Tab key so keyboard users can leave the editor
  const lines = value.split("\n").length;

  const setCaret = (el, pos) =>
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = pos;
    });

  const onKeyDown = (e) => {
    const t = e.target;
    if (e.key === "Escape") {
      trap.current = false;
    } else if (e.key === "Tab" && !e.shiftKey && trap.current) {
      e.preventDefault();
      const s = t.selectionStart;
      onChange(value.slice(0, s) + "    " + value.slice(t.selectionEnd));
      setCaret(t, s + 4);
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun();
    } else if (e.key === "Enter") {
      // keep indentation, and indent after a line ending with ":"
      e.preventDefault();
      const s = t.selectionStart;
      const before = value.slice(0, s);
      const line = before.split("\n").pop();
      let indent = line.match(/^\s*/)[0];
      if (line.trimEnd().endsWith(":")) indent += "    ";
      onChange(before + "\n" + indent + value.slice(t.selectionEnd));
      setCaret(t, s + 1 + indent.length);
    }
  };

  return (
    <div className="editor">
      <div className="gutter" aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={i + 1 === errorLine ? "ln err" : "ln"}>
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        value={value}
        rows={lines}
        wrap="off"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="Python code editor"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => (trap.current = true)}
      />
    </div>
  );
}

export default function Playground({
  initial,
  assertions,
  onRun,
  onCodeChange,
  runLabel = "Run",
  showReset = true,
}) {
  const [code, setCode] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const update = (v) => {
    setCode(v);
    onCodeChange && onCodeChange(v);
  };

  const run = async () => {
    if (busy) return;
    setBusy(true);
    const r = await runPython(code, { assertions });
    setResult(r);
    setBusy(false);
    onRun && onRun(r, code);
  };

  const errorLine = result && !result.ok && result.error ? result.error.line : null;

  return (
    <div className="playground">
      <CodeEditor value={code} onChange={update} onRun={run} errorLine={errorLine} />
      <div className="pg-bar">
        <button className="btn" onClick={run} disabled={busy}>
          {busy ? "Running…" : runLabel}
        </button>
        {showReset && (
          <button
            className="btn btn-ghost"
            onClick={() => {
              update(initial);
              setResult(null);
            }}
          >
            Reset code
          </button>
        )}
        <span className="dim small">Ctrl/Cmd + Enter to run</span>
      </div>
      <div className="output" aria-live="polite">
        {busy && <p className="dim">Running. The first run downloads Python, so it can take a few seconds.</p>}
        {!busy && result && (
          <>
            {result.output && <pre className="out-text">{result.output.trimEnd()}</pre>}
            {!result.ok && result.error && (
              <div className="bug">
                <strong>
                  Found a small bug{result.error.line ? ` on line ${result.error.line}` : ""}.
                </strong>
                <pre>{result.error.summary}</pre>
              </div>
            )}
            {result.ok && !result.output && <p className="dim">Ran fine, but nothing was printed.</p>}
          </>
        )}
        {!busy && !result && <p className="dim">Output appears here.</p>}
      </div>
    </div>
  );
}
