import { createServerClient } from "@supabase/ssr";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 1. Basic Auth Check
    if (!user) {
        redirect("/login?redirectTo=/admin");
    }

    // 2. Admin Role Check
    const adminEmails = ["admin@dsashare.com"];
    if (!user.email || !adminEmails.includes(user.email)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground">You do not have permission to view this page.</p>
                    <a href="/" className="text-primary hover:underline mt-4 block">Go Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <span>Admin Panel</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Logged in as {user.email}</span>
                </div>
            </header>
            <main className="container mx-auto py-8 px-4 md:px-6">
                {children}
            </main>
        </div>
    );
}
