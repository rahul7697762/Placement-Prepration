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
        title: "Prefix Sum",
        description: "Precompute a prefix sum array where prefix[i] stores the sum of elements from index 0 to i. This enables quick sum queries over any subarray.",
        slug: "prefix-sum",
        questions: [
            { id: "1-1", title: "Range Sum Query - Immutable (LeetCode #303)", difficulty: "Easy", link: "https://leetcode.com/problems/range-sum-query-immutable/", pattern: "prefix-sum", completed: false },
            { id: "1-2", title: "Contiguous Array (LeetCode #525)", difficulty: "Medium", link: "https://leetcode.com/problems/contiguous-array/", pattern: "prefix-sum", completed: false },
            { id: "1-3", title: "Subarray Sum Equals K (LeetCode #560)", difficulty: "Medium", link: "https://leetcode.com/problems/subarray-sum-equals-k/", pattern: "prefix-sum", completed: false },
        ]
    },
    {
        id: "2",
        title: "Two Pointers",
        description: "Use two pointers (either moving towards or away from each other) to efficiently search or process elements in an array.",
        slug: "two-pointers",
        questions: [
            { id: "2-1", title: "Two Sum II — Sorted Array (LeetCode #167)", difficulty: "Medium", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", pattern: "two-pointers", completed: false },
            { id: "2-2", title: "3Sum (LeetCode #15)", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/", pattern: "two-pointers", completed: false },
            { id: "2-3", title: "Container With Most Water (LeetCode #11)", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/", pattern: "two-pointers", completed: false },
            { id: "2-4", title: "Trapping Rain Water (LeetCode #42)", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/", pattern: "two-pointers", completed: false },
        ]
    },
    {
        id: "3",
        title: "Sliding Window",
        description: "Maintain a dynamic window (subarray or substring) that slides over the input while updating required values efficiently.",
        slug: "sliding-window",
        questions: [
            { id: "3-1", title: "Longest Substring Without Repeating Characters (LeetCode #3)", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", pattern: "sliding-window", completed: false },
            { id: "3-2", title: "Minimum Window Substring (LeetCode #76)", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/", pattern: "sliding-window", completed: false },
            { id: "3-3", title: "Sliding Window Maximum (LeetCode #239)", difficulty: "Hard", link: "https://leetcode.com/problems/sliding-window-maximum/", pattern: "sliding-window", completed: false },
            { id: "3-4", title: "Longest Repeating Character Replacement (LeetCode #424)", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/", pattern: "sliding-window", completed: false },
        ]
    },
    {
        id: "4",
        title: "Fast & Slow Pointers (Tortoise and Hare)",
        description: "Use two pointers moving at different speeds to detect cycles or find specific elements in linked lists.",
        slug: "fast-slow-pointers",
        questions: [
            { id: "4-1", title: "Linked List Cycle (LeetCode #141)", difficulty: "Easy", link: "https://leetcode.com/problems/linked-list-cycle/", pattern: "fast-slow-pointers", completed: false },
            { id: "4-2", title: "Find the Duplicate Number (LeetCode #287)", difficulty: "Medium", link: "https://leetcode.com/problems/find-the-duplicate-number/", pattern: "fast-slow-pointers", completed: false },
            { id: "4-3", title: "Happy Number (LeetCode #202)", difficulty: "Easy", link: "https://leetcode.com/problems/happy-number/", pattern: "fast-slow-pointers", completed: false },
            { id: "4-4", title: "Reorder List (LeetCode #143)", difficulty: "Medium", link: "https://leetcode.com/problems/reorder-list/", pattern: "fast-slow-pointers", completed: false },
        ]
    },
    {
        id: "5",
        title: "Linked List In-Place Reversal",
        description: "Reverse sections of a linked list in place by adjusting pointers without extra memory.",
        slug: "linked-list-reversal",
        questions: [
            { id: "5-1", title: "Reverse Linked List (LeetCode #206)", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/", pattern: "linked-list-reversal", completed: false },
            { id: "5-2", title: "Reverse Linked List II (LeetCode #92)", difficulty: "Medium", link: "https://leetcode.com/problems/reverse-linked-list-ii/", pattern: "linked-list-reversal", completed: false },
            { id: "5-3", title: "Swap Nodes in Pairs (LeetCode #24)", difficulty: "Medium", link: "https://leetcode.com/problems/swap-nodes-in-pairs/", pattern: "linked-list-reversal", completed: false },
            { id: "5-4", title: "Rotate List (LeetCode #61)", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-list/", pattern: "linked-list-reversal", completed: false },
        ]
    },
    {
        id: "6",
        title: "Monotonic Stack",
        description: "Use a stack to maintain a sequence of increasing/decreasing elements to solve problems related to the 'next greater/smaller' elements.",
        slug: "monotonic-stack",
        questions: [
            { id: "6-1", title: "Next Greater Element I (LeetCode #496)", difficulty: "Easy", link: "https://leetcode.com/problems/next-greater-element-i/", pattern: "monotonic-stack", completed: false },
            { id: "6-2", title: "Daily Temperatures (LeetCode #739)", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/", pattern: "monotonic-stack", completed: false },
            { id: "6-3", title: "Largest Rectangle in Histogram (LeetCode #84)", difficulty: "Hard", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/", pattern: "monotonic-stack", completed: false },
            { id: "6-4", title: "Online Stock Span (LeetCode #901)", difficulty: "Medium", link: "https://leetcode.com/problems/online-stock-span/", pattern: "monotonic-stack", completed: false },
        ]
    },
    {
        id: "7",
        title: "Top K Elements (Heap)",
        description: "Use heaps (priority queues) or quick-select to efficiently find the k largest/smallest elements.",
        slug: "top-k-elements",
        questions: [
            { id: "7-1", title: "Kth Largest Element in an Array (LeetCode #215)", difficulty: "Medium", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/", pattern: "top-k-elements", completed: false },
            { id: "7-2", title: "Top K Frequent Elements (LeetCode #347)", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-elements/", pattern: "top-k-elements", completed: false },
            { id: "7-3", title: "Find K Pairs with Smallest Sums (LeetCode #373)", difficulty: "Medium", link: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/", pattern: "top-k-elements", completed: false },
        ]
    },
    {
        id: "8",
        title: "Overlapping Intervals",
        description: "Merge or process overlapping intervals in a sorted list.",
        slug: "overlapping-intervals",
        questions: [
            { id: "8-1", title: "Merge Intervals (LeetCode #56)", difficulty: "Medium", link: "https://leetcode.com/problems/merge-intervals/", pattern: "overlapping-intervals", completed: false },
            { id: "8-2", title: "Insert Interval (LeetCode #57)", difficulty: "Medium", link: "https://leetcode.com/problems/insert-interval/", pattern: "overlapping-intervals", completed: false },
            { id: "8-3", title: "Non-Overlapping Intervals (LeetCode #435)", difficulty: "Medium", link: "https://leetcode.com/problems/non-overlapping-intervals/", pattern: "overlapping-intervals", completed: false },
        ]
    },
    {
        id: "9",
        title: "Modified Binary Search",
        description: "Apply binary search variations on sorted, rotated, or complex datasets.",
        slug: "modified-binary-search",
        questions: [
            { id: "9-1", title: "Search in Rotated Sorted Array (LeetCode #33)", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/", pattern: "modified-binary-search", completed: false },
            { id: "9-2", title: "Find Minimum in Rotated Sorted Array (LeetCode #153)", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", pattern: "modified-binary-search", completed: false },
            { id: "9-3", title: "Search a 2D Matrix II (LeetCode #240)", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix-ii/", pattern: "modified-binary-search", completed: false },
        ]
    },
    {
        id: "10",
        title: "Binary Tree Traversal",
        description: "Visit all nodes in a tree using different orders.",
        slug: "binary-tree-traversal",
        questions: [
            { id: "10-1", title: "Binary Tree Inorder Traversal (LeetCode #94)", difficulty: "Easy", link: "https://leetcode.com/problems/binary-tree-inorder-traversal/", pattern: "binary-tree-traversal", completed: false },
            { id: "10-2", title: "Binary Tree Zigzag Level Order Traversal (LeetCode #103)", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", pattern: "binary-tree-traversal", completed: false },
            { id: "10-3", title: "Binary Tree Paths (LeetCode #257)", difficulty: "Easy", link: "https://leetcode.com/problems/binary-tree-paths/", pattern: "binary-tree-traversal", completed: false },
        ]
    },
    {
        id: "11",
        title: "Depth-First Search (DFS)",
        description: "Explore as far as possible along each branch before backtracking.",
        slug: "dfs",
        questions: [
            { id: "11-1", title: "Clone Graph (LeetCode #133)", difficulty: "Medium", link: "https://leetcode.com/problems/clone-graph/", pattern: "dfs", completed: false },
            { id: "11-2", title: "Path Sum II (LeetCode #113)", difficulty: "Medium", link: "https://leetcode.com/problems/path-sum-ii/", pattern: "dfs", completed: false },
            { id: "11-3", title: "Course Schedule II (LeetCode #210)", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule-ii/", pattern: "dfs", completed: false },
        ]
    },
    {
        id: "12",
        title: "Breadth-First Search (BFS)",
        description: "Explore all nodes at the current depth before moving deeper.",
        slug: "bfs",
        questions: [
            { id: "12-1", title: "Binary Tree Level Order Traversal (LeetCode #102)", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/", pattern: "bfs", completed: false },
            { id: "12-2", title: "Rotting Oranges (LeetCode #994)", difficulty: "Medium", link: "https://leetcode.com/problems/rotting-oranges/", pattern: "bfs", completed: false },
            { id: "12-3", title: "Word Ladder (LeetCode #127)", difficulty: "Hard", link: "https://leetcode.com/problems/word-ladder/", pattern: "bfs", completed: false },
        ]
    },
    {
        id: "13",
        title: "Matrix Traversal",
        description: "Navigate through matrices using BFS, DFS, or pattern-based traversal.",
        slug: "matrix-traversal",
        questions: [
            { id: "13-1", title: "Set Matrix Zeroes (LeetCode #73)", difficulty: "Medium", link: "https://leetcode.com/problems/set-matrix-zeroes/", pattern: "matrix-traversal", completed: false },
            { id: "13-2", title: "Number of Islands (LeetCode #200)", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/", pattern: "matrix-traversal", completed: false },
            { id: "13-3", title: "Spiral Matrix (LeetCode #54)", difficulty: "Medium", link: "https://leetcode.com/problems/spiral-matrix/", pattern: "matrix-traversal", completed: false },
        ]
    },
    {
        id: "14",
        title: "Backtracking",
        description: "Explore all possible choices recursively, undoing changes when necessary.",
        slug: "backtracking",
        questions: [
            { id: "14-1", title: "Combination Sum (LeetCode #39)", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/", pattern: "backtracking", completed: false },
            { id: "14-2", title: "Sudoku Solver (LeetCode #37)", difficulty: "Hard", link: "https://leetcode.com/problems/sudoku-solver/", pattern: "backtracking", completed: false },
            { id: "14-3", title: "Permutations (LeetCode #46)", difficulty: "Medium", link: "https://leetcode.com/problems/permutations/", pattern: "backtracking", completed: false },
        ]
    },
    {
        id: "15",
        title: "Dynamic Programming (DP)",
        description: "Break a problem into smaller overlapping subproblems, store the results to avoid redundant computations (memoization or tabulation).",
        slug: "dynamic-programming",
        questions: [
            { id: "15-1", title: "Climbing Stairs (LeetCode #70)", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/", pattern: "dynamic-programming", completed: false },
            { id: "15-2", title: "House Robber (LeetCode #198)", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/", pattern: "dynamic-programming", completed: false },
            { id: "15-3", title: "Longest Palindromic Substring (LeetCode #5)", difficulty: "Medium", link: "https://leetcode.com/problems/longest-palindromic-substring/", pattern: "dynamic-programming", completed: false },
            { id: "15-4", title: "Unique Paths (LeetCode #62)", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths/", pattern: "dynamic-programming", completed: false },
            { id: "15-5", title: "Coin Change (LeetCode #322)", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/", pattern: "dynamic-programming", completed: false },
            { id: "15-6", title: "Edit Distance (LeetCode #72)", difficulty: "Medium", link: "https://leetcode.com/problems/edit-distance/", pattern: "dynamic-programming", completed: false },
            { id: "15-7", title: "Longest Increasing Subsequence (LeetCode #300)", difficulty: "Medium", link: "https://leetcode.com/problems/longest-increasing-subsequence/", pattern: "dynamic-programming", completed: false },
        ]
    }
];
