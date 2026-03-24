"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        // ... (existing logic)
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('Email not confirmed')) {
                setError('Please verify your email address before signing in. Check your inbox (and spam folder) for the verification link.');
            } else {
                setError(error.message);
            }
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        const redirectTo = process.env.NEXT_PUBLIC_SITE_URL
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`
            : `${window.location.origin}/auth/callback?next=/dashboard`;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-primary/5">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[url('/grid.svg')] opacity-20 border-b-8 border-l-8 border-foreground pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[url('/grid.svg')] opacity-20 border-t-8 border-r-8 border-foreground pointer-events-none" />

            <Card className="w-full max-w-md rounded-none border-4 border-foreground bg-background brutalist-shadow z-10">
                <CardHeader className="border-b-4 border-foreground bg-secondary pb-6">
                    <CardTitle className="text-3xl font-black uppercase tracking-tight">System Login</CardTitle>
                    <CardDescription className="text-foreground font-mono uppercase text-xs font-bold leading-relaxed max-w-[250px]">
                        Authenticate to access the platform logs and resources
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-mono uppercase font-bold tracking-widest text-xs">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded-none border-2 border-foreground bg-primary/5 focus-visible:ring-0 focus-visible:border-primary font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-mono uppercase font-bold tracking-widest text-xs">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pr-10 rounded-none border-2 border-foreground bg-primary/5 focus-visible:ring-0 focus-visible:border-primary font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground hover:text-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="text-xs font-mono font-bold text-destructive bg-destructive/10 border-2 border-destructive p-3">
                                [ERROR] {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full rounded-none border-2 border-foreground bg-primary text-primary-foreground brutalist-shadow-hover hover:bg-primary font-bold uppercase tracking-widest text-xs h-12" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? 'Authenticating...' : 'Execute Login'}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t-2 border-dashed border-foreground" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-mono font-bold tracking-widest">
                            <span className="bg-background px-4 text-foreground border-2 border-foreground">Or</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full rounded-none border-2 border-foreground bg-background text-foreground brutalist-shadow-hover hover:bg-secondary font-bold uppercase tracking-widest text-xs h-12" onClick={handleGoogleLogin} disabled={loading}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google Login Auth
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center border-t-4 border-foreground bg-background p-6">
                    <p className="text-xs font-mono font-bold uppercase tracking-widest text-foreground">
                        Not registered?{' '}
                        <Link href="/signup" className="text-primary hover:bg-primary hover:text-primary-foreground border-b-2 border-primary transition-colors">
                            Initialize Account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
