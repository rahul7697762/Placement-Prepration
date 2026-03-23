import { Metadata } from "next";
import { initialPatterns } from "@/lib/data";

const patternMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
    "two-pointers": {
        title: "Two Pointers Pattern - LeetCode Interview Problems",
        description: "Master the Two Pointers technique for coding interviews. Solve Two Sum II, 3Sum, Container With Most Water, and Trapping Rain Water with step-by-step explanations.",
        keywords: ["two pointers leetcode", "two pointers pattern", "two pointers technique", "3sum leetcode", "trapping rain water leetcode"],
    },
    "sliding-window": {
        title: "Sliding Window Pattern - LeetCode Interview Problems",
        description: "Master the Sliding Window technique for coding interviews. Solve Longest Substring Without Repeating Characters, Minimum Window Substring, and more.",
        keywords: ["sliding window leetcode", "sliding window pattern", "sliding window technique", "minimum window substring", "longest substring without repeating"],
    },
    "dynamic-programming": {
        title: "Dynamic Programming Pattern - LeetCode Interview Problems",
        description: "Master Dynamic Programming for coding interviews. Solve Climbing Stairs, House Robber, Coin Change, Longest Increasing Subsequence and more DP problems.",
        keywords: ["dynamic programming leetcode", "DP interview questions", "memoization leetcode", "tabulation problems", "coin change leetcode", "house robber leetcode"],
    },
    "backtracking": {
        title: "Backtracking Pattern - LeetCode Interview Problems",
        description: "Master Backtracking for coding interviews. Solve Combination Sum, Permutations, Sudoku Solver and more recursive backtracking problems.",
        keywords: ["backtracking leetcode", "backtracking interview questions", "combination sum leetcode", "permutations leetcode", "sudoku solver leetcode"],
    },
    "bfs": {
        title: "BFS Pattern - Breadth-First Search LeetCode Problems",
        description: "Master BFS (Breadth-First Search) for coding interviews. Solve Binary Tree Level Order Traversal, Rotting Oranges, Word Ladder and more.",
        keywords: ["BFS leetcode", "breadth first search interview", "binary tree level order traversal", "word ladder leetcode", "rotting oranges leetcode"],
    },
    "dfs": {
        title: "DFS Pattern - Depth-First Search LeetCode Problems",
        description: "Master DFS (Depth-First Search) for coding interviews. Solve Clone Graph, Course Schedule, Path Sum II and more DFS problems.",
        keywords: ["DFS leetcode", "depth first search interview", "clone graph leetcode", "course schedule leetcode", "graph traversal interview"],
    },
    "binary-tree-traversal": {
        title: "Binary Tree Traversal Pattern - LeetCode Interview Problems",
        description: "Master Binary Tree Traversal patterns for coding interviews. Solve inorder, preorder, postorder, and level-order traversal problems.",
        keywords: ["binary tree traversal leetcode", "inorder traversal", "tree interview questions", "binary tree zigzag traversal", "tree traversal patterns"],
    },
    "modified-binary-search": {
        title: "Modified Binary Search Pattern - LeetCode Interview Problems",
        description: "Master Modified Binary Search for coding interviews. Solve Search in Rotated Sorted Array, Find Minimum in Rotated Array, and more variants.",
        keywords: ["binary search leetcode", "modified binary search", "search rotated sorted array leetcode", "binary search interview questions", "binary search variants"],
    },
    "top-k-elements": {
        title: "Top K Elements Pattern - Heap LeetCode Interview Problems",
        description: "Master the Top K Elements pattern using Heaps for coding interviews. Solve Kth Largest Element, Top K Frequent Elements, and more.",
        keywords: ["top k elements leetcode", "heap interview questions", "priority queue leetcode", "kth largest element leetcode", "top k frequent elements"],
    },
    "overlapping-intervals": {
        title: "Overlapping Intervals Pattern - LeetCode Interview Problems",
        description: "Master the Overlapping Intervals pattern for coding interviews. Solve Merge Intervals, Insert Interval, Non-Overlapping Intervals and more.",
        keywords: ["merge intervals leetcode", "overlapping intervals pattern", "interval interview questions", "insert interval leetcode"],
    },
    "monotonic-stack": {
        title: "Monotonic Stack Pattern - LeetCode Interview Problems",
        description: "Master the Monotonic Stack technique for coding interviews. Solve Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram.",
        keywords: ["monotonic stack leetcode", "monotonic stack pattern", "next greater element leetcode", "daily temperatures leetcode", "stack interview questions"],
    },
    "fast-slow-pointers": {
        title: "Fast & Slow Pointers Pattern - LeetCode Interview Problems",
        description: "Master the Fast & Slow Pointers (Floyd's Cycle Detection) technique. Solve Linked List Cycle, Find Duplicate Number, Happy Number and more.",
        keywords: ["fast slow pointers leetcode", "floyd cycle detection", "linked list cycle leetcode", "tortoise hare algorithm", "find duplicate number leetcode"],
    },
    "linked-list-reversal": {
        title: "Linked List Reversal Pattern - LeetCode Interview Problems",
        description: "Master in-place Linked List Reversal for coding interviews. Solve Reverse Linked List, Reverse Linked List II, Swap Nodes in Pairs and more.",
        keywords: ["reverse linked list leetcode", "linked list reversal pattern", "linked list interview questions", "swap nodes in pairs leetcode"],
    },
    "matrix-traversal": {
        title: "Matrix Traversal Pattern - LeetCode Interview Problems",
        description: "Master Matrix Traversal for coding interviews. Solve Number of Islands, Spiral Matrix, Set Matrix Zeroes and more 2D array problems.",
        keywords: ["matrix traversal leetcode", "number of islands leetcode", "spiral matrix leetcode", "2D array interview questions", "grid problems leetcode"],
    },
    "prefix-sum": {
        title: "Prefix Sum Pattern - LeetCode Interview Problems",
        description: "Master the Prefix Sum technique for coding interviews. Solve Range Sum Query, Contiguous Array, Subarray Sum Equals K and more.",
        keywords: ["prefix sum leetcode", "prefix sum pattern", "range sum query leetcode", "subarray sum equals k leetcode", "prefix sum interview questions"],
    },
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const pattern = initialPatterns.find((p) => p.slug === slug);
    const meta = patternMeta[slug];

    const title = meta?.title ?? `${pattern?.title ?? slug} Pattern - LeetCode Interview Problems`;
    const description =
        meta?.description ??
        `Master the ${pattern?.title ?? slug} pattern for coding interviews. ${pattern?.description ?? ""} Practice with curated LeetCode problems on prep4place.`;
    const keywords = meta?.keywords ?? [
        `${slug} leetcode`,
        `${slug} interview questions`,
        `${slug} pattern`,
        "coding interview",
        "placement preparation",
    ];

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: `https://prep4place.com/patterns/${slug}`,
        },
        openGraph: {
            title: `${title} | prep4place`,
            description,
            url: `https://prep4place.com/patterns/${slug}`,
            type: "website",
            images: [
                {
                    url: "https://prep4place.com/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: `prep4place - ${pattern?.title ?? slug} Pattern`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["https://prep4place.com/og-image.png"],
        },
    };
}

export default function PatternSlugLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
