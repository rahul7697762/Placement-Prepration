import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";

import { Footer } from "@/components/footer";
import { FeedbackButton } from "@/components/FeedbackModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DSA Pattern Share",
  description: "Master Data Structures and Algorithms pattern-wise",
  metadataBase: new URL("https://dsa-pattern-share.vercel.app"), // Update this with your actual production URL
  openGraph: {
    title: "DSA Pattern Share",
    description: "Master Data Structures and Algorithms pattern-wise. Your ultimate platform for learning DSA through categorized patterns and problems.",
    url: "https://dsa-pattern-share.vercel.app", // Update this with your actual production URL
    siteName: "DSA Pattern Share",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DSA Pattern Share - Master Data Structures and Algorithms",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Pattern Share",
    description: "Master Data Structures and Algorithms pattern-wise. Your ultimate platform for learning DSA through categorized patterns and problems.",
    images: ["/og-image.png"],
  },
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
      </body>
    </html>
  );
}
