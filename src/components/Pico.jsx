import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

// brow: [leftRotate, rightRotate, leftLift, rightLift]
const MOODS = {
  idle:        { mouth: "M52 78 Q60 83 68 78", brow: [0, 0, 0, 0] },
  happy:       { mouth: "M51 76 Q60 88 69 76", brow: [0, 0, -2, -2], happyEyes: true },
  curious:     { mouth: "M54 79 Q60 77 66 79", brow: [0, 0, -5, 0] },
  thinking:    { mouth: "M54 80 L66 80",       brow: [6, -6, 0, 0], gaze: [3, -3] },
  confused:    { mouth: "M52 81 Q56 76 60 80 T68 80", brow: [-12, 12, 0, 0] },
  encouraging: { mouth: "M50 76 Q60 90 70 76", brow: [0, 0, -3, -3], happyEyes: true },
  helping:     { mouth: "M51 77 Q60 86 69 77", brow: [-4, 4, -2, -2] },
  coding:      { mouth: "M53 79 Q60 82 67 79", brow: [4, -4, 0, 0], gaze: [0, 3] },
  celebrating: { mouth: "M49 75 Q60 96 71 75 Z", brow: [0, 0, -4, -4], happyEyes: true, open: true },
  detective:   { mouth: "M54 80 L66 80",       brow: [8, -8, 0, 0], gaze: [-3, 0] },
  boss:        { mouth: "M50 82 Q60 73 70 82", brow: [14, -14, 0, 0] },
  graduation:  { mouth: "M51 76 Q60 88 69 76", brow: [0, 0, -2, -2], happyEyes: true },
};

