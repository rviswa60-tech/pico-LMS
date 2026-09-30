// All course content lives here. Add a new level by filling in a content object
// for the matching index in CONTENT below – the roadmap, unlock logic, quiz,
// challenge, boss battle and rewards all pick it up automatically.
//
// Challenge checking:
//   expected   – exact stdout the learner's program must print
//   assertions – optional Python run after the learner's code (same namespace)
//   rules      – regex checks on the learner's source, with a friendly message

export const BADGES = {
  first_code: { name: "First Code", desc: "Passed your first coding challenge" },
  bug_hunter: { name: "Bug Hunter", desc: "Hit an error, fixed it, and passed" },
  perfect_score: { name: "Perfect Score", desc: "Aced a quiz on the first try" },
  boss_gate: { name: "Gatekeeper", desc: "Defeated the Gate Guardian" },
  boss_data: { name: "Data Keeper", desc: "Defeated the Receipt Golem" },
  boss_logic: { name: "Logic Master", desc: "Defeated the Logic Beast" },
};

export const ROADMAP = [
  "Python Orientation",
  "Variables, Data Types and Operators",
  "Conditions and Decision Making",
  "Loops and Iteration",
  "Functions",
  "Data Structures",
  "Object-Oriented Programming",
  "Modules, Packages and Libraries",
  "File and Exception Handling",
  "Advanced Python",
  "NumPy and Pandas",
  "Data Analysis and Visualization",
  "SQL with Python",
  "APIs and Web Development",
  "Automation with Python",
  "Git and GitHub",
  "Real-World Python Projects",
  "Coding Interview Preparation",
  "Final Capstone Project",
  "Job-Readiness Assessment",
];

