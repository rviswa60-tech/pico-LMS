import { useCallback, useEffect, useState } from "react";
import { PicoProvider } from "./components/Pico.jsx";
import { useProgress } from "./store.js";
import { LEVELS } from "./data/levels.js";
import { getCurrentUser, logoutAccount } from "./api.js";
import { getPyodide } from "./python.js";
import Welcome from "./components/Welcome.jsx";
import AuthPage from "./components/AuthPage.jsx";
import Header from "./components/Header.jsx";
import Roadmap from "./components/Roadmap.jsx";
import LevelView from "./components/LevelView.jsx";
import Assessment from "./components/Assessment.jsx";

function pathFor(path) {
  const [pathname, query = ""] = path.split("?");
  return { pathname, params: new URLSearchParams(query) };
}

function safeRedirect(value) { return value && value.startsWith("/") && !value.startsWith("//") ? value : "/app"; }

export default function App() {
  const progress = useProgress();
  const [route, setRoute] = useState(() => window.location.pathname + window.location.search);
  const [auth, setAuth] = useState({ loading: true, user: null });

  const navigate = useCallback((next) => { window.history.pushState({}, "", next); setRoute(next); window.scrollTo(0, 0); }, []);
  useEffect(() => { const onPop = () => setRoute(window.location.pathname + window.location.search); window.addEventListener("popstate", onPop); return () => window.removeEventListener("popstate", onPop); }, []);
  useEffect(() => { getCurrentUser().then((result) => { setAuth({ loading: false, user: result.user }); progress.hydrate(result.user, result.dashboard); }).catch(() => setAuth({ loading: false, user: null })); }, [progress.hydrate]);

  const onAuthSuccess = useCallback((result, next = "/app") => { setAuth({ loading: false, user: result.user }); progress.hydrate(result.user, result.dashboard); navigate(safeRedirect(next)); }, [navigate, progress]);
  const onLogout = useCallback(async () => { try { await logoutAccount(); } catch { /* session may already be expired */ } setAuth({ loading: false, user: null }); navigate("/"); }, [navigate]);
  const current = pathFor(route);

  if (auth.loading) return <div className="app-loading"><span className="brand-mark">P</span><p>Loading your workspace…</p></div>;
  const isApp = current.pathname === "/app" || current.pathname.startsWith("/app/");
  const isAuth = ["/signin", "/register", "/forgot-password", "/reset-password"].includes(current.pathname);
  const next = safeRedirect(current.params.get("next"));

  let content;
  if (isApp && !auth.user) content = <AuthPage mode="signin" next={route} onNavigate={navigate} onSuccess={onAuthSuccess} />;
  else if (current.pathname === "/signin") content = <AuthPage mode="signin" next={next} onNavigate={navigate} onSuccess={onAuthSuccess} />;
  else if (current.pathname === "/register") content = <AuthPage mode="register" onNavigate={navigate} onSuccess={onAuthSuccess} />;
  else if (current.pathname === "/forgot-password") content = <AuthPage mode="forgot" onNavigate={navigate} onSuccess={onAuthSuccess} />;
  else if (current.pathname === "/reset-password") content = <AuthPage mode="reset" token={current.params.get("token") || ""} onNavigate={navigate} onSuccess={onAuthSuccess} />;
  else if (isAuth) content = <AuthPage mode="signin" onNavigate={navigate} onSuccess={onAuthSuccess} />;
  else if (auth.user) content = <Welcome authenticated onSignIn={() => navigate("/app")} onRegister={() => navigate("/app")} onContinue={() => navigate("/app")} />;
  else content = <Welcome onSignIn={() => navigate("/signin?next=/app")} onRegister={() => navigate("/register")} />;

  // Pico is useful on the public landing page and inside the learning app,
  // but stays out of focused authentication forms.
  return <PicoProvider showDock={!isAuth && (!isApp || Boolean(auth.user))}>{isApp && auth.user ? <Main progress={progress} onLogout={onLogout} /> : content}</PicoProvider>;
}

function Main({ progress, onLogout }) {
  const [active, setActive] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [justUnlocked, setJustUnlocked] = useState(null);
  useEffect(() => { getPyodide().catch(() => {}); }, []);
  if (active) {
    const next = LEVELS[active.n] || null;
    return <><Header state={progress.state} onReset={progress.reset} onLogout={onLogout} /><main className="page"><LevelView key={active.id} level={active} nextLevel={next} progress={progress} onExit={() => setActive(null)} onComplete={() => { setJustUnlocked(next ? next.id : null); setActive(null); }} /></main></>;
  }
  if (assessment) return <><Header state={progress.state} onReset={progress.reset} onLogout={onLogout} /><main className="page"><Assessment gateAfter={assessment} onExit={() => setAssessment(null)} onComplete={() => setAssessment(null)} /></main></>;
  return <><Header state={progress.state} onReset={progress.reset} onLogout={onLogout} /><main className="page"><Roadmap levels={LEVELS} state={progress.state} completed={progress.state.completed} justUnlocked={justUnlocked} onOpen={(level) => setActive(level)} onAssessment={setAssessment} /></main></>;
}
