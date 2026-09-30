import { useEffect, useState } from "react";
import { PicoProvider } from "./components/Pico.jsx";
import { useProgress } from "./store.js";
import { LEVELS } from "./data/levels.js";
import { getPyodide } from "./python.js";
import Welcome from "./components/Welcome.jsx";
import Header from "./components/Header.jsx";
import Roadmap from "./components/Roadmap.jsx";
import LevelView from "./components/LevelView.jsx";

export default function App() {
  const progress = useProgress();
  const hasName = Boolean(progress.state.name);
  return (
    <PicoProvider showDock={hasName}>
      {hasName ? <Main progress={progress} /> : <Welcome onStart={progress.setName} />}
    </PicoProvider>
  );
}

function Main({ progress }) {
  const [active, setActive] = useState(null);
  const [justUnlocked, setJustUnlocked] = useState(null);

  // Start downloading the Python runtime in the background
  useEffect(() => {
    getPyodide().catch(() => {});
  }, []);

  if (active) {
    const next = LEVELS[active.n] || null;
    return (
      <>
        <Header state={progress.state} onReset={progress.reset} />
        <main className="page">
          <LevelView
            key={active.id}
            level={active}
            nextLevel={next}
            progress={progress}
            onExit={() => setActive(null)}
            onComplete={() => {
              setJustUnlocked(next ? next.id : null);
              setActive(null);
            }}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Header state={progress.state} onReset={progress.reset} />
      <main className="page">
        <Roadmap
          levels={LEVELS}
          completed={progress.state.completed}
          justUnlocked={justUnlocked}
          onOpen={(l) => setActive(l)}
        />
      </main>
    </>
  );
}
