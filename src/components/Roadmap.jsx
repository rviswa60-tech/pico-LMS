import { useState } from "react";
import { usePico } from "./Pico.jsx";

const STEP = 124;
const TOP = 80;
const pos = (i) => ({ x: 50 + Math.sin(i * 1.1) * 26, y: TOP + i * STEP });

function pathTo(count) {
  if (count < 1) return "";
  let d = `M ${pos(0).x} ${pos(0).y}`;
  for (let i = 1; i < count; i++) {
    const a = pos(i - 1);
    const b = pos(i);
    d += ` C ${a.x} ${a.y + STEP / 2}, ${b.x} ${b.y - STEP / 2}, ${b.x} ${b.y}`;
  }
  return d;
}

const Check = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);
const Lock = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export default function Roadmap({ levels, completed, justUnlocked, onOpen }) {
  const pico = usePico();
  const [shake, setShake] = useState(null);
  const n = levels.length;
  const H = TOP * 2 + (n - 1) * STEP;
  const currentIdx = levels.findIndex((l) => !completed.includes(l.id));
  const cur = currentIdx === -1 ? n - 1 : currentIdx;

  const status = (i) => (completed.includes(levels[i].id) ? "done" : i === cur ? "current" : i < cur ? "done" : "locked");

  const click = (i) => {
    const l = levels[i];
    const s = status(i);
    if (s === "locked") {
      setShake(l.id);
      setTimeout(() => setShake(null), 500);
      pico.say(`Finish "${levels[i - 1].title}" first to open this level.`, { mood: "confused" });
    } else if (!l.content) {
      pico.say("This mission is still being built. More levels are coming.", { mood: "thinking" });
    } else {
      onOpen(l);
    }
  };

  const next = levels[cur];

  return (
    <div className="roadmap-wrap">
      <div className="next-card">
        <div>
          <p className="dim small">Next up</p>
          <h2>{next.content ? next.content.mission : `Level ${next.n} – ${next.title}`}</h2>
          <p className="dim">{next.title}</p>
        </div>
        <button className="btn" onClick={() => click(cur)}>
          {completed.includes(next.id) ? "Play again" : completed.length ? "Continue" : "Start"}
        </button>
      </div>

      <div className="roadmap" style={{ height: H }}>
        <svg className="road" viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={pathTo(n)} className="road-base" vectorEffect="non-scaling-stroke" />
          <path d={pathTo(cur + 1)} className="road-done" vectorEffect="non-scaling-stroke" />
        </svg>

        {levels.map((l, i) => {
          const p = pos(i);
          const s = status(i);
          const cls = ["node", s, shake === l.id ? "shake" : "", justUnlocked === l.id ? "just-unlocked" : ""].join(" ");
          return (
            <div key={l.id} className="node-slot" style={{ left: `${p.x}%`, top: p.y }}>
              <button
                className={cls}
                onClick={() => click(i)}
                aria-label={`Level ${l.n}: ${l.title}, ${s === "done" ? "completed" : s === "locked" ? "locked" : "unlocked"}`}
              >
                {s === "done" ? <Check /> : s === "locked" ? <Lock /> : <span>{l.n}</span>}
              </button>
              <div className={`node-label ${p.x < 50 ? "right" : "left"}`}>
                <strong>{l.content ? l.content.mission : l.title}</strong>
                {l.content ? (
                  <span className="dim small">{l.title}</span>
                ) : (
                  <span className="dim small">Coming soon</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
