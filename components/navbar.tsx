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
                "sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200",
                isScrolled ? "bg-background/80 border-border" : "bg-transparent border-transparent"
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

                    <Link
                        href="/blog"
                        className={cn(
                            "transition-colors hover:text-primary flex items-center gap-1",
                            pathname.startsWith("/blog") ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <BookOpen className="h-4 w-4" />
                        Blog
                    </Link>

                    <Link
                        href="/visualizer"
                        className={cn(
                            "transition-colors hover:text-primary flex items-center gap-1",
                            pathname.startsWith("/visualizer") ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <BarChart3 className="h-4 w-4" />
                        Visualizer
                        <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold ml-1">
                            NEW
                        </span>
                    </Link>

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
                    <div className="hidden md:flex items-center gap-2">
                        <ModeToggle />
                    </div>

                    {!user ? (
                        <div className="hidden md:block">
                            <Link href="/login">
                                <Button variant="default" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:block">
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
