import { useEffect, useRef, useState } from "react";
import { BADGES } from "../data/levels.js";
import { usePico } from "./Pico.jsx";

function Confetti() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = ref.current;
    const ctx = c.getContext("2d");
    const w = (c.width = window.innerWidth);
    const h = (c.height = window.innerHeight);
    const cols = ["#F2B544", "#5FE3B2", "#7FB2FF", "#FF7A6B", "#ECEBF7"];
    const ps = Array.from({ length: 150 }, () => ({
      x: w / 2,
      y: h * 0.35,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 15 - 4,
      s: 5 + Math.random() * 6,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      c: cols[Math.floor(Math.random() * cols.length)],
    }));
    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of ps) {
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        if (p.y < h + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
          ctx.restore();
        }
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="confetti" aria-hidden="true" />;
}

function useCountUp(target, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!target) return;
    const t0 = performance.now();
    let raf;
    const f = (t) => {
      const k = Math.min((t - t0) / ms, 1);
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export default function Reward({ level, nextLevel, xp, badges, replay, onContinue }) {
  const pico = usePico();
  const shown = useCountUp(xp);

  useEffect(() => {
    pico.say("Level complete! Look at that XP.", { mood: "celebrating", ttl: 7000 });
  }, []);

  return (
    <div className="reward">
      <Confetti />
      <p className="dim">{level.content.mission}</p>
      <h2 className="reward-title">Boss defeated</h2>
      <div className="xp-big" aria-label={`${xp} experience points earned`}>
        +{shown} XP
      </div>
      {replay && <p className="dim small">You've already cleared this level, so no new XP this time.</p>}

      {badges.length > 0 && (
        <div className="badge-row">
          {badges.map((id, i) => (
            <div key={id} className="badge" style={{ animationDelay: `${0.5 + i * 0.25}s` }}>
              <div className="badge-medal" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="9" r="6" />
                  <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
                </svg>
              </div>
              <strong>{BADGES[id].name}</strong>
              <span className="dim small">{BADGES[id].desc}</span>
            </div>
          ))}
        </div>
      )}

      <div className="unlock">
        {nextLevel ? (
          <>
            <div className="unlock-lock" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path className="shackle" d="M8 11V8a4 4 0 0 1 7.5-2" />
              </svg>
            </div>
            <h3>Level {nextLevel.n} unlocked</h3>
            <p className="dim">{nextLevel.title}</p>
          </>
        ) : (
          <h3>That's every level so far</h3>
        )}
      </div>

      <button className="btn" onClick={onContinue}>
        Back to the roadmap
      </button>
    </div>
  );
}
