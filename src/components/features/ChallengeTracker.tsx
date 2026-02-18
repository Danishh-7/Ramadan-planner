'use client';

import React from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { ProgressBar } from '../ui/ProgressBar';
import { Trophy, Star } from 'lucide-react';

export const ChallengeTracker: React.FC = () => {
    const { challenges, updateChallenge, updateChallengeText } = useRamadanStore();
    const completedCount = challenges.filter(c => c.completed).length;

    return (
        <div className="space-y-8 sm:space-y-10 animate-fade-in pb-12 font-serif px-4 sm:px-0">
            <div className="text-center space-y-2 sm:space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-2 sm:decoration-4 text-[#4a342e]">30-Day Challenge</h1>
                <p className="text-[#8D6E63] font-bold uppercase tracking-widest text-[10px] sm:text-xs">Transform your soul one day at a time</p>
            </div>

            <Card className="bg-[#4a342e] text-white p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] notebook-shadow relative overflow-hidden border-none">
                <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                    <Trophy className="w-20 h-20 sm:w-32 sm:h-32" />
                </div>
                <div className="relative z-10 text-center space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <Star className="w-6 h-6 sm:w-8 sm:h-8 text-secondary fill-secondary" />
                        <div className="text-4xl sm:text-5xl md:text-6xl font-black italic text-secondary">{completedCount}/30</div>
                        <Star className="w-6 h-6 sm:w-8 sm:h-8 text-secondary fill-secondary" />
                    </div>
                    <p className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/60">Challenges Completed</p>
                    <ProgressBar value={completedCount} max={30} color="primary" className="h-3 sm:h-4 bg-white/10" />
                </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {challenges.map((challenge) => (
                    <Card
                        key={challenge.id}
                        className={`group p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] notebook-border transition-all duration-300 hover:scale-[1.02] shadow-md ${challenge.completed ? 'bg-[#e8f5e9] border-completed shadow-completed/10' : 'bg-white'}`}
                    >
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl transition-colors shrink-0 shadow-sm ${challenge.completed ? 'bg-completed text-white' : 'bg-[#fdfcf0] text-[#4a342e] border-2 border-border/50'}`}>
                                {challenge.day}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start gap-2">
                                    <Checkbox
                                        checked={challenge.completed}
                                        onChange={(checked) => updateChallenge(challenge.day, challenge.task, checked)}
                                        className="shrink-0 mt-1"
                                    />
                                    <textarea
                                        value={challenge.task}
                                        onChange={(e) => updateChallengeText(challenge.day, e.target.value)}
                                        placeholder={`Add your challenge for day ${challenge.day}`}
                                        rows={2}
                                        className={`w-full bg-transparent border-none focus:ring-0 font-bold p-0 text-xs sm:text-sm transition-all outline-none placeholder:italic placeholder:text-muted-foreground/50 resize-none ${challenge.completed ? 'line-through opacity-50 text-muted-foreground' : 'text-[#4a342e]'}`}
                                    />
                                </div>
                                <div className="h-px w-0 group-hover:w-full bg-[#4a342e]/10 transition-all duration-500" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
