"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface RoadmapPhase {
    title: string;
    description: string;
    topics: {
        name: string;
        details?: string[];
        problems?: string[];
    }[];
}

const roadmapData: RoadmapPhase[] = [
    {
        title: "1. Warm-Up (Basics of Programming)",
        description: "Goal: Get comfortable writing simple logic.",
        topics: [
            { name: "Variables, loops, conditionals" },
            { name: "Functions, recursion basics" },
            { name: "Time & Space Complexity (Big-O) — only intuition needed" },
        ],
    },
    {
        title: "2. Core Data Structures (Must-Master)",
        description: "Build a strong foundation with essential data structures.",
        topics: [
            {
                name: "Arrays & Strings",
                details: ["Traversal", "Two-pointer patterns", "Sliding window basics", "Prefix sum"],
                problems: ["Two Sum", "Move Zeroes", "Kadane’s Algorithm", "Longest substring without repeating characters"],
            },
            {
                name: "Hashing (HashMap / HashSet)",
                details: ["Frequency counting", "Lookup & storage", "Avoiding duplicates"],
                problems: ["Hash-based Two Sum", "Anagrams", "Subarray sum equal K"],
            },
            {
                name: "Linked List",
                details: ["Single & doubly linked", "Fast–slow pointer", "Reverse LL", "Detect cycle"],
            },
            {
                name: "Stack & Queue",
                details: ["Stack using array/LL", "Queue using array/LL"],
                problems: ["Valid parentheses", "Next greater element", "Sliding window max"],
            },
        ],
    },
    {
        title: "3. Intermediate Core",
        description: "Step up to more complex structures and algorithms.",
        topics: [
            {
                name: "Trees",
                details: ["Binary Tree basics", "Traversals (in/pre/post/level)", "Height, diameter", "LCA (Lowest Common Ancestor)"],
            },
            {
                name: "Binary Search Trees",
                details: ["Insertion, deletion", "Search", "Balanced vs unbalanced"],
            },
            {
                name: "Recursion & Backtracking",
                details: ["Subsets", "Permutations", "N-Queens (optional)", "Rat in a maze"],
            },
        ],
    },
    {
        title: "4. Algorithms",
        description: "Master fundamental algorithms for sorting and searching.",
        topics: [
            {
                name: "Sorting",
                details: ["Bubble, Selection, Insertion → just idea", "Merge Sort", "QuickSort", "Counting Sort (basic idea)"],
            },
            {
                name: "Searching",
                details: ["Binary Search on array", "Binary search on answer patterns", "Search rotated sorted array", "Find peak element"],
            },
        ],
    },
    {
        title: "5. Graph Theory (Beginner Level)",
        description: "Introduction to graphs and basic traversal algorithms.",
        topics: [
            {
                name: "Basics",
                details: ["BFS", "DFS", "Adjacency list", "Cycle detection"],
                problems: ["Number of islands", "Bipartite graph"],
            },
        ],
    },
    {
        title: "6. DP Starter",
        description: "Don’t start advanced DP early. Just master the basics.",
        topics: [
            {
                name: "Dynamic Programming Basics",
                details: ["Fibonacci (memo + tabulation)", "Climbing stairs", "0/1 Knapsack intuition"],
            },
        ],
    },
];

export default function RoadmapPage() {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="text-center space-y-6 mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight"
                    >
                        DSA Beginner Roadmap
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground"
                    >
                        Zero → Strong Foundation. A step-by-step guide to mastering DSA.
                    </motion.p>
                </div>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {roadmapData.map((phase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <span className="text-sm font-bold">{index + 1}</span>
                            </div>

                            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl text-primary">{phase.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {phase.topics.map((topic, i) => (
                                        <div key={i} className="space-y-2">
                                            <h4 className="font-medium flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {topic.name}
                                            </h4>
                                            {topic.details && (
                                                <div className="flex flex-wrap gap-2 pl-4">
                                                    {topic.details.map((detail, j) => (
                                                        <Badge key={j} variant="secondary" className="text-xs font-normal">
                                                            {detail}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            {topic.problems && (
                                                <div className="pl-4 mt-2">
                                                    <p className="text-xs text-muted-foreground mb-1 font-medium">Common Problems:</p>
                                                    <ul className="space-y-1">
                                                        {topic.problems.map((prob, k) => (
                                                            <li key={k} className="text-sm flex items-center gap-2 text-muted-foreground/80">
                                                                <Circle className="w-2 h-2" />
                                                                {prob}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
