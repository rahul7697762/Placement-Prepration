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
                            <Card className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors cursor-pointer border-border/50 hover:border-primary/50 h-full">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-medium truncate">{pattern.title}</span>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
