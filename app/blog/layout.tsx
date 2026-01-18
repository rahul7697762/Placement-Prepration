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
    openGraph: {
        title: "prep4place Blog - Placement Preparation Tips & DSA Patterns",
        description: "Expert tips on DSA patterns, system design, interview strategies, and career guidance to crack your placements.",
        type: "website",
        url: "https://placement-prepration-woad.vercel.app/blog",
    },
    twitter: {
        card: "summary_large_image",
        title: "prep4place Blog - Placement Preparation Tips",
        description: "Expert tips on DSA patterns, system design, and interview strategies.",
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
