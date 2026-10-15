import { useEffect, useState } from "react";
import { usePico } from "./Pico.jsx";
import { rankFor } from "../store.js";

const Check = () => <span className="status-check">✓</span>;
const Lock = () => <span className="status-lock">⌁</span>;

export default function Roadmap({ levels, state, completed, justUnlocked, onOpen, onAssessment }) {
  const pico = usePico();
  const todayLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()).toUpperCase();
  const [filter, setFilter] = useState("all");
  const passedGates = new Set(state?.assessmentPasses || []);
  const gateFor = (levelNumber) => [3, 6, 9, 12, 15, 18].filter((gate) => gate < levelNumber && !passedGates.has(gate)).at(-1) || null;
  const assessmentLocked = (index) => Boolean(gateFor(index + 1));
  const currentIdx = levels.findIndex((l, i) => !completed.includes(l.id) && !assessmentLocked(i));
  const lastCompleted = levels.reduce((last, level, index) => completed.includes(level.id) ? index : last, -1);
  const cur = currentIdx === -1 ? Math.max(0, lastCompleted) : currentIdx;
  const next = levels[cur];
  const live = levels.filter((l) => l.content).length;
  const done = levels.filter((l) => completed.includes(l.id)).length;
  const activeDays = Math.min(7, Math.max(0, state?.streak || 0));
  const tests = [3, 6, 9, 12, 15, 18].filter((gate) => completed.includes(`L${gate}`) && !(state?.assessmentPasses || []).includes(gate));
  useEffect(() => {
    pico.setContext({ surface: "dashboard", greeting: "Welcome back! Ready for your next mission?", topic: next?.title || "your next mission", body: next?.content?.intro || "Choose an open mission to keep your Python progress moving." });
  }, [next?.id, done]);
  useEffect(() => {
    if (tests[0] === 3 && onAssessment) {
      pico.say("Module 4 is locked. Attend the Competency Check after Module 3 to unlock it.", { mood: "encouraging", actions: [{ label: "Attend test module", primary: true, onClick: () => onAssessment(3) }], ttl: 0 });
    }
  }, [tests[0], onAssessment]);
  const status = (i) => completed.includes(levels[i].id) ? "done" : assessmentLocked(i) ? "locked" : i === cur ? "current" : i < cur ? "done" : "locked";
  const testStatus = (gate) => passedGates.has(gate) ? "assessment-done" : completed.includes(`L${gate}`) ? "assessment-current" : "assessment-locked";

  const click = (i) => {
    const l = levels[i];
    const s = status(i);
    if (s === "locked") {
      const gate = gateFor(i + 1);
      if (gate && onAssessment) pico.say(`Complete the competency check after Module ${gate} before starting this module.`, { mood: "encouraging", actions: [{ label: "Take competency check", primary: true, onClick: () => onAssessment(gate) }] });
      else pico.say(`Finish "${levels[Math.max(0, i - 1)].title}" first to open this level.`, { mood: "confused" });
    } else if (!l.content) {
      pico.say("This mission is on the roadmap. More content is coming soon.", { mood: "thinking" });
    } else onOpen(l);
  };

  const timeline = levels.flatMap((level, index) => {
    const items = [{ type: "level", level, index }];
    if ([3, 6, 9, 12, 15, 18].includes(index + 1)) items.push({ type: "assessment", gate: index + 1 });
    return items;
  }).filter((item) => filter === "all" || (item.type === "level" && status(item.index) === filter) || (item.type === "assessment" && ((filter === "done" && testStatus(item.gate) === "assessment-done") || (filter === "current" && testStatus(item.gate) === "assessment-current"))));

  return (
    <div className="dashboard" id="overview">
      <section className="dashboard-heading">
        <div><p className="eyebrow">{todayLabel}</p><h1>Good morning, learner.</h1><p className="heading-copy">Build the skills that compound. One focused mission at a time.</p></div>
        <div className="heading-actions"><button className="icon-button" aria-label="Notifications">♢<span className="notification-dot" /></button><button className="btn btn-dark" onClick={() => click(cur)}>{done ? "Continue learning" : "Start learning"}<span>→</span></button></div>
      </section>

      <section className="metric-grid" aria-label="Your learning summary">
        <div className="metric-card"><span className="metric-icon mint">⌁</span><div><span className="metric-label">Current level</span><strong>{rankFor(state?.xp || 0).rank.name}</strong><small>Keep building momentum</small></div></div>
        <div className="metric-card"><span className="metric-icon violet">◈</span><div><span className="metric-label">Course progress</span><strong>{done} <small className="of-total">/ {levels.length}</small></strong><small>{live} missions ready to play</small></div></div>
        <div className="metric-card"><span className="metric-icon orange">✦</span><div><span className="metric-label">Experience points</span><strong>{state?.xp || 0} XP</strong><small>Earn XP as you ship</small></div></div>
        <div className="metric-card"><span className="metric-icon blue">↗</span><div><span className="metric-label">Learning streak</span><strong>{state?.streak || 0} <small className="of-total">days</small></strong><small>Show up, get better</small></div></div>
      </section>
      {tests.length > 0 && <section className="assessment-banner" role="status" aria-live="polite"><div><p className="eyebrow">MODULE {tests[0] + 1} LOCKED</p><h2>Attend the Competency Check after Module {tests[0]}</h2><p>Complete and pass the test module to unlock Module {tests[0] + 1}.</p></div><button className="btn btn-light" onClick={() => onAssessment(tests[0])}>Attend test module <span>→</span></button></section>}

      <section className="continue-card">
        <div className="continue-art"><div className="art-orb orb-one" /><div className="art-orb orb-two" /><div className="art-grid" /><div className="art-code"><span>01</span> <i>print</i>(<b>"hello, world"</b>)<br /><span>02</span> <i>level</i> = <em>01</em><br /><span>03</span> <i>ship</i>(level)</div><div className="art-badge">✦</div></div>
        <div className="continue-copy"><div className="card-kicker"><span className="live-dot" /> UP NEXT <span className="kicker-divider" /> MISSION {String(next.n).padStart(2, "0")}</div><h2>{next.content ? next.content.mission.split(" – ")[1] || next.title : next.title}</h2><p>{next.content?.intro || "Your next chapter is being prepared. Explore the learning path while you wait."}</p><div className="continue-meta"><span>◷ 20 min</span><span>◈ Beginner</span><span>⚡ +100 XP</span></div><button className="btn btn-light" onClick={() => click(cur)}>{done ? "Resume mission" : "Begin mission"}<span>→</span></button></div>
      </section>

      <div className="content-grid">
        <section className="path-section" id="learning-path">
          <div className="section-heading"><div><p className="eyebrow">THE CURRICULUM</p><h2>Your learning path</h2></div><div className="filter-tabs">{[["all", "All missions"], ["current", "In progress"], ["done", "Completed"]].map(([key, label]) => <button key={key} className={filter === key ? "selected" : ""} onClick={() => setFilter(key)}>{label}</button>)}</div></div>
          <div className="course-list">
            {timeline.map((item) => {
              if (item.type === "assessment") {
                const s = testStatus(item.gate); const ready = s === "assessment-current";
                return <button key={`assessment-${item.gate}`} className={`course-row assessment-row ${s}`} onClick={() => ready ? onAssessment(item.gate) : pico.say(`Complete Module ${item.gate} before attending this competency check.`, { mood: "confused" })}>
                  <span className="course-number">{s === "assessment-done" ? <Check /> : <span className="test-mark">✓</span>}</span>
                  <span className="course-main"><span className="course-topline"><strong>Competency Check · Modules 1–{item.gate}</strong>{ready && <span className="current-pill">REQUIRED NEXT</span>}{s === "assessment-done" && <span className="current-pill done-test">PASSED</span>}</span><span className="course-sub">{ready ? `Pass this test to unlock Module ${item.gate + 1}.` : s === "assessment-done" ? `Module ${item.gate + 1} is unlocked.` : `Complete Module ${item.gate} first.`}</span></span>
                  <span className="course-side">{s === "assessment-done" ? <span className="done-label">Passed</span> : ready ? <span className="open-label">Attend test →</span> : <span className="lock-label">Locked</span>}</span>
                </button>;
              }
              const l = item.level;
              const originalIndex = item.index;
              const s = status(originalIndex);
              return <button key={l.id} className={`course-row ${s} ${justUnlocked === l.id ? "just-unlocked" : ""}`} onClick={() => click(originalIndex)}>
                <span className="course-number">{s === "done" ? <Check /> : s === "locked" ? <Lock /> : String(l.n).padStart(2, "0")}</span>
                <span className="course-main"><span className="course-topline"><strong>{l.title}</strong>{s === "current" && <span className="current-pill">CURRENT</span>}{!l.content && <span className="coming-pill">COMING SOON</span>}</span><span className="course-sub">{l.content ? l.content.intro : "A new skill chapter for your developer journey"}</span></span>
                <span className="course-side">{s === "done" ? <span className="done-label">Completed</span> : s === "current" ? <span className="open-label">Open mission <b>→</b></span> : <span className="lock-label">Locked</span>}</span>
              </button>;
            })}
          </div>
        </section>

        <aside className="insights-column">
          <section className="insight-card progress-card" id="practice"><div className="section-heading compact"><div><p className="eyebrow">AT A GLANCE</p><h3>Completion</h3></div><button className="more-button" aria-label="More completion options">•••</button></div><div className="progress-ring-wrap"><div className="progress-ring" style={{ "--progress": `${Math.round((done / levels.length) * 100)}%` }}><strong>{Math.round((done / levels.length) * 100)}%</strong><span>complete</span></div><div className="ring-copy"><strong>{done} of {levels.length}</strong><span>missions completed</span><span className="positive">+{Math.max(1, levels.length - done)} next to explore</span></div></div><div className="mini-progress"><span /><span /><span /><span className="muted" /></div><div className="mini-legend"><span>Foundation</span><span>Core Python</span></div></section>
          <section className="insight-card activity-card" id="achievements"><div className="section-heading compact"><div><p className="eyebrow">CONSISTENCY</p><h3>Weekly activity</h3></div><span className="activity-total">{(done * 0.6).toFixed(1)}h</span></div><div className="activity-chart">{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => { const active = activeDays > 0 && i >= 7 - activeDays; return <div className="activity-day" key={`${day}-${i}`}><div className={`activity-bar bar-${active ? (i === 6 ? "active" : "soft") : "empty"}`} style={{ height: `${active ? (i === 6 ? 58 : 28 + (i % 3) * 10) : 14}%` }} /><span>{day}</span></div>; })}</div><p className="activity-note"><span className="green-dot" /> {activeDays ? "Keep showing up to build your streak" : "Start a mission today to build your streak"}</p></section>
          <section className="insight-card badge-card" id="library"><div className="section-heading compact"><div><p className="eyebrow">MILESTONES</p><h3>Recent badges</h3></div><span className="badge-count">0 / 6</span></div><div className="badge-empty"><span>✦</span><p>Your first badge is waiting.<br /><small>Complete a challenge to earn it.</small></p></div></section>
        </aside>
      </div>
    </div>
  );
}
