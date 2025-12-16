'use client';

import { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle, Loader2, User, Mail, MessageCircle } from 'lucide-react';

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rating: 0,
        feedbackType: 'general',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const feedbackTypes = [
        { value: 'general', label: 'General Feedback', icon: '💬' },
        { value: 'bug', label: 'Bug Report', icon: '🐛' },
        { value: 'feature', label: 'Feature Request', icon: '✨' },
        { value: 'improvement', label: 'Improvement', icon: '📈' },
        { value: 'other', label: 'Other', icon: '📝' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    timestamp: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setIsSubmitted(true);
        } catch (err) {
            setError('Failed to submit feedback. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse delay-500" />

                    <div className="relative bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-12 text-center shadow-2xl">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-primary bg-clip-text text-transparent mb-4">
                            Thank You!
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md">
                            Your feedback has been submitted successfully. We appreciate you taking the time to help us improve!
                        </p>
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setFormData({ name: '', email: '', rating: 0, feedbackType: 'general', message: '' });
                            }}
                            className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
                        >
                            Submit Another Feedback
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
            </div>

            <div className="max-w-2xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
                        <MessageSquare className="w-4 h-4" />
                        We Value Your Feedback
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-4 bg-clip-text text-transparent">
                            Share Your Thoughts
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                        Help us improve DSA Pattern Share by sharing your valuable feedback, suggestions, or reporting any issues.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name & Email */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <User className="w-4 h-4 text-primary" />
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Mail className="w-4 h-4 text-primary" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Star className="w-4 h-4 text-primary" />
                                How would you rate your experience?
                            </label>
                            <div className="flex gap-2 items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="relative p-1 transition-transform duration-200 hover:scale-125"
                                    >
                                        <Star
                                            className={`w-10 h-10 transition-all duration-300 ${star <= (hoveredRating || formData.rating)
                                                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                                                    : 'text-muted-foreground/30'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-4 text-muted-foreground text-sm">
                                    {formData.rating > 0 && (
                                        <span className="px-3 py-1 bg-primary/10 rounded-full">
                                            {formData.rating === 1 && 'Poor'}
                                            {formData.rating === 2 && 'Fair'}
                                            {formData.rating === 3 && 'Good'}
                                            {formData.rating === 4 && 'Very Good'}
                                            {formData.rating === 5 && 'Excellent'}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Feedback Type */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <MessageCircle className="w-4 h-4 text-primary" />
                                Feedback Type
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {feedbackTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, feedbackType: type.value })}
                                        className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${formData.feedbackType === type.value
                                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                                : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
                                            }`}
                                    >
                                        <span className="text-2xl">{type.icon}</span>
                                        <span className="text-xs font-medium text-center">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Your Feedback
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 placeholder:text-muted-foreground/50 resize-none"
                                placeholder="Share your thoughts, suggestions, or report any issues you've encountered..."
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || formData.rating === 0}
                            className="w-full py-4 bg-gradient-to-r from-primary via-primary to-chart-2 text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Feedback
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer note */}
                <p className="text-center text-muted-foreground text-sm mt-8">
                    Your feedback is anonymous and helps us make DSA Pattern Share better for everyone.
                </p>
            </div>
        </div>
    );
}
