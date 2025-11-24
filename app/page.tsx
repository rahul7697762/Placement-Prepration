"use client";

import { PatternGrid } from "@/components/pattern-grid";
import { motion } from "framer-motion";
import { ArrowRight, Target, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />

      {/* Hero Section */}
      <section className="container mx-auto px-8 md:px-12 py-24 md:py-32 space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            New: Interactive Roadmap
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Master DSA Patterns <br className="hidden md:block" /> Not Just Problems
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Stop grinding random LeetCode problems. Learn the underlying patterns, visualize concepts, and crack your technical interviews with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-lg" asChild>
              <Link href="/patterns">
                Explore Patterns <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
              <Link href="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-24">
        <div className="container mx-auto px-8 md:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Why Learn Patterns?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding patterns allows you to solve thousands of problems by mastering just a few core concepts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Structured Learning",
                description: "Follow a curated path from basic to advanced patterns, ensuring no gaps in your knowledge."
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description: "Visualize your journey with detailed progress tracking for each pattern and topic."
              },
              {
                icon: Zap,
                title: "Pattern Recognition",
                description: "Learn to identify which data structure or algorithm fits a problem instantly."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background p-8 rounded-2xl border hover:border-primary/50 transition-colors shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patterns Grid Section */}
      <section className="container mx-auto px-8 md:px-12 py-24 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">Explore Patterns</h2>
            <p className="text-muted-foreground">Master these fundamental coding patterns.</p>
          </div>
          <Link href="/patterns">
            <Button variant="outline" className="group">
              View All Patterns <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <PatternGrid />
      </section>

      {/* How It Works Section */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-8 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Your journey to mastery in 4 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Select Pattern", desc: "Choose a pattern from our curated roadmap." },
              { step: "02", title: "Learn Concept", desc: "Understand the intuition and use cases." },
              { step: "03", title: "Solve Problems", desc: "Practice with hand-picked LeetCode questions." },
              { step: "04", title: "Master It", desc: "Mark as complete and move to the next challenge." }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="text-6xl font-black text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-8 md:px-12 py-24">
        <div className="bg-primary rounded-3xl p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to Crack Your Interview?</h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Join thousands of developers mastering Data Structures and Algorithms the right way.
            </p>
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold" asChild>
              <Link href="/patterns">
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
