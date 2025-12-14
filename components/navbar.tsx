"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Code2, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
                isScrolled ? "bg-background/80 border-border" : "bg-transparent border-transparent"
            )}
        >
            <div className="container mx-auto px-8 md:px-12 flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                            <Code2 className="h-5 w-5" />
                        </div>
                        <span>DSA Share</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link
                        href="/"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === "/" ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        href="/patterns"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname.startsWith("/patterns") ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Patterns
                    </Link>
                    <SignedIn>
                        <Link
                            href="/dashboard"
                            className={cn(
                                "transition-colors hover:text-primary",
                                pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Dashboard
                        </Link>
                    </SignedIn>
                    <Link
                        href="/roadmap"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === "/roadmap" ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Roadmap
                    </Link>
                    <Link
                        href="/think"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === "/think" ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Think
                    </Link>
                    <Link
                        href="/compiler"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === "/compiler" ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Compiler
                    </Link>
                    <Link
                        href="/resume-builder"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === "/resume-builder" ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Resume
                    </Link>
                    <Link
                        href="/community"
                        className={cn(
                            "transition-colors hover:text-primary",
                            pathname === "/community" ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        Community
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Github className="h-5 w-5" />
                    </Button>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="default" size="sm" className="hidden sm:flex">
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
