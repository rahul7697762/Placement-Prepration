"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { allPatterns, Question } from "@/lib/data";
import { getSolution, upsertSolution, Solution } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2, PlayCircle, ExternalLink, Code2 } from "lucide-react";
import Link from "next/link";

export default function EditSolutionPage() {
    const params = useParams();
    const router = useRouter();
    const questionId = params.questionId as string;

    const [question, setQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [videoUrl, setVideoUrl] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        // Find static question data
        let foundConfig: Question | null = null;
        for (const p of allPatterns) {
            const q = p.questions.find(q => q.id === questionId);
            if (q) {
                foundConfig = q;
                break;
            }
        }
        setQuestion(foundConfig);

        // Fetch existing solution
        async function loadSolution() {
            setLoading(true);
            try {
                const solution = await getSolution(questionId);
                if (solution) {
                    setVideoUrl(solution.video_url || "");
                    setLanguage(solution.language || "javascript");
                    setCodeSnippet(solution.code_snippet || "");
                    setContent(solution.content || "");
                } else {
                    // Initialize with some default templates if empty
                    setContent("## Approach\n\nExplain your approach here...\n\n## Complexity\n\n- Time complexity: O(n)\n- Space complexity: O(1)");
                }
            } catch (err) {
                console.error("Error loading solution", err);
            } finally {
                setLoading(false);
            }
        }

        if (foundConfig) {
            loadSolution();
        } else {
            setLoading(false);
        }
    }, [questionId]);

    const handleSave = async () => {
        if (!questionId) return;

        setSaving(true);
        try {
            const result = await upsertSolution({
                question_id: questionId,
                title: question?.title, // Update title sync
                content,
                video_url: videoUrl,
                code_snippet: codeSnippet,
                language
            });

            if (result) {
                // Success feedback
                alert("Solution saved successfully!"); // Simple fallback
                router.refresh(); // Refresh server data
            } else {
                alert("Failed to save solution.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    if (!question) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Problem Not Found</h1>
                <p className="text-muted-foreground mt-2">The problem ID {questionId} does not exist in our database.</p>
                <div className="mt-4">
                    <Link href="/admin"><Button variant="outline">Back to Dashboard</Button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">{question.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline" className="font-mono">{questionId}</Badge>
                        <a href={question.link} target="_blank" className="flex items-center hover:underline hover:text-primary gap-1">
                            LeetCode <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
                <div className="ml-auto">
                    <Button onClick={handleSave} disabled={saving} className="gap-2 min-w-[120px]">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? "Saving..." : "Save Solution"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content (Left Col) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Solution Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Video Walkthrough URL</Label>
                                <div className="relative">
                                    <PlayCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="https://youtu.be/..."
                                        className="pl-9"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Supports YouTube embeds automatically.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Explanation (Markdown)</Label>
                                <Textarea
                                    className="min-h-[400px] font-mono text-sm leading-relaxed"
                                    placeholder="# Approach..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (Right Col) */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Code2 className="h-5 w-5" />
                                Code Implementation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="java">Java</SelectItem>
                                        <SelectItem value="cpp">C++</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Code Snippet</Label>
                                <Textarea
                                    className="min-h-[300px] font-mono text-xs bg-slate-950 text-slate-50 border-slate-800"
                                    placeholder="// Write your solution here..."
                                    value={codeSnippet}
                                    onChange={(e) => setCodeSnippet(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                        <CardContent className="p-4">
                            <h4 className="font-semibold text-sm mb-2">Tips</h4>
                            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                                <li>Use concise markdown for explanations.</li>
                                <li>Always verify the code snippet runs.</li>
                                <li>Video is optional but recommended.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Simple Badge Component if not available
function Badge({ variant = "default", className, ...props }: any) {
    return <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className} border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80`} {...props} />
}
