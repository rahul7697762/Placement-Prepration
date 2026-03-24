"use client";

import { PatternGrid } from "@/components/pattern-grid";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

export default function PatternsPage() {
    return (
        <main className="min-h-screen bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[url('/grid.svg')] opacity-20 border-b-8 border-l-8 border-foreground pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[url('/grid.svg')] opacity-20 border-t-8 border-r-8 border-foreground pointer-events-none" />

            <div className="container mx-auto px-8 md:px-12 py-16 max-w-7xl space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-background border-4 border-foreground rounded-none mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Target className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                        <span className="bg-foreground text-background inline-block px-4 py-2 border-4 border-foreground shadow-[8px_8px_0px_0px_var(--primary)] -rotate-1">DSA Patterns</span>
                    </h1>
                    <p className="text-lg font-mono uppercase font-bold text-foreground max-w-2xl mx-auto tracking-widest leading-relaxed mt-12">
                        Master the structural algorithms. Execute pattern analysis to track progress.
                    </p>
                </motion.div>

                {/* Pattern Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <PatternGrid />
                </motion.div>
            </div>
        </main>
    );
}
