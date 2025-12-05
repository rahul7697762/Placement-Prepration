"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchPostById, fetchComments, createComment, Post, Comment } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, User, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
    const { id } = useParams();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) loadData();
    }, [id, user]);

    const loadData = async () => {
        try {
            const token = await getToken({ template: 'supabase' }) || await getToken();
            const [postData, commentsData] = await Promise.all([
                fetchPostById(id as string, token || undefined),
                fetchComments(id as string, token || undefined)
            ]);

            setPost(postData);
            setComments(commentsData);
        } catch (error) {
            console.error("Failed to load post data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateComment = async () => {
        if (!user || !newComment.trim() || !post) return;

        setIsSubmitting(true);
        try {
            const token = await getToken({ template: 'supabase' }) || await getToken();
            const comment = await createComment({
                post_id: post.id,
                content: newComment,
                user_id: user.id,
                author_name: user.fullName || user.username || "Anonymous"
            }, token || undefined);

            if (comment) {
                setComments([...comments, comment]);
                setNewComment("");
            }
        } catch (error) {
            console.error("Failed to create comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
                <div className="h-8 w-24 bg-muted/30 animate-pulse rounded" />
                <div className="h-64 bg-muted/30 animate-pulse rounded-lg border" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <Link href="/community">
                    <Button variant="link" className="mt-4">Back to Community</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Link href="/community" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Community
                </Link>

                <Card className="mb-8 border-primary/10">
                    <CardHeader className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                                <User className="h-3 w-3" />
                                <span>{post.author_name}</span>
                            </div>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        </div>
                        <CardTitle className="text-2xl sm:text-3xl leading-tight">
                            {post.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-base leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </CardContent>
                    <CardFooter className="border-t bg-muted/5 py-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 text-foreground font-medium">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{post.likes} Likes</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-4 w-4" />
                                <span>{comments.length} Comments</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <MessageSquare className="h-5 w-5" />
                        <h3>Discussion ({comments.length})</h3>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Textarea
                                placeholder="Add to the discussion..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px] mb-2"
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleCreateComment} disabled={isSubmitting || !newComment.trim()}>
                                    {isSubmitting ? (
                                        "Posting..."
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Post Comment
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        {comments.map((comment) => (
                            <Card key={comment.id} className="bg-muted/10 border-none shadow-sm">
                                <CardContent className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <span className="text-primary">{comment.author_name}</span>
                                            <span className="text-muted-foreground font-normal text-xs">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground/90">
                                        {comment.content}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                        {comments.length === 0 && (
                            <p className="text-center text-muted-foreground py-8 italic">
                                No comments yet. Be the first to start the conversation!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
