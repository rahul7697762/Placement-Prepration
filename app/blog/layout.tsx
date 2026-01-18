import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog - Placement Preparation Tips & DSA Patterns",
    description: "Expert tips on DSA patterns, system design, interview strategies, and career guidance. Learn from comprehensive guides to crack your placement interviews at FAANG and top tech companies.",
    keywords: [
        "placement preparation blog",
        "DSA patterns guide",
        "interview preparation tips",
        "FAANG interview",
        "coding interview blog",
        "system design tutorials",
        "resume tips for freshers",
        "technical interview strategies",
        "LeetCode patterns",
        "placement success stories"
    ],
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "prep4place Blog - Placement Preparation Tips & DSA Patterns",
        description: "Expert tips on DSA patterns, system design, interview strategies, and career guidance to crack your placements.",
        type: "website",
        url: "https://prep4place.com/blog",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place Blog",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "prep4place Blog - Placement Preparation Tips",
        description: "Expert tips on DSA patterns, system design, and interview strategies.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

