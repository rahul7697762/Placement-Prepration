"use client";

import Link from "next/link";
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
    Target,
    Trophy,
    Zap,
    BookOpen,
    Brain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
                title: "Blind 75 LeetCode Problems: Complete Guide 2025",
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
                                <Badge className="bg-primary/20 text-primary border-none">Blind 75</Badge>
                                <Badge variant="outline">LeetCode</Badge>
                                <Badge variant="outline">Interview Prep</Badge>
                                <Badge variant="outline">FAANG</Badge>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Blind 75 LeetCode Problems:{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                                    Complete Interview Guide 2025
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
                                Master the most efficient curated list of 75 LeetCode problems to crack coding interviews
                                at Google, Amazon, Microsoft, Meta, and other top tech companies. This comprehensive guide
                                covers all problems organized by category with patterns, solutions, and a strategic study plan.
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                                <span className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Code2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>prep4place Team</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    January 25, 2025
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    20 min read
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
                                { href: "#introduction", label: "What is Blind 75?" },
                                { href: "#why-blind-75", label: "Why Blind 75?" },
                                { href: "#categories", label: "Problem Categories" },
                                { href: "#study-plan", label: "8-Week Study Plan" },
                                { href: "#array-hashing", label: "Array & Hashing" },
                                { href: "#trees-graphs", label: "Trees & Graphs" },
                                { href: "#dynamic-programming", label: "Dynamic Programming" },
                                { href: "#tips", label: "Success Tips" },
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
                                    What is the Blind 75?
                                </h2>

                                <p className="text-muted-foreground mb-6">
                                    The <strong>Blind 75</strong> is a curated list of <strong>75 essential LeetCode problems</strong> created
                                    by a Facebook engineer (username &quot;Blind&quot; on the Blind app) to help software engineers prepare
                                    efficiently for technical coding interviews. Unlike practicing hundreds of random problems, the Blind 75
                                    focuses on the <strong>most important patterns</strong> that appear repeatedly in FAANG interviews.
                                </p>

                                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6 border border-primary/20 mb-8">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        Why the Blind 75 is the Gold Standard
                                    </h3>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>Created by industry experts</strong> with real interview experience at top companies</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>80% of FAANG interview questions</strong> are variations of these 75 problems</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>Efficient coverage</strong> of all major data structures and algorithm patterns</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span><strong>Battle-tested</strong> by thousands of successful candidates at Google, Amazon, Meta</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-muted/50 rounded-xl p-6 border mb-8">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-yellow-500" />
                                        Quick Stats
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-primary">75</div>
                                            <div className="text-sm text-muted-foreground">Problems</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-500">38</div>
                                            <div className="text-sm text-muted-foreground">Medium</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-500">30</div>
                                            <div className="text-sm text-muted-foreground">Easy</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-red-500">7</div>
                                            <div className="text-sm text-muted-foreground">Hard</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        {/* Why Blind 75 Section */}
                        <section id="why-blind-75" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Brain className="h-7 w-7 text-purple-500" />
                                    Why Choose Blind 75 Over Other Lists?
                                </h2>

                                <p className="text-muted-foreground mb-6">
                                    With thousands of problems on LeetCode, it&apos;s overwhelming to know where to start. Here&apos;s why
                                    the Blind 75 stands out from other curated lists like NeetCode 150, Grind 75, or LeetCode Top 100:
                                </p>

                                <div className="space-y-6 mb-8">
                                    <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            1. Optimal Problem-to-Pattern Ratio
                                        </h4>
                                        <p className="text-muted-foreground text-sm">
                                            Just <strong>75 problems</strong> cover <strong>95% of interview patterns</strong>. Other lists have 150+
                                            problems with diminishing returns. The Blind 75 maximizes learning efficiency - every problem teaches
                                            you a crucial pattern without redundancy.
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20">
                                        <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                                            <Target className="h-5 w-5" />
                                            2. Industry-Validated Selection
                                        </h4>
                                        <p className="text-muted-foreground text-sm">
                                            These aren&apos;t randomly chosen problems. Each one has appeared <strong>multiple times in actual
                                                interviews</strong> at Google, Amazon, Microsoft, Meta, Apple, and Netflix. The creator analyzed
                                            thousands of interview experiences shared on Blind.
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                        <h4 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            3. Time-Efficient Preparation
                                        </h4>
                                        <p className="text-muted-foreground text-sm">
                                            Complete all 75 problems in <strong>8-12 weeks</strong> with focused practice. Other comprehensive
                                            lists require 4-6 months. Perfect for candidates with limited time before interviews or those switching
                                            careers into software engineering.
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                        <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2">
                                            <Lightbulb className="h-5 w-5" />
                                            4. Progressive Difficulty Curve
                                        </h4>
                                        <p className="text-muted-foreground text-sm">
                                            Problems are carefully ordered to build your skills progressively. You&apos;ll start with foundational
                                            array and string manipulations, then advance to complex tree, graph, and DP problems. This structured
                                            learning path prevents burnout and builds confidence.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/20">
                                    <h4 className="font-semibold text-amber-400 mb-3">⚡ Real Success Stories</h4>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        <em>&quot;I solved all Blind 75 problems in 10 weeks and got offers from Google L4, Amazon SDE II, and Meta E4.
                                            The pattern recognition I gained was invaluable - I could solve 80% of my interview problems using variations
                                            of Blind 75 patterns.&quot;</em> - Anonymous, Blind community
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Thousands of candidates credit the Blind 75 for their success. The focused approach helps you develop
                                        <strong> problem-solving intuition</strong> rather than just memorizing solutions.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        {/* Problem Categories Section */}
                        <section id="categories" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    📊 All 18 Problem Categories in Blind 75
                                </h2>

                                <p className="text-muted-foreground mb-6">
                                    The Blind 75 problems are organized into <strong>18 categories</strong> covering all major data structures
                                    and algorithmic patterns. Here&apos;s the complete breakdown:
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 mb-8">
                                    {[
                                        { name: "Array & Hashing", count: 9, color: "blue", difficulty: "Easy-Medium" },
                                        { name: "Two Pointers", count: 3, color: "green", difficulty: "Medium" },
                                        { name: "Sliding Window", count: 4, color: "purple", difficulty: "Medium" },
                                        { name: "Stack", count: 2, color: "orange", difficulty: "Easy-Medium" },
                                        { name: "Binary Search", count: 4, color: "red", difficulty: "Medium" },
                                        { name: "Linked List", count: 6, color: "cyan", difficulty: "Easy-Medium" },
                                        { name: "Trees", count: 11, color: "emerald", difficulty: "Easy-Hard" },
                                        { name: "Tries", count: 3, color: "pink", difficulty: "Medium-Hard" },
                                        { name: "Heap / Priority Queue", count: 4, color: "amber", difficulty: "Medium-Hard" },
                                        { name: "Backtracking", count: 5, color: "violet", difficulty: "Medium" },
                                        { name: "Graphs", count: 9, color: "indigo", difficulty: "Medium-Hard" },
                                        { name: "1-D Dynamic Programming", count: 10, color: "rose", difficulty: "Easy-Hard" },
                                        { name: "2-D Dynamic Programming", count: 4, color: "fuchsia", difficulty: "Medium-Hard" },
                                        { name: "Greedy", count: 3, color: "lime", difficulty: "Medium" },
                                        { name: "Intervals", count: 4, color: "teal", difficulty: "Medium" },
                                        { name: "Math & Geometry", count: 3, color: "sky", difficulty: "Medium" },
                                        { name: "Bit Manipulation", count: 5, color: "slate", difficulty: "Easy-Medium" },
                                        { name: "Strings", count: 4, color: "yellow", difficulty: "Medium" },
                                    ].map((category, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-muted/50 border hover:border-primary/30 transition-all">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold">{category.name}</h4>
                                                <Badge variant="outline">{category.count} problems</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Difficulty: {category.difficulty}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                                    <h4 className="font-semibold text-primary mb-3">🎯 Category Learning Order</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Start with <strong>Arrays & Hashing</strong> and <strong>Two Pointers</strong> to build fundamentals.
                                        Progress to <strong>Trees</strong> and <strong>Graphs</strong> for intermediate patterns. Save
                                        <strong> Dynamic Programming</strong> and <strong>Advanced Graph algorithms</strong> for later after
                                        you&apos;ve built solid problem-solving intuition.
                                    </p>
                                </div>
                            </motion.div>
                        </section>

                        {/* 8-Week Study Plan */}
                        <section id="study-plan" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Calendar className="h-7 w-7 text-primary" />
                                    8-Week Blind 75 Study Plan
                                </h2>

                                <p className="text-muted-foreground mb-6">
                                    Follow this <strong>structured 8-week plan</strong> to master all 75 problems. Dedicate
                                    <strong> 1-2 hours daily</strong> and you&apos;ll be interview-ready in 2 months.
                                </p>

                                <div className="space-y-4 mb-8">
                                    {[
                                        {
                                            week: "Week 1-2: Arrays & Foundations",
                                            focus: "Array & Hashing, Two Pointers, Sliding Window",
                                            problems: "~25 problems",
                                            goal: "Build pattern recognition for O(n) optimizations, master hash maps and two-pointer technique",
                                            tips: "Focus on understanding WHY solutions work, not just memorizing code"
                                        },
                                        {
                                            week: "Week 3: Data Structures",
                                            focus: "Stack, Binary Search, Linked List",
                                            problems: "~12 problems",
                                            goal: "Master pointer manipulation, stack-based problems, and binary search variations",
                                            tips: "Draw diagrams for linked list problems, practice implementing stack from scratch"
                                        },
                                        {
                                            week: "Week 4-5: Trees & Graphs",
                                            focus: "Binary Trees, BST, Tries, Graph Traversal",
                                            problems: "~23 problems",
                                            goal: "Master DFS, BFS, recursive thinking, and graph algorithms",
                                            tips: "Understand recursion deeply - most tree problems are variations of DFS/BFS"
                                        },
                                        {
                                            week: "Week 6: Dynamic Programming",
                                            focus: "1-D DP, 2-D DP patterns",
                                            problems: "~14 problems",
                                            goal: "Recognize overlapping subproblems, build DP state transition logic",
                                            tips: "Start with recursive solution + memoization, then convert to bottom-up DP"
                                        },
                                        {
                                            week: "Week 7: Advanced Topics",
                                            focus: "Heap/Priority Queue, Backtracking, Greedy, Intervals",
                                            problems: "~16 problems",
                                            goal: "Complete remaining patterns, understand when to use each approach",
                                            tips: "Backtracking is DFS with state restoration - recognize the pattern"
                                        },
                                        {
                                            week: "Week 8: Review & Mock Interviews",
                                            focus: "Revision, timed practice, mock interviews",
                                            problems: "Revisit all 75 problems",
                                            goal: "Solve problems in 25-30 minutes, explain solutions clearly",
                                            tips: "Practice on whiteboard/paper, do mock interviews with peers or Pramp"
                                        },
                                    ].map((week, index) => (
                                        <div key={index} className="p-6 rounded-xl bg-gradient-to-r from-muted/80 to-muted/50 border hover:border-primary/30 transition-all">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-semibold text-primary text-lg">{week.week}</h4>
                                                <Badge variant="outline">{week.problems}</Badge>
                                            </div>
                                            <div className="space-y-2 text-muted-foreground text-sm">
                                                <p><strong className="text-foreground">Focus Areas:</strong> {week.focus}</p>
                                                <p><strong className="text-foreground">Goal:</strong> {week.goal}</p>
                                                <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                                    <p className="text-blue-400 text-xs"><strong>💡 Pro Tip:</strong> {week.tips}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                                    <h4 className="font-semibold text-green-400 mb-3">✅ Daily Practice Routine</h4>
                                    <ol className="space-y-2 text-muted-foreground text-sm list-decimal list-inside">
                                        <li><strong>15 min:</strong> Review previous day&apos;s problems</li>
                                        <li><strong>40 min:</strong> Solve 1-2 new problems (attempt before looking at solutions)</li>
                                        <li><strong>20 min:</strong> Read and understand optimal solutions</li>
                                        <li><strong>15 min:</strong> Implement the pattern from scratch</li>
                                        <li><strong>10 min:</strong> Document key learnings and patterns</li>
                                    </ol>
                                </div>
                            </motion.div>
                        </section>

                        {/* Success Tips Section */}
                        <section id="tips" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    🎯 10 Expert Tips to Master Blind 75
                                </h2>

                                <div className="space-y-4 mb-8">
                                    {[
                                        {
                                            tip: "Understand Patterns, Don't Memorize Solutions",
                                            detail: "Focus on WHY a solution works. Recognize that 'Two Sum' teaches you hash map lookups, not just how to solve that one problem. This pattern applies to hundreds of variants."
                                        },
                                        {
                                            tip: "Solve Without Looking at Solutions First",
                                            detail: "Spend 30-45 minutes attempting each problem before checking solutions. Struggling builds problem-solving muscles. It's okay to not solve it perfectly - the learning happens in the attempt."
                                        },
                                        {
                                            tip: "Master Time & Space Complexity Analysis",
                                            detail: "For every solution, identify the Big O complexity. In interviews, you'll need to explain why your solution is O(n) or O(log n). Practice analyzing complexity until it becomes second nature."
                                        },
                                        {
                                            tip: "Revisit Problems Multiple Times",
                                            detail: "Use spaced repetition: solve each problem 3 times with gaps (Day 1, Day 3, Day 7). This reinforces patterns and improves retention better than solving once."
                                        },
                                        {
                                            tip: "Code Without IDE Help Initially",
                                            detail: "Practice on paper or basic text editors without autocomplete. Most technical interviews use platforms like CoderPad with minimal IDE features. Build muscle memory for syntax."
                                        },
                                        {
                                            tip: "Explain Your Thinking Out Loud",
                                            detail: "Practice explaining your approach as you code, even when alone. Interviewers want to understand your thought process. Saying 'I'll use a hash map to store...' shows structured thinking."
                                        },
                                        {
                                            tip: "Start with Brute Force, Then Optimize",
                                            detail: "Always state the brute force O(n²) solution first, then optimize to O(n) or O(n log n). Interviewers appreciate seeing your optimization process."
                                        },
                                        {
                                            tip: "Test With Edge Cases",
                                            detail: "Always test with: empty input, single element, duplicates, negative numbers, maximum constraints. Finding bugs yourself is better than the interviewer pointing them out."
                                        },
                                        {
                                            tip: "Join Study Groups or Find Accountability Partners",
                                            detail: "Discuss solutions with peers. Teaching others solidifies your understanding. Use platforms like Discord, Reddit's r/leetcode, or form study groups with friends preparing for interviews."
                                        },
                                        {
                                            tip: "Track Your Progress and Patterns",
                                            detail: "Maintain a spreadsheet with: problem name, difficulty, date solved, patterns used, mistakes made. Review this weekly to identify weak areas and track improvement."
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="p-5 rounded-xl bg-muted/50 border hover:border-primary/30 transition-all">
                                            <div className="flex items-start gap-4">
                                                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <h4 className="font-semibold mb-2">{item.tip}</h4>
                                                    <p className="text-muted-foreground text-sm">{item.detail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* Sample Problems Preview */}
                        <section id="array-hashing" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    📝 Sample Problems from Blind 75
                                </h2>

                                <p className="text-muted-foreground mb-6">
                                    Here are a few example problems from different categories to give you a taste of what to expect:
                                </p>

                                <div className="space-y-4 mb-8">
                                    {[
                                        {
                                            name: "Two Sum",
                                            difficulty: "Easy",
                                            category: "Array & Hashing",
                                            pattern: "Hash Map",
                                            description: "Given an array, find two indices that sum to a target. Classic hash map pattern.",
                                            leetcode: 1
                                        },
                                        {
                                            name: "Longest Substring Without Repeating Characters",
                                            difficulty: "Medium",
                                            category: "Sliding Window",
                                            pattern: "Sliding Window + Set",
                                            description: "Find the longest substring without duplicate characters. Essential sliding window problem.",
                                            leetcode: 3
                                        },
                                        {
                                            name: "Invert Binary Tree",
                                            difficulty: "Easy",
                                            category: "Trees",
                                            pattern: "DFS Recursion",
                                            description: "Swap left and right children recursively. Fundamental tree manipulation.",
                                            leetcode: 226
                                        },
                                        {
                                            name: "Climbing Stairs",
                                            difficulty: "Easy",
                                            category: "1-D DP",
                                            pattern: "Dynamic Programming",
                                            description: "Count ways to reach the top. Classic DP introduction problem.",
                                            leetcode: 70
                                        },
                                        {
                                            name: "Course Schedule",
                                            difficulty: "Medium",
                                            category: "Graphs",
                                            pattern: "Topological Sort",
                                            description: "Detect cycles in directed graph. Important for dependency resolution problems.",
                                            leetcode: 207
                                        },
                                    ].map((problem, idx) => (
                                        <div key={idx} className="p-5 rounded-xl bg-card border hover:border-primary/30 hover:shadow-lg transition-all">
                                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-lg mb-1">{problem.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                                                </div>
                                                <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)} shrink-0 h-fit`}>
                                                    {problem.difficulty}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs mb-3">
                                                <span className="px-2 py-1 rounded bg-primary/10 text-primary">
                                                    {problem.category}
                                                </span>
                                                <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                                                    Pattern: {problem.pattern}
                                                </span>
                                            </div>
                                            <a
                                                href={`https://leetcode.com/problems/${problem.name.toLowerCase().replace(/\s+/g, '-')}/`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                            >
                                                Solve on LeetCode #{problem.leetcode}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                                    <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        Access All 75 Problems
                                    </h4>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Get the complete Blind 75 list organized by category with progress tracking, difficulty filters,
                                        and LeetCode links. Track your preparation journey and never lose your place.
                                    </p>
                                    <Link
                                        href="/roadmap/blind-75"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        View Complete Blind 75 List
                                        <ExternalLink className="h-4 w-4" />
                                    </Link>
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
                                    Ready to Conquer the Blind 75? 🚀
                                </h2>
                                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                                    Start your interview preparation journey with our interactive Blind 75 tracker. Monitor your progress,
                                    access organized problem lists, and get step-by-step guidance for each category.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/roadmap/blind-75"
                                        className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                                    >
                                        Start Blind 75 Journey
                                    </Link>
                                    <Link
                                        href="/roadmap/dsa-patterns"
                                        className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        Explore More DSA Patterns
                                    </Link>
                                </div>
                            </motion.div>
                        </section>

                        {/* FAQ Section */}
                        <section id="faq" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                                    ❓ Frequently Asked Questions
                                </h2>

                                <div className="space-y-4">
                                    {[
                                        {
                                            q: "Is Blind 75 enough to crack FAANG interviews?",
                                            a: "Yes, for most SDE I-II roles. The Blind 75 covers 80-90% of patterns you'll encounter. However, for senior roles or specific companies (e.g., Google L5+), you may need additional system design and advanced algorithm knowledge."
                                        },
                                        {
                                            q: "How long does it take to complete Blind 75?",
                                            a: "Most people complete it in 8-12 weeks with 1-2 hours daily practice. Faster completion (4-6 weeks) is possible if you have strong foundations and dedicate 3-4 hours daily. Quality over speed - understanding patterns is more important than rushing through."
                                        },
                                        {
                                            q: "Should I do Blind 75 or NeetCode 150?",
                                            a: "Start with Blind 75 if you have limited time (< 3 months). It's more focused and efficient. NeetCode 150 is better if you have 4+ months and want comprehensive coverage. Many candidates do Blind 75 first, then add NeetCode problems for additional practice."
                                        },
                                        {
                                            q: "Can beginners start with Blind 75?",
                                            a: "Yes, but learn basic data structures first (arrays, strings, hash maps, basic recursion). If you're completely new to coding, spend 2-3 weeks on fundamentals before jumping into Blind 75. The problems range from Easy to Hard, so you can start with easier ones."
                                        },
                                        {
                                            q: "Do I need LeetCode Premium for Blind 75?",
                                            a: "No! All Blind 75 problems are free on LeetCode. A few problems (like 'Encode and Decode Strings') are premium, but you can find them on LintCode or practice alternatives. Premium is helpful for company-specific questions but not required for Blind 75."
                                        },
                                    ].map((faq, index) => (
                                        <div key={index} className="p-6 rounded-xl bg-muted/30 border">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <span className="text-primary">{index + 1}.</span>
                                                {faq.q}
                                            </h4>
                                            <p className="text-muted-foreground text-sm pl-7">{faq.a}</p>
                                        </div>
                                    ))}
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
                            { title: "Top 50 DSA Questions for Placements 2025", category: "DSA", emoji: "📚", href: "/blog/top-50-dsa-questions-for-placements-2025" },
                            { title: "Complete DSA Pattern Cheatsheet", category: "Patterns", emoji: "🎯", href: "/roadmap/dsa-patterns" },
                            { title: "How to Approach System Design Interviews", category: "System Design", emoji: "🏗️", href: "#" },
                        ].map((article, index) => (
                            <Link key={index} href={article.href}>
                                <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all cursor-pointer h-full">
                                    <div className="text-4xl mb-4">{article.emoji}</div>
                                    <Badge variant="secondary" className="mb-3">{article.category}</Badge>
                                    <h3 className="font-semibold hover:text-primary transition-colors">{article.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
