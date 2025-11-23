"use client";

import { PatternCard } from "@/components/pattern-card";
import { initialPatterns } from "@/lib/data";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 py-16 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
          >
            Master DSA Patterns
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            A curated collection of Data Structures and Algorithms patterns to help you crack technical interviews.
            Track your progress and master one pattern at a time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialPatterns.map((pattern, index) => (
            <PatternCard
              key={pattern.id}
              title={pattern.title}
              description={pattern.description}
              slug={pattern.slug}
              count={pattern.questions.length}
              index={index}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
