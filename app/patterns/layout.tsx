import { Metadata } from "next";
import { generateCourseSchema } from "@/lib/seo-schema";

export const metadata: Metadata = {
    title: "DSA Patterns - Master Coding Interview Patterns",
    description: "Master 20+ essential coding interview patterns. Learn the underlying patterns that solve 95% of coding interview questions. Perfect for placement preparation at FAANG and top tech companies.",
    keywords: [
        "DSA patterns",
        "coding patterns",
        "LeetCode patterns",
        "coding interview patterns",
        "two pointers pattern",
        "sliding window pattern",
        "dynamic programming patterns",
        "backtracking patterns",
        "placement preparation",
        "FAANG interview patterns",
        "data structures patterns",
    ],
    alternates: {
        canonical: "/patterns",
    },
    openGraph: {
        title: "DSA Patterns - Master Coding Interview Patterns | prep4place",
        description: "Master 20+ essential coding patterns that solve 95% of interview questions.",
        type: "website",
        url: "https://prep4place.com/patterns",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place DSA Patterns",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "DSA Patterns - Master Coding Interview Patterns",
        description: "Master 20+ essential coding patterns that solve 95% of interview questions.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

const jsonLd = generateCourseSchema({
    name: "Master DSA Patterns for Coding Interviews",
    description: "Learn the 20+ most common coding patterns to solve 95% of algorithm questions including Sliding Window, Two Pointers, and DP.",
    provider: "prep4place",
});

export default function PatternsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}

