import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Online Compiler - Code in Python, C++, Java & More",
    description: "Practice coding instantly with our zero-setup online IDE. Support for Python, C++, Java, JavaScript and more. Perfect for coding interview practice and DSA problem solving.",
    keywords: [
        "online compiler",
        "online IDE",
        "Python compiler online",
        "C++ compiler online",
        "Java compiler online",
        "JavaScript compiler",
        "code editor online",
        "run code online",
        "coding practice",
        "DSA problem solving",
    ],
    alternates: {
        canonical: "/compiler",
    },
    openGraph: {
        title: "Online Compiler - Code in Python, C++, Java & More | prep4place",
        description: "Practice coding instantly with our zero-setup online IDE. Support for multiple languages.",
        type: "website",
        url: "https://prep4place.com/compiler",
        images: [
            {
                url: "https://prep4place.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "prep4place Online Compiler",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Online Compiler - Code in Python, C++, Java & More",
        description: "Practice coding instantly with our zero-setup online IDE.",
        images: ["https://prep4place.com/og-image.png"],
    },
};

export default function CompilerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
