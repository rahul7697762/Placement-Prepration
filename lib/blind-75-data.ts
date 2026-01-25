export interface Blind75Question {
    id: string;
    title: string;
    number: number;
    difficulty: "Easy" | "Medium" | "Hard";
    acceptanceRate: string;
    link: string;
    category: string;
    completed: boolean;
}

export interface Blind75Category {
    id: string;
    title: string;
    description: string;
    slug: string;
    questions: Blind75Question[];
}

export const blind75Categories: Blind75Category[] = [
    {
        id: "1",
        title: "Array & Hashing",
        description: "Master array manipulation and hash table techniques for efficient data storage and retrieval.",
        slug: "array-hashing",
        questions: [
            { id: "1-1", title: "Two Sum", number: 1, difficulty: "Easy", acceptanceRate: "56.9%", link: "https://leetcode.com/problems/two-sum/", category: "array-hashing", completed: false },
            { id: "1-2", title: "Contains Duplicate", number: 217, difficulty: "Easy", acceptanceRate: "64.0%", link: "https://leetcode.com/problems/contains-duplicate/", category: "array-hashing", completed: false },
            { id: "1-3", title: "Group Anagrams", number: 49, difficulty: "Medium", acceptanceRate: "72.0%", link: "https://leetcode.com/problems/group-anagrams/", category: "array-hashing", completed: false },
            { id: "1-4", title: "Top K Frequent Elements", number: 347, difficulty: "Medium", acceptanceRate: "65.7%", link: "https://leetcode.com/problems/top-k-frequent-elements/", category: "array-hashing", completed: false },
            { id: "1-5", title: "Encode and Decode Strings", number: 271, difficulty: "Medium", acceptanceRate: "51.0%", link: "https://leetcode.com/problems/encode-and-decode-strings/", category: "array-hashing", completed: false },
            { id: "1-6", title: "Longest Consecutive Sequence", number: 128, difficulty: "Medium", acceptanceRate: "47.0%", link: "https://leetcode.com/problems/longest-consecutive-sequence/", category: "array-hashing", completed: false },
        ]
    },
    {
        id: "2",
        title: "Two Pointers",
        description: "Use two pointer technique to solve problems involving sorted arrays and strings efficiently.",
        slug: "two-pointers",
        questions: [
            { id: "2-1", title: "Valid Parentheses", number: 20, difficulty: "Easy", acceptanceRate: "43.5%", link: "https://leetcode.com/problems/valid-parentheses/", category: "two-pointers", completed: false },
            { id: "2-2", title: "3Sum", number: 15, difficulty: "Medium", acceptanceRate: "38.4%", link: "https://leetcode.com/problems/3sum/", category: "two-pointers", completed: false },
            { id: "2-3", title: "Container With Most Water", number: 11, difficulty: "Medium", acceptanceRate: "59.3%", link: "https://leetcode.com/problems/container-with-most-water/", category: "two-pointers", completed: false },
        ]
    },
    {
        id: "3",
        title: "Sliding Window",
        description: "Master the sliding window pattern to solve substring and subarray problems optimally.",
        slug: "sliding-window",
        questions: [
            { id: "3-1", title: "Longest Substring Without Repeating Characters", number: 3, difficulty: "Medium", acceptanceRate: "38.3%", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", category: "sliding-window", completed: false },
            { id: "3-2", title: "Longest Repeating Character Replacement", number: 424, difficulty: "Medium", acceptanceRate: "58.8%", link: "https://leetcode.com/problems/longest-repeating-character-replacement/", category: "sliding-window", completed: false },
            { id: "3-3", title: "Minimum Window Substring", number: 76, difficulty: "Hard", acceptanceRate: "46.7%", link: "https://leetcode.com/problems/minimum-window-substring/", category: "sliding-window", completed: false },
        ]
    },
    {
        id: "4",
        title: "Stack",
        description: "Utilize stack data structure for parsing, expression evaluation, and monotonic problems.",
        slug: "stack",
        questions: [
            { id: "4-1", title: "Valid Parentheses", number: 20, difficulty: "Easy", acceptanceRate: "43.5%", link: "https://leetcode.com/problems/valid-parentheses/", category: "stack", completed: false },
        ]
    },
    {
        id: "5",
        title: "Binary Search",
        description: "Apply binary search algorithm on sorted arrays and search spaces.",
        slug: "binary-search",
        questions: [
            { id: "5-1", title: "Search in Rotated Sorted Array", number: 33, difficulty: "Medium", acceptanceRate: "44.0%", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/", category: "binary-search", completed: false },
            { id: "5-2", title: "Find Minimum in Rotated Sorted Array", number: 153, difficulty: "Medium", acceptanceRate: "53.7%", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", category: "binary-search", completed: false },
        ]
    },
    {
        id: "6",
        title: "Linked List",
        description: "Master linked list manipulation, reversal, and cycle detection techniques.",
        slug: "linked-list",
        questions: [
            { id: "6-1", title: "Reverse Linked List", number: 206, difficulty: "Easy", acceptanceRate: "80.1%", link: "https://leetcode.com/problems/reverse-linked-list/", category: "linked-list", completed: false },
            { id: "6-2", title: "Linked List Cycle", number: 141, difficulty: "Easy", acceptanceRate: "53.7%", link: "https://leetcode.com/problems/linked-list-cycle/", category: "linked-list", completed: false },
            { id: "6-3", title: "Merge Two Sorted Lists", number: 21, difficulty: "Easy", acceptanceRate: "67.8%", link: "https://leetcode.com/problems/merge-two-sorted-lists/", category: "linked-list", completed: false },
            { id: "6-4", title: "Remove Nth Node From End of List", number: 19, difficulty: "Medium", acceptanceRate: "50.7%", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", category: "linked-list", completed: false },
            { id: "6-5", title: "Reorder List", number: 143, difficulty: "Medium", acceptanceRate: "64.3%", link: "https://leetcode.com/problems/reorder-list/", category: "linked-list", completed: false },
            { id: "6-6", title: "Merge k Sorted Lists", number: 23, difficulty: "Hard", acceptanceRate: "58.6%", link: "https://leetcode.com/problems/merge-k-sorted-lists/", category: "linked-list", completed: false },
        ]
    },
    {
        id: "7",
        title: "Trees",
        description: "Learn tree traversals, binary search trees, and tree construction problems.",
        slug: "trees",
        questions: [
            { id: "7-1", title: "Invert Binary Tree", number: 226, difficulty: "Easy", acceptanceRate: "79.7%", link: "https://leetcode.com/problems/invert-binary-tree/", category: "trees", completed: false },
            { id: "7-2", title: "Same Tree", number: 100, difficulty: "Easy", acceptanceRate: "66.4%", link: "https://leetcode.com/problems/same-tree/", category: "trees", completed: false },
            { id: "7-3", title: "Subtree of Another Tree", number: 572, difficulty: "Easy", acceptanceRate: "51.1%", link: "https://leetcode.com/problems/subtree-of-another-tree/", category: "trees", completed: false },
            { id: "7-4", title: "Binary Tree Level Order Traversal", number: 102, difficulty: "Medium", acceptanceRate: "72.0%", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/", category: "trees", completed: false },
            { id: "7-5", title: "Validate Binary Search Tree", number: 98, difficulty: "Medium", acceptanceRate: "35.2%", link: "https://leetcode.com/problems/validate-binary-search-tree/", category: "trees", completed: false },
            { id: "7-6", title: "Serialize and Deserialize Binary Tree", number: 297, difficulty: "Hard", acceptanceRate: "60.2%", link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", category: "trees", completed: false },
        ]
    },
    {
        id: "8",
        title: "Tries",
        description: "Implement and utilize Trie data structure for word-based problems.",
        slug: "tries",
        questions: [
            { id: "8-1", title: "Implement Trie (Prefix Tree)", number: 208, difficulty: "Medium", acceptanceRate: "69.0%", link: "https://leetcode.com/problems/implement-trie-prefix-tree/", category: "tries", completed: false },
            { id: "8-2", title: "Design Add and Search Words Data Structure", number: 211, difficulty: "Medium", acceptanceRate: "48.0%", link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", category: "tries", completed: false },
            { id: "8-3", title: "Word Search II", number: 212, difficulty: "Hard", acceptanceRate: "38.0%", link: "https://leetcode.com/problems/word-search-ii/", category: "tries", completed: false },
        ]
    },
    {
        id: "9",
        title: "Heap / Priority Queue",
        description: "Use heaps to efficiently find top K elements and merge sorted structures.",
        slug: "heap",
        questions: [
            { id: "9-1", title: "Merge k Sorted Lists", number: 23, difficulty: "Hard", acceptanceRate: "58.6%", link: "https://leetcode.com/problems/merge-k-sorted-lists/", category: "heap", completed: false },
            { id: "9-2", title: "Find Median from Data Stream", number: 295, difficulty: "Hard", acceptanceRate: "54.1%", link: "https://leetcode.com/problems/find-median-from-data-stream/", category: "heap", completed: false },
        ]
    },
    {
        id: "10",
        title: "Backtracking",
        description: "Explore all possible solutions using backtracking and pruning techniques.",
        slug: "backtracking",
        questions: [
            { id: "10-1", title: "Combination Sum", number: 39, difficulty: "Medium", acceptanceRate: "75.9%", link: "https://leetcode.com/problems/combination-sum/", category: "backtracking", completed: false },
            { id: "10-2", title: "Word Search", number: 79, difficulty: "Medium", acceptanceRate: "46.7%", link: "https://leetcode.com/problems/word-search/", category: "backtracking", completed: false },
        ]
    },
    {
        id: "11",
        title: "Graphs",
        description: "Master graph traversal, cycle detection, and topological sorting.",
        slug: "graphs",
        questions: [
            { id: "11-1", title: "Number of Islands", number: 200, difficulty: "Medium", acceptanceRate: "63.6%", link: "https://leetcode.com/problems/number-of-islands/", category: "graphs", completed: false },
            { id: "11-2", title: "Clone Graph", number: 133, difficulty: "Medium", acceptanceRate: "64.4%", link: "https://leetcode.com/problems/clone-graph/", category: "graphs", completed: false },
            { id: "11-3", title: "Pacific Atlantic Water Flow", number: 417, difficulty: "Medium", acceptanceRate: "60.4%", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/", category: "graphs", completed: false },
            { id: "11-4", title: "Course Schedule", number: 207, difficulty: "Medium", acceptanceRate: "50.6%", link: "https://leetcode.com/problems/course-schedule/", category: "graphs", completed: false },
            { id: "11-5", title: "Number of Connected Components in an Undirected Graph", number: 323, difficulty: "Medium", acceptanceRate: "64.7%", link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", category: "graphs", completed: false },
            { id: "11-6", title: "Graph Valid Tree", number: 261, difficulty: "Medium", acceptanceRate: "49.8%", link: "https://leetcode.com/problems/graph-valid-tree/", category: "graphs", completed: false },
            { id: "11-7", title: "Alien Dictionary", number: 269, difficulty: "Hard", acceptanceRate: "37.0%", link: "https://leetcode.com/problems/alien-dictionary/", category: "graphs", completed: false },
        ]
    },
    {
        id: "12",
        title: "1-D Dynamic Programming",
        description: "Solve linear DP problems with optimal substructure.",
        slug: "1d-dp",
        questions: [
            { id: "12-1", title: "Climbing Stairs", number: 70, difficulty: "Easy", acceptanceRate: "53.9%", link: "https://leetcode.com/problems/climbing-stairs/", category: "1d-dp", completed: false },
            { id: "12-2", title: "House Robber", number: 198, difficulty: "Medium", acceptanceRate: "52.9%", link: "https://leetcode.com/problems/house-robber/", category: "1d-dp", completed: false },
            { id: "12-3", title: "House Robber II", number: 213, difficulty: "Medium", acceptanceRate: "44.5%", link: "https://leetcode.com/problems/house-robber-ii/", category: "1d-dp", completed: false },
            { id: "12-4", title: "Decode Ways", number: 91, difficulty: "Medium", acceptanceRate: "37.5%", link: "https://leetcode.com/problems/decode-ways/", category: "1d-dp", completed: false },
            { id: "12-5", title: "Coin Change", number: 322, difficulty: "Medium", acceptanceRate: "47.8%", link: "https://leetcode.com/problems/coin-change/", category: "1d-dp", completed: false },
            { id: "12-6", title: "Maximum Product Subarray", number: 152, difficulty: "Medium", acceptanceRate: "35.9%", link: "https://leetcode.com/problems/maximum-product-subarray/", category: "1d-dp", completed: false },
            { id: "12-7", title: "Word Break", number: 139, difficulty: "Medium", acceptanceRate: "49.0%", link: "https://leetcode.com/problems/word-break/", category: "1d-dp", completed: false },
            { id: "12-8", title: "Longest Increasing Subsequence", number: 300, difficulty: "Medium", acceptanceRate: "58.9%", link: "https://leetcode.com/problems/longest-increasing-subsequence/", category: "1d-dp", completed: false },
        ]
    },
    {
        id: "13",
        title: "2-D Dynamic Programming",
        description: "Master multi-dimensional DP for complex optimization problems.",
        slug: "2d-dp",
        questions: [
            { id: "13-1", title: "Unique Paths", number: 62, difficulty: "Medium", acceptanceRate: "66.5%", link: "https://leetcode.com/problems/unique-paths/", category: "2d-dp", completed: false },
            { id: "13-2", title: "Longest Common Subsequence", number: 1143, difficulty: "Medium", acceptanceRate: "58.8%", link: "https://leetcode.com/problems/longest-common-subsequence/", category: "2d-dp", completed: false },
        ]
    },
    {
        id: "14",
        title: "Greedy",
        description: "Make locally optimal choices to find global optimum solutions.",
        slug: "greedy",
        questions: [
            { id: "14-1", title: "Maximum Subarray", number: 53, difficulty: "Medium", acceptanceRate: "52.9%", link: "https://leetcode.com/problems/maximum-subarray/", category: "greedy", completed: false },
            { id: "14-2", title: "Jump Game", number: 55, difficulty: "Medium", acceptanceRate: "40.4%", link: "https://leetcode.com/problems/jump-game/", category: "greedy", completed: false },
        ]
    },
    {
        id: "15",
        title: "Intervals",
        description: "Handle interval merging, overlapping, and scheduling problems.",
        slug: "intervals",
        questions: [
            { id: "15-1", title: "Insert Interval", number: 57, difficulty: "Medium", acceptanceRate: "44.6%", link: "https://leetcode.com/problems/insert-interval/", category: "intervals", completed: false },
            { id: "15-2", title: "Merge Intervals", number: 56, difficulty: "Medium", acceptanceRate: "50.9%", link: "https://leetcode.com/problems/merge-intervals/", category: "intervals", completed: false },
            { id: "15-3", title: "Non-overlapping Intervals", number: 435, difficulty: "Medium", acceptanceRate: "56.5%", link: "https://leetcode.com/problems/non-overlapping-intervals/", category: "intervals", completed: false },
            { id: "15-4", title: "Meeting Rooms II", number: 253, difficulty: "Medium", acceptanceRate: "52.5%", link: "https://leetcode.com/problems/meeting-rooms-ii/", category: "intervals", completed: false },
        ]
    },
    {
        id: "16",
        title: "Math & Geometry",
        description: "Apply mathematical concepts and geometric algorithms.",
        slug: "math-geometry",
        questions: [
            { id: "16-1", title: "Rotate Image", number: 48, difficulty: "Medium", acceptanceRate: "79.2%", link: "https://leetcode.com/problems/rotate-image/", category: "math-geometry", completed: false },
            { id: "16-2", title: "Spiral Matrix", number: 54, difficulty: "Medium", acceptanceRate: "55.9%", link: "https://leetcode.com/problems/spiral-matrix/", category: "math-geometry", completed: false },
            { id: "16-3", title: "Set Matrix Zeroes", number: 73, difficulty: "Medium", acceptanceRate: "62.2%", link: "https://leetcode.com/problems/set-matrix-zeroes/", category: "math-geometry", completed: false },
        ]
    },
    {
        id: "17",
        title: "Bit Manipulation",
        description: "Use bitwise operations to solve problems efficiently.",
        slug: "bit-manipulation",
        questions: [
            { id: "17-1", title: "Number of 1 Bits", number: 191, difficulty: "Easy", acceptanceRate: "76.1%", link: "https://leetcode.com/problems/number-of-1-bits/", category: "bit-manipulation", completed: false },
            { id: "17-2", title: "Counting Bits", number: 338, difficulty: "Easy", acceptanceRate: "80.3%", link: "https://leetcode.com/problems/counting-bits/", category: "bit-manipulation", completed: false },
            { id: "17-3", title: "Reverse Bits", number: 190, difficulty: "Easy", acceptanceRate: "65.6%", link: "https://leetcode.com/problems/reverse-bits/", category: "bit-manipulation", completed: false },
            { id: "17-4", title: "Missing Number", number: 268, difficulty: "Easy", acceptanceRate: "71.4%", link: "https://leetcode.com/problems/missing-number/", category: "bit-manipulation", completed: false },
        ]
    },
    {
        id: "18",
        title: "String Manipulation",
        description: "Master string processing, palindromes, and pattern matching.",
        slug: "strings",
        questions: [
            { id: "18-1", title: "Longest Palindromic Substring", number: 5, difficulty: "Medium", acceptanceRate: "37.1%", link: "https://leetcode.com/problems/longest-palindromic-substring/", category: "strings", completed: false },
            { id: "18-2", title: "Palindromic Substrings", number: 647, difficulty: "Medium", acceptanceRate: "72.4%", link: "https://leetcode.com/problems/palindromic-substrings/", category: "strings", completed: false },
        ]
    },
];

// Calculate total questions
export const totalBlind75Questions = blind75Categories.reduce(
    (total, category) => total + category.questions.length,
    0
);
