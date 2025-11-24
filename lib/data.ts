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
        title: "2 Heaps",
        description: "Use two heaps (min-heap and max-heap) to solve problems like finding the median of a number stream.",
        slug: "two-heaps",
        questions: [],
    },
    {
        id: "2",
        title: "Arrays",
        description: "Fundamental data structure problems including traversal, manipulation, and optimization techniques.",
        slug: "arrays",
        questions: [],
    },
    {
        id: "3",
        title: "Backtracking",
        description: "Explore all possible solutions by building candidates recursively and abandoning those that fail.",
        slug: "backtracking",
        questions: [],
    },
    {
        id: "4",
        title: "Dynamic Programming",
        description: "Solve complex problems by breaking them down into simpler subproblems and storing their solutions.",
        slug: "dynamic-programming",
        questions: [],
    },
    {
        id: "5",
        title: "Fast & Slow Pointers",
        description: "Use two pointers moving at different speeds to detect cycles or find the middle of a linked list.",
        slug: "fast-slow-pointers",
        questions: [],
    },
    {
        id: "6",
        title: "Graph Traversal",
        description: "Traverse graphs using BFS or DFS to find paths, cycles, or connected components.",
        slug: "graph-traversal",
        questions: [],
    },
    {
        id: "7",
        title: "In-place Reversal of LinkedList",
        description: "Reverse the links between nodes in a linked list without using extra space.",
        slug: "in-place-reversal",
        questions: [],
    },
    {
        id: "8",
        title: "K-Way Merge",
        description: "Merge K sorted data structures (arrays, lists) into a single sorted structure using a heap.",
        slug: "k-way-merge",
        questions: [],
    },
    {
        id: "9",
        title: "Merge Intervals",
        description: "Handle overlapping intervals by sorting and merging them based on start and end times.",
        slug: "merge-intervals",
        questions: [],
    },
    {
        id: "10",
        title: "Modified Binary Search",
        description: "Adapt binary search to solve problems in rotated arrays or infinite lists.",
        slug: "modified-binary-search",
        questions: [],
    },
    {
        id: "11",
        title: "Sliding Window",
        description: "Perform operations on a specific window size of an array or string to optimize time complexity.",
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
        id: "12",
        title: "Top K Elements",
        description: "Find the K largest, smallest, or most frequent elements using a heap or quickselect.",
        slug: "top-k-elements",
        questions: [],
    },
];
