import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Public paths that don't require authentication
const PUBLIC_PATHS = [
    "/",
    "/compiler",
    "/login",
    "/signup",
    "/auth/callback",
    "/auth/auth-code-error",
    "/feedback"
];

// Paths that should skip middleware entirely (static files, api routes that handle their own auth)
const SKIP_PATHS = [
    "/_next",
    "/favicon.ico",
    "/api/health",
    "/sitemap.xml",
    "/robots.txt"
];

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    );
}

function shouldSkipMiddleware(pathname: string): boolean {
    return SKIP_PATHS.some(path => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip middleware for static files and certain paths
    if (shouldSkipMiddleware(pathname)) {
        return NextResponse.next();
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Only log in development
    if (process.env.NODE_ENV === "development") {
        console.log(`Middleware: Path: ${pathname}, User found: ${!!user}`);
    }

    // Check if the current path is public
    const isPublic = isPublicPath(pathname);

    // If user is not signed in and the path is not public, redirect to login
    if (!user && !isPublic) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is signed in and tries to access login or signup, redirect to dashboard
    if (user && (pathname === "/login" || pathname === "/signup")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Static assets
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
    ],
};
