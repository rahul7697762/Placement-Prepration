export interface Question {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    link: string;
    pattern: string;
    completed: boolean;
}

export interface Pattern {
    id: string;
    title: string;
    description: string;
    slug: string;
    questions: Question[];
}

export const initialPatterns: Pattern[] = [
    {
        id: "1",
        title: "Sliding Window",
        description: "Used to perform a required operation on a specific window size of a given array or string, such as finding the longest substring containing all '1's.",
        slug: "sliding-window",
        questions: [
            {
                id: "sw-1",
                title: "Maximum Sum Subarray of Size K",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/maximum-average-subarray-i/",
                pattern: "sliding-window",
                completed: false,
            },
            {
                id: "sw-2",
                title: "Longest Substring Without Repeating Characters",
                difficulty: "Medium",
                link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
                pattern: "sliding-window",
                completed: false,
            },
        ],
    },
    {
        id: "2",
        title: "Two Pointers",
        description: "Two pointers are used to search for a pair in a sorted array, or to merge two sorted arrays.",
        slug: "two-pointers",
        questions: [
            {
                id: "tp-1",
                title: "Pair with Target Sum",
                difficulty: "Easy",
                link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
                pattern: "two-pointers",
                completed: false,
            },
        ],
    },
    {
        id: "3",
        title: "Fast & Slow Pointers",
        description: "Also known as the Hare & Tortoise algorithm, this is a pointer algorithm that uses two pointers which move through the array (or sequence/linked list) at different speeds.",
        slug: "fast-slow-pointers",
        questions: [],
    },
    {
        id: "4",
        title: "Merge Intervals",
        description: "This pattern describes an efficient technique to deal with overlapping intervals. In a lot of problems involving intervals, we either need to find overlapping intervals or merge intervals if they overlap.",
        slug: "merge-intervals",
        questions: [],
    },
    {
        id: "5",
        title: "Cyclic Sort",
        description: "This pattern describes an interesting approach to deal with problems involving arrays containing numbers in a given range.",
        slug: "cyclic-sort",
        questions: [],
    },
];
