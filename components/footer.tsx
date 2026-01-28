import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-8 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="space-y-4 md:col-span-2">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo-bauhaus.png"
                                alt="prep4place"
                                width={120}
                                height={32}
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            The complete platform for technical interview preparation. Master patterns, build superior resumes, and practice coding all in one place.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/patterns" className="hover:text-primary transition-colors">DSA Patterns</Link></li>
                            <li><Link href="/resume-builder" className="hover:text-primary transition-colors">Resume Builder</Link></li>
                            <li><Link href="/compiler" className="hover:text-primary transition-colors">Online Compiler</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/roadmap" className="hover:text-primary transition-colors">Roadmaps</Link></li>
                            <li><Link href="/think" className="hover:text-primary transition-colors">Think</Link></li>
                            <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <div className="flex items-center gap-4">
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} prep4place. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
