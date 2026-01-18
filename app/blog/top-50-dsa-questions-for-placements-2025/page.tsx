import { Metadata } from "next";
import BlogPostContent from "./content";

export const metadata: Metadata = {
    title: "Top 50 DSA Questions You Must Solve for Placements in 2025 | prep4place",
    description: "Master the 50 most frequently asked Data Structures and Algorithms questions in FAANG, Google, Amazon, Microsoft interviews. Includes LeetCode problems, patterns, difficulty levels, and solving strategies for placement success.",
    keywords: [
        "DSA questions for placement",
        "top DSA questions 2025",
        "FAANG interview questions",
        "LeetCode questions for placement",
        "data structures and algorithms interview",
        "Google interview questions",
        "Amazon interview DSA",
        "Microsoft coding interview",
        "placement preparation DSA",
        "coding interview questions",
        "array questions for interview",
        "dynamic programming questions",
        "binary tree questions",
        "graph questions for placement",
        "two pointer questions",
        "sliding window questions",
        "linked list interview questions",
        "stack queue interview",
        "backtracking questions",
        "greedy algorithm questions",
        "TCS interview questions",
        "Infosys coding questions",
        "Wipro interview DSA",
        "freshers placement DSA",
        "campus placement preparation"
    ],
    authors: [{ name: "prep4place Team" }],
    openGraph: {
        title: "Top 50 DSA Questions for Placements 2025 - Complete Guide",
        description: "Master the 50 most frequently asked DSA questions in FAANG interviews. Includes patterns, difficulty levels, and solving strategies.",
        type: "article",
        url: "https://prep4place.com/blog/top-50-dsa-questions-for-placements-2025",
        publishedTime: "2025-01-18T00:00:00.000Z",
        modifiedTime: "2025-01-18T00:00:00.000Z",
        authors: ["prep4place Team"],
        tags: ["DSA", "Placement", "Interview", "FAANG", "LeetCode", "Coding Interview"],
        images: [
            {
                url: "https://prep4place.com/blog/dsa-banner.png",
                width: 1200,
                height: 630,
                alt: "Top 50 DSA Questions for Placements 2025",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Top 50 DSA Questions for Placements 2025",
        description: "Master the 50 most frequently asked DSA questions in FAANG interviews. Complete guide with patterns and strategies.",
        creator: "@prep4place",
        images: ["https://prep4place.com/blog/dsa-banner.png"],
    },
    alternates: {
        canonical: "https://prep4place.com/blog/top-50-dsa-questions-for-placements-2025",
    },
};

// Structured data for SEO (JSON-LD)
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Top 50 DSA Questions You Must Solve for Placements in 2025",
    description: "A comprehensive guide to the most frequently asked Data Structures and Algorithms questions in technical interviews at FAANG, startups, and product companies.",
    image: "https://prep4place.com/blog/dsa-banner.png",
    datePublished: "2025-01-18T00:00:00.000Z",
    dateModified: "2025-01-18T00:00:00.000Z",
    author: {
        "@type": "Organization",
        name: "prep4place",
        url: "https://prep4place.com"
    },
    publisher: {
        "@type": "Organization",
        name: "prep4place",
        logo: {
            "@type": "ImageObject",
            url: "https://prep4place.com/logo-bauhaus.png"
        }
    },
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://prep4place.com/blog/top-50-dsa-questions-for-placements-2025"
    }
};

export default function BlogPostPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPostContent />
        </>
    );
}
