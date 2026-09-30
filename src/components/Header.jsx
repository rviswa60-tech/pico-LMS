import { rankFor } from "../store.js";

export default function Header({ state, onReset }) {
  const { rank, next, pct } = rankFor(state.xp);
  return (
    <header className="top">
      <div className="brand">Pico Labs</div>
      <div className="stats">
        <div className="rank">
          <div className="rank-line">
            <strong>{state.name}</strong>
            <span className="dim small">{rank.name}</span>
          </div>
          <div className="bar" role="progressbar" aria-valuenow={Math.round(pct * 100)} aria-valuemin="0" aria-valuemax="100">
            <div style={{ width: `${Math.round(pct * 100)}%` }} />
          </div>
          <span className="dim small">
            {state.xp} XP{next ? ` · ${next.min - state.xp} to ${next.name}` : ""}
          </span>
        </div>
        <div className="streak" title="Days in a row you've learned">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12 7 14a5 5 0 0 0 10 0c0-2-1-3-2-4 0 2-1 3-2 3 1-3 0-7-1-11z" />
          </svg>
          <strong>{state.streak}</strong>
        </div>
        <button
          className="btn btn-ghost btn-small"
          onClick={() => {
            if (window.confirm("Reset all progress on this device?")) onReset();
          }}
        >
          Reset
        </button>
      </div>
    </header>
  );
}
