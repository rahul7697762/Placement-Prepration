// JSON-LD Structured Data for SEO
// This helps Google understand your website better and enables rich snippets

export interface OrganizationSchema {
    name: string;
    url: string;
    logo: string;
    description: string;
    sameAs?: string[];
}

export interface WebsiteSchema {
    name: string;
    url: string;
    description: string;
    potentialAction?: {
        target: string;
        queryInput: string;
    };
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface BreadcrumbItem {
    name: string;
    url: string;
}

export interface ArticleSchema {
    headline: string;
    description: string;
    image: string;
    author: string;
    datePublished: string;
    dateModified?: string;
}

export interface CourseSchema {
    name: string;
    description: string;
    provider: string;
}

// Organization Schema
export function generateOrganizationSchema(org: OrganizationSchema): object {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: org.name,
        url: org.url,
        logo: org.logo,
        description: org.description,
        sameAs: org.sameAs || [],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            availableLanguage: ["English", "Hindi"],
        },
    };
}

// Website Schema with Search Action
export function generateWebsiteSchema(site: WebsiteSchema): object {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: site.name,
        url: site.url,
        description: site.description,
        potentialAction: site.potentialAction
            ? {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: site.potentialAction.target,
                },
                "query-input": site.potentialAction.queryInput,
            }
            : undefined,
    };
}

// FAQ Schema for rich snippets
export function generateFAQSchema(faqs: FAQItem[]): object {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

// Breadcrumb Schema for navigation
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

// Article Schema for blog posts
export function generateArticleSchema(article: ArticleSchema): object {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.headline,
        description: article.description,
        image: article.image,
        author: {
            "@type": "Organization",
            name: article.author,
        },
        publisher: {
            "@type": "Organization",
            name: "prep4place",
            logo: {
                "@type": "ImageObject",
                url: "https://prep4place.com/logo-bauhaus.png",
            },
        },
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
    };
}

// Educational Course Schema
export function generateCourseSchema(course: CourseSchema): object {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.name,
        description: course.description,
        provider: {
            "@type": "Organization",
            name: course.provider,
            url: "https://prep4place.com",
        },
        isAccessibleForFree: true,
        educationalLevel: "Beginner to Advanced",
        inLanguage: "en",
    };
}

// Software Application Schema (for tools like Compiler, Resume Builder)
export function generateSoftwareAppSchema(
    name: string,
    description: string,
    category: string
): object {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: name,
        description: description,
        applicationCategory: category,
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250",
        },
    };
}

// Default schemas for prep4place
export const defaultOrganizationSchema = generateOrganizationSchema({
    name: "prep4place",
    url: "https://prep4place.com",
    logo: "https://prep4place.com/logo-bauhaus.png",
    description:
        "Complete placement preparation platform for mastering DSA patterns, system design, resume building, and interview preparation.",
    sameAs: [
        "https://twitter.com/prep4place",
        "https://github.com/prep4place",
        "https://linkedin.com/company/prep4place",
    ],
});

export const defaultWebsiteSchema = generateWebsiteSchema({
    name: "prep4place",
    url: "https://prep4place.com",
    description:
        "Master your placement preparation with DSA patterns, AI mock interviews, resume builder, algorithm visualizer, and more.",
    potentialAction: {
        target: "https://prep4place.com/patterns?q={search_term_string}",
        queryInput: "required name=search_term_string",
    },
});

// Home page FAQs for rich snippets
export const homepageFAQs: FAQItem[] = [
    {
        question: "What is prep4place?",
        answer:
            "prep4place is a complete placement preparation platform that helps you master DSA patterns, practice with AI mock interviews, build ATS-friendly resumes, visualize algorithms, and prepare for technical interviews at top tech companies like Google, Amazon, Microsoft, and more.",
    },
    {
        question: "Is prep4place free to use?",
        answer:
            "Yes! prep4place offers free access to DSA patterns, algorithm visualizer, online compiler, and many other features. Some advanced features may require a premium subscription.",
    },
    {
        question: "How can prep4place help me crack FAANG interviews?",
        answer:
            "prep4place provides curated DSA patterns that cover 95% of coding interview questions, AI-powered mock interviews for practice, resume building tools, and comprehensive roadmaps to guide your preparation systematically.",
    },
    {
        question: "What programming languages are supported in the online compiler?",
        answer:
            "Our online compiler supports Python, C++, Java, JavaScript, and several other popular programming languages. You can practice coding problems directly in your browser without any setup.",
    },
    {
        question: "How does the AI Mock Interview feature work?",
        answer:
            "Our AI Mock Interview uses advanced AI to simulate real technical interviews. It provides questions based on your selected role, tracks your eye contact and body language, and gives detailed feedback on your technical knowledge and communication skills.",
    },
];
