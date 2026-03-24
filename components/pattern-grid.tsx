"use client";

import { initialPatterns } from "@/lib/data";
import { Card } from "@/components/ui/card";
import {
    Layers,
    LayoutGrid,
    GitBranch,
    BrainCircuit,
    Activity,
    Share2,
    RefreshCw,
    Merge,
    Combine,
    Search,
    MoveHorizontal,
    Trophy,
    LucideIcon
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
    "two-heaps": Layers,
    "arrays": LayoutGrid,
    "backtracking": GitBranch,
    "dynamic-programming": BrainCircuit,
    "fast-slow-pointers": Activity,
    "graph-traversal": Share2,
    "in-place-reversal": RefreshCw,
    "k-way-merge": Merge,
    "merge-intervals": Combine,
    "modified-binary-search": Search,
    "sliding-window": MoveHorizontal,
    "top-k-elements": Trophy,
};

export function PatternGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {initialPatterns.map((pattern, index) => {
                const Icon = iconMap[pattern.slug] || LayoutGrid;
                return (
                    <motion.div
                        key={pattern.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link href={`/patterns/${pattern.slug}`}>
                            <Card className="flex items-center gap-4 p-4 transition-transform duration-200 hover:-translate-y-1 hover:translate-x-1 cursor-pointer rounded-none border-4 border-foreground bg-background brutalist-shadow hover:brutalist-shadow-sm h-full group">
                                <div className="p-3 border-2 border-foreground bg-secondary text-foreground shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-mono uppercase font-bold tracking-widest text-sm truncate">{pattern.title}</span>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
