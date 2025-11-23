import Link from "next/link";
import { Code2, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-8 md:px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                                <Code2 className="h-5 w-5" />
                            </div>
                            <span>DSA Share</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Master Data Structures and Algorithms pattern-wise. Built for developers, by developers.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Patterns</Link></li>
                            <li><Link href="/roadmap" className="hover:text-primary transition-colors">Roadmap</Link></li>
                            <li><Link href="/think" className="hover:text-primary transition-colors">Think</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Community</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contribute</a></li>
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
                    <p>&copy; {new Date().getFullYear()} DSA Share. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
