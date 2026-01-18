import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - Track Your Progress",
    description: "Track your DSA progress, LeetCode stats, and placement preparation journey. View your solved problems, patterns mastered, and interview readiness score.",
    keywords: [
        "placement dashboard",
        "DSA progress tracker",
        "LeetCode tracker",
        "coding progress",
        "placement preparation tracker",
        "interview preparation dashboard",
    ],
    alternates: {
        canonical: "/dashboard",
    },
    openGraph: {
        title: "Dashboard - Track Your Progress | prep4place",
        description: "Track your DSA progress and placement preparation journey.",
        type: "website",
        url: "https://prep4place.com/dashboard",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place Dashboard",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Dashboard - Track Your Progress",
        description: "Track your DSA progress and placement preparation journey.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