const CONTENT = [
  // ───────────── Level 1 ─────────────
  {
    mission: "Mission 01 – The Gate Guardian",
    intro: "Welcome to Pico Labs! Let's get Python talking.",
    learn: [
      {
        title: "Talking to the computer",
        body: "A Python program is a list of instructions. The computer reads them from top to bottom. `print()` makes Python show something on the screen.",
        code: 'print("Hello from Pico Labs")',
      },
      {
        title: "Text lives in quotes",
        body: "Text is called a string. Wrap it in quotes. Numbers don't need quotes, and a number in quotes becomes text.",
        code: 'print("Python")\nprint(2026)\nprint("2026")',
      },
      {
        title: "Notes for humans",
        body: "A line starting with `#` is a comment. Python ignores it, so you can leave notes for yourself and your team.",
        code: '# This line is ignored\nprint("Comments are free")',
      },
    ],
    quiz: [
      {
        q: "Which line shows Hi on the screen?",
        options: [
          { t: 'print("Hi")', why: "print() with the text in quotes is exactly how Python shows text." },
          { t: 'show("Hi")', why: "Python has no function called show. Use print." },
          { t: "echo Hi", why: "echo is a shell command, not Python." },
          { t: "print(Hi)", why: "Without quotes, Python looks for a variable named Hi and raises a NameError." },
        ],
        answer: 0,
      },
      {
        q: "What does Python do with a line that starts with #?",
        options: [
          { t: "Ignores it", why: "Comments are notes for humans. Python skips them." },
          { t: "Prints it", why: "Nothing is printed unless you call print()." },
          { t: "Stops the program", why: "Comments never stop a program." },
          { t: "Shows an error", why: "Comments are valid code, so there is no error." },
        ],
        answer: 0,
      },
      {
        q: "Which of these is a string?",
        options: [
          { t: "42", why: "Without quotes, 42 is an integer." },
          { t: '"42"', why: "Anything inside quotes is a string, even if it looks like a number." },
          { t: "4.2", why: "4.2 is a float (a decimal number)." },
          { t: "True", why: "True is a boolean." },
        ],
        answer: 1,
      },
    ],
    challenge: {
      title: "Say hello to the lab",
      prompt: "Print exactly this line:\n\nWelcome to Pico Labs",
      starter: "# Write your code below\n",
      expected: "Welcome to Pico Labs",
      rules: [{ re: "\\bprint\\b", msg: "Use print() to show the text." }],
      hints: [
        "Which function shows text on the screen?",
        "Use print( ) and put your text between the brackets.",
        'Example: print("Good morning") shows Good morning.',
        "Text needs quotes. Capital letters and spacing must match exactly.",
      ],
      solution: 'print("Welcome to Pico Labs")',
    },
    boss: {
      name: "The Gate Guardian",
      story: "The guardian wants an ID card before you can enter. Build it with three print lines and one comment.",
      prompt:
        "Print these three lines, in this order, and add at least one comment (a line starting with #):\n\nName: Ada\nRole: Engineer\nStatus: Online",
      starter: "# Build the ID card\n",
      expected: "Name: Ada\nRole: Engineer\nStatus: Online",
      rules: [
        { re: "\\bprint\\b", msg: "Use print() for each line." },
        { re: "#", msg: "Add a comment that starts with #." },
      ],
      hints: [
        "Each line of output needs its own print().",
        "Three lines of output means three print() calls.",
        'print("Name: Ada") is the first one.',
        "Don't forget to add a # comment somewhere in your code.",
      ],
      solution: '# ID card for the guardian\nprint("Name: Ada")\nprint("Role: Engineer")\nprint("Status: Online")',
    },
    bossBadge: "boss_gate",
  },

  // ───────────── Level 2 ─────────────
  {
    mission: "Mission 02 – The Receipt Golem",
    intro: "Time to store data. Variables are where programs remember things.",
    learn: [
      {
        title: "Variables are labelled boxes",
        body: "A variable stores a value under a name. `=` puts a value in. Use the name to read it back.",
        code: "price = 250\nquantity = 4\nprint(price)\nprint(quantity)",
      },
      {
        title: "Four everyday types",
        body: "`str` is text, `int` is a whole number, `float` is a decimal and `bool` is True or False. `type()` tells you which one you have.",
        code: 'name = "Asha"\nage = 29\nheight = 1.62\nis_member = True\nprint(type(name))\nprint(type(age))\nprint(type(height))\nprint(type(is_member))',
      },
      {
        title: "Operators do the maths",
        body: "Use `+ - *` as you'd expect. `/` always gives a float, `//` drops the decimals and `%` gives the remainder.",
        code: "total = 250 * 4\nprint(total)\nprint(total / 3)\nprint(total // 3)\nprint(total % 3)",
      },
      {
        title: "f-strings mix text and values",
        body: "Put `f` before the quotes and wrap variables in `{ }`. Python fills in their values.",
        code: 'customer = "Asha"\ntotal = 1000\nprint(f"{customer} owes {total}")',
      },
    ],
    quiz: [
      {
        q: "After x = 5 and then x = x + 2, what is x?",
        options: [
          { t: "5", why: "x was reassigned, so it no longer holds 5." },
          { t: "7", why: "Python calculates x + 2 using the old value (5), then stores 7 in x." },
          { t: "2", why: "x + 2 adds to x. It doesn't replace it with 2." },
          { t: "52", why: "That would be joining text. These are numbers, so they add." },
        ],
        answer: 1,
      },
      {
        q: "What type is the value 3.0?",
        options: [
          { t: "int", why: "An int has no decimal point." },
          { t: "float", why: "Any number written with a decimal point is a float, even 3.0." },
          { t: "str", why: "It would need quotes to be a string." },
          { t: "bool", why: "Only True and False are booleans." },
        ],
        answer: 1,
      },
      {
        q: "What does 17 // 5 give?",
        options: [
          { t: "3", why: "// is floor division. 17 divided by 5 is 3.4, and the decimals are dropped." },
          { t: "3.4", why: "That's what / gives. // drops the decimals." },
          { t: "2", why: "That's the remainder, which % gives." },
          { t: "4", why: "// rounds down, not up." },
        ],
        answer: 0,
      },
    ],
    challenge: {
      title: "Total the order",
      prompt:
        "A customer orders 4 keyboards at 250 each.\n\nStore those in price and quantity, calculate total, then print total.",
      starter: "# Create price, quantity and total\n",
      expected: "1000",
      assertions:
        'assert price == 250, "price should be 250"\nassert quantity == 4, "quantity should be 4"\nassert total == price * quantity, "total should be price * quantity"',
      rules: [{ re: "\\*", msg: "Calculate total with the * operator." }],
      hints: [
        "You need three variables. Which two describe the order?",
        "Write price = 250, then quantity, then multiply them into total.",
        "Example: width = 3, height = 5, area = width * height, print(area).",
        "Multiplication uses *. Finish with print(total).",
      ],
      solution: "price = 250\nquantity = 4\ntotal = price * quantity\nprint(total)",
    },
    boss: {
      name: "The Receipt Golem",
      story: "The golem prints receipts, but its printer is broken. Build the receipt line for it.",
      prompt:
        "Using the variables provided, calculate the total and print exactly one line:\n\nAsha bought 3 items. Total: 598.5\n\nBuild the line with an f-string.",
      starter:
        'customer = "Asha"\nitems = 3\nunit_price = 199.5\n\n# Calculate the total and print the receipt line\n',
      expected: "Asha bought 3 items. Total: 598.5",
      rules: [{ re: "f[\"']", msg: "Build the line with an f-string." }],
      hints: [
        "First work out the total from items and unit_price.",
        "total = items * unit_price, then print one line using total.",
        'Example: print(f"{name} is {age} years old")',
        "Your f-string needs {customer}, {items} and {total} in the right places.",
      ],
      solution:
        'customer = "Asha"\nitems = 3\nunit_price = 199.5\n\ntotal = items * unit_price\nprint(f"{customer} bought {items} items. Total: {total}")',
    },
    bossBadge: "boss_data",
  },

  // ───────────── Level 3 ─────────────
  {
    mission: "Mission 03 – The Logic Beast",
    intro: "Programs get interesting when they can decide. Let's teach yours to choose.",
    learn: [
      {
        title: "if asks a yes-or-no question",
        body: "An `if` block runs only when its condition is True. The indented lines belong to the block. Indentation is how Python knows.",
        code: 'temperature = 34\nif temperature > 30:\n    print("Hot day")\nprint("Done")',
      },
      {
        title: "elif and else cover the other cases",
        body: "Python checks from the top and runs the first branch that matches. Only one branch runs.",
        code: 'score = 72\nif score >= 90:\n    print("A")\nelif score >= 75:\n    print("B")\nelif score >= 60:\n    print("C")\nelse:\n    print("Fail")',
      },
      {
        title: "Combine conditions",
        body: "Use `and`, `or` and `not` to combine conditions. Compare values with `==`, `!=`, `<`, `>`, `<=` and `>=`.",
        code: 'age = 20\nhas_id = True\nif age >= 18 and has_id:\n    print("Entry allowed")\nelse:\n    print("Entry denied")',
      },
    ],
    quiz: [
      {
        q: "What is the difference between = and ==?",
        options: [
          { t: "= stores a value, == compares two values", why: "Single = assigns. Double == asks whether two values are equal." },
          { t: "They mean the same thing", why: "Mixing them up is one of the most common beginner bugs." },
          { t: "== stores a value, = compares", why: "It's the other way around." },
          { t: "= is only used in loops", why: "= is used everywhere you assign a variable." },
        ],
        answer: 0,
      },
      {
        q: "With score = 80, what does the grade code from the lesson print?",
        options: [
          { t: "A", why: "80 is not >= 90, so the first branch is skipped." },
          { t: "B", why: "80 fails the A test, then passes >= 75, so B runs and the rest are skipped." },
          { t: "C", why: "Python stops at the first matching branch, which is B." },
          { t: "A and B", why: "Only one branch in an if/elif chain runs." },
        ],
        answer: 1,
      },
      {
        q: "What does True and False evaluate to?",
        options: [
          { t: "True", why: "and needs both sides to be True." },
          { t: "False", why: "With and, one False makes the whole thing False." },
          { t: "None", why: "Boolean operators return True or False here, not None." },
          { t: "An error", why: "This is valid Python." },
        ],
        answer: 1,
      },
    ],
    challenge: {
      title: "Grade the score",
      prompt:
        "Use if / elif / else to print the grade for score:\n\n90 or more: A\n75 to 89: B\n60 to 74: C\nbelow 60: Fail\n\nWith score = 72 your program should print C.",
      starter: "score = 72\n\n# Print the grade\n",
      expected: "C",
      rules: [
        { re: "\\bif\\b", msg: "Use an if statement." },
        { re: "\\belif\\b", msg: "Use elif for the middle grades." },
        { re: "\\belse\\b", msg: "Finish with an else branch." },
      ],
      hints: [
        "Start with the highest grade and work downwards.",
        "Check score >= 90 first, then >= 75, then >= 60, and use else for the rest.",
        'Example: if age >= 18: print("Adult") else: print("Minor")',
        "Every if, elif and else line ends with a colon, and the code under it is indented.",
      ],
      solution:
        'score = 72\n\nif score >= 90:\n    print("A")\nelif score >= 75:\n    print("B")\nelif score >= 60:\n    print("C")\nelse:\n    print("Fail")',
    },
    boss: {
      name: "The Logic Beast",
      story: "A payments system needs a fraud rule, and the beast is guarding the data. Write the rule.",
      prompt:
        'Flag the order when the amount is over 1000 AND (the country is not "IN" OR it is night time).\n\nPrint FLAGGED if the rule matches, otherwise print OK.\n\nWith the values provided, the answer is FLAGGED.',
      starter: 'amount = 1200\ncountry = "XX"\nis_night = True\n\n# Apply the fraud rule\n',
      expected: "FLAGGED",
      rules: [
        { re: "\\bif\\b", msg: "Use an if statement." },
        { re: "\\band\\b", msg: "Use and to combine the amount check with the rest." },
        { re: "\\bor\\b", msg: "Use or for the country/night check." },
      ],
      hints: [
        "Break the rule into two parts: the amount, and the country-or-night part.",
        "The country-or-night part needs parentheses so or is checked first.",
        'Example: if a > 5 and (b == "x" or c): ...',
        'Use country != "IN" for "not IN". is_night is already True or False.',
      ],
      solution:
        'amount = 1200\ncountry = "XX"\nis_night = True\n\nif amount > 1000 and (country != "IN" or is_night):\n    print("FLAGGED")\nelse:\n    print("OK")',
    },
    bossBadge: "boss_logic",
  },
];

export const LEVELS = ROADMAP.map((title, i) => ({
  id: `L${i + 1}`,
  n: i + 1,
  title,
  content: CONTENT[i] || null,
}));
