import { Metadata } from "next";
import { generateSoftwareAppSchema } from "@/lib/seo-schema";

export const metadata: Metadata = {
    title: "Algorithm Visualizer - Interactive DSA Visualizations",
    description: "Learn Data Structures and Algorithms through interactive visualizations. Explore sorting algorithms, searching algorithms, graph traversals, tree operations, and more. Perfect for placement preparation.",
    keywords: [
        "algorithm visualizer",
        "DSA visualizer",
        "sorting algorithm visualization",
        "bubble sort visualizer",
        "quick sort animation",
        "binary search visualization",
        "BFS DFS visualization",
        "binary tree visualizer",
        "graph algorithm animation",
        "data structures visualization",
        "interactive algorithm learning",
        "placement preparation tools",
        "coding interview visualization"
    ],
    alternates: {
        canonical: "/visualizer",
    },
    openGraph: {
        title: "Algorithm Visualizer - Interactive DSA Visualizations | prep4place",
        description: "Learn DSA through interactive visualizations. Explore sorting, searching, graphs, and trees.",
        type: "website",
        url: "https://prep4place.com/visualizer",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place Algorithm Visualizer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Algorithm Visualizer - Interactive DSA Learning",
        description: "Watch 14+ algorithms come to life with step-by-step animations.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

const jsonLd = generateSoftwareAppSchema(
    "prep4place Algorithm Visualizer",
    "Interactive visualization tool for learning Data Structures and Algorithms. Includes Sorting, Searching, Graphs, and Trees visualizations.",
    "EducationalApplication"
);

export default function VisualizerLayout({
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


