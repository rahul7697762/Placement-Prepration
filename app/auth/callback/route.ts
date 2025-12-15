import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    console.log("Auth callback triggered. URL:", request.url);
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (errorParam) {
        console.error("Auth callback error param:", errorParam, errorDescription);
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${errorParam}`)
    }

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            console.log("Session exchanged successfully. Redirecting to:", `${origin}${next}`);
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error("Session exchange error:", error);
        }
    } else {
        console.log("No code found in URL search params.");
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
