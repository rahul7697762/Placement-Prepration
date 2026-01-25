"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Blog posts data
const blogPosts = [
    {
        id: "blind-75-leetcode-problems-complete-guide-2025",
        title: "Blind 75 LeetCode Problems: Complete Interview Prep Guide 2025",
        excerpt: "Master the most efficient curated list of 75 LeetCode problems to crack coding interviews at Google, Amazon, Microsoft, Meta. Comprehensive guide with categorized problems, patterns, 8-week study plan, and expert tips.",
        coverImage: "/blog/blind-75-banner.png",
        author: "prep4place Team",
        date: "January 25, 2025",
        readTime: "20 min read",
        category: "DSA",
        tags: ["Blind 75", "LeetCode", "Interview Prep", "FAANG", "DSA", "Coding Interview"],
        featured: true,
    },
    {
        id: "top-50-dsa-questions-for-placements-2025",
        title: "Top 50 DSA Questions You Must Solve for Placements in 2025",
        excerpt: "A comprehensive guide to the most frequently asked Data Structures and Algorithms questions in technical interviews at FAANG, startups, and product companies. Includes company-specific patterns and solving strategies.",
        coverImage: "/blog/dsa-questions-cover.jpg",
        author: "prep4place Team",
        date: "January 18, 2025",
        readTime: "15 min read",
        category: "DSA",
        tags: ["DSA", "Interview", "Placement", "FAANG", "LeetCode"],
        featured: false,
    },
];

const categories = ["All", "DSA", "System Design", "Interview Tips", "Resume", "Career"];

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredPosts = blogPosts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredPost = blogPosts.find(post => post.featured);

    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

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
                            📚 prep4place Blog
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 mb-6">
                            Placement Preparation Insights
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Expert tips, DSA patterns, interview strategies, and career guidance to help you land your dream job at top tech companies.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-6 text-base rounded-full border-2 border-border/50 focus:border-primary/50 bg-background/80 backdrop-blur-sm"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Filter */}
            <section className="py-4 border-b border-border/50 sticky top-16 bg-background/80 backdrop-blur-md z-40">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                                    selectedCategory === category
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && selectedCategory === "All" && !searchQuery && (
                <section className="py-12">
                    <div className="container mx-auto px-6 md:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Link href={`/blog/${featuredPost.id}`}>
                                <article className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                                    <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                                        <div className="flex flex-col justify-center">
                                            <Badge className="w-fit mb-4 bg-primary/20 text-primary border-none">
                                                ⭐ Featured Article
                                            </Badge>
                                            <h2 className="text-2xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-muted-foreground mb-6 line-clamp-3">
                                                {featuredPost.excerpt}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {featuredPost.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {featuredPost.readTime}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                                                    Read Article <ArrowRight className="h-4 w-4" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-8xl animate-pulse">💻</div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6 md:px-12">
                    {filteredPosts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                >
                                    <Link href={`/blog/${post.id}`}>
                                        <article className="group h-full flex flex-col rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                                            <div className="relative h-48 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-6xl">{post.category === "DSA" ? "🧩" : post.category === "System Design" ? "🏗️" : post.category === "Resume" ? "📄" : "💡"}</div>
                                                </div>
                                                <div className="absolute top-4 left-4">
                                                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                                                        {post.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-1 p-6">
                                                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-4 border-t border-border/50">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {post.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {post.readTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filter to find what you&apos;re looking for.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 border-t border-border/50">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <div className="inline-block p-4 rounded-full bg-primary/10 mb-6">
                            <Tag className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">
                            Stay Updated with Placement Tips
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Get the latest DSA patterns, interview strategies, and career advice delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                            >
                                Join prep4place for Free
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
