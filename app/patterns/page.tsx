"use client";

import { PatternGrid } from "@/components/pattern-grid";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

export default function PatternsPage() {
    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-8 md:px-12 py-16 max-w-7xl space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                        <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        DSA Patterns
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Master coding interview patterns. Click on any pattern to explore questions and track your progress.
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
