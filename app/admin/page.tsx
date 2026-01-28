"use client";

import { useEffect, useState } from "react";
import { allPatterns, Pattern, Question } from "@/lib/data";
import { getAllSolutions, Solution } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Search, Edit, Eye, Filter } from "lucide-react";
import Link from "next/link";

// Flatten questions for easier filtering
type FlatQuestion = Question & {
    patternId: string;
    patternTitle: string;
    hasSolution: boolean;
    solutionId?: string;
    updatedAt?: string;
};

export default function AdminDashboard() {
    const [questions, setQuestions] = useState<FlatQuestion[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<FlatQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // all, solved, missing
    const [patternFilter, setPatternFilter] = useState("all");

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // Fetch solutions statuses
                const solutions = await getAllSolutions();
                const solutionMap = new Map();
                solutions.forEach(s => {
                    if (s.question_id) solutionMap.set(s.question_id, s);
                });

                // Flatten detailed list
                const flatList: FlatQuestion[] = [];
                allPatterns.forEach(p => {
                    p.questions.forEach(q => {
                        const sol = solutionMap.get(q.id);
                        flatList.push({
                            ...q,
                            patternId: p.id,
                            patternTitle: p.title,
                            hasSolution: !!sol,
                            solutionId: sol?.id,
                            updatedAt: sol?.updated_at
                        });
                    });
                });

                setQuestions(flatList);
                setFilteredQuestions(flatList);
            } catch (err) {
                console.error("Failed to load admin data", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Apply filters
    useEffect(() => {
        let result = questions;

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(q =>
                q.title.toLowerCase().includes(lowerSearch) ||
                q.id.toLowerCase().includes(lowerSearch)
            );
        }

        if (statusFilter !== "all") {
            const wantSolved = statusFilter === "solved";
            result = result.filter(q => q.hasSolution === wantSolved);
        }

        if (patternFilter !== "all") {
            result = result.filter(q => q.patternId === patternFilter);
        }

        setFilteredQuestions(result);
    }, [search, statusFilter, patternFilter, questions]);

    const stats = {
        total: questions.length,
        solved: questions.filter(q => q.hasSolution).length,
        missing: questions.filter(q => !q.hasSolution).length
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Solution Manager</h1>
                    <p className="text-muted-foreground mt-1">Manage solutions for {stats.total} LeetCode problems across {allPatterns.length} patterns.</p>
                </div>
                <div className="flex gap-2">
                    <Card className="px-4 py-2 bg-green-50 border-green-200">
                        <div className="text-xs text-green-600 font-semibold uppercase">Solved</div>
                        <div className="text-2xl font-bold text-green-700">{stats.solved}</div>
                    </Card>
                    <Card className="px-4 py-2 bg-orange-50 border-orange-200">
                        <div className="text-xs text-orange-600 font-semibold uppercase">Missing</div>
                        <div className="text-2xl font-bold text-orange-700">{stats.missing}</div>
                    </Card>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or ID..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="solved">Solved</SelectItem>
                        <SelectItem value="missing">Missing Solution</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={patternFilter} onValueChange={setPatternFilter}>
                    <SelectTrigger className="w-full md:w-[240px]">
                        <SelectValue placeholder="Filter by Pattern" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Patterns</SelectItem>
                        {allPatterns.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="text-center py-20 text-muted-foreground">Loading specific data...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredQuestions.map(q => (
                        <div key={q.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow group">
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${q.hasSolution ? 'bg-green-500' : 'bg-orange-300'}`} />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">{q.id}</span>
                                        <h3 className="font-semibold text-sm md:text-base">{q.title}</h3>
                                        <Badge variant="outline" className={`text-[10px] h-5 ${q.difficulty === 'Easy' ? 'text-green-600 bg-green-50' : q.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'}`}>
                                            {q.difficulty}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                        <span>{q.patternTitle}</span>
                                        {q.updatedAt && (
                                            <>
                                                <span>•</span>
                                                <span>Updated {new Date(q.updatedAt).toLocaleDateString()}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={`/admin/solution/${q.id}`}>
                                    <Button size="sm" variant={q.hasSolution ? "outline" : "default"} className="h-8 gap-1.5">
                                        {q.hasSolution ? (
                                            <>
                                                <Edit className="h-3.5 w-3.5" />
                                                Edit
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-3.5 w-3.5 flex items-center justify-center font-bold text-xs">+</div>
                                                Add
                                            </>
                                        )}
                                    </Button>
                                </Link>
                                {q.hasSolution && (
                                    <Link href={q.link} target="_blank">
                                        {/* Ideally this links to our internal page but for now sticking to external until that page is ready */}
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                            <p className="text-muted-foreground">No problems found matching filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
