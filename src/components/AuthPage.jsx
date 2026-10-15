import { useMemo, useState } from "react";
import { loginAccount, registerAccount, requestPasswordReset, resetPassword } from "../api.js";

const safeNext = (value) => value && value.startsWith("/") && !value.startsWith("//") ? value : "/app";

function Eye({ open }) { return <span aria-hidden="true">{open ? "◉" : "◌"}</span>; }

function PasswordField({ label, value, onChange, autoComplete, hint }) {
  const [visible, setVisible] = useState(false);
  return <div className="auth-field"><label>{label}</label><div className="password-wrap"><input type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} minLength={8} required /><button type="button" className="password-toggle" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"}><Eye open={visible} /></button></div>{hint && <span className="field-hint">{hint}</span>}</div>;
}

function AuthAside({ mode }) {
  return <aside className="auth-aside"><div className="auth-aside-grid" /><div className="auth-aside-brand"><span className="brand-mark">P</span><span>Pico <em>Labs</em></span></div><div className="auth-aside-copy"><span className="launch-pill"><span className="launch-dot" /> PYTHON, BUILT DIFFERENTLY</span><h1>{mode === "register" ? "Your next line starts here." : "Keep your momentum."}</h1><p>{mode === "register" ? "A focused workspace for learning Python by writing, testing, and shipping real code." : "Pick up where you left off and turn another concept into working code."}</p></div><div className="auth-mini-product"><div className="mini-product-top"><span><i /> <i /> <i /></span><small>pico-labs / current-mission</small></div><div className="mini-code"><span className="code-muted">01</span> <b>def</b> greet(name):<br /><span className="code-muted">02</span>&nbsp;&nbsp;&nbsp;&nbsp;<b>return</b> <i>f"Hello, {"{"}name{"}"}!"</i><br /><span className="code-muted">03</span><br /><span className="code-muted">04</span> <em>✓ Challenge passed</em></div><div className="mini-progress"><span style={{ width: "68%" }} /></div><small className="mini-progress-label">Module progress <strong>68%</strong></small></div><div className="auth-aside-footer"><span>⌁</span> Learn in small steps. Build with confidence.</div></aside>;
}

export default function AuthPage({ mode = "signin", next = "/app", token = "", onNavigate, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devResetToken, setDevResetToken] = useState("");

  const copy = useMemo(() => ({
    signin: { eyebrow: "WELCOME BACK", title: "Welcome back.", body: "Pick up where you left off and keep building your Python skills.", submit: "Sign in" },
    register: { eyebrow: "START LEARNING", title: "Start your Python journey.", body: "Create your account and start learning through real coding practice.", submit: "Create free account" },
    forgot: { eyebrow: "ACCOUNT RECOVERY", title: "Reset your password.", body: "Enter your email and we’ll send recovery instructions if an account exists.", submit: "Send recovery email" },
    reset: { eyebrow: "NEW PASSWORD", title: "Choose a new password.", body: "Use a strong password you do not reuse anywhere else.", submit: "Update password" },
  })[mode], [mode]);

  const submit = async (event) => {
    event.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      if (mode === "signin") {
        const result = await loginAccount({ email, password }); onSuccess(result, safeNext(next));
      } else if (mode === "register") {
        if (password !== confirm) throw new Error("Passwords do not match.");
        const result = await registerAccount({ name, email, password, termsAccepted: terms }); onSuccess(result, "/app");
      } else if (mode === "forgot") {
        const result = await requestPasswordReset(email); setMessage(result.message); if (result.devResetToken) setDevResetToken(result.devResetToken);
      } else {
        if (password !== confirm) throw new Error("Passwords do not match.");
        const result = await resetPassword(token, password); onSuccess(result, "/app");
      }
    } catch (submitError) { setError(submitError.message || "Something went wrong. Try again."); } finally { setBusy(false); }
  };

  return <main className="auth-shell"><AuthAside mode={mode} /><section className="auth-main"><div className="auth-mobile-brand"><span className="brand-mark">P</span><span>Pico <em>Labs</em></span></div><div className="auth-form-card"><div className="auth-form-heading"><span className="eyebrow">{copy.eyebrow}</span><h2>{copy.title}</h2><p>{copy.body}</p></div>{error && <div className="auth-alert error" role="alert">{error}</div>}{message && <div className="auth-alert success" role="status">{message}</div>}{devResetToken && <div className="dev-reset-note"><strong>Local development link</strong><a href={`/reset-password?token=${encodeURIComponent(devResetToken)}`}>Open password reset</a><small>This helper is only returned outside production.</small></div>}
      <form className="auth-form" onSubmit={submit} noValidate>
        {mode === "register" && <div className="auth-field"><label htmlFor="name">Full name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></div>}
        {mode !== "reset" && <div className="auth-field"><label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div>}
        {mode !== "forgot" && <PasswordField label="Password" value={password} onChange={setPassword} autoComplete={mode === "signin" ? "current-password" : "new-password"} hint={mode === "register" ? "Use at least 8 characters." : ""} />}
        {(mode === "register" || mode === "reset") && <PasswordField label="Confirm password" value={confirm} onChange={setConfirm} autoComplete="new-password" />}
        {mode === "register" && <label className="terms-check"><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} required /><span>I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</span></label>}
        {mode === "signin" && <div className="auth-form-meta"><label className="remember-check"><input type="checkbox" /> <span>Remember me</span></label><button type="button" className="text-button" onClick={() => onNavigate("/forgot-password")}>Forgot password?</button></div>}
        <button className="btn auth-submit" disabled={busy}>{busy ? "Please wait…" : copy.submit}<span>→</span></button>
      </form>
      {mode === "signin" && <p className="auth-switch">New to Pico Labs? <button onClick={() => onNavigate("/register")}>Create an account</button></p>}
      {mode === "register" && <p className="auth-switch">Already have an account? <button onClick={() => onNavigate("/signin")}>Sign in</button></p>}
      {mode === "forgot" && <p className="auth-switch"><button onClick={() => onNavigate("/signin")}>← Back to sign in</button></p>}
      {mode === "reset" && <p className="auth-switch">Remembered your password? <button onClick={() => onNavigate("/signin")}>Sign in</button></p>}
    </div><p className="auth-legal">Pico Labs keeps your account secure with encrypted passwords and expiring sessions.</p></section></main>;
}
