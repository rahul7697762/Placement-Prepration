import { Metadata } from "next";
import { InterviewProvider } from "@/contexts/InterviewContext";

export const metadata: Metadata = {
    title: "AI Mock Interview - Practice with AI Interviewer",
    description: "Practice your technical interview skills with our AI-powered interviewer. Get real-time feedback on technical knowledge, communication skills, and body language. Perfect for placement preparation.",
    keywords: [
        "AI mock interview",
        "interview practice",
        "technical interview preparation",
        "mock interview AI",
        "interview feedback",
        "placement interview practice",
        "coding interview practice",
        "FAANG interview preparation",
        "AI interviewer",
        "interview skills training",
    ],
    alternates: {
        canonical: "/interview",
    },
    openGraph: {
        title: "AI Mock Interview - Practice with AI Interviewer | prep4place",
        description: "Practice your technical interview skills with AI. Get real-time feedback on technical knowledge and communication.",
        type: "website",
        url: "https://prep4place.com/interview",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place AI Mock Interview",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "AI Mock Interview - Practice with AI Interviewer",
        description: "Practice technical interviews with AI and get real-time feedback.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

export default function InterviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <InterviewProvider>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                {children}
            </div>
        </InterviewProvider>
    );
}