export function PicoFace({ mood = "idle", size = 120 }) {
  const m = MOODS[mood] || MOODS.idle;
  const [lr, rr, ll, rl] = m.brow;
  const [gx, gy] = m.gaze || [0, 0];
  const armsUp = mood === "celebrating";

  return (
    <svg
      className={`pico pico-${mood}`}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label={`Pico the teddy bear looks ${mood}`}
    >
      <g className="pico-root">
        {/* body + arms */}
        <ellipse cx="60" cy="102" rx="30" ry="20" fill="#E0A03E" />
        <ellipse cx="60" cy="104" rx="17" ry="13" fill="#F6DDA8" />
        <g className={armsUp ? "pico-arms-up" : ""}>
          <circle cx={armsUp ? 20 : 31} cy={armsUp ? 64 : 98} r="8" fill="#E0A03E" />
          <circle cx={armsUp ? 100 : 89} cy={armsUp ? 64 : 98} r="8" fill="#E0A03E" />
        </g>

        {/* ears */}
        <circle cx="28" cy="32" r="14" fill="#E0A03E" />
        <circle cx="92" cy="32" r="14" fill="#E0A03E" />
        <circle cx="28" cy="32" r="7" fill="#B9762A" />
        <circle cx="92" cy="32" r="7" fill="#B9762A" />

        {/* head */}
        <circle cx="60" cy="60" r="38" fill="#F2B544" />
        <ellipse cx="60" cy="73" rx="17" ry="13" fill="#F6DDA8" />

        {mood === "boss" && <rect x="24" y="36" width="72" height="7" rx="3" fill="#FF7A6B" />}
        {mood === "graduation" && (
          <g>
            <polygon points="60,14 96,28 60,40 24,28" fill="#1B1F3A" />
            <rect x="48" y="36" width="24" height="8" rx="2" fill="#1B1F3A" />
            <line x1="92" y1="30" x2="92" y2="46" stroke="#F2B544" strokeWidth="2" />
          </g>
        )}

        {/* eyes */}
        <g transform={`translate(${gx} ${gy})`}>
          {m.happyEyes ? (
            <g fill="none" stroke="#1B1F3A" strokeWidth="3" strokeLinecap="round">
              <path d="M41 57 Q47 50 53 57" />
              <path d="M67 57 Q73 50 79 57" />
            </g>
          ) : (
            <g className="pico-eyes" fill="#1B1F3A">
              <circle cx="47" cy="56" r="4.6" />
              <circle cx="73" cy="56" r="4.6" />
              <circle cx="48.5" cy="54.5" r="1.3" fill="#fff" />
              <circle cx="74.5" cy="54.5" r="1.3" fill="#fff" />
            </g>
          )}
        </g>

        {/* brows */}
        <g stroke="#7A4A14" strokeWidth="3" strokeLinecap="round">
          <line x1="40" y1="44" x2="54" y2="44" transform={`translate(0 ${ll}) rotate(${lr} 47 44)`} />
          <line x1="66" y1="44" x2="80" y2="44" transform={`translate(0 ${rl}) rotate(${rr} 73 44)`} />
        </g>

        {/* nose + mouth */}
        <ellipse cx="60" cy="68" rx="5.5" ry="4" fill="#3A2412" />
        <path
          d={m.mouth}
          fill={m.open ? "#7A2E2E" : "none"}
          stroke="#3A2412"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {(m.happyEyes || mood === "helping") && (
          <g fill="#FF9C8A" opacity=".55">
            <circle cx="38" cy="69" r="5" />
            <circle cx="82" cy="69" r="5" />
          </g>
        )}

        {/* props */}
        {mood === "thinking" && (
          <g fill="#ECEBF7" className="pico-dots">
            <circle cx="100" cy="22" r="3" />
            <circle cx="108" cy="14" r="4" />
            <circle cx="116" cy="4" r="5" />
          </g>
        )}
        {mood === "confused" && (
          <text x="92" y="24" fontSize="26" fontWeight="800" fill="#ECEBF7" className="pico-q">?</text>
        )}
        {mood === "coding" && (
          <g>
            <rect x="34" y="92" width="52" height="24" rx="4" fill="#2B3150" />
            <rect x="38" y="96" width="44" height="13" rx="2" fill="#12152A" />
            <path d="M42 100 h14 M42 104 h22" stroke="#5FE3B2" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
        {mood === "detective" && (
          <g fill="none" stroke="#ECEBF7" strokeWidth="3" strokeLinecap="round">
            <circle cx="92" cy="84" r="11" fill="rgba(127,178,255,.25)" />
            <line x1="100" y1="92" x2="110" y2="104" />
          </g>
        )}
        {armsUp && (
          <g fill="#F2B544" className="pico-sparkles">
            <path d="M12 30 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" />
            <path d="M104 18 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" />
          </g>
        )}
      </g>
    </svg>
  );
}

// ───────────────────── Context: Pico as a global companion ─────────────────────
const PicoCtx = createContext(null);

export function usePico() {
  return useContext(PicoCtx);
}

export function PicoProvider({ children, showDock = true }) {
  const [mood, setMood] = useState("idle");
  const [bubble, setBubble] = useState(null); // { text, actions? }
  const timer = useRef(null);
  const clickRef = useRef(null); // the current screen can register what clicking Pico does

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setBubble(null);
    setMood("idle");
  }, []);

  const say = useCallback((text, { mood: m = "happy", actions = null, ttl = 5500 } = {}) => {
    clearTimeout(timer.current);
    setMood(m);
    setBubble({ text, actions });
    if (!actions && ttl) {
      timer.current = setTimeout(() => {
        setBubble(null);
        setMood("idle");
      }, ttl);
    }
  }, []);

  const value = useMemo(() => ({ mood, setMood, say, dismiss, clickRef }), [mood, say, dismiss]);

  const onPicoClick = () => {
    if (clickRef.current) clickRef.current();
    else say("Pick a mission and I'll be right here if you need me.", { mood: "encouraging" });
  };

  return (
    <PicoCtx.Provider value={value}>
      {children}
      {showDock && (
        <div className="pico-dock">
          {bubble && (
            <div className="pico-bubble" role="status">
              <p>{bubble.text}</p>
              {bubble.actions && (
                <div className="pico-actions">
                  {bubble.actions.map((a) => (
                    <button
                      key={a.label}
                      className={a.primary ? "btn btn-small" : "btn btn-small btn-ghost"}
                      onClick={() => {
                        dismiss();
                        a.onClick();
                      }}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button className="pico-button" onClick={onPicoClick} aria-label="Ask Pico for help">
            <PicoFace mood={mood} size={104} />
          </button>
        </div>
      )}
    </PicoCtx.Provider>
  );
}
