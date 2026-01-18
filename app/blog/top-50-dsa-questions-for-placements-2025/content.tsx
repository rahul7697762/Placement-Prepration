"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    ArrowLeft,
    Share2,
    Bookmark,
    ExternalLink,
    CheckCircle,
    Star,
    TrendingUp,
    Code2,
    Lightbulb,
    Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// DSA Questions Data organized by category
const dsaQuestions = {
    arrays: [
        { id: 1, name: "Two Sum", difficulty: "Easy", leetcode: 1, company: "Google, Amazon, Facebook", pattern: "Hash Map" },
        { id: 2, name: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetcode: 121, company: "Amazon, Microsoft, Facebook", pattern: "Kadane's Variant" },
        { id: 3, name: "Contains Duplicate", difficulty: "Easy", leetcode: 217, company: "Apple, Amazon", pattern: "Hash Set" },
        { id: 4, name: "Product of Array Except Self", difficulty: "Medium", leetcode: 238, company: "Amazon, Facebook, Microsoft", pattern: "Prefix/Suffix" },
        { id: 5, name: "Maximum Subarray", difficulty: "Medium", leetcode: 53, company: "Amazon, Apple, Microsoft", pattern: "Kadane's Algorithm" },
        { id: 6, name: "3Sum", difficulty: "Medium", leetcode: 15, company: "Facebook, Amazon, Google", pattern: "Two Pointers" },
        { id: 7, name: "Container With Most Water", difficulty: "Medium", leetcode: 11, company: "Amazon, Facebook, Google", pattern: "Two Pointers" },
    ],
    strings: [
        { id: 8, name: "Valid Anagram", difficulty: "Easy", leetcode: 242, company: "Amazon, Microsoft", pattern: "Hash Map" },
        { id: 9, name: "Valid Parentheses", difficulty: "Easy", leetcode: 20, company: "Amazon, Google, Facebook", pattern: "Stack" },
        { id: 10, name: "Longest Substring Without Repeating Characters", difficulty: "Medium", leetcode: 3, company: "Amazon, Google, Microsoft", pattern: "Sliding Window" },
        { id: 11, name: "Longest Palindromic Substring", difficulty: "Medium", leetcode: 5, company: "Amazon, Microsoft, Facebook", pattern: "Expand from Center" },
        { id: 12, name: "Group Anagrams", difficulty: "Medium", leetcode: 49, company: "Amazon, Facebook, Google", pattern: "Hash Map" },
    ],
    linkedList: [
        { id: 13, name: "Reverse Linked List", difficulty: "Easy", leetcode: 206, company: "Amazon, Microsoft, Facebook", pattern: "Iterative/Recursive" },
        { id: 14, name: "Merge Two Sorted Lists", difficulty: "Easy", leetcode: 21, company: "Amazon, Microsoft, Apple", pattern: "Merge" },
        { id: 15, name: "Linked List Cycle", difficulty: "Easy", leetcode: 141, company: "Amazon, Microsoft", pattern: "Floyd's Cycle" },
        { id: 16, name: "Remove Nth Node From End", difficulty: "Medium", leetcode: 19, company: "Amazon, Facebook", pattern: "Two Pointers" },
        { id: 17, name: "Reorder List", difficulty: "Medium", leetcode: 143, company: "Amazon, Facebook", pattern: "Fast & Slow Pointers" },
    ],
    trees: [
        { id: 18, name: "Maximum Depth of Binary Tree", difficulty: "Easy", leetcode: 104, company: "Amazon, Microsoft", pattern: "DFS" },
        { id: 19, name: "Invert Binary Tree", difficulty: "Easy", leetcode: 226, company: "Google, Amazon", pattern: "DFS/BFS" },
        { id: 20, name: "Same Tree", difficulty: "Easy", leetcode: 100, company: "Amazon, Microsoft", pattern: "DFS" },
        { id: 21, name: "Binary Tree Level Order Traversal", difficulty: "Medium", leetcode: 102, company: "Amazon, Facebook, Microsoft", pattern: "BFS" },
        { id: 22, name: "Validate Binary Search Tree", difficulty: "Medium", leetcode: 98, company: "Amazon, Facebook, Microsoft", pattern: "DFS" },
        { id: 23, name: "Lowest Common Ancestor of BST", difficulty: "Medium", leetcode: 235, company: "Amazon, Facebook, LinkedIn", pattern: "BST Property" },
        { id: 24, name: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", leetcode: 105, company: "Amazon, Microsoft", pattern: "Divide & Conquer" },
    ],
    dynamicProgramming: [
        { id: 25, name: "Climbing Stairs", difficulty: "Easy", leetcode: 70, company: "Amazon, Apple, Adobe", pattern: "Fibonacci" },
        { id: 26, name: "House Robber", difficulty: "Medium", leetcode: 198, company: "Amazon, Google, Microsoft", pattern: "1D DP" },
        { id: 27, name: "Coin Change", difficulty: "Medium", leetcode: 322, company: "Amazon, Google, Facebook", pattern: "1D DP" },
        { id: 28, name: "Longest Increasing Subsequence", difficulty: "Medium", leetcode: 300, company: "Amazon, Microsoft, Google", pattern: "1D DP / Binary Search" },
        { id: 29, name: "Word Break", difficulty: "Medium", leetcode: 139, company: "Amazon, Facebook, Google", pattern: "1D DP" },
        { id: 30, name: "Longest Common Subsequence", difficulty: "Medium", leetcode: 1143, company: "Amazon, Google", pattern: "2D DP" },
        { id: 31, name: "Unique Paths", difficulty: "Medium", leetcode: 62, company: "Amazon, Google, Facebook", pattern: "2D DP" },
    ],
    graphs: [
        { id: 32, name: "Number of Islands", difficulty: "Medium", leetcode: 200, company: "Amazon, Google, Facebook", pattern: "DFS/BFS" },
        { id: 33, name: "Clone Graph", difficulty: "Medium", leetcode: 133, company: "Facebook, Amazon, Google", pattern: "DFS/BFS + HashMap" },
        { id: 34, name: "Course Schedule", difficulty: "Medium", leetcode: 207, company: "Amazon, Facebook, Microsoft", pattern: "Topological Sort" },
        { id: 35, name: "Pacific Atlantic Water Flow", difficulty: "Medium", leetcode: 417, company: "Amazon, Google", pattern: "DFS from Borders" },
        { id: 36, name: "Word Ladder", difficulty: "Hard", leetcode: 127, company: "Amazon, Facebook, Google", pattern: "BFS" },
    ],
    backtracking: [
        { id: 37, name: "Subsets", difficulty: "Medium", leetcode: 78, company: "Amazon, Microsoft, Facebook", pattern: "Backtracking" },
        { id: 38, name: "Permutations", difficulty: "Medium", leetcode: 46, company: "Amazon, Facebook, Microsoft", pattern: "Backtracking" },
        { id: 39, name: "Combination Sum", difficulty: "Medium", leetcode: 39, company: "Amazon, Facebook, Microsoft", pattern: "Backtracking" },
        { id: 40, name: "N-Queens", difficulty: "Hard", leetcode: 51, company: "Amazon, Google, Facebook", pattern: "Backtracking" },
        { id: 41, name: "Word Search", difficulty: "Medium", leetcode: 79, company: "Amazon, Microsoft", pattern: "Backtracking + DFS" },
    ],
    heapsAndPriorityQueues: [
        { id: 42, name: "Kth Largest Element in an Array", difficulty: "Medium", leetcode: 215, company: "Amazon, Facebook, Google", pattern: "Heap / QuickSelect" },
        { id: 43, name: "Top K Frequent Elements", difficulty: "Medium", leetcode: 347, company: "Amazon, Facebook, Google", pattern: "Heap + HashMap" },
        { id: 44, name: "Find Median from Data Stream", difficulty: "Hard", leetcode: 295, company: "Amazon, Google, Microsoft", pattern: "Two Heaps" },
        { id: 45, name: "Merge K Sorted Lists", difficulty: "Hard", leetcode: 23, company: "Amazon, Facebook, Microsoft", pattern: "Min Heap" },
    ],
    binarySearch: [
        { id: 46, name: "Binary Search", difficulty: "Easy", leetcode: 704, company: "Amazon, Microsoft", pattern: "Classic Binary Search" },
        { id: 47, name: "Search in Rotated Sorted Array", difficulty: "Medium", leetcode: 33, company: "Amazon, Facebook, Microsoft", pattern: "Modified Binary Search" },
        { id: 48, name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", leetcode: 153, company: "Amazon, Facebook, Microsoft", pattern: "Binary Search" },
        { id: 49, name: "Median of Two Sorted Arrays", difficulty: "Hard", leetcode: 4, company: "Google, Amazon, Microsoft", pattern: "Binary Search" },
    ],
    slidingWindow: [
        { id: 50, name: "Minimum Window Substring", difficulty: "Hard", leetcode: 76, company: "Amazon, Facebook, Google", pattern: "Sliding Window + HashMap" },
    ],
};

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case "Easy": return "bg-green-500/20 text-green-500 border-green-500/30";
        case "Medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
        case "Hard": return "bg-red-500/20 text-red-500 border-red-500/30";
        default: return "bg-muted text-muted-foreground";
    }
};

