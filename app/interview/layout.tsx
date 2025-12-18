import { InterviewProvider } from "@/contexts/InterviewContext";

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
