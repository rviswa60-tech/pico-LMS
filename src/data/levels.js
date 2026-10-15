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
  boss_loops: { name: "Loop Runner", desc: "Defeated the Loop Hydra" },
  boss_functions: { name: "Function Forge", desc: "Defeated the Signature Sphinx" },
  boss_structures: { name: "Structure Scout", desc: "Defeated the Collection Kraken" },
  boss_oop: { name: "Class Architect", desc: "Defeated the Object Titan" },
  boss_modules: { name: "Module Mapper", desc: "Defeated the Import Warden" },
  boss_errors: { name: "Resilience Engineer", desc: "Defeated the Error Hydra" },
  boss_advanced: { name: "Python Alchemist", desc: "Defeated the Comprehension Chimera" },
  boss_numpy: { name: "Data Wrangler", desc: "Defeated the Array Oracle" },
  boss_analysis: { name: "Insight Miner", desc: "Defeated the Chart Phantom" },
  boss_sql: { name: "Query Builder", desc: "Defeated the SQL Sentinel" },
  boss_api: { name: "API Navigator", desc: "Defeated the Request Kraken" },
  boss_automation: { name: "Automation Pilot", desc: "Defeated the Task Golem" },
  boss_git: { name: "Version Voyager", desc: "Defeated the Merge Minotaur" },
  boss_projects: { name: "Project Shipper", desc: "Defeated the Scope Dragon" },
  boss_interview: { name: "Interview Solver", desc: "Defeated the Whiteboard Wraith" },
  boss_capstone: { name: "Capstone Commander", desc: "Defeated the Launch Leviathan" },
  boss_ready: { name: "Career Ready", desc: "Completed the job-readiness assessment" },
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

// Levels 4-20. These are intentionally data-only so new modules can be authored
// without changing the roadmap, lesson renderer, quiz engine or Python checker.
const choice = (t, why) => ({ t, why });
const makeModule = ({ n, intro, learn, quiz, challenge, boss, badge }) => ({
  mission: `Mission ${String(n).padStart(2, "0")} – ${ROADMAP[n - 1]}`,
  intro,
  learn,
  quiz,
  challenge,
  boss,
  bossBadge: badge,
});