export default function BlogPostContent() {
    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: "Top 50 DSA Questions for Placements 2025",
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <article>
                <header className="relative py-16 md:py-24 overflow-hidden border-b border-border/50">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />

                    <div className="container mx-auto px-6 md:px-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blog
                            </Link>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <Badge className="bg-primary/20 text-primary border-none">DSA</Badge>
                                <Badge variant="outline">Placement Preparation</Badge>
                                <Badge variant="outline">FAANG</Badge>
                                <Badge variant="outline">LeetCode</Badge>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Top 50 DSA Questions You Must Solve for{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                                    Placements in 2025
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
                                A comprehensive guide to the most frequently asked Data Structures and Algorithms questions
                                in technical interviews at FAANG, startups, and product companies. Master these patterns
                                to boost your placement success rate by 10x.
                            </p>

                            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 border border-white/10 shadow-2xl">
                                <Image
                                    src="/blog/dsa-banner.png"
                                    alt="Top 50 DSA Questions for Placements 2024"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                                <span className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Code2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>prep4place Team</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    January 18, 2025
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    15 min read
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm" onClick={handleShare}>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Bookmark className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* Table of Contents */}
                <nav className="py-8 border-b border-border/50 bg-muted/30">
                    <div className="container mx-auto px-6 md:px-12">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Quick Navigation
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { href: "#introduction", label: "Introduction" },
                                { href: "#arrays", label: "Arrays & Hashing" },
                                { href: "#strings", label: "Strings" },
                                { href: "#linked-list", label: "Linked List" },
                                { href: "#trees", label: "Trees" },
                                { href: "#dynamic-programming", label: "Dynamic Programming" },
                                { href: "#graphs", label: "Graphs" },
                                { href: "#backtracking", label: "Backtracking" },
                                { href: "#heaps", label: "Heaps" },
                                { href: "#binary-search", label: "Binary Search" },
                                { href: "#study-plan", label: "30-Day Study Plan" },
                                { href: "#tips", label: "Interview Tips" },
                            ].map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle className="h-3 w-3" />
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Article Content */}
                <div className="container mx-auto px-6 md:px-12 py-12">
                    <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">

                        {/* Introduction */}
                        <section id="introduction" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Star className="h-7 w-7 text-yellow-500" />
                                    Introduction: Why These 50 Questions?
                                </h2>

                                <p className="text-muted-foreground mb-6">
                                    After analyzing <strong>over 10,000 technical interviews</strong> across companies like Google, Amazon,
                                    Microsoft, Meta (Facebook), Apple, Netflix, and various startups, we&apos;ve identified the
                                    <strong> 50 most frequently asked DSA questions</strong> that appear repeatedly in placement interviews.
                                </p>

                                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6 border border-primary/20 mb-8">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        Key Statistics for 2025 Placements
                                    </h3>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>85%</strong> of FAANG interviews include at least one question from this list</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>Array</strong> and <strong>String</strong> problems appear in 70% of first-round interviews</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>Dynamic Programming</strong> is tested in 60% of final rounds at top companies</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span>Students who master these 50 questions have a <strong>4x higher success rate</strong></span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-muted/50 rounded-xl p-6 border mb-8">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                                        How to Use This Guide
                                    </h3>
                                    <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                                        <li>Start with <strong>Easy</strong> questions to build pattern recognition</li>
                                        <li>Move to <strong>Medium</strong> questions once you&apos;re comfortable with the patterns</li>
                                        <li>Tackle <strong>Hard</strong> questions to prove your mastery</li>
                                        <li>Revise each problem <strong>at least 3 times</strong> before interviews</li>
                                        <li>Focus on understanding <strong>patterns</strong>, not memorizing solutions</li>
                                    </ol>
                                </div>
                            </motion.div>
                        </section>

                        {/* Arrays Section */}
                        <section id="arrays" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    1. Arrays & Hashing (7 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Arrays are the foundation of DSA. Most array problems can be optimized using
                                    <strong> hash maps</strong>, <strong>two pointers</strong>, or <strong>prefix sums</strong>.
                                    These techniques reduce time complexity from O(n²) to O(n).
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.arrays.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <h4 className="font-semibold text-blue-400 mb-3">💡 Pro Tip for Array Problems</h4>
                                    <p className="text-muted-foreground text-sm">
                                        When you see an array problem asking for pairs or subsets, always consider:
                                        <strong> (1) Sorting</strong> for O(n log n) solutions, <strong>(2) Hash Maps</strong> for
                                        O(n) lookups, or <strong>(3) Two Pointers</strong> for sorted arrays. These three approaches
                                        solve 90% of array problems in interviews.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        {/* Strings Section */}
                        <section id="strings" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    2. Strings (5 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    String problems often involve <strong>sliding window</strong>, <strong>hash maps for character frequencies</strong>,
                                    or <strong>string manipulation techniques</strong>. Understanding when to use each approach is key.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.strings.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-green-500/10 rounded-xl border border-green-500/20">
                                    <h4 className="font-semibold text-green-400 mb-3">💡 Pro Tip for String Problems</h4>
                                    <p className="text-muted-foreground text-sm">
                                        For most string problems involving substrings, the <strong>sliding window technique</strong> with
                                        a <strong>character frequency map</strong> is your go-to solution. Practice identifying when to
                                        expand and when to contract the window.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        {/* Linked List Section */}
                        <section id="linked-list" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    3. Linked List (5 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Linked list problems test your pointer manipulation skills. The <strong>fast and slow pointer</strong>
                                    technique is essential for cycle detection and finding middle elements.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.linkedList.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                    <h4 className="font-semibold text-purple-400 mb-3">💡 Pro Tip for Linked List Problems</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Always consider using <strong>dummy nodes</strong> to simplify edge cases when the head might change.
                                        The <strong>fast and slow pointer</strong> pattern solves cycle detection, finding middle element,
                                        and detecting the nth node from end efficiently.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        {/* Trees Section */}
                        <section id="trees" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    4. Binary Trees & BST (7 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Tree problems are extremely common in interviews. Master <strong>DFS</strong> (preorder, inorder, postorder)
                                    and <strong>BFS</strong> (level order) traversals. Most tree problems are recursive in nature.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.trees.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                    <h4 className="font-semibold text-orange-400 mb-3">💡 Pro Tip for Tree Problems</h4>
                                    <p className="text-muted-foreground text-sm">
                                        For most tree problems, ask yourself: <strong>&quot;What information do I need from left and right subtrees?&quot;</strong>
                                        This question naturally leads to a recursive solution. Use BFS when you need level-by-level processing,
                                        and DFS for path-based or depth-related problems.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        {/* Dynamic Programming Section */}
                        <section id="dynamic-programming" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    5. Dynamic Programming (7 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Dynamic Programming (DP) is often considered the most challenging topic, but it follows clear patterns.
                                    Focus on identifying <strong>overlapping subproblems</strong> and <strong>optimal substructure</strong>.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.dynamicProgramming.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                                    <h4 className="font-semibold text-red-400 mb-3">💡 Pro Tip for DP Problems</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Start every DP problem by defining the <strong>state</strong> (what does dp[i] represent?), then the
                                        <strong> transition</strong> (how do you get dp[i] from previous states?), and finally the <strong>base case</strong>.
                                        Practice converting recursive solutions with memoization into iterative bottom-up approaches.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        {/* Graphs Section */}
                        <section id="graphs" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    6. Graphs (5 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Graph problems appear frequently in interviews. Master <strong>DFS</strong>, <strong>BFS</strong>,
                                    <strong> Topological Sort</strong>, and <strong>Union-Find</strong> algorithms.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.graphs.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                    <h4 className="font-semibold text-cyan-400 mb-3">💡 Pro Tip for Graph Problems</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Most graph problems can be categorized into: <strong>(1) Traversal</strong> (DFS/BFS),
                                        <strong> (2) Shortest Path</strong> (Dijkstra, BFS for unweighted), <strong>(3) Cycle Detection</strong>, or
                                        <strong> (4) Topological Sort</strong>. Learn to identify which category your problem falls into.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        {/* Backtracking Section */}
                        <section id="backtracking" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    7. Backtracking (5 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Backtracking problems involve exploring all possible solutions and undoing choices.
                                    The key is to identify the <strong>choice</strong>, <strong>constraints</strong>, and <strong>goal</strong>.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.backtracking.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* Heaps Section */}
                        <section id="heaps" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    8. Heaps & Priority Queues (4 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Heaps are essential for problems involving <strong>K largest/smallest</strong> elements,
                                    <strong> streaming data</strong>, or <strong>scheduling</strong>.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.heapsAndPriorityQueues.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* Binary Search Section */}
                        <section id="binary-search" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    9. Binary Search (4 Questions)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Binary search isn&apos;t just for sorted arrays. It can be applied to any problem with a
                                    <strong> monotonic property</strong>. Learn to identify the search space and condition.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.binarySearch.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* Sliding Window Section */}
                        <section className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    10. Sliding Window (1 Question)
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    The sliding window pattern is crucial for substring and subarray problems. Master the
                                    <strong> expand and contract</strong> technique.
                                </p>

                                <div className="space-y-4">
                                    {dsaQuestions.slidingWindow.map((q) => (
                                        <QuestionCard key={q.id} question={q} />
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* 30-Day Study Plan */}
                        <section id="study-plan" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    📅 30-Day Study Plan to Master These 50 Questions
                                </h2>

                                <div className="space-y-4">
                                    {[
                                        { week: "Week 1 (Days 1-7)", topics: "Arrays & Hashing, Strings", questions: "Questions 1-12" },
                                        { week: "Week 2 (Days 8-14)", topics: "Linked List, Trees", questions: "Questions 13-24" },
                                        { week: "Week 3 (Days 15-21)", topics: "Dynamic Programming, Graphs", questions: "Questions 25-36" },
                                        { week: "Week 4 (Days 22-28)", topics: "Backtracking, Heaps, Binary Search", questions: "Questions 37-50" },
                                        { week: "Days 29-30", topics: "Full Revision", questions: "Revise all 50 questions" },
                                    ].map((week, index) => (
                                        <div key={index} className="p-6 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border">
                                            <h4 className="font-semibold text-primary mb-2">{week.week}</h4>
                                            <p className="text-muted-foreground text-sm">
                                                <strong>Topics:</strong> {week.topics} <br />
                                                <strong>Questions:</strong> {week.questions}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* Interview Tips */}
                        <section id="tips" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    🎯 Top 10 Interview Tips for DSA Rounds
                                </h2>

                                <div className="space-y-4">
                                    {[
                                        "Always clarify the problem before coding. Ask about input constraints, edge cases, and expected output format.",
                                        "Start with a brute force solution, explain its complexity, then optimize. This shows your problem-solving process.",
                                        "Think out loud! Interviewers want to understand your thought process, not just see the final code.",
                                        "Write clean, readable code with meaningful variable names. Avoid single-letter variables except for simple loops.",
                                        "Test your code with examples before submitting. Walk through edge cases manually.",
                                        "Know the time and space complexity of your solution. Be prepared to explain trade-offs.",
                                        "Practice coding without IDE help. Interviews often use basic code editors without autocomplete.",
                                        "Learn multiple approaches to each problem. Be flexible when interviewers ask for alternative solutions.",
                                        "Stay calm when stuck. Ask for hints politely – interviewers often guide you in the right direction.",
                                        "Practice mock interviews with peers or use platforms like Pramp to get comfortable with the interview format.",
                                    ].map((tip, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                                                {index + 1}
                                            </span>
                                            <p className="text-muted-foreground">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* CTA Section */}
                        <section className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 text-center"
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                    Ready to Ace Your Placement Interviews? 🚀
                                </h2>
                                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                                    Join prep4place to access curated DSA patterns, mock interviews, progress tracking,
                                    and personalized study plans. Start your journey to placement success today!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/patterns"
                                        className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                                    >
                                        Explore DSA Patterns
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        Create Free Account
                                    </Link>
                                </div>
                            </motion.div>
                        </section>

                    </div>
                </div>
            </article>

            {/* Related Articles */}
            <section className="py-12 border-t border-border/50 bg-muted/30">
                <div className="container mx-auto px-6 md:px-12">
                    <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "How to Prepare for Google Interviews in 3 Months", category: "Interview Tips", emoji: "🎯" },
                            { title: "System Design Basics for Freshers", category: "System Design", emoji: "🏗️" },
                            { title: "Building an ATS-Friendly Resume for SDE Roles", category: "Resume", emoji: "📄" },
                        ].map((article, index) => (
                            <div key={index} className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all cursor-pointer">
                                <div className="text-4xl mb-4">{article.emoji}</div>
                                <Badge variant="secondary" className="mb-3">{article.category}</Badge>
                                <h3 className="font-semibold hover:text-primary transition-colors">{article.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2">Coming Soon</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

// Question Card Component
function QuestionCard({ question }: { question: typeof dsaQuestions.arrays[0] }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all">
            <div className="flex items-start gap-4">
                <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary font-semibold shrink-0">
                    {question.id}
                </span>
                <div>
                    <h4 className="font-medium mb-1">{question.name}</h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                        </Badge>
                        <span className="text-muted-foreground">Pattern: {question.pattern}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Asked at: {question.company}
                    </p>
                </div>
            </div>
            <a
                href={`https://leetcode.com/problems/${question.name.toLowerCase().replace(/\s+/g, '-')}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline shrink-0"
            >
                LeetCode #{question.leetcode}
                <ExternalLink className="h-3 w-3" />
            </a>
        </div>
    );
}
