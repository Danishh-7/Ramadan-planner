'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Send, Loader2, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';

export const FeedbackView: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'Suggestion',
        message: ''
    });

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzbbgeq';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.message.trim()) return;

        setStatus('submitting');

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    setStatus('idle');
                    setFormData({ name: '', email: '', type: 'Suggestion', message: '' });
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Feedback Error:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in font-serif">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-100/50">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-black italic text-foreground">Thank You!</h3>
                    <p className="text-muted-foreground font-bold text-lg max-w-md mx-auto">
                        Your feedback has been sent successfully. We appreciate your contribution to the Ramadan Planner.
                    </p>
                </div>
                <Button
                    onClick={() => setStatus('idle')}
                    className="mt-8 rounded-2xl px-8 py-4 font-black"
                >
                    SEND ANOTHER RESPONSE
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-serif max-w-4xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Feedback & Support</h1>
                <p className="text-muted-foreground font-bold text-lg uppercase tracking-widest">
                    "Help us improve your experience"
                </p>
            </div>

            <Card className="p-8 md:p-12 rounded-[3rem] notebook-border space-y-8 shadow-xl bg-[#E8E0D5]/90 backdrop-blur-sm">
                <div className="bg-[#4a342e]/5 border-2 border-[#4a342e]/10 p-6 rounded-[2rem] flex items-start gap-4 text-[#4a342e]">
                    <div className="bg-primary/10 p-3 rounded-full shrink-0">
                        <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-black text-lg text-muted-foreground">We value your input</h3>
                        <p className="font-medium leading-relaxed opacity-80 text-muted-foreground">
                            Have a suggestion, found a bug, or just want to say salam? Let us know! We read every message to make the Ramadan Planner better for everyone.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Your Name (Optional)</label>
                            <input
                                type="text"
                                placeholder="Brother/Sister"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold bg-background/50 hover:bg-background"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Email (Optional)</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold bg-background/50 hover:bg-background"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Feedback Type</label>
                        <div className="flex bg-muted/20 p-2 rounded-2xl gap-2">
                            {['Suggestion', 'Bug Report', 'Other'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`flex-1 py-4 rounded-xl text-sm font-black transition-all ${formData.type === type ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted/50'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Message</label>
                        <textarea
                            required
                            rows={6}
                            placeholder="Tell us what's on your mind..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-6 py-5 rounded-2xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold resize-none bg-background/50 hover:bg-background leading-relaxed"
                        />
                    </div>

                    {status === 'error' && (
                        <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 p-4 rounded-2xl border-2 border-red-100">
                            <AlertCircle className="w-4 h-4" />
                            Something went wrong. Please try again later.
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-6 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                        {status === 'submitting' ? (
                            <span className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" /> SENDING...
                            </span>
                        ) : (
                            <span className="flex items-center gap-3">
                                <Send className="w-5 h-5" /> SEND FEEDBACK
                            </span>
                        )}
                    </Button>
                </form>
            </Card>
        </div>
    );
};
