import { useEffect, useMemo, useState } from "react";
import { getAssessment, submitAssessment } from "../api.js";
import { runPython } from "../python.js";

function blockClipboard(event) { event.preventDefault(); event.stopPropagation(); }
function blockClipboardKeys(event) {
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && ["c", "v", "x"].includes(key) || (event.shiftKey && event.key === "Insert")) {
    event.preventDefault(); event.stopPropagation();
  }
}

export default function Assessment({ gateAfter, onExit, onComplete }) {
  const [assessment, setAssessment] = useState(null);
  const [codes, setCodes] = useState({});
  const [outputs, setOutputs] = useState({});
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [result, setResult] = useState(null);

  useEffect(() => {
    getAssessment(gateAfter).then((data) => {
      setAssessment(data);
      setCodes(Object.fromEntries(data.questions.map((question) => [question.id, question.starter || ""])));
      setStatus({ loading: false, error: "" });
    }).catch((error) => setStatus({ loading: false, error: error.message }));
  }, [gateAfter]);

  const question = assessment?.questions[current];
  const answered = useMemo(() => assessment?.questions.filter((item) => String(codes[item.id] || "").trim()).length || 0, [assessment, codes]);
  const runSample = async () => {
    setOutputs((old) => ({ ...old, [question.id]: { loading: true } }));
    const response = await runPython(codes[question.id] || "");
    setOutputs((old) => ({ ...old, [question.id]: response }));
  };
  const submit = async (event) => {
    event.preventDefault();
    if (answered !== assessment.questions.length) return setStatus({ loading: false, error: "Write a solution for all five questions before submitting." });
    setStatus({ loading: true, error: "" });
    try {
      const data = await submitAssessment(gateAfter, { answers: codes, verifiedQuestionIds: [] });
      setResult(data); setStatus({ loading: false, error: "" }); if (data.passed) onComplete?.(data);
    } catch (error) { setStatus({ loading: false, error: error.message }); }
  };

  if (status.loading && !assessment) return <div className="panel center"><p>Loading your competency test…</p></div>;
  if (!assessment) return <div className="panel center"><p>{status.error || "This assessment is unavailable."}</p><button className="btn" onClick={onExit}>Back to roadmap</button></div>;

  return <div className="assessment-page" onCopy={blockClipboard} onCut={blockClipboard} onPaste={blockClipboard} onContextMenu={blockClipboard} onKeyDown={blockClipboardKeys}>
    <div className="level-top"><button className="btn btn-ghost btn-small" onClick={onExit}>Roadmap</button><div><p className="dim small">Competency gate · five coding problems</p><h2>{assessment.title}</h2></div></div>
    <div className="assessment-policy"><strong>Assessment rules</strong><span>Questions increase from Foundation to Stretch. Copy, cut, paste, and context-menu actions are disabled. Hidden tests determine the final result.</span></div>
    {status.error && <div className="auth-alert error" role="alert">{status.error}</div>}
    {result ? <div className={result.passed ? "panel center assessment-result passed" : "panel center assessment-result"}><h3>{result.passed ? "Competency confirmed" : "Assessment submitted"}</h3><p>{result.feedback}</p><p className="dim">Verified coding progress: {result.attempt.objective_score}/{result.attempt.objective_total}.</p><button className="btn" onClick={onExit}>{result.passed ? "Continue learning" : "Return to roadmap"}</button></div> : <form className="assessment-form" onSubmit={submit}>
      <div className="assessment-progress"><div><strong>Question {current + 1} of {assessment.questions.length}</strong><span>{answered} of 5 solutions started</span></div><div className="assessment-progress-bar"><i style={{ width: `${((current + 1) / assessment.questions.length) * 100}%` }} /></div></div>
      <fieldset className="panel assessment-question coding-question" key={question.id}><legend><span className="assessment-difficulty">{question.difficultyLabel}</span>{question.title}</legend><p className="assessment-prompt">{question.prompt}</p><div className="assessment-meta"><span>Topic: {question.topic}</span><span>Sample output: {question.sampleOutput || "Use the statement examples"}</span></div><label className="assessment-code-label" htmlFor={`assessment-code-${question.id}`}>Your Python solution</label><textarea id={`assessment-code-${question.id}`} className="assessment-code" value={codes[question.id] || ""} spellCheck="false" autoCapitalize="off" autoCorrect="off" onChange={(event) => setCodes((old) => ({ ...old, [question.id]: event.target.value }))} />{outputs[question.id] && <div className={outputs[question.id].ok ? "assessment-output" : "assessment-output error"}><strong>{outputs[question.id].ok ? "Sample run" : "Code error"}</strong><pre>{outputs[question.id].output || outputs[question.id].error?.summary || "No output"}</pre></div>}<div className="assessment-question-actions"><button type="button" className="btn btn-ghost btn-small" onClick={runSample}>Run sample</button><span className="dim small">Ctrl/Cmd+C/V/X are disabled</span></div></fieldset>
      <div className="assessment-submit"><button type="button" className="btn btn-ghost" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>Previous</button>{current + 1 < assessment.questions.length ? <button type="button" className="btn" onClick={() => setCurrent((value) => value + 1)}>Next question <span>→</span></button> : <button className="btn" disabled={status.loading}>{status.loading ? "Submitting…" : "Submit assessment"}</button>}</div>
    </form>}
  </div>;
}
