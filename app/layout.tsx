import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";

import { Footer } from "@/components/footer";
import { FeedbackButton } from "@/components/FeedbackModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "prep4place - Complete Placement Preparation Platform",
    template: "%s | prep4place"
  },
  description: "Master your placement preparation with prep4place - Your complete platform for DSA patterns, system design, resume builder, interview prep, and LeetCode integration. Get placement-ready with curated resources and AI-powered tools.",
  keywords: [
    "placement preparation",
    "DSA patterns",
    "data structures and algorithms",
    "system design",
    "interview preparation",
    "leetcode",
    "resume builder",
    "coding interview",
    "technical interview",
    "job interview prep",
    "computer science",
    "software engineering",
    "FAANG preparation",
    "placement ready",
    "coding practice"
  ],
  authors: [{ name: "prep4place Team" }],
  creator: "prep4place",
  publisher: "prep4place",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://prep4place.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "prep4place - Complete Placement Preparation Platform",
    description: "Master DSA patterns, system design, resume building, and ace your interviews with AI-powered tools. LeetCode integration, 300+ curated problems, and comprehensive roadmaps.",
    url: "https://prep4place.com",
    siteName: "prep4place",
    images: [
      {
        url: "https://prep4place.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "prep4place - Your Complete Placement Preparation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "prep4place - Complete Placement Preparation Platform",
    description: "Master DSA patterns, system design, and ace your interviews with AI-powered tools. 300+ curated problems, LeetCode integration, and comprehensive roadmaps.",
    images: ["https://prep4place.com/og-image.png"],
    creator: "@prep4place",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logo-bauhaus.png",
    shortcut: "/logo-bauhaus.png",
    apple: "/logo-bauhaus.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "JeLrk9UO-YZTsp6CC2dSfy1IvZpkPjdyAdOquL1x_ek",
    // yandex: "your-yandex-verification",
    // bing: "your-bing-verification",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased flex flex-col`} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            <FeedbackButton />
            <Footer />
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
