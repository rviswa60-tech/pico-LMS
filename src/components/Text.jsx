// Renders `inline code` (backticks) inside plain strings.
export default function Text({ children }) {
  const parts = String(children).split("`");
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <code key={i}>{p}</code> : <span key={i}>{p}</span>))}
    </>
  );
}
