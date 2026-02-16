'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { BookOpen, Star, Sparkles } from 'lucide-react';

export const QuranTracker: React.FC = () => {
    const { juzCompleted, toggleJuz, dailyPages, updateDailyPages, currentDay, khatamPlan, setKhatamPlan } = useRamadanStore();
    const [showKhatamModal, setShowKhatamModal] = useState(false);
    const [customPages, setCustomPages] = useState(khatamPlan.pagesPerDay.toString());

    const completedJuzCount = juzCompleted.filter(Boolean).length;
    const totalPagesRead = Object.values(dailyPages).reduce((sum, pages) => sum + (pages || 0), 0);

    return (
        <div className="space-y-12 animate-fade-in pb-12 font-serif">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Quran Journey</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Light for the soul and guidance for mankind</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 rounded-[3rem] notebook-border flex flex-col items-center text-center space-y-6 bg-white shadow-xl">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-6xl font-black italic text-[#4a342e]">{completedJuzCount}</div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8d6e63]">Juz Completed</p>
                    </div>
                    <ProgressBar value={completedJuzCount} max={30} color="primary" className="h-4" />
                </Card>

                <Card className="p-10 rounded-[3rem] notebook-border flex flex-col items-center text-center space-y-6 bg-[#fdfcf0] shadow-xl">
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-6xl font-black italic text-[#4a342e]">{totalPagesRead}</div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8d6e63]">Total Pages Read</p>
                    </div>
                    <ProgressBar value={totalPagesRead} max={604} color="secondary" className="h-4" />
                </Card>
            </div>

            <Card className="bg-[#4a342e] text-white p-10 rounded-[3rem] notebook-shadow space-y-8 border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BookOpen className="w-40 h-40" />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-8 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-3xl font-black italic text-secondary/90">Daily Progress</h3>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Recommended: {khatamPlan.pagesPerDay} pages today</p>
                    </div>
                    <div className="flex items-center gap-6  p-4">
                        <span className="font-black text-xl text-black  bg-green-500 px-2 py-1 rounded">
                            PAGES READ:
                        </span>

                        <input
                            type="number"
                            value={dailyPages[currentDay] || 0}
                            onChange={(e) =>
                                updateDailyPages(currentDay, parseInt(e.target.value) || 0)
                            }
                            className="w-28 bg-white-500/10 border-2 border-black rounded-2xl px-4 py-5 text-4xl font-black text-center text-black focus:ring-2 focus:ring-secondary outline-none focus:bg-white/20 transition-all"
                        />
                    </div>

                </div>
                <div className="flex justify-center relative z-10">
                    <Button variant="ghost" className="text-secondary border-2 border-secondary/20 hover:bg-secondary/10 px-8 py-6 rounded-2xl font-black tracking-widest text-xs" onClick={() => setShowKhatamModal(true)}>ADJUST KHATAM PLAN</Button>
                </div>
            </Card>

            <div className="space-y-8">
                <h3 className="text-3xl font-black italic text-center text-[#4a342e]">Juz Registry</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                        <button
                            key={juz}
                            onClick={() => toggleJuz(juz)}
                            className={`aspect-square rounded-2xl font-black text-xl transition-all shadow-md transform hover:scale-105 active:scale-95 ${juzCompleted[juz - 1] ? 'bg-completed text-white shadow-completed/20 border-2 border-white/30' : 'bg-white text-[#8d6e63] border-2 border-dashed border-border/50 hover:bg-[#fdfcf0]'}`}
                        >
                            {juz}
                        </button>
                    ))}
                </div>
            </div>

            <Modal isOpen={showKhatamModal} onClose={() => setShowKhatamModal(false)} title="Khatam Planning" size="sm">
                <div className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Target Pages Per Day</label>
                        <input type="number" value={customPages} onChange={(e) => setCustomPages(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-border font-black text-2xl focus:border-primary focus:outline-none" />
                    </div>
                    <div className="bg-muted p-6 rounded-2xl space-y-2 border-2 border-dashed border-border/40">
                        <p className="font-bold">Reading <span className="text-primary">{customPages}</span> pages/day</p>
                        <p className="text-sm text-muted-foreground font-medium">Will take approx <strong>{Math.ceil(604 / (parseInt(customPages) || 1))}</strong> days to finish.</p>
                    </div>
                    <Button onClick={() => { setKhatamPlan(604, parseInt(customPages) || 20); setShowKhatamModal(false); }} className="w-full py-6 rounded-2xl font-black">SAVE PLAN</Button>
                </div>
            </Modal>
        </div>
    );
};
