'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Star, Send, CheckCircle, Loader2, User, Mail, MessageCircle, X } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
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
        { value: 'general', label: 'General', icon: '💬' },
        { value: 'bug', label: 'Bug', icon: '🐛' },
        { value: 'feature', label: 'Feature', icon: '✨' },
        { value: 'improvement', label: 'Improve', icon: '📈' },
        { value: 'other', label: 'Other', icon: '📝' }
    ];

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

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

    const handleClose = () => {
        onClose();
        // Reset form after animation completes
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', rating: 0, feedbackType: 'general', message: '' });
            setError('');
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border/50 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {isSubmitted ? (
                    /* Success State */
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-primary bg-clip-text text-transparent mb-3">
                            Thank You!
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Your feedback has been submitted successfully. We appreciate your input!
                        </p>
                        <button
                            onClick={handleClose}
                            className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    /* Form State */
                    <div className="p-6 md:p-8">
                        {/* Emotional Header */}
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30 animate-pulse">
                                <span className="text-3xl">💝</span>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-primary bg-clip-text text-transparent mb-2">
                                We&apos;d Love Your Feedback!
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                                Your voice matters to us! Every piece of feedback helps us grow and serve you better.
                                <span className="text-pink-500 font-medium"> Share your thoughts</span> — you&apos;re helping shape the future of this platform! ✨
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name & Email */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                        <User className="w-3.5 h-3.5 text-primary" />
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                        <Mail className="w-3.5 h-3.5 text-primary" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                    <Star className="w-3.5 h-3.5 text-primary" />
                                    Rate your experience
                                </label>
                                <div className="flex gap-1 items-center justify-center py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="p-1 transition-transform duration-200 hover:scale-125"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-all duration-300 ${star <= (hoveredRating || formData.rating)
                                                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                                                    : 'text-muted-foreground/30'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback Type */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                                    Feedback Type
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {feedbackTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, feedbackType: type.value })}
                                            className={`p-2.5 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-1.5 ${formData.feedbackType === type.value
                                                ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
                                                : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
                                                }`}
                                        >
                                            <span className="text-xl">{type.icon}</span>
                                            <span className="text-[10px] font-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                    Your Feedback
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50 resize-none"
                                    placeholder="Share your thoughts..."
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || formData.rating === 0}
                                className="w-full py-3 bg-gradient-to-r from-primary via-primary to-chart-2 text-primary-foreground rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

// Floating Feedback Button Component with Reminder
export function FeedbackButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [showReminder, setShowReminder] = useState(false);

    // Show reminder after 30 seconds if user hasn't seen it recently
    useEffect(() => {
        const lastReminder = localStorage.getItem('feedbackReminderShown');
        const now = Date.now();

        // Don't show if reminder was shown in the last 24 hours
        if (lastReminder && now - parseInt(lastReminder) < 24 * 60 * 60 * 1000) {
            return;
        }

        const timer = setTimeout(() => {
            setShowReminder(true);
        }, 30000); // Show after 30 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleDismissReminder = () => {
        setShowReminder(false);
        localStorage.setItem('feedbackReminderShown', Date.now().toString());
    };

    const handleOpenFeedback = () => {
        setShowReminder(false);
        setIsOpen(true);
        localStorage.setItem('feedbackReminderShown', Date.now().toString());
    };

    return (
        <>
            {/* Reminder Popup */}
            {showReminder && (
                <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-right fade-in duration-500">
                    <div className="bg-card border border-border rounded-2xl shadow-2xl p-5 max-w-xs relative overflow-hidden">
                        {/* Gradient background accent */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-red-500 to-orange-400" />

                        {/* Close button */}
                        <button
                            onClick={handleDismissReminder}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Content */}
                        <div className="flex items-start gap-3 pt-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 flex-shrink-0">
                                <span className="text-xl">💝</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">
                                    Hey there! 👋
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                    Enjoying DSA Pattern Share? Your feedback means the world to us!
                                    <span className="text-pink-500 font-medium"> Share your thoughts</span> and help us make it even better! ✨
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleOpenFeedback}
                                        className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-[1.02]"
                                    >
                                        💬 Give Feedback
                                    </button>
                                    <button
                                        onClick={handleDismissReminder}
                                        className="px-3 py-2 text-muted-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                                    >
                                        Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 text-white rounded-full shadow-lg shadow-pink-500/40 hover:shadow-xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 group animate-pulse hover:animate-none"
                aria-label="Open Feedback Form"
            >
                <span className="text-2xl">💝</span>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-card border border-border rounded-xl text-foreground text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                    <span className="text-pink-500">❤️</span> We&apos;d love your feedback!
                </span>
            </button>

            <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
