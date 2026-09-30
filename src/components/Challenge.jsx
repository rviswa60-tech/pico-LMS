import { useEffect, useRef, useState } from "react";
import Playground from "./Playground.jsx";
import { usePico } from "./Pico.jsx";

const HINT_TITLES = ["Small nudge", "Stronger guidance", "An example", "Explanation", "Full solution"];

export default function Challenge({ spec, boss = false, noteHint, onPass }) {
  const pico = usePico();
  const [verdict, setVerdict] = useState(null); // { passed, problems[] }
  const [hintsShown, setHintsShown] = useState(0); // 0..5
  const fails = useRef(0);
  const hadError = useRef(false);
  const lastActivity = useRef(Date.now());
  const lastOffer = useRef(0);
  const passed = verdict && verdict.passed;

  const revealHint = () => {
    setHintsShown((h) => {
      if (h >= 5) return h;
      noteHint && noteHint();
      return h + 1;
    });
    pico.say("Here's a hint. Try it before you reveal the next one.", { mood: "helping" });
  };

  // Clicking Pico while on this screen reveals the next hint
  useEffect(() => {
    pico.clickRef.current = passed ? null : revealHint;
    return () => {
      pico.clickRef.current = null;
    };
  });

  const offerHelp = () => {
    const now = Date.now();
    if (now - lastOffer.current < 90000) return; // don't nag
    lastOffer.current = now;
    pico.say("You've been working on this for a while. Would you like a small hint?", {
      mood: "curious",
      actions: [
        { label: "Try myself", onClick: () => pico.setMood("encouraging") },
        { label: "Ask Pico", primary: true, onClick: revealHint },
      ],
    });
  };

  // Struggle detection: long inactivity
  useEffect(() => {
    if (passed) return;
    const id = setInterval(() => {
      if (Date.now() - lastActivity.current > 75000) {
        lastActivity.current = Date.now();
        offerHelp();
      }
    }, 5000);
    return () => clearInterval(id);
  }, [passed]);

  const handleRun = (res, code) => {
    lastActivity.current = Date.now();

    if (!res.ok) {
      hadError.current = true;
      fails.current += 1;
      pico.say("I found a small bug. Let's investigate it together.", { mood: "detective" });
      setVerdict({ passed: false, problems: [] });
      if (fails.current >= 3) offerHelp();
      return;
    }

    const problems = [];
    if (spec.expected !== undefined && res.output.trim() !== spec.expected.trim()) {
      problems.push({
        title: "The output doesn't match yet",
        expected: spec.expected,
        got: res.output.trim() || "(nothing printed)",
      });
    }
    if (res.assertionError) {
      problems.push({ title: res.assertionError.summary.replace(/^AssertionError:\s*/, "") });
    }
    for (const rule of spec.rules || []) {
      if (!new RegExp(rule.re).test(code)) problems.push({ title: rule.msg });
    }

    if (problems.length) {
      fails.current += 1;
      setVerdict({ passed: false, problems });
      pico.say("Close. Check the notes below the editor.", { mood: "encouraging" });
      if (fails.current >= 3) offerHelp();
    } else {
      setVerdict({ passed: true, problems: [] });
      pico.say(boss ? "BOSS DEFEATED! That was brilliant." : "Challenge complete. Nicely done!", {
        mood: "celebrating",
        ttl: 6000,
      });
    }
  };

  return (
    <div className="challenge">
      <div className={boss ? "brief brief-boss" : "brief"}>
        {boss && <h3 className="boss-name">{spec.name}</h3>}
        {boss && <p className="dim">{spec.story}</p>}
        <h3>{boss ? "Your task" : spec.title}</h3>
        <p className="prompt">{spec.prompt}</p>
      </div>

      <Playground
        initial={spec.starter}
        assertions={spec.assertions}
        runLabel="Run and check"
        onRun={handleRun}
        onCodeChange={() => (lastActivity.current = Date.now())}
      />

      {verdict && !verdict.passed && verdict.problems.length > 0 && (
        <div className="notes">
          <h4>Why didn't this pass?</h4>
          {verdict.problems.map((p, i) => (
            <div key={i} className="note">
              <p>{p.title}</p>
              {p.expected !== undefined && (
                <div className="diff">
                  <div>
                    <span className="dim small">Expected</span>
                    <pre>{p.expected}</pre>
                  </div>
                  <div>
                    <span className="dim small">Yours</span>
                    <pre>{p.got}</pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {passed ? (
        <div className="success">
          <h3>{boss ? "Boss defeated" : "Challenge complete"}</h3>
          <button
            className="btn"
            onClick={() => onPass({ hadError: hadError.current, hintsUsed: hintsShown })}
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="hints">
          <div className="hint-head">
            <h4>Need a hand?</h4>
            <button className="btn btn-ghost btn-small" onClick={revealHint} disabled={hintsShown >= 5}>
              {hintsShown === 0 ? "Ask Pico for a hint" : hintsShown >= 5 ? "No more hints" : "Another hint"}
            </button>
          </div>
          {hintsShown === 0 && (
            <p className="dim small">Hints start small and only get stronger if you ask. You can also click Pico.</p>
          )}
          {Array.from({ length: hintsShown }, (_, i) => (
            <div key={i} className="hint">
              <strong>{HINT_TITLES[i]}</strong>
              {i < 4 ? <p>{spec.hints[i]}</p> : <pre>{spec.solution}</pre>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
