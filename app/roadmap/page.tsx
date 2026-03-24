"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RoadmapPhase {
    title: string;
    description: string;
    topics: {
        name: string;
        details?: string[];
        problems?: string[];
    }[];
    link?: string;
    isTrack?: boolean;
}

const roadmapData: RoadmapPhase[] = [
    {
        title: "DSA Pattern Cheatsheet 2025",
        description: "Master 15 essential coding patterns with curated LeetCode problems.",
        topics: [
            { name: "Prefix Sum, Two Pointers" },
            { name: "Sliding Window, Heaps" },
            { name: "Graphs, DP & Backtracking" },
        ],
        link: "/roadmap/dsa-patterns",
        isTrack: true,
    },
    {
        title: "Blind 75",
        description: "The most popular curated list of 75 essential LeetCode problems for technical interview preparation.",
        topics: [
            { name: "Arrays, Strings & Hashing" },
            { name: "Trees, Graphs & DP" },
            { name: "Linked Lists & Intervals" },
        ],
        link: "/roadmap/blind-75",
        isTrack: true,
    },
    {
        title: "Computer Vision (INT345)",
        description: "Comprehensive guide to Image Processing, Camera Geometry, and Deep Learning for Vision.",
        topics: [
            { name: "Image Processing & Filtering" },
            { name: "Camera Models & Stereo Vision" },
            { name: "Feature Detection & Segmentation" },
        ],
        link: "/roadmap/computer-vision",
        isTrack: true,
    },
];

export default function RoadmapPage() {
    return (
        <main className="min-h-screen bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[url('/grid.svg')] opacity-20 border-b-8 border-l-8 border-foreground pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[url('/grid.svg')] opacity-20 border-t-8 border-r-8 border-foreground pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 py-16">
                <div className="text-center space-y-6 mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
                    >
                        <span className="bg-foreground text-background inline-block px-4 py-2 border-4 border-foreground transform -rotate-2 shadow-[8px_8px_0px_0px_var(--primary)]">Architecture Paths</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg font-mono uppercase font-bold text-foreground max-w-2xl mx-auto tracking-widest leading-relaxed mt-12"
                    >
                        Select a track to compile your knowledge. From low-level primitives to high-level system design.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roadmapData.map((phase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className={`h-full flex flex-col rounded-none border-4 border-foreground bg-background transition-transform duration-200 hover:-translate-y-2 brutalist-shadow`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="text-2xl font-black uppercase tracking-tight">{phase.title}</CardTitle>
                                        {phase.isTrack && <Badge className="rounded-none border-2 border-foreground uppercase font-bold tracking-widest">Track</Badge>}
                                    </div>
                                    <CardDescription className="text-base mt-2">
                                        {phase.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="space-y-3">
                                        {phase.topics.map((topic, i) => (
                                            <div key={i} className="text-sm">
                                                <div className="font-medium flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${phase.isTrack ? 'bg-primary' : 'bg-muted-foreground'}`} />
                                                    {topic.name}
                                                </div>
                                                {topic.details && (
                                                    <p className="text-xs text-muted-foreground pl-3.5 mt-1">
                                                        {topic.details.join(" • ")}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-6 border-t-4 border-foreground">
                                    {phase.link ? (
                                        <Button asChild className="w-full group rounded-none border-2 border-foreground bg-primary text-primary-foreground brutalist-shadow-hover hover:bg-primary font-bold uppercase tracking-widest text-sm h-14">
                                            <Link href={phase.link}>
                                                Initialize Track
                                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="w-full rounded-none border-2 border-foreground bg-background text-foreground font-bold uppercase tracking-widest text-sm h-14" disabled>
                                            Data Corrupted
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
