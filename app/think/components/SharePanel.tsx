"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Share2, Send, ThumbsUp, MessageSquare } from 'lucide-react';
import { Comment } from '@/types/thinkSolve';

interface SharePanelProps {
    comments?: Comment[];
}

const DEMO_COMMENTS: Comment[] = [
    {
        id: '1',
        author: 'Alex',
        content: 'Have you considered the case where n is negative?',
        timestamp: 1715400000000,
        reactions: { '👍': 2 },
        resolved: false,
    },
    {
        id: '2',
        author: 'Sarah',
        content: 'The recursion depth might exceed the stack limit here.',
        timestamp: 1715403600000,
        reactions: { '💡': 1 },
        resolved: false,
    },
];

export function SharePanel({ comments = DEMO_COMMENTS }: SharePanelProps) {
    const [newComment, setNewComment] = useState('');
    const [localComments, setLocalComments] = useState<Comment[]>(comments);
    const [isCopied, setIsCopied] = useState(false);

    const handleSend = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            author: 'You', // Placeholder
            content: newComment,
            timestamp: Date.now(),
            reactions: {},
            resolved: false,
        };

        setLocalComments([...localComments, comment]);
        setNewComment('');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-background/50">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
                <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Feedback
                </h3>
                <Button size="sm" variant="secondary" className="gap-2" onClick={handleShare}>
                    <Share2 className="h-3 w-3" />
                    {isCopied ? 'Copied!' : 'Share'}
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    {localComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 group">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{comment.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{comment.author}</span>
                                    <span
                                        className="text-xs text-muted-foreground"
                                        suppressHydrationWarning
                                    >
                                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/90 leading-relaxed">
                                    {comment.content}
                                </p>
                                <div className="flex items-center gap-2 pt-1">
                                    {Object.entries(comment.reactions).map(([emoji, count]) => (
                                        <span key={emoji} className="text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                                            {emoji} {count}
                                        </span>
                                    ))}
                                    <button className="text-xs text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        Reply
                                    </button>
                                    <button className="text-xs text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ThumbsUp className="h-3 w-3 inline mr-1" />
                                        Like
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background mt-auto">
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1"
                    />
                    <Button size="icon" onClick={handleSend} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
