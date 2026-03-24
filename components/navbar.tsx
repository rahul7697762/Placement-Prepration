"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Code2,
    Mic,
    ChevronDown,
    BookOpen,
    BarChart3,
    Menu,
    X,
    Layout,
    FileText,
    Terminal,
    Map,
    Users
} from "lucide-react";
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
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { href: "/", label: "Home", icon: Layout },
        { href: "/patterns", label: "Patterns", icon: Code2 },
        { href: "/visualizer", label: "Visualizer", icon: BarChart3 },
        { href: "/interview", label: "AI Interview", icon: Mic, isNew: true },
        { href: "/resume-builder", label: "Resume Builder", icon: FileText },
        { href: "/compiler", label: "Online Compiler", icon: Terminal },
        { href: "/roadmap", label: "Roadmaps", icon: Map },
        { href: "/blog", label: "Blog", icon: BookOpen },
        { href: "/community", label: "Community", icon: Users },
    ];

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b-4 backdrop-blur supports-[backdrop-filter]:bg-background/90 transition-all duration-200",
                isScrolled ? "bg-background border-foreground brutalist-shadow-sm" : "bg-transparent border-foreground"
            )}
        >
            <div className="container mx-auto px-6 md:px-12 flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo-bauhaus.png"
                            alt="prep4place"
                            width={150}
                            height={40}
                            className="h-10 w-auto object-contain md:h-12"
                            priority
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-mono font-bold uppercase tracking-widest">
                    <Link
                        href="/"
                        className={cn(
                            "transition-colors hover:text-primary hover:-translate-y-0.5",
                            pathname === "/" ? "text-primary border-b-2 border-primary" : "text-foreground"
                        )}
                    >
                        Home
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors data-[state=open]:text-primary outline-none text-foreground hover:-translate-y-0.5">
                            Platform <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="rounded-none border-4 border-foreground brutalist-shadow-sm font-mono uppercase font-bold text-xs p-2">
                            <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer mb-1 border-2 border-transparent focus:border-foreground">
                                <Link href="/patterns" className="w-full">DSA Patterns</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer mb-1 border-2 border-transparent focus:border-foreground">
                                <Link href="/resume-builder" className="w-full">Resume Builder</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer mb-1 border-2 border-transparent focus:border-foreground">
                                <Link href="/compiler" className="w-full">Online Compiler</Link>
                            </DropdownMenuItem>
                            <div className="h-1 bg-foreground my-2" />
                            <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer border-2 border-transparent focus:border-foreground">
                                <Link href="/interview" className="w-full justify-between flex items-center">
                                    AI Interview
                                    <span className="text-[10px] px-1.5 py-0.5 bg-foreground text-primary border-2 border-foreground ml-2">
                                        NEW
                                    </span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors data-[state=open]:text-primary outline-none text-foreground hover:-translate-y-0.5">
                            Resources <ChevronDown className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="rounded-none border-4 border-foreground brutalist-shadow-sm font-mono uppercase font-bold text-xs p-2">
                            <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer mb-1 border-2 border-transparent focus:border-foreground">
                                <Link href="/roadmap" className="w-full">Roadmaps</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer mb-1 border-2 border-transparent focus:border-foreground">
                                <Link href="/think" className="w-full">Think</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer border-2 border-transparent focus:border-foreground">
                                <Link href="/community" className="w-full">Community</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link
                        href="/blog"
                        className={cn(
                            "transition-colors hover:text-primary flex items-center gap-1 hover:-translate-y-0.5",
                            pathname.startsWith("/blog") ? "text-primary border-b-2 border-primary" : "text-foreground"
                        )}
                    >
                        <BookOpen className="h-4 w-4" />
                        Blog
                    </Link>

                    <Link
                        href="/visualizer"
                        className={cn(
                            "transition-colors hover:text-primary flex items-center gap-1 hover:-translate-y-0.5",
                            pathname.startsWith("/visualizer") ? "text-primary border-b-2 border-primary" : "text-foreground"
                        )}
                    >
                        <BarChart3 className="h-4 w-4" />
                        Visualizer
                        <span className="text-[10px] px-1.5 py-0.5 bg-foreground text-primary border-2 border-foreground ml-1">
                            NEW
                        </span>
                    </Link>

                    {user && (
                        <>
                            <Link
                                href="/profile"
                                className={cn(
                                    "transition-colors hover:text-primary hover:-translate-y-0.5",
                                    pathname === "/profile" ? "text-primary border-b-2 border-primary" : "text-foreground"
                                )}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/dashboard"
                                className={cn(
                                    "transition-colors hover:text-primary hover:-translate-y-0.5",
                                    pathname === "/dashboard" ? "text-primary border-b-2 border-primary" : "text-foreground"
                                )}
                            >
                                Dashboard
                            </Link>
                        </>
                    )}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <ModeToggle />
                    </div>

                    {!user ? (
                        <div className="hidden md:block">
                            <Link href="/login">
                                <Button className="rounded-none border-2 border-foreground bg-primary text-primary-foreground brutalist-shadow-hover hover:bg-primary font-bold uppercase tracking-widest text-xs h-9 px-4">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-none border-2 border-foreground brutalist-shadow-hover p-0 object-cover overflow-hidden">
                                        <Avatar className="h-full w-full rounded-none">
                                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} className="rounded-none" />
                                            <AvatarFallback className="rounded-none font-mono font-bold">{user.email?.[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 rounded-none border-4 border-foreground brutalist-shadow-sm font-mono uppercase font-bold text-xs p-2" align="end" forceMount>
                                    <DropdownMenuLabel className="font-bold">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-xs truncate">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <div className="h-1 bg-foreground my-2" />
                                    <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer mb-1 border-2 border-transparent focus:border-foreground">
                                        <Link href="/profile" className="w-full">
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-none focus:bg-primary/20 focus:text-primary cursor-pointer mb-1 border-2 border-transparent focus:border-foreground">
                                        <Link href="/dashboard" className="w-full">
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <div className="h-1 bg-foreground my-2" />
                                    <DropdownMenuItem onClick={() => signOut()} className="rounded-none focus:bg-destructive/20 focus:text-destructive cursor-pointer border-2 border-transparent focus:border-foreground">
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}

                    {/* Mobile Menu Button - Visible on small screens */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-md px-6 py-8 md:hidden border-t overflow-y-auto pb-32"
                    >
                        <div className="flex flex-col space-y-6">
                            {/* Mobile User Section */}
                            {user && (
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
                                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">{user.email}</p>
                                        <button
                                            onClick={() => signOut()}
                                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Auth Buttons */}
                            {!user && (
                                <div className="flex flex-col gap-3">
                                    <Button className="w-full" asChild>
                                        <Link href="/login">Sign In</Link>
                                    </Button>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/signup">Create Account</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Main Navigation Links */}
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground px-2 pb-2">Navigation</p>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
                                            pathname === link.href || pathname.startsWith(link.href) && link.href !== "/"
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-lg",
                                            pathname === link.href || pathname.startsWith(link.href) && link.href !== "/"
                                                ? "bg-primary/20 text-primary"
                                                : "bg-secondary text-foreground"
                                        )}>
                                            <link.icon className="h-4 w-4" />
                                        </div>
                                        <span className="flex-1">{link.label}</span>
                                        {link.isNew && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold">
                                                NEW
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex justify-between items-center px-2 pt-4 border-t">
                                <span className="text-sm font-medium">Theme</span>
                                <ModeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
