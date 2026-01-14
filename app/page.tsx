"use client";

import { PatternGrid } from "@/components/pattern-grid";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  FileText,
  Layers,
  Layout,
  Map,
  Mic,
  Terminal,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/landing-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-background/85 dark:bg-background/90 z-0" />

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] z-0 opacity-50 pointer-events-none" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 py-24 md:py-32 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 max-w-5xl mx-auto"
        >
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The All-in-One Interview Prep Platform
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 leading-tight">
            Crack Your Tech Interview <br className="hidden md:block" /> with <span className="text-primary">Confidence</span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Master DSA patterns, build ATS-friendly resumes, and practice coding in one unified platform. Stop grinding randomly—start preparing strategically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20" asChild>
              <Link href="/patterns">
                Start Learning Patterns <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto rounded-xl border-2" asChild>
              <Link href="/resume-builder">
                Build My Resume
              </Link>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="pt-12 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg border border-border/50">
              <Code2 className="w-4 h-4 text-primary" />
              <span>DSA Patterns</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg border border-border/50">
              <FileText className="w-4 h-4 text-primary" />
              <span>Resume Builder</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-purple-500/20 px-4 py-2 rounded-lg border border-primary/30 relative">
              <Mic className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">AI Interview</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-semibold">
                NEW
              </span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg border border-border/50">
              <Terminal className="w-4 h-4 text-primary" />
              <span>Online Compiler</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Features Grid */}
      <section className="bg-secondary/20 py-24 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Everything you need to succeed</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've gathered the essential tools for your placement journey in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layout,
                title: "Pattern-Based Learning",
                description: "Don't memorize solutions. Learn the 20+ patterns that solve 95% of coding interview questions.",
                link: "/patterns",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                icon: FileText,
                title: "Smart Resume Builder",
                description: "Create professional, ATS-optimized resumes. Import from PDF or start from scratch with premium templates.",
                link: "/resume-builder",
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              {
                icon: Terminal,
                title: "Online Compiler",
                description: "Practice coding instantly in Python, C++, Java, and more with our zero-setup online IDE.",
                link: "/compiler",
                color: "text-green-500",
                bg: "bg-green-500/10"
              },
              {
                icon: Map,
                title: "Interactive Roadmaps",
                description: "Structured learning paths to guide you from beginner to interview-ready developer.",
                link: "/roadmap",
                color: "text-orange-500",
                bg: "bg-orange-500/10"
              },
              {
                icon: Mic,
                title: "AI Mock Interview",
                description: "Practice with our AI interviewer. Get real-time feedback on technical skills, communication, and body language.",
                link: "/interview",
                color: "text-violet-500",
                bg: "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
                isNew: true
              },
              {
                icon: Users,
                title: "Peer Community",
                description: "Connect with other aspirants, share interview experiences, and get mock interview practice.",
                link: "/community",
                color: "text-cyan-500",
                bg: "bg-cyan-500/10"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative bg-background p-8 rounded-3xl border transition-all hover:shadow-lg hover:-translate-y-1 ${'isNew' in feature && feature.isNew
                  ? "border-violet-500/50 hover:border-violet-500 ring-1 ring-violet-500/20"
                  : "hover:border-primary/50"
                  }`}
              >
                {'isNew' in feature && feature.isNew && (
                  <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                    ✨ NEW
                  </div>
                )}
                <Link href={feature.link} className="absolute inset-0 z-10">
                  <span className="sr-only">Go to {feature.title}</span>
                </Link>
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  {feature.title}
                  {feature.link !== "#" && <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground" />}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Builder Showcase */}
      <section className="container mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Build a Resume that gets <span className="text-primary">Shortlisted</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most candidates get rejected because of poor resume formatting. Our builder ensures your resume is:
            </p>
            <ul className="space-y-4">
              {[
                "ATS-Friendly (Applicant Tracking System)",
                "Professionally designed templates",
                "Auto-import from existing PDFs or LinkedIn",
                "Real-time preview and editing"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="rounded-xl px-8" asChild>
              <Link href="/resume-builder">
                Create Free Resume
              </Link>
            </Button>
          </div>

          <div className="relative order-1 md:order-2 bg-gradient-to-tr from-primary/10 via-secondary to-background p-8 rounded-3xl border border-border/50">
            {/* Abstract representation of a resume builder */}
            <div className="bg-background rounded-xl shadow-2xl p-6 border space-y-4 opacity-90 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex gap-4 mb-6 border-b pb-4">
                <div className="h-16 w-16 bg-muted rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-foreground/80 rounded" />
                  <div className="h-3 w-1/3 bg-muted-foreground/50 rounded" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-muted rounded" />
                <div className="h-2 w-full bg-muted rounded" />
                <div className="h-2 w-3/4 bg-muted rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="h-24 bg-primary/5 rounded border border-dashed border-primary/20 flex items-center justify-center text-xs text-primary">
                  Skills Section
                </div>
                <div className="h-24 bg-primary/5 rounded border border-dashed border-primary/20 flex items-center justify-center text-xs text-primary">
                  Experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patterns Grid Section */}
      <section className="bg-secondary/20 py-24">
        <div className="container mx-auto px-6 md:px-12 space-y-12">
          <div className="flex flex-col md:flex-row items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold">Master Core Patterns</h2>
              <p className="text-muted-foreground text-lg">Stop solving random problems. Learn the underlying patterns that connect them.</p>
            </div>
            <Button variant="outline" className="group" asChild>
              <Link href="/patterns">
                View All Patterns <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <PatternGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 md:px-12 py-24">
        <div className="bg-primary rounded-[2.5rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-[100px] group-hover:bg-white/30 transition-colors" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/20 rounded-full blur-[100px] group-hover:bg-white/30 transition-colors" />

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to launch your career?</h2>
            <p className="text-primary-foreground/80 text-lg md:text-2xl font-light">
              Join thousands of developers mastering Data Structures, Algorithms, and System Design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" className="h-16 px-10 text-lg font-semibold rounded-2xl" asChild>
                <Link href="/patterns">
                  Start Learning Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-semibold rounded-2xl bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
