import { rankFor } from "../store.js";

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></>,
    spark: <><path d="m12 3-1.7 5.3L5 10l5.3 1.7L12 17l1.7-5.3L19 10l-5.3-1.7z" /><path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7z" /></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4" /></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 4.5v17M8 6h8M8 10h7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.6h.3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.6v.3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.6h-.2a1.7 1.7 0 0 0-1.6 1z" /></>,
  };
  return <svg className="ui-icon" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Header({ state, onReset, onLogout }) {
  const { rank } = rankFor(state.xp);
  const initials = state.name.slice(0, 2).toUpperCase();
  return (
    <>
      <aside className="app-sidebar">
        <div className="sidebar-brand"><span className="brand-mark">P</span><span>Pico <em>Labs</em></span></div>
        <div className="workspace-switcher"><span className="workspace-dot" /><span>Personal workspace</span><span className="chevron">⌄</span></div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          <a className="nav-item active" href="#overview"><Icon name="grid" /> Overview</a>
          <a className="nav-item" href="#learning-path"><Icon name="map" /> Learning path <span className="nav-count">{state.completed.length}/20</span></a>
          <a className="nav-item" href="#practice"><Icon name="spark" /> Practice lab</a>
          <a className="nav-item" href="#achievements"><Icon name="trophy" /> Achievements</a>
          <p className="nav-label nav-label-spaced">Resources</p>
          <a className="nav-item" href="#library"><Icon name="book" /> Course library</a>
          <a className="nav-item" href="#settings"><Icon name="settings" /> Settings</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card"><div className="plan-icon">✦</div><div><strong>Explorer plan</strong><span>3 of 20 missions live</span></div><span className="plan-arrow">↗</span></div>
          <div className="sidebar-user"><span className="avatar avatar-small">{initials || "PL"}</span><span><strong>{state.name}</strong><small>{rank.name}</small></span><button className="more-button" onClick={() => window.confirm("Reset all progress on this device?") && onReset()} aria-label="Reset progress">•••</button><button className="logout-button" onClick={onLogout} aria-label="Sign out" title="Sign out">↪</button></div>
        </div>
      </aside>
      <header className="app-topbar">
        <div className="topbar-crumb"><span className="mobile-brand"><span className="brand-mark">P</span> Pico Labs</span><span className="crumb-muted">Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
        <div className="topbar-actions">
          <button className="search-button" aria-label="Search"><span>⌕</span><span className="search-label">Search anything</span><kbd>⌘ K</kbd></button>
          <div className="top-streak"><span>✦</span><strong>{state.streak}</strong><small>day streak</small></div>
          <div className="avatar">{initials || "PL"}</div>
        </div>
      </header>
    </>
  );
}
