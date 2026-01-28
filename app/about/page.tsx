import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Users, Trophy, BookOpen } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us | prep4place",
    description: "Learn about prep4place - The ultimate platform for placement preparation.",
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    About prep4place
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    We are dedicated to democratizing tech interview preparation. Our mission is to provide students and professionals with the best tools and resources to crack their dream jobs.
                </p>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                {[
                    { label: "Active Users", value: "10K+", icon: Users },
                    { label: "Practice Problems", value: "500+", icon: Code2 },
                    { label: "Success Stories", value: "1000+", icon: Trophy },
                    { label: "Learning Resources", value: "100+", icon: BookOpen },
                ].map((stat, index) => (
                    <div key={index} className="p-6 bg-card rounded-xl border text-center hover:shadow-lg transition-shadow">
                        <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                        <div className="text-3xl font-bold mb-2">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* Mission Section */}
            <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                    <p className="text-lg text-muted-foreground">
                        At prep4place, we believe that quality placement preparation should be accessible to everyone. We've built a comprehensive ecosystem that combines:
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                                <span className="text-primary text-sm">✓</span>
                            </div>
                            <span>Structured learning paths and roadmaps</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                                <span className="text-primary text-sm">✓</span>
                            </div>
                            <span>Interactive coding environments</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                                <span className="text-primary text-sm">✓</span>
                            </div>
                            <span>AI-powered resume building tools</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                                <span className="text-primary text-sm">✓</span>
                            </div>
                            <span>Curated DSA patterns and system design resources</span>
                        </li>
                    </ul>
                </div>
                <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center border">
                    {/* Placeholder for an image or graphic */}
                    <div className="text-center p-8">
                        <div className="text-6xl mb-4">🚀</div>
                        <h3 className="text-2xl font-semibold">Your Success Partner</h3>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center bg-primary/5 rounded-3xl p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join thousands of other developers who are mastering their craft with prep4place.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/roadmap" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow h-11">
                        Explore Roadmaps <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                    <Link href="/patterns" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md shadow-sm h-11">
                        View DSA Patterns
                    </Link>
                </div>
            </section>
        </div>
    );
}
