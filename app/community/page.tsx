"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchPosts, createPost, Post } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, ThumbsUp, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function CommunityPage() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const token = await getToken({ template: "supabase" });
            const data = await fetchPosts(token || undefined);
            if (data) {
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!user || !newTitle.trim() || !newContent.trim()) return;

        try {
            setIsSubmitting(true);
            const token = await getToken({ template: "supabase" });

            const postData = {
                title: newTitle,
                content: newContent,
                user_id: user.id,
                author_name: user.fullName || user.username || "Anonymous",
            };

            const newPost = await createPost(postData, token || undefined);

            if (newPost) {
                setPosts([newPost, ...posts]);
                setNewTitle("");
                setNewContent("");
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Failed to create post", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header Section */}
            <div className="bg-card border-b sticky top-16 z-10 backdrop-blur-md bg-card/80">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
                            <p className="text-muted-foreground mt-1">
                                Ask questions, share doubts, and learn together.
                            </p>
                        </div>

                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Ask Question
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Ask a Question</DialogTitle>
                                    <DialogDescription>
                                        Describe your doubt clearly. Other students and mentors can help you out.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Input
                                            id="title"
                                            placeholder="Title (e.g., How does DFS work in a Graph?)"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Textarea
                                            id="content"
                                            placeholder="Describe your problem in detail... (Markdown supported)"
                                            className="min-h-[200px]"
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreatePost} disabled={isSubmitting}>
                                        {isSubmitting ? "Posting..." : "Post Question"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="mt-8 relative max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search discussions..."
                            className="pl-10 h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Posts List */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-muted/30 animate-pulse rounded-lg border" />
                        ))}
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="space-y-4">
                        {filteredPosts.map((post) => (
                            <Link key={post.id} href={`/community/${post.id}`}>
                                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start gap-4">
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {post.title}
                                            </CardTitle>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>{post.author_name}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-3">
                                        <p className="text-muted-foreground line-clamp-2 text-sm">
                                            {post.content}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="text-muted-foreground text-sm gap-6 pt-0">
                                        <div className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{post.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>Reply</span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium mb-1">No discussions yet</h3>
                        <p>Be the first to ask a question!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