CONTENT.push(
  makeModule({
    n: 4,
    intro: "Loops turn repeated work into a small, reliable instruction.",
    learn: [
      { title: "Repeat with for", body: "A for loop visits each value in a sequence. range(1, 4) produces 1, 2 and 3, so the body runs three times.", code: "for number in range(1, 4):\n    print(number)" },
      { title: "Accumulate a result", body: "Start with a neutral value, update it on every iteration, then use it after the loop. This pattern powers totals, counts and averages.", code: "total = 0\nfor price in [10, 20, 30]:\n    total += price\nprint(total)" },
    ],
    quiz: [
      { q: "How many times does for n in range(3): run?", options: [choice("2", "range stops before its end."), choice("3", "range(3) produces 0, 1 and 2."), choice("4", "The stop value is excluded."), choice("0", "The loop has three values.")], answer: 1 },
      { q: "What is the best starting value for a running total?", options: [choice("0", "Addition starts from the additive identity."), choice("1", "1 would change the total."), choice("None", "None cannot be added to a number."), choice("The final answer", "The final answer is not known yet.")], answer: 0 },
    ],
    challenge: { title: "Add the sensor readings", prompt: "Use a for loop to add the values in readings and print the total.\n\nThe expected total is 15.", starter: "readings = [1, 2, 3, 4, 5]\n\n# Add the readings\n", expected: "15", rules: [{ re: "\\bfor\\b", msg: "Use a for loop." }, { re: "total", msg: "Keep the running result in total." }], hints: ["Start total at zero.", "Loop over readings.", "Add each reading with +=.", "Print total after the loop."], solution: "readings = [1, 2, 3, 4, 5]\ntotal = 0\nfor reading in readings:\n    total += reading\nprint(total)" },
    boss: { name: "The Loop Hydra", story: "Three heads repeat the same task. Count every head exactly once.", prompt: "Print the numbers 3, 2, 1 and then Launch! using a loop for the countdown.", starter: "# Build the countdown\n", expected: "3\n2\n1\nLaunch!", rules: [{ re: "\\bfor\\b", msg: "Use a for loop for the countdown." }, { re: "range", msg: "Use range to create the countdown values." }], hints: ["A countdown can use range with a negative step.", "range(3, 0, -1) gives 3, 2 and 1.", "Print each number inside the loop.", "Print Launch! after the loop."], solution: "for number in range(3, 0, -1):\n    print(number)\nprint(\"Launch!\")" },
    badge: "boss_loops",
  }),
  makeModule({
    n: 5,
    intro: "Functions give useful work a name so you can call it safely anywhere.",
    learn: [
      { title: "Define once, call often", body: "def starts a function. Parameters are the inputs between parentheses, and return sends a result back to the caller.", code: "def double(value):\n    return value * 2\n\nprint(double(6))" },
      { title: "Keep functions focused", body: "A good function does one clear job. Returning data makes it easier to test, combine and reuse than printing from inside the function.", code: "def total_with_tax(price, tax_rate):\n    return price * (1 + tax_rate)\n\nprint(total_with_tax(100, 0.18))" },
    ],
    quiz: [
      { q: "What does return do?", options: [choice("Sends a value back to the caller", "The caller can store or use the returned value."), choice("Prints automatically", "return does not print."), choice("Repeats the function", "Calling the function repeats it."), choice("Stops Python forever", "return only exits the current function.")], answer: 0 },
      { q: "Why use a parameter?", options: [choice("To accept changing input", "Parameters make one function useful with many values."), choice("To create a comment", "Comments use #."), choice("To end a loop", "break ends a loop."), choice("To import a module", "import loads modules.")], answer: 0 },
    ],
    challenge: { title: "Create a square function", prompt: "Define square(number) so it returns number multiplied by itself. Print square(7).", starter: "# Define square\n", expected: "49", rules: [{ re: "def\\s+square", msg: "Define a function named square." }, { re: "return", msg: "Return the calculated value." }], hints: ["The function needs one parameter.", "Multiply the parameter by itself.", "Use return instead of print inside the function.", "Call square(7) and print the result."], solution: "def square(number):\n    return number * number\n\nprint(square(7))" },
    boss: { name: "The Signature Sphinx", story: "The sphinx accepts only a correctly designed function.", prompt: "Define shipping_cost(weight, rate) to return weight * rate. With weight 4 and rate 2.5, print the result.", starter: "# Define shipping_cost\n", expected: "10.0", rules: [{ re: "def\\s+shipping_cost", msg: "Define shipping_cost." }, { re: "return", msg: "Return the shipping cost." }], hints: ["Use two parameters.", "Multiply weight by rate.", "Return the product.", "Print shipping_cost(4, 2.5)."], solution: "def shipping_cost(weight, rate):\n    return weight * rate\n\nprint(shipping_cost(4, 2.5))" },
    badge: "boss_functions",
  }),
  makeModule({
    n: 6,
    intro: "Collections let programs work with groups of related values.",
    learn: [
      { title: "Lists are ordered", body: "Lists keep values in order and can change. Indexing starts at zero, and append adds a value at the end.", code: "tasks = [\"plan\", \"build\"]\ntasks.append(\"ship\")\nprint(tasks[0])\nprint(len(tasks))" },
      { title: "Dictionaries use keys", body: "A dictionary maps a readable key to a value. This is ideal for records such as a user, product or configuration.", code: "user = {\"name\": \"Asha\", \"role\": \"builder\"}\nprint(user[\"name\"])" },
    ],
    quiz: [
      { q: "What is the first index of a Python list?", options: [choice("0", "Python uses zero-based indexing."), choice("1", "1 is the second item."), choice("-1", "-1 is the last item."), choice("None", "Lists have numeric indexes.")], answer: 0 },
      { q: "What does a dictionary key provide?", options: [choice("A label for finding a value", "Keys make records readable and addressable."), choice("A list position", "Positions belong to lists."), choice("A loop", "Keys are data, not control flow."), choice("A function", "Functions are defined with def.")], answer: 0 },
    ],
    challenge: { title: "Find the highest score", prompt: "Use the scores list to print its highest value. Do not hard-code the answer.", starter: "scores = [72, 88, 91, 67]\n\n# Find the highest score\n", expected: "91", rules: [{ re: "max\\s*\\(", msg: "Use max() to inspect the collection." }], hints: ["The data is already in scores.", "Python has a built-in that finds the largest value.", "Pass scores to max.", "Print the returned value."], solution: "scores = [72, 88, 91, 67]\nprint(max(scores))" },
    boss: { name: "The Collection Kraken", story: "The kraken stores inventory in nested records. Read it without losing the structure.", prompt: "Using inventory, print the stock of pencils and then the total stock of all products.", starter: "inventory = {\"pencils\": 12, \"notebooks\": 8, \"erasers\": 5}\n\n# Inspect the inventory\n", expected: "12\n25", rules: [{ re: "inventory\\[", msg: "Read values from the dictionary." }, { re: "sum\\s*\\(", msg: "Use sum() for the total." }], hints: ["The pencil value is under the pencils key.", "Dictionary values returns all stock numbers.", "Pass inventory.values() to sum.", "Print the pencil stock, then the sum."], solution: "inventory = {\"pencils\": 12, \"notebooks\": 8, \"erasers\": 5}\nprint(inventory[\"pencils\"])\nprint(sum(inventory.values()))" },
    badge: "boss_structures",
  }),
  makeModule({
    n: 7,
    intro: "Object-oriented Python groups state and behavior into reusable classes.",
    learn: [
      { title: "Classes describe objects", body: "A class is a blueprint. __init__ stores instance data on self, and methods describe what an object can do.", code: "class User:\n    def __init__(self, name):\n        self.name = name\n\nuser = User(\"Asha\")\nprint(user.name)" },
      { title: "Methods change state", body: "A method receives self automatically. Updating attributes inside a method lets an object protect its own rules.", code: "class Counter:\n    def __init__(self):\n        self.value = 0\n    def increment(self):\n        self.value += 1\n\ncounter = Counter()\ncounter.increment()\nprint(counter.value)" },
    ],
    quiz: [
      { q: "What is self?", options: [choice("The current object", "self gives a method access to its instance."), choice("A global variable", "self is scoped to the instance method."), choice("The class name", "The class is separate from its instances."), choice("A module", "Modules are imported.")], answer: 0 },
      { q: "When does __init__ run?", options: [choice("When an instance is created", "It initializes new object state."), choice("When Python starts", "It is not a program entry point."), choice("After every print", "It runs during construction."), choice("Only when imported", "Importing is unrelated.")], answer: 0 },
    ],
    challenge: { title: "Build a Greeter class", prompt: "Create Greeter(name) with a greet() method that returns Hello, NAME!. Print the greeting for Ada.", starter: "# Define Greeter\n", expected: "Hello, Ada!", rules: [{ re: "class\\s+Greeter", msg: "Define a Greeter class." }, { re: "def\\s+greet", msg: "Add a greet method." }, { re: "self\\.name", msg: "Store the name on self." }], hints: ["Use __init__ to store name.", "greet should return an f-string.", "Include self.name in the message.", "Create Greeter(\"Ada\") and print greet()."], solution: "class Greeter:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return f\"Hello, {self.name}!\"\n\ngreeter = Greeter(\"Ada\")\nprint(greeter.greet())" },
    boss: { name: "The Object Titan", story: "The titan protects a vault. Model an account that can deposit funds.", prompt: "Create BankAccount with a balance, deposit(amount), and report() method. Deposit 250 into a starting balance of 100 and print the balance.", starter: "# Define BankAccount\n", expected: "350", rules: [{ re: "class\\s+BankAccount", msg: "Define BankAccount." }, { re: "def\\s+deposit", msg: "Add a deposit method." }, { re: "self\\.balance", msg: "Store and update balance on self." }], hints: ["Initialize balance in __init__.", "deposit should add amount.", "report can return the balance.", "Create the account, deposit, then print report."], solution: "class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n    def report(self):\n        return self.balance\n\naccount = BankAccount(100)\naccount.deposit(250)\nprint(account.report())" },
    badge: "boss_oop",
  }),
  makeModule({
    n: 8,
    intro: "Modules keep code organized and let you reuse Python's standard library.",
    learn: [
      { title: "Import what you need", body: "import loads a module. Use module.name to access its functions and constants without copying their implementation.", code: "import math\n\nprint(math.ceil(4.2))\nprint(math.sqrt(81))" },
      { title: "Use a clear boundary", body: "A module should expose a small, purposeful API. Aliases such as import statistics as stats can make repeated calls easier to read.", code: "import statistics as stats\nvalues = [10, 20, 30]\nprint(stats.mean(values))" },
    ],
    quiz: [
      { q: "Why use a module?", options: [choice("To reuse organized code", "Modules prevent duplication and separate responsibilities."), choice("To hide all errors", "Modules can still raise errors."), choice("To replace variables", "Modules provide values and functions."), choice("To make a loop", "Loops use for or while.")], answer: 0 },
      { q: "What does import math as m create?", options: [choice("The alias m for math", "m.sqrt can access math.sqrt."), choice("A new math language", "It is only a name alias."), choice("A list named m", "It binds the module."), choice("A function m", "The alias refers to the module.")], answer: 0 },
    ],
    challenge: { title: "Measure a circle", prompt: "Import math and print the area of a circle with radius 3, rounded to 2 decimal places.", starter: "radius = 3\n\n# Calculate the area\n", expected: "28.27", rules: [{ re: "import\\s+math", msg: "Import the math module." }, { re: "math\\.pi", msg: "Use math.pi for the circle constant." }], hints: ["Circle area is pi times radius squared.", "Use math.pi and radius ** 2.", "round the result to two decimal places.", "Print round(math.pi * radius ** 2, 2)."], solution: "import math\nradius = 3\nprint(round(math.pi * radius ** 2, 2))" },
    boss: { name: "The Import Warden", story: "The warden only opens for precise standard-library work.", prompt: "Import statistics and print the median of [4, 9, 2, 7, 5].", starter: "values = [4, 9, 2, 7, 5]\n\n# Find the median\n", expected: "5", rules: [{ re: "import\\s+statistics", msg: "Import statistics." }, { re: "statistics\\.median", msg: "Use statistics.median." }], hints: ["Median is the middle value after sorting.", "statistics has a median function.", "Pass values to statistics.median.", "Print the result."], solution: "import statistics\nvalues = [4, 9, 2, 7, 5]\nprint(statistics.median(values))" },
    badge: "boss_modules",
  }),
  makeModule({
    n: 9,
    intro: "Reliable programs expect bad input and recover with useful behavior.",
    learn: [
      { title: "Catch expected failures", body: "try contains risky work. except handles a known error type, so one bad value does not crash the whole workflow.", code: "try:\n    number = int(\"not a number\")\nexcept ValueError:\n    number = 0\nprint(number)" },
      { title: "Clean up with finally", body: "finally runs whether the operation succeeds or fails. Use it for cleanup and keep the recovery path specific.", code: "try:\n    print(10 / 2)\nexcept ZeroDivisionError:\n    print(\"Cannot divide\")\nfinally:\n    print(\"Finished\")" },
    ],
    quiz: [
      { q: "What should an except block contain?", options: [choice("Recovery for a known error", "Specific recovery keeps failures understandable."), choice("Every possible error", "Catch only what you can handle."), choice("The main program always", "Normal work belongs in try or outside it."), choice("A loop", "Loops are independent.")], answer: 0 },
      { q: "When does finally run?", options: [choice("After try or except", "finally runs on both success and failure."), choice("Only on errors", "It also runs on success."), choice("Before try", "It comes after the handlers."), choice("Never", "It is designed to run.")], answer: 0 },
    ],
    challenge: { title: "Parse a safe integer", prompt: "Try to convert raw to an integer. Print the number when valid, otherwise print Invalid.", starter: "raw = \"42x\"\n\n# Parse raw safely\n", expected: "Invalid", rules: [{ re: "try", msg: "Use a try block." }, { re: "except\\s+ValueError", msg: "Handle ValueError explicitly." }], hints: ["int(raw) can raise ValueError.", "Put int(raw) inside try.", "Print Invalid in except.", "Use the current raw value, which is invalid."], solution: "raw = \"42x\"\ntry:\n    print(int(raw))\nexcept ValueError:\n    print(\"Invalid\")" },
    boss: { name: "The Error Hydra", story: "Every malformed record grows another head. Build a parser that keeps the batch alive.", prompt: "Convert each item in raw_values when possible and print the count of valid numbers.", starter: "raw_values = [\"10\", \"bad\", \"25\", \"?\", \"5\"]\n\n# Count valid values\n", expected: "3", rules: [{ re: "try", msg: "Use exception handling while parsing." }, { re: "except\\s+ValueError", msg: "Handle invalid values with ValueError." }], hints: ["Start valid_count at zero.", "Loop over raw_values.", "Increment only inside the successful try path.", "Print valid_count after the loop."], solution: "raw_values = [\"10\", \"bad\", \"25\", \"?\", \"5\"]\nvalid_count = 0\nfor raw in raw_values:\n    try:\n        int(raw)\n        valid_count += 1\n    except ValueError:\n        pass\nprint(valid_count)" },
    badge: "boss_errors",
  }),
  makeModule({
    n: 10,
    intro: "Advanced Python helps you express transformations clearly without hiding the logic.",
    learn: [
      { title: "Comprehensions transform data", body: "A list comprehension maps or filters values in one readable expression. Use a normal loop when the logic needs more explanation.", code: "numbers = [1, 2, 3, 4]\nsquares = [n * n for n in numbers]\nprint(squares)" },
      { title: "Sort with a key", body: "sorted returns a new list. Its key function tells Python what value to compare, while reverse changes the direction.", code: "users = [(\"Asha\", 82), (\"Ben\", 91)]\nranked = sorted(users, key=lambda user: user[1], reverse=True)\nprint(ranked[0][0])" },
    ],
    quiz: [
      { q: "What does a list comprehension create?", options: [choice("A new list", "The expression builds a new list from an iterable."), choice("A dictionary always", "It uses square brackets for a list."), choice("A function", "A comprehension is an expression."), choice("A file", "It only operates on values.")], answer: 0 },
      { q: "What does key= do in sorted?", options: [choice("Chooses the comparison value", "Python sorts by the value returned by key."), choice("Locks the list", "It affects ordering."), choice("Adds a dictionary key", "It is a sorting argument."), choice("Reverses automatically", "reverse controls direction.")], answer: 0 },
    ],
    challenge: { title: "Filter active users", prompt: "Use a list comprehension to create active users with score >= 70 and print the list.", starter: "scores = [45, 72, 88, 61, 90]\n\n# Keep passing scores\n", expected: "[72, 88, 90]", rules: [{ re: "\\[.*for.*in.*if", msg: "Use a filtered list comprehension." }], hints: ["The output needs only scores at least 70.", "A comprehension can end with if condition.", "Use score for score in scores if score >= 70.", "Print the new list."], solution: "scores = [45, 72, 88, 61, 90]\npassing = [score for score in scores if score >= 70]\nprint(passing)" },
    boss: { name: "The Comprehension Chimera", story: "The chimera wants a clean ranking with no mutation of the original data.", prompt: "Sort the products by price from highest to lowest and print the product names in order.", starter: "products = [(\"pen\", 10), (\"book\", 35), (\"bag\", 25)]\n\n# Rank products\n", expected: "book\nbag\npen", rules: [{ re: "sorted", msg: "Use sorted to create the ranking." }, { re: "key", msg: "Sort with a key function." }, { re: "reverse=True", msg: "Sort from highest to lowest." }], hints: ["Sort products by item[1].", "Use a lambda as key.", "Set reverse=True.", "Loop over the sorted result and print item[0]."], solution: "products = [(\"pen\", 10), (\"book\", 35), (\"bag\", 25)]\nranked = sorted(products, key=lambda item: item[1], reverse=True)\nfor product in ranked:\n    print(product[0])" },
    badge: "boss_advanced",
  }),
  makeModule({
    n: 11,
    intro: "Data tools make repeated numeric work faster, clearer and easier to inspect.",
    learn: [
      { title: "Think in columns", body: "Data analysis starts by treating a field such as sales or temperature as a column. Even with plain Python lists, the same mental model applies.", code: "sales = [120, 180, 150, 210]\naverage = sum(sales) / len(sales)\nprint(round(average, 1))" },
      { title: "Choose the right tool", body: "NumPy is built for numeric arrays and Pandas is built for labelled tables. This lesson uses core Python so the browser challenge runs everywhere.", code: "rows = [{\"name\": \"A\", \"score\": 80}, {\"name\": \"B\", \"score\": 95}]\nprint([row[\"score\"] for row in rows])" },
    ],
    quiz: [
      { q: "What is a column in a table?", options: [choice("Values for one attribute", "A score column contains scores for many rows."), choice("One complete record", "A record is a row."), choice("A Python class only", "Columns are a data concept."), choice("A chart title", "Titles label visualizations.")], answer: 0 },
      { q: "Why use an array library?", options: [choice("To work efficiently with numeric data", "Array tools provide useful operations and performance."), choice("To remove all data", "They analyze data."), choice("To avoid testing", "Tests are still needed."), choice("To replace Python syntax", "They extend Python.")], answer: 0 },
    ],
    challenge: { title: "Summarize temperatures", prompt: "Print the minimum, maximum and average temperature from readings, one per line. Round average to 1 decimal.", starter: "readings = [24, 27, 25, 30, 26]\n\n# Summarize readings\n", expected: "24\n30\n26.4", rules: [{ re: "min\\s*\\(", msg: "Calculate the minimum." }, { re: "max\\s*\\(", msg: "Calculate the maximum." }, { re: "sum\\s*\\(", msg: "Calculate the average from the values." }], hints: ["Use min and max on readings.", "Average is sum divided by length.", "Round the average to one decimal.", "Print min, max, average in that order."], solution: "readings = [24, 27, 25, 30, 26]\nprint(min(readings))\nprint(max(readings))\nprint(round(sum(readings) / len(readings), 1))" },
    boss: { name: "The Array Oracle", story: "The oracle has a column of scores and needs a reliable summary.", prompt: "Calculate the percentage of scores that are at least 70 and print it rounded to 1 decimal.", starter: "scores = [60, 72, 88, 55, 91, 70]\n\n# Calculate pass percentage\n", expected: "66.7", rules: [{ re: "sum", msg: "Count the matching values with a sum or equivalent." }, { re: "len\\s*\\(", msg: "Use the number of scores as the denominator." }], hints: ["Create a list or count of passing scores.", "A passing score is >= 70.", "Divide passing count by len(scores) and multiply by 100.", "Round to one decimal."], solution: "scores = [60, 72, 88, 55, 91, 70]\npassed = sum(score >= 70 for score in scores)\nprint(round(passed / len(scores) * 100, 1))" },
    badge: "boss_numpy",
  }),
  makeModule({
    n: 12,
    intro: "Analysis turns raw records into decisions people can act on.",
    learn: [
      { title: "Group before you compare", body: "Aggregations such as totals and averages become useful when grouped by a meaningful category such as region or product.", code: "orders = [(\"East\", 10), (\"West\", 20), (\"East\", 15)]\ntotals = {}\nfor region, amount in orders:\n    totals[region] = totals.get(region, 0) + amount\nprint(totals)" },
      { title: "Tell the story", body: "A chart is only useful when the question, measure and comparison are clear. Label the output so another person can interpret it.", code: "monthly = {\"Jan\": 12, \"Feb\": 18, \"Mar\": 15}\nbest = max(monthly, key=monthly.get)\nprint(best, monthly[best])" },
    ],
    quiz: [
      { q: "Why group records?", options: [choice("To compare meaningful categories", "Grouping reveals patterns by region, product or time."), choice("To delete duplicates always", "Grouping does not automatically delete data."), choice("To avoid labels", "Labels make analysis clearer."), choice("To turn data into code", "The data is already being processed.")], answer: 0 },
      { q: "What makes a visualization useful?", options: [choice("A clear question and labelled measure", "The viewer needs context to read a chart."), choice("As many colors as possible", "Decoration can distract."), choice("No title", "Titles add context."), choice("Random data", "A visualization should represent real data.")], answer: 0 },
    ],
    challenge: { title: "Find the best month", prompt: "Using monthly sales, print the month with the highest sales and then its value.", starter: "monthly = {\"Jan\": 120, \"Feb\": 180, \"Mar\": 150}\n\n# Find the best month\n", expected: "Feb\n180", rules: [{ re: "max\\s*\\(", msg: "Use max to find the best month." }, { re: "key=", msg: "Compare dictionary values with a key." }], hints: ["max can inspect dictionary keys.", "Use key=monthly.get.", "Store the best month.", "Print the month and monthly[month]."], solution: "monthly = {\"Jan\": 120, \"Feb\": 180, \"Mar\": 150}\nbest = max(monthly, key=monthly.get)\nprint(best)\nprint(monthly[best])" },
    boss: { name: "The Chart Phantom", story: "The phantom hides a trend in a stream of events. Aggregate it before it disappears.", prompt: "Count each event type in events and print the count for login, purchase and logout in that order.", starter: "events = [\"login\", \"purchase\", \"login\", \"logout\", \"purchase\", \"login\"]\n\n# Count event types\n", expected: "3\n2\n1", rules: [{ re: "for", msg: "Iterate through the events." }, { re: "get\\(", msg: "Use a dictionary accumulation pattern." }], hints: ["Start counts as an empty dictionary.", "For each event, add one to counts.get(event, 0).", "The required order is login, purchase, logout.", "Print the three dictionary values."], solution: "events = [\"login\", \"purchase\", \"login\", \"logout\", \"purchase\", \"login\"]\ncounts = {}\nfor event in events:\n    counts[event] = counts.get(event, 0) + 1\nprint(counts[\"login\"])\nprint(counts[\"purchase\"])\nprint(counts[\"logout\"])" },
    badge: "boss_analysis",
  }),
  makeModule({
    n: 13,
    intro: "SQL is a precise language for filtering, sorting and summarizing tables.",
    learn: [
      { title: "Think in SELECT and WHERE", body: "SELECT chooses columns and WHERE filters rows. The same ideas map naturally to Python records and database APIs.", code: "rows = [{\"name\": \"Asha\", \"score\": 82}, {\"name\": \"Ben\", \"score\": 61}]\npassed = [row for row in rows if row[\"score\"] >= 70]\nprint(passed[0][\"name\"])" },
      { title: "Sort and limit", body: "ORDER BY creates a useful ranking and LIMIT keeps the result focused. Always make the ordering explicit when it affects decisions.", code: "rows = [(\"A\", 90), (\"B\", 75), (\"C\", 85)]\nranked = sorted(rows, key=lambda row: row[1], reverse=True)\nprint(ranked[:2])" },
    ],
    quiz: [
      { q: "What does WHERE do in SQL?", options: [choice("Filters rows", "Only rows matching the condition remain."), choice("Renames a table", "AS renames columns or tables."), choice("Sorts columns", "ORDER BY sorts results."), choice("Creates a database", "CREATE handles schema.")], answer: 0 },
      { q: "What does ORDER BY control?", options: [choice("Result ordering", "It sorts the selected rows."), choice("Which database opens", "Connection settings do that."), choice("The table schema", "Schema changes use DDL."), choice("Error handling", "Exceptions handle errors.")], answer: 0 },
    ],
    challenge: { title: "Filter passed learners", prompt: "Filter learners with score >= 70 and print their names in alphabetical order.", starter: "learners = [(\"Zoe\", 72), (\"Asha\", 88), (\"Ben\", 61)]\n\n# Query the learners\n", expected: "Asha\nZoe", rules: [{ re: "sorted", msg: "Sort the final names." }, { re: "if", msg: "Filter by the score condition." }], hints: ["Keep rows whose score is at least 70.", "Build a list of names.", "Pass names to sorted.", "Print each name."], solution: "learners = [(\"Zoe\", 72), (\"Asha\", 88), (\"Ben\", 61)]\npassed = sorted([name for name, score in learners if score >= 70])\nfor name in passed:\n    print(name)" },
    boss: { name: "The SQL Sentinel", story: "The sentinel guards the top two records in a reporting table.", prompt: "Return the names of the two highest-scoring learners, one per line.", starter: "learners = [{\"name\": \"Asha\", \"score\": 88}, {\"name\": \"Ben\", \"score\": 91}, {\"name\": \"Zoe\", \"score\": 84}]\n\n# Build the top-two report\n", expected: "Ben\nAsha", rules: [{ re: "sorted", msg: "Sort the records." }, { re: "reverse=True", msg: "Rank from highest score down." }], hints: ["Sort records by score.", "Use a key function for row[score].", "Set reverse=True.", "Slice the first two and print their names."], solution: "learners = [{\"name\": \"Asha\", \"score\": 88}, {\"name\": \"Ben\", \"score\": 91}, {\"name\": \"Zoe\", \"score\": 84}]\nranked = sorted(learners, key=lambda row: row[\"score\"], reverse=True)\nfor row in ranked[:2]:\n    print(row[\"name\"])" },
    badge: "boss_sql",
  }),
  makeModule({
    n: 14,
    intro: "APIs are contracts between programs. Learn to shape requests and validate responses.",
    learn: [
      { title: "JSON is structured data", body: "JSON maps naturally to Python dictionaries and lists. Parse it before reading fields, and keep external data at the boundary of your program.", code: "import json\npayload = json.loads('{\"status\": \"ok\", \"count\": 3}')\nprint(payload[\"status\"])" },
      { title: "Validate the response", body: "A successful network response can still contain missing or unexpected data. Check status and required fields before using the payload.", code: "response = {\"status\": 200, \"items\": [1, 2]}\nif response[\"status\"] == 200:\n    print(len(response[\"items\"]))" },
    ],
    quiz: [
      { q: "Why parse JSON?", options: [choice("To turn text into usable data", "Parsing creates Python dictionaries and lists."), choice("To encrypt it", "JSON is not encryption."), choice("To send an email", "JSON is a data format."), choice("To compile Python", "Parsing data is different from compiling.")], answer: 0 },
      { q: "What should an API client validate?", options: [choice("Status and required fields", "Both transport and data shape can fail."), choice("Only the URL", "A correct URL does not guarantee a useful response."), choice("Nothing", "External data is untrusted."), choice("The browser color", "It is unrelated.")], answer: 0 },
    ],
    challenge: { title: "Read an API payload", prompt: "Parse the JSON payload and print the username and number of tasks.", starter: "import json\npayload = '{\"user\": \"Asha\", \"tasks\": [\"plan\", \"ship\"]}'\n\n# Read the payload\n", expected: "Asha\n2", rules: [{ re: "json\\.loads", msg: "Parse the JSON with json.loads." }, { re: "tasks", msg: "Read the tasks field." }], hints: ["json.loads returns a dictionary.", "Read payload['user'].", "Use len on payload['tasks'].", "Print both values."], solution: "import json\npayload = '{\"user\": \"Asha\", \"tasks\": [\"plan\", \"ship\"]}'\ndata = json.loads(payload)\nprint(data[\"user\"])\nprint(len(data[\"tasks\"]))" },
    boss: { name: "The Request Kraken", story: "The kraken returns inconsistent payloads. Normalize the response before the product sees it.", prompt: "If response status is 200, print the first item's name; otherwise print Unavailable.", starter: "response = {\"status\": 200, \"items\": [{\"name\": \"Python\"}]}\n\n# Validate the response\n", expected: "Python", rules: [{ re: "if", msg: "Check the response status." }, { re: "status", msg: "Read status from the response." }, { re: "items", msg: "Read the items payload." }], hints: ["Compare response['status'] with 200.", "The first item is at index zero.", "Read its name key.", "Use else for Unavailable."], solution: "response = {\"status\": 200, \"items\": [{\"name\": \"Python\"}]}\nif response[\"status\"] == 200:\n    print(response[\"items\"][0][\"name\"])\nelse:\n    print(\"Unavailable\")" },
    badge: "boss_api",
  }),
  makeModule({
    n: 15,
    intro: "Automation turns repetitive, predictable steps into dependable workflows.",
    learn: [
      { title: "Represent the workflow", body: "Before automating, make the inputs, transformation and output explicit. A small pure function is easier to test than a giant script.", code: "def make_slug(title):\n    return title.lower().replace(\" \", \"-\")\n\nprint(make_slug(\"Ship Python\"))" },
      { title: "Use patterns carefully", body: "Regular expressions are useful for identifying text patterns. Keep the pattern readable and test both valid and invalid examples.", code: "import re\ntext = \"ticket-482\"\nprint(bool(re.fullmatch(r\"ticket-\\d+\", text)))" },
    ],
    quiz: [
      { q: "What makes automation safe?", options: [choice("Clear inputs and repeatable steps", "Predictable behavior is easier to test and monitor."), choice("No logs", "Logs help diagnose workflows."), choice("Random timing", "Determinism is safer."), choice("Hard-coded secrets", "Secrets should never be embedded.")], answer: 0 },
      { q: "What does a regular expression describe?", options: [choice("A text pattern", "Regex matches structured text patterns."), choice("A database table", "Tables hold data."), choice("A Python class", "Classes model objects."), choice("A user password", "Regex can validate but does not define passwords.")], answer: 0 },
    ],
    challenge: { title: "Create safe filenames", prompt: "Convert each title into a lowercase slug and print the slugs, one per line.", starter: "titles = [\"Hello Python\", \"Build APIs\", \"Ship It\"]\n\n# Create slugs\n", expected: "hello-python\nbuild-apis\nship-it", rules: [{ re: "lower\\(\\)", msg: "Convert titles to lowercase." }, { re: "replace", msg: "Replace spaces with hyphens." }], hints: ["Loop over titles.", "Call lower on each title.", "Replace spaces with '-'.", "Print each slug."], solution: "titles = [\"Hello Python\", \"Build APIs\", \"Ship It\"]\nfor title in titles:\n    print(title.lower().replace(\" \", \"-\"))" },
    boss: { name: "The Task Golem", story: "The golem runs a queue of jobs. Mark only the jobs that are ready for automation.", prompt: "Print the names of jobs whose status is ready, one per line.", starter: "jobs = [{\"name\": \"backup\", \"status\": \"ready\"}, {\"name\": \"report\", \"status\": \"hold\"}, {\"name\": \"sync\", \"status\": \"ready\"}]\n\n# Run ready jobs\n", expected: "backup\nsync", rules: [{ re: "for", msg: "Iterate through jobs." }, { re: "ready", msg: "Check for the ready status." }], hints: ["Loop over each job.", "Use an if condition on job['status'].", "Print job['name'] when ready.", "Do not print jobs on hold."], solution: "jobs = [{\"name\": \"backup\", \"status\": \"ready\"}, {\"name\": \"report\", \"status\": \"hold\"}, {\"name\": \"sync\", \"status\": \"ready\"}]\nfor job in jobs:\n    if job[\"status\"] == \"ready\":\n        print(job[\"name\"])" },
    badge: "boss_automation",
  }),
  makeModule({
    n: 16,
    intro: "Git gives your work a memory: small commits, clear history and safe collaboration.",
    learn: [
      { title: "Commits are checkpoints", body: "A commit records a coherent change. Good messages explain what changed so you can navigate history later.", code: "commits = [\"add login\", \"fix typo\", \"add tests\"]\nfor commit in commits:\n    print(commit)" },
      { title: "Branch before risk", body: "Branches let you develop an idea separately, review it and merge it when ready. Keep the default branch releasable.", code: "branches = {\"main\": \"stable\", \"feature/api\": \"in progress\"}\nprint(branches[\"feature/api\"])" },
    ],
    quiz: [
      { q: "What is a commit?", options: [choice("A versioned checkpoint", "A commit captures a coherent snapshot of changes."), choice("A database password", "Credentials are not commits."), choice("A running server", "Servers execute code."), choice("A Python loop", "Loops are language control flow.")], answer: 0 },
      { q: "Why use a feature branch?", options: [choice("To isolate work before review", "Branches reduce risk on the stable branch."), choice("To delete history", "Branches preserve history."), choice("To avoid tests", "Branches should still be tested."), choice("To hide bugs", "Review should expose bugs.")], answer: 0 },
    ],
    challenge: { title: "Format a release log", prompt: "Print each commit with the prefix '- '.", starter: "commits = [\"add login\", \"fix typo\", \"add tests\"]\n\n# Format the release log\n", expected: "- add login\n- fix typo\n- add tests", rules: [{ re: "for", msg: "Loop over the commit list." }, { re: "- ", msg: "Add the release-log prefix." }], hints: ["Each commit becomes one output line.", "Use a for loop.", "Concatenate '- ' with commit.", "Print the formatted line."], solution: "commits = [\"add login\", \"fix typo\", \"add tests\"]\nfor commit in commits:\n    print(\"- \" + commit)" },
    boss: { name: "The Merge Minotaur", story: "Two branches carry useful changes. Combine their commit messages in order.", prompt: "Merge feature_commits after main_commits and print the complete history.", starter: "main_commits = [\"setup app\", \"add homepage\"]\nfeature_commits = [\"add dashboard\", \"add tests\"]\n\n# Combine the histories\n", expected: "setup app\nadd homepage\nadd dashboard\nadd tests", rules: [{ re: "extend|\\+", msg: "Combine both commit lists." }, { re: "for", msg: "Print the merged history." }], hints: ["Create a new list from main_commits.", "Add feature_commits after it.", "Keep the order unchanged.", "Print every commit."], solution: "main_commits = [\"setup app\", \"add homepage\"]\nfeature_commits = [\"add dashboard\", \"add tests\"]\nhistory = main_commits + feature_commits\nfor commit in history:\n    print(commit)" },
    badge: "boss_git",
  }),
  makeModule({
    n: 17,
    intro: "Real projects are built by turning a small, clear requirement into tested behavior.",
    learn: [
      { title: "Start with the contract", body: "Write down inputs, outputs and edge cases before implementation. A small contract keeps scope visible and makes acceptance tests possible.", code: "def word_count(text):\n    return len(text.split())\n\nprint(word_count(\"learn by shipping\"))" },
      { title: "Separate concerns", body: "Keep parsing, business rules and presentation separate. This makes a feature easier to change without breaking unrelated behavior.", code: "def is_valid_username(name):\n    return len(name) >= 3 and name.isalnum()\n\nprint(is_valid_username(\"Asha7\"))" },
    ],
    quiz: [
      { q: "What is an acceptance criterion?", options: [choice("A testable statement of done", "It describes observable behavior."), choice("A color choice", "Visual choices are separate."), choice("A private password", "Criteria should be shared."), choice("A random idea", "Criteria reduce ambiguity.")], answer: 0 },
      { q: "Why separate concerns?", options: [choice("To make changes safer", "Focused components are easier to test and replace."), choice("To add more bugs", "Separation reduces coupling."), choice("To avoid naming functions", "Clear names matter more."), choice("To hide requirements", "Requirements should stay visible.")], answer: 0 },
    ],
    challenge: { title: "Build a score report", prompt: "Write average_score(scores) that returns the average rounded to 1 decimal. Print the result for [80, 90, 70].", starter: "# Build average_score\n", expected: "80.0", rules: [{ re: "def\\s+average_score", msg: "Define average_score." }, { re: "return", msg: "Return the calculated average." }], hints: ["The average is sum divided by len.", "Put the calculation in a function.", "Round the result to 1 decimal.", "Call it with the provided scores."], solution: "def average_score(scores):\n    return round(sum(scores) / len(scores), 1)\n\nprint(average_score([80, 90, 70]))" },
    boss: { name: "The Scope Dragon", story: "The dragon only accepts a focused feature with a clear output contract.", prompt: "Create summarize_tasks(tasks) that returns '2/3 complete' for the provided task records.", starter: "tasks = [{\"done\": True}, {\"done\": False}, {\"done\": True}]\n\n# Build the summary\n", expected: "2/3 complete", rules: [{ re: "def\\s+summarize_tasks", msg: "Define summarize_tasks." }, { re: "return", msg: "Return the summary string." }, { re: "done", msg: "Inspect the done field." }], hints: ["Count the records whose done is True.", "Use len(tasks) for the total.", "Build an f-string with completed and total.", "Print summarize_tasks(tasks)."], solution: "def summarize_tasks(tasks):\n    completed = sum(task[\"done\"] for task in tasks)\n    return f\"{completed}/{len(tasks)} complete\"\n\nprint(summarize_tasks(tasks))" },
    badge: "boss_projects",
  }),
  makeModule({
    n: 18,
    intro: "Interview problems reward a calm process: clarify, choose a pattern, test edge cases.",
    learn: [
      { title: "Name the pattern", body: "Many problems reduce to a small set of patterns: counting, two pointers, a stack, a queue or a hash map. Recognizing the shape saves time.", code: "values = [2, 7, 11, 15]\ntarget = 9\nseen = set()\nfor value in values:\n    if target - value in seen:\n        print(value)\n    seen.add(value)" },
      { title: "Test the edges", body: "Check empty input, one item, duplicates and already-sorted or reverse-sorted data. Good explanations include complexity and trade-offs.", code: "def first_duplicate(values):\n    seen = set()\n    for value in values:\n        if value in seen:\n            return value\n        seen.add(value)\n    return None" },
    ],
    quiz: [
      { q: "Why use a set for membership checks?", options: [choice("It gives fast average lookup", "A set is designed for membership tests."), choice("It preserves every duplicate", "Sets remove duplicates."), choice("It sorts values", "Sets are not ordered for sorting."), choice("It stores key-value pairs", "Dictionaries do that.")], answer: 0 },
      { q: "What should you do before coding an interview problem?", options: [choice("Clarify inputs and outputs", "A shared contract prevents solving the wrong problem."), choice("Skip examples", "Examples reveal edge cases."), choice("Write random code", "Choose a pattern first."), choice("Optimize blindly", "Start with correctness.")], answer: 0 },
    ],
    challenge: { title: "Find the first duplicate", prompt: "Write first_duplicate(values) and print the first value that appears twice. Return None if there is no duplicate.", starter: "# Build first_duplicate\n", expected: "4", rules: [{ re: "def\\s+first_duplicate", msg: "Define first_duplicate." }, { re: "set", msg: "Use a set for seen values." }], hints: ["Track values already visited.", "If a value is in seen, return it.", "Otherwise add it to seen.", "Test with [2, 4, 1, 4, 3]."], solution: "def first_duplicate(values):\n    seen = set()\n    for value in values:\n        if value in seen:\n            return value\n        seen.add(value)\n    return None\n\nprint(first_duplicate([2, 4, 1, 4, 3]))" },
    boss: { name: "The Whiteboard Wraith", story: "The wraith hides the shortest route through a small list. Explain your pattern with working code.", prompt: "Print True if any two numbers add to target, otherwise False.", starter: "numbers = [3, 8, 12, 4]\ntarget = 16\n\n# Find the pair\n", expected: "True", rules: [{ re: "set", msg: "Use a set for efficient lookup." }, { re: "target", msg: "Use the target to find the complement." }], hints: ["For each number, calculate target - number.", "Check whether the complement was seen.", "Add each number after checking it.", "Print a boolean result."], solution: "numbers = [3, 8, 12, 4]\ntarget = 16\nseen = set()\nfound = False\nfor number in numbers:\n    if target - number in seen:\n        found = True\n        break\n    seen.add(number)\nprint(found)" },
    badge: "boss_interview",
  }),
  makeModule({
    n: 19,
    intro: "A capstone is a small product: clear input, useful transformation, and a result someone can use.",
    learn: [
      { title: "Design the smallest useful slice", body: "A good first version solves one user problem end to end. Define the input, the happy path, the failure path and the next improvement.", code: "def summarize_expenses(expenses):\n    total = sum(expenses)\n    return {\"count\": len(expenses), \"total\": total}\n\nprint(summarize_expenses([12, 8, 20]))" },
      { title: "Make the result presentable", body: "A project is easier to trust when its output is labelled, predictable and backed by a few meaningful tests.", code: "report = {\"count\": 3, \"total\": 40}\nprint(f\"{report['count']} expenses: {report['total']}\")" },
    ],
    quiz: [
      { q: "What belongs in a useful MVP?", options: [choice("One complete user outcome", "A thin end-to-end slice creates learning quickly."), choice("Every future feature", "MVPs deliberately limit scope."), choice("Only a landing page", "The core workflow must work."), choice("No error path", "Failures should be considered.")], answer: 0 },
      { q: "Why label project output?", options: [choice("So users can interpret it", "Labels make results understandable and trustworthy."), choice("To make code slower", "Labels have no such purpose."), choice("To avoid tests", "Tests are still valuable."), choice("To hide missing data", "Missing data should be visible.")], answer: 0 },
    ],
    challenge: { title: "Build an expense summary", prompt: "Create summarize_expenses(expenses) returning a dictionary with count and total. Print total for [12, 8, 20].", starter: "# Build summarize_expenses\n", expected: "40", rules: [{ re: "def\\s+summarize_expenses", msg: "Define summarize_expenses." }, { re: "count", msg: "Include a count in the result." }, { re: "total", msg: "Include a total in the result." }], hints: ["The result should be a dictionary.", "count is len(expenses).", "total is sum(expenses).", "Print the returned dictionary's total."], solution: "def summarize_expenses(expenses):\n    return {\"count\": len(expenses), \"total\": sum(expenses)}\n\nprint(summarize_expenses([12, 8, 20])[\"total\"])" },
    boss: { name: "The Launch Leviathan", story: "The leviathan will launch only a complete, testable report.", prompt: "Create build_report(tasks) returning the number of done tasks and total tasks. Print '2/3 complete' for the provided tasks.", starter: "tasks = [{\"title\": \"plan\", \"done\": True}, {\"title\": \"build\", \"done\": True}, {\"title\": \"ship\", \"done\": False}]\n\n# Build the report\n", expected: "2/3 complete", rules: [{ re: "def\\s+build_report", msg: "Define build_report." }, { re: "sum", msg: "Count completed tasks." }, { re: "len", msg: "Calculate the total task count." }], hints: ["Count True done values with sum.", "Use len(tasks) for total.", "Return an f-string.", "Print build_report(tasks)."], solution: "def build_report(tasks):\n    done = sum(task[\"done\"] for task in tasks)\n    return f\"{done}/{len(tasks)} complete\"\n\nprint(build_report(tasks))" },
    badge: "boss_capstone",
  }),
  makeModule({
    n: 20,
    intro: "You are ready to turn fundamentals into a clear, confident engineering story.",
    learn: [
      { title: "Explain your decisions", body: "Job readiness is more than syntax. Describe the problem, your approach, trade-offs, tests and what you would improve next.", code: "project = {\"problem\": \"slow reports\", \"approach\": \"group data\", \"next\": \"add caching\"}\nfor key, value in project.items():\n    print(f\"{key}: {value}\")" },
      { title: "Keep learning in public", body: "A small portfolio, clear README and thoughtful commit history show how you work. Progress compounds when you can reflect on it.", code: "skills = [\"Python\", \"SQL\", \"Testing\"]\nprint(\" | \".join(skills))" },
    ],
    quiz: [
      { q: "What makes a project explanation strong?", options: [choice("Problem, approach, trade-offs and tests", "That story shows both engineering judgment and execution."), choice("Only the final screenshot", "The reasoning matters too."), choice("A list of buzzwords", "Specific evidence is stronger."), choice("No limitations", "Honest trade-offs build trust.")], answer: 0 },
      { q: "What does a good README provide?", options: [choice("Context and steps to run the project", "Others should understand and reproduce the work."), choice("Only a logo", "A README needs useful information."), choice("Private credentials", "Secrets must never be committed."), choice("Unverified claims", "Documentation should be accurate.")], answer: 0 },
    ],
    challenge: { title: "Format your skills", prompt: "Print the skills joined by ' | ' exactly as a portfolio headline.", starter: "skills = [\"Python\", \"SQL\", \"Testing\"]\n\n# Format the headline\n", expected: "Python | SQL | Testing", rules: [{ re: "join", msg: "Use join to format the skills." }], hints: ["The separator is ' | '.", "Call join on the separator string.", "Pass skills to join.", "Print the result."], solution: "skills = [\"Python\", \"SQL\", \"Testing\"]\nprint(\" | \".join(skills))" },
    boss: { name: "The Career Gate", story: "The final gate checks whether you can turn raw evidence into a concise engineering signal.", prompt: "Using the project dictionary, print three labelled lines: Problem, Approach and Next step.", starter: "project = {\"problem\": \"slow reports\", \"approach\": \"group data\", \"next\": \"add caching\"}\n\n# Present the project story\n", expected: "Problem: slow reports\nApproach: group data\nNext step: add caching", rules: [{ re: "project", msg: "Use the provided project data." }, { re: "problem", msg: "Include the problem." }, { re: "approach", msg: "Include the approach." }, { re: "next", msg: "Include the next step." }], hints: ["Read each value from project.", "Use an f-string for each line.", "The labels must match exactly.", "Print Problem, Approach, Next step in order."], solution: "project = {\"problem\": \"slow reports\", \"approach\": \"group data\", \"next\": \"add caching\"}\nprint(f\"Problem: {project['problem']}\")\nprint(f\"Approach: {project['approach']}\")\nprint(f\"Next step: {project['next']}\")" },
    badge: "boss_ready",
  }),
);

export const LEVELS = ROADMAP.map((title, i) => ({
  id: `L${i + 1}`,
  n: i + 1,
  title,
  content: CONTENT[i] || null,
}));
