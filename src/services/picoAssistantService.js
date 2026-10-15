// Curriculum-grounded fallback help. This stays separate from the UI so a
// server-side AI service can be plugged in later without changing Pico.
export function getPicoHelp(action, context = {}) {
  const topic = context.topic || context.title || "this Python concept";
  const hints = Array.isArray(context.hints) ? context.hints : [];
  const hintIndex = Math.min(Math.max(Number(context.hintIndex) || 0, 0), Math.max(0, hints.length - 1));

  if (context.restricted || context.surface === "assessment") {
    return "I’ll stay quiet during this assessment so your result reflects your own work. Take a breath and read the question one small piece at a time.";
  }

  if (action === "hint") {
    return hints[hintIndex] || `Start by identifying what ${topic} needs to produce, then test one small step at a time.`;
  }
  if (action === "debug") {
    if (context.error) return `Read the first useful line of the error: ${context.error}. Check the values and types on that line before changing the whole solution.`;
    return "Run the smallest version of your code, inspect the output, and compare it with the expected result. Then check the line where that value is created.";
  }
  if (action === "example") {
    return context.example || `For ${topic}, make a tiny example with one or two values first. Once that behaves as expected, expand it to the full problem.`;
  }
  return context.body || `Let’s break ${topic} into one idea at a time. Look for the input, the transformation, and the result you need to return.`;
}
