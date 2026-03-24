import { Metadata } from "next";
import BlogPostContent from "./content";

export const metadata: Metadata = {
    title: "Top 50 Node.js & Express.js Interview Questions & Answers 2025 | prep4place",
    description: "Ace your backend interviews with our complete guide to the top 50 Node.js and Express.js interview questions and answers for 2025. Covers event loop, streams, middleware, REST APIs, async/await, and more.",
    keywords: [
        "Node.js interview questions",
        "Express.js interview questions",
        "Node.js interview questions and answers",
        "Express.js interview questions and answers",
        "Node.js interview questions 2025",
        "backend interview questions",
        "Node.js event loop interview",
        "Express middleware interview questions",
        "Node.js async await interview",
        "Node.js streams interview",
        "REST API interview questions",
        "backend developer interview",
        "Node.js basics interview",
        "Express.js REST API",
        "Node.js advanced interview questions",
        "JavaScript backend interview",
        "server side JavaScript interview",
        "npm interview questions",
        "Node.js promise interview",
        "Express routing interview",
        "Node.js buffer streams",
        "MERN stack interview questions",
        "software engineer backend interview",
        "SDE backend interview prep",
        "placement preparation backend",
        "tech interview Node.js",
        "campus placement Node.js",
        "top Node.js questions for interview",
        "Express.js middleware chain",
        "Node.js cluster module",
    ],
    authors: [{ name: "prep4place Team" }],
    openGraph: {
        title: "Top 50 Node.js & Express.js Interview Questions & Answers 2025",
        description: "Complete backend interview prep guide with 50 Node.js and Express.js questions covering event loop, streams, middleware, async patterns and more.",
        type: "article",
        url: "https://prep4place.com/blog/nodejs-expressjs-interview-questions-2025",
        publishedTime: "2025-03-24T00:00:00.000Z",
        modifiedTime: "2025-03-24T00:00:00.000Z",
        authors: ["prep4place Team"],
        tags: ["Node.js", "Express.js", "Backend", "Interview Prep", "JavaScript", "REST API"],
        images: [
            {
                url: "https://prep4place.com/blog/nodejs-expressjs-banner.png",
                width: 1200,
                height: 630,
                alt: "Top 50 Node.js & Express.js Interview Questions 2025",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Top 50 Node.js & Express.js Interview Questions 2025",
        description: "Complete backend interview prep: 50 Node.js & Express.js Q&A covering event loop, middleware, async patterns, REST APIs and more.",
        creator: "@prep4place",
        images: ["https://prep4place.com/blog/nodejs-expressjs-banner.png"],
    },
    alternates: {
        canonical: "https://prep4place.com/blog/nodejs-expressjs-interview-questions-2025",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Top 50 Node.js & Express.js Interview Questions & Answers 2025",
    description: "A comprehensive guide covering the top 50 Node.js and Express.js interview questions and answers for backend developer interviews in 2025.",
    image: "https://prep4place.com/blog/nodejs-expressjs-banner.png",
    datePublished: "2025-03-24T00:00:00.000Z",
    dateModified: "2025-03-24T00:00:00.000Z",
    author: {
        "@type": "Organization",
        name: "prep4place",
        url: "https://prep4place.com",
    },
    publisher: {
        "@type": "Organization",
        name: "prep4place",
        logo: {
            "@type": "ImageObject",
            url: "https://prep4place.com/logo.png",
        },
    },
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://prep4place.com/blog/nodejs-expressjs-interview-questions-2025",
    },
    about: [
        { "@type": "Thing", name: "Node.js" },
        { "@type": "Thing", name: "Express.js" },
        { "@type": "Thing", name: "Backend Development" },
        { "@type": "Thing", name: "JavaScript" },
    ],
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Node.js Basics",
            description: "Fundamental Node.js concepts including event loop, streams, and module system",
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Async Patterns",
            description: "Promises, async/await, callbacks, and EventEmitter patterns",
        },
        {
            "@type": "ListItem",
            position: 3,
            name: "Express.js Fundamentals",
            description: "Routing, middleware, error handling, and REST API design",
        },
        {
            "@type": "ListItem",
            position: 4,
            name: "Advanced Topics",
            description: "Cluster module, streams, security, performance optimization",
        },
    ],
    mainEntity: {
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is Node.js and how does it work?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Node.js is an open-source, cross-platform JavaScript runtime built on Chrome's V8 engine. It uses an event-driven, non-blocking I/O model making it lightweight and efficient for building scalable network applications.",
                },
            },
            {
                "@type": "Question",
                name: "What is the Event Loop in Node.js?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The Event Loop is the core mechanism that allows Node.js to perform non-blocking I/O operations. It processes callbacks in phases: Timers, Pending Callbacks, Idle/Prepare, Poll, Check, and Close Callbacks.",
                },
            },
            {
                "@type": "Question",
                name: "What is middleware in Express.js?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Middleware in Express.js are functions that have access to the request object, response object, and the next middleware function. They can execute code, modify request/response objects, end the request-response cycle, or call the next middleware.",
                },
            },
        ],
    },
};

export default function NodeExpressBlogPage() {
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
