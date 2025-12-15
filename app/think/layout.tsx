
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Think & Solve | DSA Share",
    description: "Visualize, brainstorm, and solve complex problems.",
};

export default function ThinkLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full flex flex-col">
            {children}
        </div>
    );
}
