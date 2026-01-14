"use client";


import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Code2, Github, Mic, ChevronDown } from "lucide-react";
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
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo-bauhaus.png"
                            alt="prep4place"
                            width={150}
                            height={40}
                            className="h-12 w-auto object-contain"
                            priority
                        />
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

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors data-[state=open]:text-primary outline-none text-muted-foreground">
                            Platform <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem asChild>
                                <Link href="/patterns" className="w-full cursor-pointer">DSA Patterns</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/resume-builder" className="w-full cursor-pointer">Resume Builder</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/compiler" className="w-full cursor-pointer">Online Compiler</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/interview" className="w-full cursor-pointer justify-between flex items-center">
                                    AI Interview
                                    <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full font-semibold ml-2">
                                        NEW
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors data-[state=open]:text-primary outline-none text-muted-foreground">
                            Resources <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem asChild>
                                <Link href="/roadmap" className="w-full cursor-pointer">Roadmaps</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/think" className="w-full cursor-pointer">Think</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/community" className="w-full cursor-pointer">Community</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user && (
                        <>
                            <Link
                                href="/profile"
                                className={cn(
                                    "transition-colors hover:text-primary",
                                    pathname === "/profile" ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                Coding Profile
                            </Link>
                            <Link
                                href="/dashboard"
                                className={cn(
                                    "transition-colors hover:text-primary",
                                    pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                Dashboard
                            </Link>
                        </>
                    )}
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
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="w-full cursor-pointer">
                                        Coding Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="w-full cursor-pointer">
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
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
