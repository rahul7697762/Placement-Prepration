import { Metadata } from "next";

export const metadata: Metadata = {
    title: "DSA Roadmap - Structured Learning Path",
    description: "Follow structured learning paths from beginner to interview-ready developer. Master DSA patterns, Python programming, and more with our curated roadmaps.",
    keywords: [
        "DSA roadmap",
        "placement roadmap",
        "coding interview roadmap",
        "Python learning path",
        "data structures roadmap",
        "algorithms learning path",
        "placement preparation guide",
        "6 months placement plan",
        "DSA learning order",
        "coding interview guide",
    ],
    alternates: {
        canonical: "/roadmap",
    },
    openGraph: {
        title: "DSA Roadmap - Structured Learning Path | prep4place",
        description: "Structured learning paths from beginner to interview-ready. Master DSA with curated roadmaps.",
        type: "website",
        url: "https://prep4place.com/roadmap",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place DSA Roadmap",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "DSA Roadmap - Structured Learning Path",
        description: "Structured learning paths from beginner to interview-ready developer.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

export default function RoadmapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
