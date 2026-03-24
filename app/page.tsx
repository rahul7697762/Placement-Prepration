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
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import AuthenticatedHome from "@/components/authenticated-home";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show personalized homepage for logged-in users
  if (user) {
    return <AuthenticatedHome user={user} />;
  }

  // Show marketing landing page for logged-out users

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Neo-brutalist Background Pattern */}
      <div className="absolute inset-0 z-0 bg-background" />
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)', backgroundSize: '32px 32px' }} 
      />

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 py-24 md:py-32 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8 max-w-6xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-5 py-2.5 text-xs rounded-none border-2 border-foreground bg-primary/10 text-primary uppercase font-mono tracking-widest brutalist-shadow-sm">
              <span className="flex h-2.5 w-2.5 bg-primary border border-foreground border-solid mr-3 animate-pulse"></span>
              System Ready: V2.0
            </Badge>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter text-foreground leading-[0.9] pb-2">
            Crack Your <br className="hidden md:block" /> Tech Interview <br className="hidden md:block" />
            <span className="text-primary tracking-tighter bg-foreground px-6 py-2 inline-block -skew-y-3 mt-4 brutalist-shadow transition-transform hover:skew-y-0">WITH CONFIDENCE</span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground font-mono leading-relaxed max-w-3xl mx-auto border-l-8 border-primary pl-8 my-10 bg-background/50 backdrop-blur pb-2 pt-2 text-left">
            &gt; Master DSA patterns, build ATS-friendly resumes, and practice coding in one unified platform_ <br />
            &gt; Stop grinding randomly. Start preparing strategically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Button size="lg" className="h-16 px-10 text-xl w-full sm:w-auto rounded-none border-2 border-foreground bg-primary text-primary-foreground brutalist-shadow-hover font-bold uppercase tracking-widest" asChild>
              <Link href="/patterns">
                Start Learning <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-xl w-full sm:w-auto rounded-none border-2 border-foreground bg-secondary text-secondary-foreground brutalist-shadow-hover font-bold uppercase tracking-widest" asChild>
              <Link href="/resume-builder">
                Build Resume
              </Link>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="pt-20 flex flex-wrap justify-center gap-5 text-xs md:text-sm font-mono tracking-wider font-bold uppercase">
            <div className="flex items-center gap-3 bg-card px-5 py-3 border-2 border-foreground brutalist-shadow-sm hover:-translate-y-1 hover:brutalist-shadow transition-transform">
              <Code2 className="w-5 h-5 text-primary" />
              <span>DSA Patterns</span>
            </div>
            <div className="flex items-center gap-3 bg-card px-5 py-3 border-2 border-foreground brutalist-shadow-sm hover:-translate-y-1 hover:brutalist-shadow transition-transform">
              <FileText className="w-5 h-5 text-secondary" />
              <span>Resume Builder</span>
            </div>
            <div className="flex items-center gap-3 bg-accent px-5 py-3 border-2 border-foreground brutalist-shadow-sm hover:-translate-y-1 hover:brutalist-shadow transition-transform relative text-accent-foreground">
              <Mic className="w-5 h-5 text-foreground" />
              <span>AI Interview</span>
              <span className="absolute -top-3 -right-3 px-2 py-0.5 border-2 border-foreground bg-primary text-primary-foreground text-[10px] transform rotate-[15deg]">
                NEW
              </span>
            </div>
            <div className="flex items-center gap-3 bg-card px-5 py-3 border-2 border-foreground brutalist-shadow-sm hover:-translate-y-1 hover:brutalist-shadow transition-transform">
              <Terminal className="w-5 h-5 text-chart-3" />
              <span>Online Compiler</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Features Grid */}
      <section className="bg-background py-24 relative z-10 border-t-8 border-foreground border-b-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary border-b-8 border-l-8 border-foreground -translate-y-1" />
        <div className="container mx-auto px-6 md:px-12 relative">
          <div className="text-left mb-16 space-y-6 max-w-4xl border-2 border-foreground p-8 bg-card brutalist-shadow mt-12">
            <div className="inline-block px-3 py-1 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest border-2 border-foreground mb-4">
              /// MODULE_01
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Everything You Need To Succeed</h2>
            <p className="text-foreground font-mono text-lg max-w-2xl border-l-4 border-primary pl-4">
              We've gathered the essential tools for your placement journey in one unified, high-performance interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Layout,
                title: "Pattern-Based Learning",
                description: "Don't memorize solutions. Learn the 20+ patterns that solve 95% of coding interview questions.",
                link: "/patterns",
                theme: "bg-background text-foreground"
              },
              {
                icon: FileText,
                title: "Smart Resume Builder",
                description: "Create professional, ATS-optimized resumes. Import from PDF or start from scratch with solid layouts.",
                link: "/resume-builder",
                theme: "bg-secondary text-secondary-foreground"
              },
              {
                icon: Terminal,
                title: "Online Compiler",
                description: "Practice coding instantly in Python, C++, Java, and more with our zero-setup online terminal.",
                link: "/compiler",
                theme: "bg-background text-foreground"
              },
              {
                icon: Map,
                title: "Interactive Roadmaps",
                description: "Structured learning paths to guide you from beginner to interview-ready developer.",
                link: "/roadmap",
                theme: "bg-accent text-accent-foreground"
              },
              {
                icon: Mic,
                title: "AI Mock Interview",
                description: "Practice with our AI interviewer. Get real-time feedback on technical skills and system design.",
                link: "/interview",
                theme: "bg-primary text-primary-foreground",
                isNew: true
              },
              {
                icon: Users,
                title: "Peer Community",
                description: "Connect with other aspirants, share interview experiences, and get mock interview practice.",
                link: "/community",
                theme: "bg-background text-foreground"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative p-8 border-4 border-foreground transition-all duration-200 hover:-translate-y-2 hover:-translate-x-2 ${feature.theme} brutalist-shadow-sm hover:brutalist-shadow`}
              >
                {'isNew' in feature && feature.isNew && (
                  <div className="absolute -top-4 -right-4 px-3 py-1 bg-accent text-accent-foreground border-2 border-foreground font-mono font-bold text-sm transform rotate-[10deg] brutalist-shadow-sm">
                    /// NEW
                  </div>
                )}
                <Link href={feature.link} className="absolute inset-0 z-10">
                  <span className="sr-only">Go to {feature.title}</span>
                </Link>
                <div className="w-16 h-16 border-2 border-current flex items-center justify-center mb-8 rotate-3 group-hover:-rotate-3 transition-transform bg-transparent">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 flex items-center justify-between">
                  {feature.title}
                  {feature.link !== "#" && <ArrowRight className="w-6 h-6 ml-2" />}
                </h3>
                <p className="font-mono text-sm leading-relaxed border-t-2 border-current pt-4">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Builder Showcase */}
      <section className="container mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <div className="inline-block px-3 py-1 bg-secondary text-secondary-foreground font-mono text-sm uppercase tracking-widest border-2 border-foreground mb-4">
              /// MODULE_02 
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              Build A Resume That Gets <span className="text-primary tracking-tighter mix-blend-difference bg-foreground px-4 py-1.5 inline-block -skew-y-2 mt-2">SHORTLISTED</span>
            </h2>
            <p className="text-lg text-foreground font-mono leading-relaxed border-l-4 border-foreground pl-4">
              Most candidates get rejected because of poor resume formatting. Our builder ensures your resume is:
            </p>
            <ul className="space-y-4 font-mono font-medium">
              {[
                "ATS-Friendly (Applicant Tracking System)",
                "Professionally designed templates",
                "Auto-import from existing PDFs or LinkedIn",
                "Real-time preview and editing"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-primary border-2 border-foreground" />
                  <span className="uppercase">{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="h-16 px-10 text-xl rounded-none border-2 border-foreground bg-primary text-primary-foreground brutalist-shadow-hover hover:bg-primary uppercase font-bold tracking-widest" asChild>
              <Link href="/resume-builder">
                Build Resume Free
              </Link>
            </Button>
          </div>

          <div className="relative order-1 md:order-2 bg-accent p-8 border-4 border-foreground brutalist-shadow-sm group mt-10 md:mt-0">
            {/* Abstract representation of a brutalist resume builder */}
            <div className="bg-background border-4 border-foreground p-6 space-y-4 brutalist-shadow rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <div className="flex gap-4 mb-6 border-b-4 border-foreground pb-4">
                <div className="h-16 w-16 bg-secondary border-2 border-foreground" />
                <div className="space-y-3 flex-1">
                  <div className="h-6 w-1/2 bg-foreground" />
                  <div className="h-4 w-1/3 bg-foreground/60" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-3 w-full bg-foreground/80" />
                <div className="h-3 w-full bg-foreground/80" />
                <div className="h-3 w-3/4 bg-foreground/80" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="h-28 bg-primary/10 border-2 border-foreground border-dashed flex items-center justify-center text-sm font-mono uppercase font-bold text-foreground">
                  Skills Section
                </div>
                <div className="h-28 bg-secondary/10 border-2 border-foreground border-dashed flex items-center justify-center text-sm font-mono uppercase font-bold text-foreground">
                  Experience
                </div>
              </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full bg-[url('/grid.svg')] border-4 border-foreground" />
          </div>
        </div>
      </section>

      {/* Patterns Grid Section */}
      <section className="bg-foreground text-background py-24 relative z-10 border-t-8 border-background border-b-8">
        <div className="container mx-auto px-6 md:px-12 space-y-12">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-block px-3 py-1 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest border-2 border-background mb-2">
                /// MODULE_03
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter line-clamp-2 leading-[0.9]">Master Core <br/>Patterns</h2>
              <p className="text-background/80 font-mono text-lg border-l-4 border-primary pl-4">Stop solving random problems. Learn the underlying structural patterns.</p>
            </div>
            <Button variant="outline" className="h-14 px-8 rounded-none border-4 border-background bg-secondary text-secondary-foreground hover:bg-background hover:text-foreground font-bold uppercase tracking-widest brutalist-shadow-sm transition-transform hover:-translate-y-1" asChild>
              <Link href="/patterns">
                View All Patterns <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <PatternGrid />
        </div>
      </section>

      {/* Featured Blog Section */}
      <section className="container mx-auto px-6 md:px-12 py-24 relative z-10 border-b-8 border-foreground">
        <div className="text-center mb-16 space-y-6">
          <Badge variant="outline" className="px-5 py-2.5 text-xs rounded-none border-2 border-foreground bg-accent/20 text-foreground uppercase font-mono tracking-widest brutalist-shadow-sm inline-flex">
            <span>[ SYSTEM_LOGS :: BLOG ]</span>
          </Badge>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Interview Preparation Guides</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <Link href="/blog/blind-75-leetcode-problems-complete-guide-2025" className="block outline-none">
            <article className="group relative bg-background border-4 border-foreground hover:-translate-y-2 hover:-translate-x-2 transition-transform duration-300 brutalist-shadow-sm hover:brutalist-shadow">
              <div className="grid md:grid-cols-5 gap-0">
                {/* Image Section */}
                <div className="md:col-span-2 relative h-64 md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-foreground bg-primary/20 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/blog/blind-75-banner.png')] bg-cover bg-center mix-blend-multiply grayscale contrast-150 group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent mix-blend-overlay" />
                  <div className="absolute top-4 left-4">
                    <Badge className="rounded-none bg-primary text-primary-foreground border-2 border-foreground uppercase font-mono font-bold tracking-widest text-[10px] brutalist-shadow-sm">
                      FEATURED_POST
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center bg-[url('/grid.svg')] bg-opacity-5">
                  <div className="flex flex-wrap gap-3 mb-6 font-mono">
                    <Badge variant="secondary" className="rounded-none border-2 border-foreground uppercase text-xs">Blind 75</Badge>
                    <Badge variant="secondary" className="rounded-none border-2 border-foreground uppercase text-xs">LeetCode</Badge>
                    <Badge variant="secondary" className="rounded-none border-2 border-foreground uppercase text-xs">Interview Prep</Badge>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 group-hover:text-primary transition-colors leading-[1.05]">
                    Blind 75 LeetCode Problems: Complete Interview Guide 2025
                  </h3>

                  <p className="font-mono text-sm leading-relaxed mb-8 border-l-4 border-foreground pl-4">
                    Master the most efficient curated list of 75 LeetCode problems to crack coding interviews at Google, Amazon, Microsoft, and Meta.
                  </p>

                  <div className="flex flex-wrap items-center gap-6 font-mono text-xs font-bold uppercase mb-8 pb-8 border-b-4 border-foreground border-dashed">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-primary"/>Jan 25, 2025</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-secondary"/>20 min read</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-accent"/>prep4place</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-bold text-foreground font-mono uppercase tracking-widest flex items-center gap-3 transition-transform group-hover:translate-x-2">
                      Read Full Guide <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>

          {/* Additional Blog Links */}
          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button variant="outline" size="lg" className="h-16 px-10 rounded-none border-2 border-foreground bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground font-bold uppercase tracking-widest group brutalist-shadow-hover">
                View All System Logs <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 md:px-12 py-24 relative z-10">
        <div className="bg-primary border-8 border-foreground p-12 md:p-24 text-center text-primary-foreground relative group brutalist-shadow">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
          <div className="absolute top-0 left-0 w-8 h-8 border-b-4 border-r-4 border-foreground" />
          <div className="absolute top-0 right-0 w-8 h-8 border-b-4 border-l-4 border-foreground" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-t-4 border-r-4 border-foreground" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-t-4 border-l-4 border-foreground" />

          <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
            <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
              Execute <br/> <span className="bg-foreground text-primary px-4 inline-block mt-4 -skew-y-2 brutalist-shadow">PROGRAM</span>
            </h2>
            <p className="text-primary-foreground font-mono text-xl md:text-2xl font-bold uppercase tracking-widest max-w-2xl mx-auto border-t-4 border-b-4 border-foreground py-6 bg-foreground/10">
              [ Join thousands of developers mastering DSA and System Design. ]
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button size="lg" className="h-20 px-12 text-2xl font-black uppercase tracking-widest rounded-none bg-background text-foreground border-4 border-foreground hover:bg-secondary hover:text-secondary-foreground transition-all brutalist-shadow hover:translate-y-1 hover:translate-x-1" asChild>
                <Link href="/patterns">
                  Init sequence &gt;
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
