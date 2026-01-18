"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    Search,
    GitBranch,
    Binary,
    Network,
    Layers,
    Zap,
    Play,
    BookOpen,
    List
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const algorithmCategories = [
    {
        id: "sorting",
        title: "Sorting Algorithms",
        description: "Visualize how different sorting algorithms organize data step by step",
        icon: BarChart3,
        color: "from-blue-500 to-cyan-500",
        algorithms: [
            { name: "Bubble Sort", complexity: "O(n²)", slug: "bubble-sort" },
            { name: "Selection Sort", complexity: "O(n²)", slug: "selection-sort" },
            { name: "Insertion Sort", complexity: "O(n²)", slug: "insertion-sort" },
            { name: "Merge Sort", complexity: "O(n log n)", slug: "merge-sort" },
            { name: "Quick Sort", complexity: "O(n log n)", slug: "quick-sort" },
        ],
    },
    {
        id: "searching",
        title: "Searching Algorithms",
        description: "Watch how searching algorithms find elements in different data structures",
        icon: Search,
        color: "from-green-500 to-emerald-500",
        algorithms: [
            { name: "Linear Search", complexity: "O(n)", slug: "linear-search" },
            { name: "Binary Search", complexity: "O(log n)", slug: "binary-search" },
        ],
    },
    {
        id: "data-structures",
        title: "Data Structures",
        description: "Explore fundamental data structures with interactive operations",
        icon: List,
        color: "from-amber-500 to-orange-500",
        algorithms: [
            { name: "Linked List", complexity: "O(1)/O(n)", slug: "linked-list" },
            { name: "Stack (LIFO)", complexity: "O(1)", slug: "stack" },
            { name: "Queue (FIFO)", complexity: "O(1)", slug: "queue" },
        ],
    },
    {
        id: "graphs",
        title: "Graph Algorithms",
        description: "Explore graph traversal and pathfinding algorithms interactively",
        icon: Network,
        color: "from-purple-500 to-pink-500",
        algorithms: [
            { name: "Breadth-First Search (BFS)", complexity: "O(V + E)", slug: "bfs" },
            { name: "Depth-First Search (DFS)", complexity: "O(V + E)", slug: "dfs" },
        ],
    },
    {
        id: "trees",
        title: "Tree Algorithms",
        description: "Visualize tree structures and traversal methods",
        icon: GitBranch,
        color: "from-rose-500 to-red-500",
        algorithms: [
            { name: "Binary Search Tree", complexity: "O(log n)", slug: "bst" },
            { name: "Tree Traversals", complexity: "O(n)", slug: "tree-traversals" },
        ],
    },
];

const features = [
    {
        icon: Play,
        title: "Step-by-Step Animation",
        description: "Watch algorithms execute one step at a time with adjustable speed controls",
    },
    {
        icon: Zap,
        title: "Instant Visualization",
        description: "See immediate visual feedback as data transforms in real-time",
    },
    {
        icon: Layers,
        title: "Custom Inputs",
        description: "Test algorithms with your own data to understand edge cases",
    },
    {
        icon: BookOpen,
        title: "Learn by Doing",
        description: "Interactive learning that reinforces DSA concepts for interviews",
    },
];

export default function VisualizerPage() {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <Badge
                            variant="outline"
                            className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20"
                        >
                            🎯 Interactive Learning
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                                Algorithm Visualizer
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Master Data Structures and Algorithms through interactive visualizations.
                            Watch sorting, searching, graph, and tree algorithms come to life.
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap justify-center gap-6 mt-8">
                            {[
                                { value: "14+", label: "Algorithms" },
                                { value: "5", label: "Categories" },
                                { value: "∞", label: "Custom Inputs" },
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 border-y border-border/50 bg-muted/30">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Algorithm Categories */}
            <section className="py-16">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Choose Your Algorithm
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Select a category to start visualizing algorithms. Each visualization includes
                            step-by-step animation, complexity analysis, and code explanation.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {algorithmCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onMouseEnter={() => setHoveredCategory(category.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                <div className={cn(
                                    "h-full rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300",
                                    hoveredCategory === category.id && "border-primary/50 shadow-xl shadow-primary/5"
                                )}>
                                    {/* Category Header */}
                                    <div className={cn(
                                        "p-6 bg-gradient-to-r",
                                        category.color
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                                <category.icon className="h-8 w-8 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{category.title}</h3>
                                                <p className="text-white/80 text-sm">{category.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Algorithms List */}
                                    <div className="p-6 space-y-3">
                                        {category.algorithms.map((algo) => (
                                            <Link
                                                key={algo.slug}
                                                href={`/visualizer/${algo.slug}`}
                                                className="group flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-primary group-hover:scale-125 transition-transform" />
                                                    <span className="font-medium group-hover:text-primary transition-colors">
                                                        {algo.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {algo.complexity}
                                                    </Badge>
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-border/50">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-block p-4 rounded-full bg-primary/10 mb-6">
                            <Binary className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Master DSA?
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Combine algorithm visualizations with our curated DSA patterns, practice problems,
                            and AI-powered interview prep to ace your placements.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/patterns"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                            >
                                Explore DSA Patterns
                            </Link>
                            <Link
                                href="/blog"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary/10 transition-colors"
                            >
                                Read Our Blog
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
