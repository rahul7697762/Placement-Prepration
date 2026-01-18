import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume Builder - Create ATS-Friendly Resumes",
    description: "Build professional, ATS-optimized resumes that get you shortlisted. Import from PDF or start from scratch with premium templates. Perfect for freshers and experienced professionals.",
    keywords: [
        "resume builder",
        "ATS resume",
        "free resume builder",
        "resume for freshers",
        "professional resume",
        "resume templates",
        "tech resume builder",
        "software engineer resume",
        "placement resume",
        "resume maker online",
    ],
    alternates: {
        canonical: "/resume-builder",
    },
    openGraph: {
        title: "Resume Builder - Create ATS-Friendly Resumes | prep4place",
        description: "Build professional, ATS-optimized resumes that get you shortlisted. Free online resume builder.",
        type: "website",
        url: "https://prep4place.com/resume-builder",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place Resume Builder",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Resume Builder - Create ATS-Friendly Resumes",
        description: "Build professional, ATS-optimized resumes that get you shortlisted.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

export default function ResumeBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
