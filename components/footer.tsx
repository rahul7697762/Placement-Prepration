import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t-8 border-foreground bg-primary/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[url('/grid.svg')] border-b-8 border-l-8 border-foreground opacity-20 pointer-events-none" />
            <div className="container mx-auto px-8 md:px-12 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                    <div className="space-y-6 md:col-span-2">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo-bauhaus.png"
                                alt="prep4place"
                                width={120}
                                height={32}
                                className="h-8 w-auto object-contain grayscale contrast-200"
                            />
                        </Link>
                        <p className="text-sm font-mono text-foreground font-bold uppercase leading-relaxed max-w-sm border-l-4 border-primary pl-4">
                            The complete platform for technical interview preparation. Master patterns, build superior resumes.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-xl uppercase tracking-wider mb-6 border-b-4 border-foreground pb-2 w-fit">Platform</h3>
                        <ul className="space-y-3 text-sm font-mono font-bold uppercase tracking-wider">
                            <li><Link href="/patterns" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; DSA Patterns</Link></li>
                            <li><Link href="/resume-builder" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; Resume Builder</Link></li>
                            <li><Link href="/compiler" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; Online Compiler</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-xl uppercase tracking-wider mb-6 border-b-4 border-foreground pb-2 w-fit">Resources</h3>
                        <ul className="space-y-3 text-sm font-mono font-bold uppercase tracking-wider">
                            <li><Link href="/about" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; About Us</Link></li>
                            <li><Link href="/roadmap" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; Roadmaps</Link></li>
                            <li><Link href="/think" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; Think</Link></li>
                            <li><Link href="/community" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; Community</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-primary hover:translate-x-1 transition-all inline-block">&gt; Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-xl uppercase tracking-wider mb-6 border-b-4 border-foreground pb-2 w-fit">Connect</h3>
                        <div className="flex items-center gap-4">
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="bg-background border-2 border-foreground p-2 brutalist-shadow-hover text-foreground hover:bg-primary transition-colors">
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="bg-background border-2 border-foreground p-2 brutalist-shadow-hover text-foreground hover:bg-primary transition-colors">
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="bg-background border-2 border-foreground p-2 brutalist-shadow-hover text-foreground hover:bg-primary transition-colors">
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t-8 border-foreground border-dashed text-left text-sm font-mono font-bold uppercase tracking-widest text-foreground">
                    <p>&copy; {new Date().getFullYear()} prep4place. [ SYSTEM_ONLINE ]</p>
                </div>
            </div>
        </footer>
    );
}
