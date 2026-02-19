'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Send, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'Suggestion',
        message: ''
    });

    // Instructions for the user:
    // 1. Go to https://formspree.io/
    // 2. Create a new form (free)
    // 3. Replace the URL below with your unique Formspree Endpoint
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
                    onClose();
                    setStatus('idle');
                    setFormData({ name: '', email: '', type: 'Suggestion', message: '' });
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Feedback Error:', error);
            setStatus('error');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Send Feedback" size="md">
            {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black italic text-[#4a342e]">Thank You!</h3>
                    <p className="text-muted-foreground font-bold">Your feedback has been sent successfully.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 pt-4 font-serif">
                    <div className="bg-[#fdfcf0] border-2 border-[#4a342e]/10 p-4 rounded-2xl flex gap-3 text-sm text-[#4a342e]/80">
                        <div className="bg-primary/10 p-2 rounded-full h-fit"><AlertCircle className="w-4 h-4 text-primary" /></div>
                        <p className="font-bold leading-relaxed">
                            Have a suggestion or found a bug? Let us know! We read every message to improve your Ramadan experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name (Optional)</label>
                            <input
                                type="text"
                                placeholder="Brother/Sister"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email (Optional)</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-5 py-3 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold bg-background"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Feedback Type</label>
                        <div className="flex bg-muted/20 p-1.5 rounded-xl gap-2">
                            {['Suggestion', 'Bug Report', 'Other'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${formData.type === type ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted/50'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Tell us what's on your mind..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-5 py-4 rounded-xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold resize-none bg-background"
                        />
                    </div>

                    {status === 'error' && (
                        <p className="text-xs font-black uppercase tracking-widest text-red-500 text-center bg-red-50 p-2 rounded-lg">
                            Something went wrong. Please try again.
                        </p>
                    )}

                    <div className="flex gap-4 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={status === 'submitting'}
                            className="flex-1 py-4 rounded-xl font-black text-muted-foreground hover:bg-muted/20"
                        >
                            CANCEL
                        </Button>
                        <Button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="flex-[2] py-4 rounded-xl font-black shadow-lg shadow-primary/20"
                        >
                            {status === 'submitting' ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> SENDING...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send className="w-4 h-4" /> SEND FEEDBACK
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};
