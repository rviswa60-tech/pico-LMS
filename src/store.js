import { useState, useEffect, useCallback } from "react";

const KEY = "pico-lms-v1";

const initial = {
  name: "",
  xp: 0,
  streak: 0,
  lastDay: null,
  completed: [],
  badges: [],
  hintsUsed: 0,
};

export const RANKS = [
  { name: "Python Beginner", min: 0 },
  { name: "Python Explorer", min: 150 },
  { name: "Code Warrior", min: 400 },
  { name: "Python Developer", min: 800 },
  { name: "Python Expert", min: 1400 },
  { name: "Python Master", min: 2200 },
];

export function rankFor(xp) {
  let idx = 0;
  RANKS.forEach((r, i) => {
    if (xp >= r.min) idx = i;
  });
  const rank = RANKS[idx];
  const next = RANKS[idx + 1] || null;
  const pct = next ? (xp - rank.min) / (next.min - rank.min) : 1;
  return { rank, next, pct };
}

const dayStr = (d = new Date()) => d.toISOString().slice(0, 10);

function bumpStreak(p) {
  const today = dayStr();
  if (p.lastDay === today) return p;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const streak = p.lastDay === dayStr(y) ? p.streak + 1 : 1;
  return { ...p, streak, lastDay: today };
}

function load() {
  try {
    return { ...initial, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return initial;
  }
}

export function useProgress() {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable – progress just won't persist */
    }
  }, [state]);

  const setName = useCallback(
    (name) => setState((p) => bumpStreak({ ...p, name })),
    []
  );

  const completeLevel = useCallback(({ id, xp, badges }) => {
    setState((p) =>
      bumpStreak({
        ...p,
        xp: p.xp + xp,
        completed: Array.from(new Set([...p.completed, id])),
        badges: Array.from(new Set([...p.badges, ...badges])),
      })
    );
  }, []);

  const noteHint = useCallback(
    () => setState((p) => ({ ...p, hintsUsed: p.hintsUsed + 1 })),
    []
  );

  const reset = useCallback(() => setState(initial), []);

  return { state, setName, completeLevel, noteHint, reset };
}
