export interface Problem {
    id: string;
    title: string;
    slug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    status: "Solved" | "Unsolved";
    type: "MCQ" | "Coding";
    description: string;
    lesson: {
        title: string;
        content: string; // Markdown supported
        examples: {
            code: string;
            explanation: string;
        }[];
    };
    problemStatement?: string;
    starterCode?: string;
    testCases?: {
        input: string;
        expectedOutput: string;
    }[];
    options?: { // For MCQs
        id: string;
        text: string;
        isCorrect: boolean;
    }[];
}

export const pythonModules: {
    id: string;
    title: string;
    description: string;
    problems: Problem[];
}[] = [
        {
            id: "1",
            title: "Introduction, Output and Math Operators",
            description: "Python programs covering print statements and basic math operations.",
            problems: [
                {
                    id: "p1",
                    title: "Sum and Print - MCQ",
                    slug: "sum-and-print-mcq",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "MCQ",
                    description: "Understand how to add numbers and print them.",
                    lesson: {
                        title: "Basic Arithmetic and Printing",
                        content: "In Python, you can perform arithmetic operations like addition directly inside a `print()` function. \n\nFor example, `print(2 + 3)` will calculate the sum `5` and then print it.",
                        examples: [
                            {
                                code: "print(5 + 10)",
                                explanation: "This will output 15."
                            }
                        ]
                    },
                    options: [
                        { id: "a", text: "print(12 + 13)", isCorrect: true },
                        { id: "b", text: "print(12 + 13 = 25)", isCorrect: false },
                        { id: "c", text: "print(\"12 + 13\")", isCorrect: false },
                        { id: "d", text: "echo 12 + 13", isCorrect: false }
                    ],
                    problemStatement: "Which of the following is the correct way to print the sum of 12 and 13?"
                },
                {
                    id: "p2",
                    title: "Print Coding Chef",
                    slug: "print-coding-chef",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Write your first Python program to print a string.",
                    lesson: {
                        title: "Printing Strings",
                        content: "To print text in Python, you use the `print()` function. The text must be enclosed in double quotes `\"` or single quotes `'`.\n\nThis text is called a **string**.",
                        examples: [
                            {
                                code: "print(\"Hello World\")",
                                explanation: "Prints: Hello World"
                            }
                        ]
                    },
                    problemStatement: "Write a program to print the text **Coding Chef** to the console.",
                    starterCode: "# Write your code below\n",
                    testCases: [
                        { input: "", expectedOutput: "Coding Chef" }
                    ]
                },
                {
                    id: "p3",
                    title: "Identify Correct Syntax",
                    slug: "identify-correct-syntax",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "MCQ",
                    description: "Identify the correct syntax for printing.",
                    lesson: {
                        title: "Python Syntax Rules",
                        content: "Python is case-sensitive. `print` must be lowercase. Strings must be quoted.",
                        examples: []
                    },
                    options: [
                        { id: "a", text: "Print(\"Hello\")", isCorrect: false },
                        { id: "b", text: "print(\"Hello\")", isCorrect: true },
                        { id: "c", text: "print(Hello)", isCorrect: false },
                        { id: "d", text: "PRINT(\"Hello\")", isCorrect: false }
                    ],
                    problemStatement: "Which of the following is valid Python syntax?"
                },
                {
                    id: "p4",
                    title: "Print difference of 10 and 3",
                    slug: "print-difference",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Learn subtraction in Python.",
                    lesson: {
                        title: "Subtraction",
                        content: "You can use the minus symbol `-` to subtract numbers.",
                        examples: [
                            {
                                code: "print(10 - 5)",
                                explanation: "Outputs: 5"
                            }
                        ]
                    },
                    problemStatement: "Write a program that prints the result of subtracting 3 from 10.",
                    starterCode: "# Print the difference\n",
                    testCases: [
                        { input: "", expectedOutput: "7" }
                    ]
                },
                {
                    id: "p5",
                    title: "Identify Correct Syntax",
                    slug: "identify-correct-syntax-2",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "MCQ",
                    description: "Identify the correct syntax for printing numbers.",
                    lesson: {
                        title: "Printing Numbers",
                        content: "Numbers do not need to be enclosed in quotes when printing.",
                        examples: [
                            { code: "print(123)", explanation: "Prints the number 123" }
                        ]
                    },
                    options: [
                        { id: "a", text: "print(20)", isCorrect: true },
                        { id: "b", text: "print 20", isCorrect: false },
                        { id: "c", text: "Print(20)", isCorrect: false },
                        { id: "d", text: "echo 20", isCorrect: false }
                    ],
                    problemStatement: "Which of the following is the correct way to print the number 20?"
                },
                {
                    id: "p6",
                    title: "Print String num",
                    slug: "print-string-num",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Distinguish between printing numbers and strings.",
                    lesson: {
                        title: "Strings vs Numbers",
                        content: "If you put a number in quotes, it becomes a string. `print(\"20\")` prints the characters 2 and 0, not the number twenty.",
                        examples: []
                    },
                    problemStatement: "Write a program to print the string **20** (as text, not a number).",
                    starterCode: "# Print the string \"20\"\n",
                    testCases: [
                        { input: "", expectedOutput: "20" }
                    ]
                },
                {
                    id: "p7",
                    title: "Print 6 divided by 2",
                    slug: "print-division",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Learn division in Python.",
                    lesson: {
                        title: "Division",
                        content: "Use the forward slash `/` for division. Note that division always returns a float (decimal number) in Python 3.",
                        examples: [
                            { code: "print(10 / 2)", explanation: "Outputs: 5.0" }
                        ]
                    },
                    problemStatement: "Write a program to print the result of 6 divided by 2.",
                    starterCode: "# Print 6 divided by 2\n",
                    testCases: [
                        { input: "", expectedOutput: "3.0" }
                    ]
                },
                {
                    id: "p8",
                    title: "Identify Incorrect Syntax",
                    slug: "identify-incorrect-syntax",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "MCQ",
                    description: "Spot errors in Python code.",
                    lesson: {
                        title: "Common Syntax Errors",
                        content: "Missing parentheses, unclosed quotes, or misspelled function names are common errors.",
                        examples: []
                    },
                    options: [
                        { id: "a", text: "print(\"Hello\")", isCorrect: false },
                        { id: "b", text: "print(5 + 3)", isCorrect: false },
                        { id: "c", text: "print(\"Hello)", isCorrect: true },
                        { id: "d", text: "print(10)", isCorrect: false }
                    ],
                    problemStatement: "Which of the following lines contains a syntax error?"
                },
                {
                    id: "p9",
                    title: "Print 108 using 9 and 12",
                    slug: "print-multiplication",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Learn multiplication in Python.",
                    lesson: {
                        title: "Multiplication",
                        content: "Use the asterisk `*` for multiplication.",
                        examples: [
                            { code: "print(5 * 4)", explanation: "Outputs: 20" }
                        ]
                    },
                    problemStatement: "Write a program to print the product of 9 and 12.",
                    starterCode: "# Print 9 multiplied by 12\n",
                    testCases: [
                        { input: "", expectedOutput: "108" }
                    ]
                },
                {
                    id: "p10",
                    title: "Print Learn Coding on CodeChef",
                    slug: "print-learn-coding",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Practice printing longer strings.",
                    lesson: {
                        title: "Printing Sentences",
                        content: "You can print sentences just like words. Make sure the entire sentence is inside the quotes.",
                        examples: []
                    },
                    problemStatement: "Write a program to print: **Learn Coding on CodeChef**",
                    starterCode: "# Print the sentence\n",
                    testCases: [
                        { input: "", expectedOutput: "Learn Coding on CodeChef" }
                    ]
                },
                {
                    id: "p11",
                    title: "Print Right Angled Triangle",
                    slug: "print-right-angled-triangle",
                    difficulty: "Medium",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Use multiple print statements to create a pattern.",
                    lesson: {
                        title: "Multiline Output",
                        content: "Python executes code line by line. You can use multiple `print()` statements to print on new lines.",
                        examples: [
                            {
                                code: "print(\"*\")\nprint(\"**\")",
                                explanation: "Prints a small star pattern."
                            }
                        ]
                    },
                    problemStatement: "Print the following pattern:\n*\n**\n***",
                    starterCode: "# Print the pattern\n",
                    testCases: [
                        { input: "", expectedOutput: "*\n**\n***" }
                    ]
                },
                {
                    id: "p12",
                    title: "Print Multiple Strings - MCQ",
                    slug: "print-multiple-strings-mcq",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "MCQ",
                    description: "Placeholder for Print Multiple Strings - MCQ",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    options: [
                        { id: "a", text: "Option A", isCorrect: true },
                        { id: "b", text: "Option B", isCorrect: false }
                    ],
                    problemStatement: "Question coming soon..."
                },
                {
                    id: "p13",
                    title: "Print 5 5",
                    slug: "print-5-5",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Placeholder for Print 5 5",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    problemStatement: "Problem statement coming soon...",
                    starterCode: "# Write your code here\n",
                    testCases: []
                },
                {
                    id: "p14",
                    title: "Output Format - MCQ",
                    slug: "output-format-mcq",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "MCQ",
                    description: "Placeholder for Output Format - MCQ",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    options: [
                        { id: "a", text: "Option A", isCorrect: true },
                        { id: "b", text: "Option B", isCorrect: false }
                    ],
                    problemStatement: "Question coming soon..."
                },
                {
                    id: "p15",
                    title: "Role of endl",
                    slug: "role-of-endl",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Placeholder for Role of endl",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    problemStatement: "Problem statement coming soon...",
                    starterCode: "# Write your code here\n",
                    testCases: []
                },
                {
                    id: "p16",
                    title: "Print Python Programming",
                    slug: "print-python-programming",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Placeholder for Print Python Programming",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    problemStatement: "Problem statement coming soon...",
                    starterCode: "# Write your code here\n",
                    testCases: []
                },
                {
                    id: "p17",
                    title: "Print Many Literals - MCQ",
                    slug: "print-many-literals-mcq",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "MCQ",
                    description: "Placeholder for Print Many Literals - MCQ",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    options: [
                        { id: "a", text: "Option A", isCorrect: true },
                        { id: "b", text: "Option B", isCorrect: false }
                    ],
                    problemStatement: "Question coming soon..."
                },
                {
                    id: "p18",
                    title: "Output Challenge - MCQ",
                    slug: "output-challenge-mcq",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "MCQ",
                    description: "Placeholder for Output Challenge - MCQ",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    options: [
                        { id: "a", text: "Option A", isCorrect: true },
                        { id: "b", text: "Option B", isCorrect: false }
                    ],
                    problemStatement: "Question coming soon..."
                },
                {
                    id: "p19",
                    title: "Print 1 to 5",
                    slug: "print-1-to-5",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Placeholder for Print 1 to 5",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    problemStatement: "Problem statement coming soon...",
                    starterCode: "# Write your code here\n",
                    testCases: []
                },
                {
                    id: "p20",
                    title: "Print I love CodeChef",
                    slug: "print-i-love-codechef",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Placeholder for Print I love CodeChef",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    problemStatement: "Problem statement coming soon...",
                    starterCode: "# Write your code here\n",
                    testCases: []
                },
                {
                    id: "p21",
                    title: "Print Squares",
                    slug: "print-squares",
                    difficulty: "Easy",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Placeholder for Print Squares",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    problemStatement: "Problem statement coming soon...",
                    starterCode: "# Write your code here\n",
                    testCases: []
                },
                {
                    id: "p22",
                    title: "Print Pattern",
                    slug: "print-pattern",
                    difficulty: "Medium",
                    status: "Unsolved",
                    type: "Coding",
                    description: "Placeholder for Print Pattern",
                    lesson: {
                        title: "Coming Soon",
                        content: "This lesson is under development.",
                        examples: []
                    },
                    problemStatement: "Problem statement coming soon...",
                    starterCode: "# Write your code here\n",
                    testCases: []
                }
            ]
        }
    ];
