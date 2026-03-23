import { Metadata } from "next";

export const metadata: Metadata = {
    title: "DSA Patterns Roadmap - Master All Coding Patterns",
    description: "Follow the DSA Patterns roadmap to master all 15+ coding interview patterns. Structured path from Two Pointers to Dynamic Programming with progress tracking.",
    keywords: [
        "DSA patterns roadmap",
        "coding patterns learning path",
        "DSA interview patterns guide",
        "two pointers to dynamic programming",
        "complete DSA patterns list",
        "coding interview patterns order",
        "placement preparation roadmap",
    ],
    alternates: {
        canonical: "https://prep4place.com/roadmap/dsa-patterns",
    },
    openGraph: {
        title: "DSA Patterns Roadmap - Master All Coding Patterns | prep4place",
        description: "Structured path to master all 15+ DSA coding interview patterns with progress tracking.",
        url: "https://prep4place.com/roadmap/dsa-patterns",
        type: "website",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place DSA Patterns Roadmap",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "DSA Patterns Roadmap - Master All Coding Patterns",
        description: "Structured path to master all DSA coding interview patterns.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

export default function DSAPatternsRoadmapLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
