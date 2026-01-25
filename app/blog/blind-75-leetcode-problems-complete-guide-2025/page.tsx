import { Metadata } from "next";
import BlogPostContent from "./content";

export const metadata: Metadata = {
    title: "Blind 75 LeetCode Problems: Complete Interview Prep Guide 2025 | prep4place",
    description: "Master the Blind 75 LeetCode problems - the most popular curated list for technical interviews at FAANG, Google, Amazon, Microsoft. Includes all 75 problems organized by category with solutions, patterns, and difficulty levels.",
    keywords: [
        "Blind 75",
        "Blind 75 LeetCode",
        "Blind 75 problems",
        "LeetCode Blind 75 list",
        "Blind 75 solutions",
        "coding interview preparation",
        "FAANG interview questions",
        "LeetCode interview prep",
        "technical interview questions",
        "Google interview prep",
        "Amazon coding interview",
        "Microsoft interview questions",
        "Meta interview prep",
        "software engineer interview",
        "data structures and algorithms",
        "DSA interview questions",
        "array leetcode problems",
        "tree interview questions",
        "graph problems leetcode",
        "dynamic programming interview",
        "blind 75 study plan",
        "leetcode patterns",
        "coding interview bootcamp",
        "SDE interview preparation",
        "tech interview guide",
        "leetcode study guide",
        "best leetcode problems",
        "must solve leetcode problems",
        "top coding interview questions",
        "placement preparation",
        "campus placement  DSA"
    ],
    authors: [{ name: "prep4place Team" }],
    openGraph: {
        title: "Blind 75 LeetCode Problems: Complete Guide 2025",
        description: "Master all 75 essential LeetCode problems for technical interviews. Complete guide with categorized problems, patterns, and study plans for FAANG success.",
        type: "article",
        url: "https://prep4place.com/blog/blind-75-leetcode-problems-complete-guide-2025",
        publishedTime: "2025-01-25T00:00:00.000Z",
        modifiedTime: "2025-01-25T00:00:00.000Z",
        authors: ["prep4place Team"],
        tags: ["Blind 75", "LeetCode", "Interview Prep", "FAANG", "Coding Interview", "DSA"],
        images: [
            {
                url: "https://prep4place.com/blog/blind-75-banner.png",
                width: 1200,
                height: 630,
                alt: "Blind 75 LeetCode Problems Complete Guide 2025",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blind 75 LeetCode Problems: Complete Interview Guide",
        description: "Master all 75 essential LeetCode problems for FAANG interviews. Complete guide with patterns, study plans, and categorized problems.",
        creator: "@prep4place",
        images: ["https://prep4place.com/blog/blind-75-banner.png"],
    },
    alternates: {
        canonical: "https://prep4place.com/blog/blind-75-leetcode-problems-complete-guide-2025",
    },
};

// Structured data for SEO (JSON-LD)
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Blind 75 LeetCode Problems: Complete Interview Preparation Guide 2025",
    description: "A comprehensive guide to the Blind 75 LeetCode problems - the most efficient curated list for mastering coding interviews at top tech companies including FAANG.",
    image: "https://prep4place.com/blog/blind-75-banner.png",
    datePublished: "2025-01-25T00:00:00.000Z",
    dateModified: "2025-01-25T00:00:00.000Z",
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
            url: "https://prep4place.com/logo.png"
        }
    },
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://prep4place.com/blog/blind-75-leetcode-problems-complete-guide-2025"
    },
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Array & Hashing Problems",
            description: "Essential array manipulation and hash table problems"
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Two Pointers",
            description: "Efficient two pointer technique problems"
        },
        {
            "@type": "ListItem",
            position: 3,
            name: "Trees & Graphs",
            description: "Binary tree and graph traversal problems"
        },
        {
            "@type": "ListItem",
            position: 4,
            name: "Dynamic Programming",
            description: "Classic DP patterns for optimization problems"
        }
    ]
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
