import { useState } from "react";
import Text from "./Text.jsx";
import { usePico } from "./Pico.jsx";

export default function Quiz({ questions, onPass }) {
  const pico = usePico();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[i];
  const need = Math.ceil(questions.length * 0.66);

  const choose = (idx) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) {
      setScore((s) => s + 1);
      pico.say("Correct!", { mood: "happy", ttl: 2000 });
    } else {
      pico.say("Not quite. Have a look at why.", { mood: "confused", ttl: 3000 });
    }
  };

  const next = () => {
    if (i + 1 < questions.length) {
      setI(i + 1);
      setPicked(null);
    } else {
      setDone(true);
    }
  };

  const retry = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const pass = score >= need;
    return (
      <div className="panel center">
        <h3>
          {score} of {questions.length} correct
        </h3>
        {pass ? (
          <>
            <p className="dim">{score === questions.length ? "A perfect round." : "You passed the quiz."}</p>
            <button className="btn" onClick={() => onPass(score, questions.length)}>
              Continue to the challenge
            </button>
          </>
        ) : (
          <>
            <p className="dim">You need {need} correct to move on. Review the explanations and try again.</p>
            <button className="btn" onClick={retry}>
              Try the quiz again
            </button>
          </>
        )}
      </div>
    );
  }

  const wrong = picked !== null && picked !== q.answer;

  return (
    <div className="panel">
      <p className="dim small">
        Question {i + 1} of {questions.length}
      </p>
      <h3 className="q">
        <Text>{q.q}</Text>
      </h3>
      <div className="options">
        {q.options.map((o, idx) => {
          let cls = "option";
          if (picked !== null) {
            if (idx === q.answer) cls += " correct";
            else if (idx === picked) cls += " wrong";
          }
          return (
            <button key={idx} className={cls} onClick={() => choose(idx)} disabled={picked !== null}>
              <code>{o.t}</code>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className={wrong ? "explain explain-wrong" : "explain"}>
          {wrong ? (
            <>
              <h4>Why did I get this wrong?</h4>
              <p>
                <span className="dim">Your answer:</span> <code>{q.options[picked].t}</code>
              </p>
              <p>{q.options[picked].why}</p>
              <p>
                <span className="dim">Correct answer:</span> <code>{q.options[q.answer].t}</code>
              </p>
              <p>{q.options[q.answer].why}</p>
            </>
          ) : (
            <>
              <h4>Right</h4>
              <p>{q.options[q.answer].why}</p>
            </>
          )}
          <button className="btn" onClick={next}>
            {i + 1 < questions.length ? "Next question" : "See my score"}
          </button>
        </div>
      )}
    </div>
  );
}
