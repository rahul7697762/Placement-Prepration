import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blind 75 Roadmap - Complete Study Plan & Progress Tracker",
    description: "Follow the Blind 75 structured roadmap to crack FAANG interviews. Track your progress through all 75 must-know LeetCode problems organized by pattern and difficulty.",
    keywords: [
        "blind 75 roadmap",
        "blind 75 study plan",
        "blind 75 progress tracker",
        "blind 75 leetcode order",
        "FAANG interview roadmap",
        "leetcode 75 problems list",
        "coding interview study plan",
    ],
    alternates: {
        canonical: "https://prep4place.com/roadmap/blind-75",
    },
    openGraph: {
        title: "Blind 75 Roadmap - Complete Study Plan | prep4place",
        description: "Follow the structured Blind 75 roadmap. Track progress through 75 must-know LeetCode problems organized by pattern.",
        url: "https://prep4place.com/roadmap/blind-75",
        type: "website",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place Blind 75 Roadmap",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blind 75 Roadmap - Complete Study Plan",
        description: "Track your progress through 75 must-know LeetCode problems.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

export default function Blind75Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
