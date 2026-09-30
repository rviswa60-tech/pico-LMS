import { useState } from "react";
import { PicoFace } from "./Pico.jsx";

export default function Welcome({ onStart }) {
  const [name, setName] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };
  return (
    <main className="welcome">
      <div className="welcome-pico">
        <PicoFace mood={name ? "happy" : "curious"} size={200} />
      </div>
      <h1>Hi, I'm Pico.</h1>
      <p className="lead">
        I'll be your guide from your first line of Python to a real developer portfolio. Missions, bosses, bugs to hunt
        and a path that opens as you go.
      </p>
      <form onSubmit={submit} className="welcome-form">
        <label htmlFor="name">What should I call you?</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoFocus maxLength={30} />
        <button className="btn" disabled={!name.trim()}>
          Start my journey
        </button>
      </form>
    </main>
  );
}
