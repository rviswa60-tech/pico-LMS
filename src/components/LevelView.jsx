import { useEffect, useRef, useState } from "react";
import Text from "./Text.jsx";
import Quiz from "./Quiz.jsx";
import Challenge from "./Challenge.jsx";
import Playground from "./Playground.jsx";
import Reward from "./Reward.jsx";
import { usePico } from "./Pico.jsx";

const STEPS = ["Learn", "Quiz", "Challenge", "Boss battle"];

function Learn({ cards, onDone }) {
  const [i, setI] = useState(0);
  const card = cards[i];
  return (
    <div className="panel">
      <p className="dim small">
        Lesson {i + 1} of {cards.length}
      </p>
      <h3>{card.title}</h3>
      <p className="lesson-body">
        <Text>{card.body}</Text>
      </p>
      <p className="dim small">Run the example, then change it and run it again.</p>
      <Playground key={i} initial={card.code} />
      <div className="row-end">
        {i > 0 && (
          <button className="btn btn-ghost" onClick={() => setI(i - 1)}>
            Back
          </button>
        )}
        {i + 1 < cards.length ? (
          <button className="btn" onClick={() => setI(i + 1)}>
            Next lesson
          </button>
        ) : (
          <button className="btn" onClick={onDone}>
            Start the quiz
          </button>
        )}
      </div>
    </div>
  );
}

function BossIntro({ boss, onStart }) {
  const pico = usePico();
  useEffect(() => {
    pico.say(`${boss.name} is waiting. You've got this.`, { mood: "boss", ttl: 6000 });
  }, []);
  return (
    <div className="panel center boss-intro">
      <h2 className="boss-title">Boss battle</h2>
      <h3>{boss.name}</h3>
      <p className="dim">{boss.story}</p>
      <button className="btn" onClick={onStart}>
        Fight
      </button>
    </div>
  );
}

export default function LevelView({ level, nextLevel, progress, onExit, onComplete }) {
  const c = level.content;
  const pico = usePico();
  const [step, setStep] = useState(0);
  const [bossStarted, setBossStarted] = useState(false);
  const [result, setResult] = useState(null);
  const earned = useRef({ xp: 0, badges: new Set() });
  const replay = progress.state.completed.includes(level.id);

  useEffect(() => {
    pico.say(c.intro, { mood: "happy", ttl: 6000 });
    window.scrollTo(0, 0);
  }, []);

  const add = (xp, ...badges) => {
    earned.current.xp += xp;
    badges.filter(Boolean).forEach((b) => earned.current.badges.add(b));
  };

  const finish = (bossInfo) => {
    add(100, c.bossBadge, bossInfo.hadError && "bug_hunter");
    if (bossInfo.hintsUsed === 0) add(20);
    const xp = replay ? 0 : earned.current.xp;
    const badges = [...earned.current.badges].filter((b) => !progress.state.badges.includes(b));
    progress.completeLevel({ id: level.id, xp, badges });
    setResult({ xp, badges });
  };

  if (result) {
    return (
      <Reward
        level={level}
        nextLevel={nextLevel}
        xp={result.xp}
        badges={result.badges}
        replay={replay}
        onContinue={() => onComplete(level)}
      />
    );
  }

  return (
    <div className="level">
      <div className="level-top">
        <button className="btn btn-ghost btn-small" onClick={onExit}>
          Roadmap
        </button>
        <div>
          <p className="dim small">Level {level.n}</p>
          <h2>{c.mission}</h2>
        </div>
      </div>

      <ol className="steps" aria-label="Level progress">
        {STEPS.map((s, i) => (
          <li key={s} className={i < step ? "done" : i === step ? "current" : ""}>
            {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Learn
          cards={c.learn}
          onDone={() => {
            add(10);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <Quiz
          questions={c.quiz}
          onPass={(score, total) => {
            add(score * 10, score === total && "perfect_score");
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <Challenge
          spec={c.challenge}
          noteHint={progress.noteHint}
          onPass={({ hadError, hintsUsed }) => {
            add(40, !progress.state.badges.includes("first_code") && "first_code", hadError && "bug_hunter");
            if (hintsUsed === 0) add(10);
            setStep(3);
          }}
        />
      )}

      {step === 3 &&
        (bossStarted ? (
          <Challenge spec={c.boss} boss noteHint={progress.noteHint} onPass={finish} />
        ) : (
          <BossIntro boss={c.boss} onStart={() => setBossStarted(true)} />
        ))}
    </div>
  );
}
