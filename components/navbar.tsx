"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Code2, Github, Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/mode-toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, signOut } = useAuth();

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const shouldBeScrolled = window.scrollY > 0;
                    setIsScrolled(shouldBeScrolled);
                    ticking = false;
                });
                ticking = true;
            }
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
                        href="/interview"
                        className={cn(
                            "transition-colors hover:text-primary flex items-center gap-1.5",
                            pathname.startsWith("/interview") ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <Mic className="w-3.5 h-3.5" />
                        Interview
                        <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-semibold">
                            NEW
                        </span>
                    </Link>
                    {user && (
                        <Link
                            href="/dashboard"
                            className={cn(
                                "transition-colors hover:text-primary",
                                pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            Dashboard
                        </Link>
                    )}
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

                    {!user ? (
                        <Link href="/login">
                            <Button variant="default" size="sm" className="hidden sm:flex">
                                Sign In
                            </Button>
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
