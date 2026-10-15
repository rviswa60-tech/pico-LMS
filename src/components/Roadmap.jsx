import { useState } from "react";
import { usePico } from "./Pico.jsx";
import { rankFor } from "../store.js";

const Check = () => <span className="status-check">✓</span>;
const Lock = () => <span className="status-lock">⌁</span>;

export default function Roadmap({ levels, state, completed, justUnlocked, onOpen }) {
  const pico = usePico();
  const todayLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date()).toUpperCase();
  const [filter, setFilter] = useState("all");
  const currentIdx = levels.findIndex((l) => !completed.includes(l.id));
  const cur = currentIdx === -1 ? levels.length - 1 : currentIdx;
  const next = levels[cur];
  const live = levels.filter((l) => l.content).length;
  const done = levels.filter((l) => completed.includes(l.id)).length;
  const activeDays = Math.min(7, Math.max(0, state?.streak || 0));
  const status = (i) => completed.includes(levels[i].id) ? "done" : i === cur ? "current" : i < cur ? "done" : "locked";

  const click = (i) => {
    const l = levels[i];
    const s = status(i);
    if (s === "locked") {
      pico.say(`Finish "${levels[Math.max(0, i - 1)].title}" first to open this level.`, { mood: "confused" });
    } else if (!l.content) {
      pico.say("This mission is on the roadmap. More content is coming soon.", { mood: "thinking" });
    } else onOpen(l);
  };

  const visible = levels.filter((l, i) => filter === "all" || status(i) === filter);

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

      <section className="continue-card">
        <div className="continue-art"><div className="art-orb orb-one" /><div className="art-orb orb-two" /><div className="art-grid" /><div className="art-code"><span>01</span> <i>print</i>(<b>"hello, world"</b>)<br /><span>02</span> <i>level</i> = <em>01</em><br /><span>03</span> <i>ship</i>(level)</div><div className="art-badge">✦</div></div>
        <div className="continue-copy"><div className="card-kicker"><span className="live-dot" /> UP NEXT <span className="kicker-divider" /> MISSION {String(next.n).padStart(2, "0")}</div><h2>{next.content ? next.content.mission.split(" – ")[1] || next.title : next.title}</h2><p>{next.content?.intro || "Your next chapter is being prepared. Explore the learning path while you wait."}</p><div className="continue-meta"><span>◷ 20 min</span><span>◈ Beginner</span><span>⚡ +100 XP</span></div><button className="btn btn-light" onClick={() => click(cur)}>{done ? "Resume mission" : "Begin mission"}<span>→</span></button></div>
      </section>

      <div className="content-grid">
        <section className="path-section" id="learning-path">
          <div className="section-heading"><div><p className="eyebrow">THE CURRICULUM</p><h2>Your learning path</h2></div><div className="filter-tabs">{[["all", "All missions"], ["current", "In progress"], ["done", "Completed"]].map(([key, label]) => <button key={key} className={filter === key ? "selected" : ""} onClick={() => setFilter(key)}>{label}</button>)}</div></div>
          <div className="course-list">
            {visible.map((l) => {
              const originalIndex = levels.findIndex((x) => x.id === l.id);
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
