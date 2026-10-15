import { useState } from "react";
import { PicoFace } from "./Pico.jsx";

export default function Welcome({ onStart }) {
  const [name, setName] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };
  return (
    <main className="welcome-shell">
      <nav className="welcome-nav"><div className="sidebar-brand"><span className="brand-mark">P</span><span>Pico <em>Labs</em></span></div><div className="welcome-nav-links"><span>How it works</span><span>Curriculum</span><span>For teams</span></div><span className="welcome-login">Already learning? <u>Sign in</u></span></nav>
      <section className="welcome-hero">
        <div className="welcome-copy"><div className="launch-pill"><span className="launch-dot" /> THE FRIENDLY WAY TO LEARN PYTHON <span>↗</span></div><h1>Build skills.<br /><span>Ship confidently.</span></h1><p className="lead">A focused, guided learning workspace that turns Python fundamentals into real developer momentum.</p><form onSubmit={submit} className="welcome-form"><label htmlFor="name">Let’s get you set up</label><div className="name-input"><span>✦</span><input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="What should we call you?" autoFocus maxLength={30} /><button className="btn" disabled={!name.trim()}>Start free <span>→</span></button></div><small>Free forever · No credit card required</small></form><div className="social-proof"><div className="avatar-stack"><span>AS</span><span>MK</span><span>JR</span><span>+</span></div><span>Join <strong>2,400+</strong> curious builders</span></div></div>
        <div className="welcome-visual"><div className="visual-glow" /><div className="floating-note note-top"><span className="note-icon mint">✓</span><div><strong>Lesson complete</strong><small>+40 XP earned</small></div></div><div className="product-preview"><div className="preview-top"><div className="preview-brand"><span className="brand-mark mini">P</span> Pico Labs</div><span className="preview-dots">•••</span></div><div className="preview-body"><div className="preview-sidebar"><span className="preview-line bright" /><span className="preview-line" /><span className="preview-line" /><span className="preview-line short" /></div><div className="preview-content"><div className="preview-kicker">YOUR LEARNING PATH</div><h3>Good morning, Alex.</h3><div className="preview-card"><div className="preview-card-art"><span>{`{ }`}</span></div><div><small>UP NEXT · MISSION 01</small><strong>The Gate Guardian</strong><span>20 min · Beginner</span><b>Continue →</b></div></div><div className="preview-stats"><span><i>03</i><small>missions</small></span><span><i>120</i><small>XP earned</small></span><span><i>04</i><small>day streak</small></span></div></div></div></div><div className="floating-note note-bottom"><PicoFace mood="happy" size={58} /><div><strong>Pico is here</strong><small>Personal guidance, every step</small></div></div></div>
      </section>
      <section className="welcome-trust"><span>Designed for real progress</span><i /> <span>Learn by doing</span><i /> <span>Stay in flow</span><i /> <span>Build your portfolio</span></section>
    </main>
  );
}
