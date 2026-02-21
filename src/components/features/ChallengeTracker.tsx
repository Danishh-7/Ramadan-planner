'use client';

import React from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Trophy, Star, Lock, CheckCircle, Flame, Gift, ShieldAlert } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const ChallengeTracker: React.FC = () => {
    const { challenges, updateChallenge, updateChallengeText, hasanatPoints, currentStreak, currentDay } = useRamadanStore();
    const completedCount = challenges.filter(c => c.completed).length;

    const getBadgeInfo = (points: number) => {
        if (points >= 500) return { name: 'Golden Lantern', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
        if (points >= 200) return { name: 'Silver Star', color: 'text-slate-300', bg: 'bg-slate-300/20' };
        if (points >= 50) return { name: 'Bronze Crescent', color: 'text-amber-600', bg: 'bg-amber-600/20' };
        return { name: 'Seeker', color: 'text-[#8D6E63]', bg: 'bg-[#8D6E63]/20' };
    };

    const badge = getBadgeInfo(hasanatPoints);

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-serif px-4 sm:px-0">
            <div className="text-center space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-2 sm:decoration-4 text-[#4a342e]">30-Day Challenge</h1>
                <p className="text-[#8D6E63] font-bold uppercase tracking-widest text-[10px] sm:text-xs">Transform your soul one day at a time</p>
            </div>

            {/* Gamification Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#4a342e] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Star className="w-24 h-24" /></div>
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 mb-2 z-10">Hasanat Points</div>
                    <div className="text-4xl sm:text-5xl font-black italic text-secondary z-10">{hasanatPoints||0}</div>
                </Card>

                <Card className="bg-white border-2 border-[#4a342e]/10 p-6 rounded-[2rem] shadow-md flex flex-col items-center justify-center min-h-[140px]">
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#8D6E63] mb-2">Noor Streak</div>
                    <div className="flex items-center gap-3">
                        <Flame className={`w-8 h-8 sm:w-10 sm:h-10 ${currentStreak >= 3 ? 'text-orange-500 animate-pulse' : 'text-slate-300'}`} />
                        <div className="text-4xl sm:text-5xl font-black italic text-[#4a342e]">{currentStreak}</div>
                    </div>
                </Card>

                <Card className="bg-white border-2 border-[#4a342e]/10 p-6 rounded-[2rem] shadow-md flex flex-col items-center justify-center min-h-[140px]">
                    <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#8D6E63] mb-2">Current Rank</div>
                    <div className={`px-4 py-2 rounded-xl border-2 border-dashed border-current ${badge.color} ${badge.bg} flex items-center gap-2`}>
                        <ShieldAlert className="w-5 h-5" />
                        <span className="font-black tracking-wider text-sm uppercase">{badge.name}</span>
                    </div>
                </Card>
            </div>

            {/* Traditional Progress */}
            <div className="px-2">
                <div className="flex justify-between text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-3">
                    <span>Journey Progress</span>
                    <span>{completedCount} / 30 Days</span>
                </div>
                <ProgressBar value={completedCount} max={30} color="secondary" className="h-4 sm:h-5 shadow-inner" />
            </div>

            {/* Gamified Advent Calendar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {challenges.map((challenge, idx) => {
                    const isFutured = challenge.day > currentDay;
                    const isToday = challenge.day === currentDay;
                    // Strict sequential lock: cannot do Day N if Day N-1 is not done (excluding Day 1)
                    const prevChallenge = idx > 0 ? challenges[idx - 1] : null;
                    const isLinearlyLocked = prevChallenge ? !prevChallenge.completed && challenge.day >= currentDay : false;
                    const isLocked = isFutured || isLinearlyLocked;

                    return (
                        <div
                            key={challenge.id}
                            onClick={() => {
                                if (!isLocked) {
                                    updateChallenge(challenge.day, challenge.task, !challenge.completed);
                                }
                            }}
                            className={`group relative aspect-square p-4 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden
                                ${isLocked
                                    ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-70 grayscale-[0.5]'
                                    : isToday && !challenge.completed
                                        ? 'bg-white border-secondary shadow-xl shadow-secondary/20 scale-105 cursor-pointer z-10'
                                        : challenge.completed
                                            ? 'bg-[#e8f5e9] border-[#a5d6a7] shadow-inner cursor-pointer'
                                            : 'bg-white border-[#4a342e]/10 hover:border-[#4a342e]/30 shadow-sm hover:shadow-md cursor-pointer'
                                }
                            `}
                        >
                            {/* Day Badge */}
                            <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-colors
                                ${challenge.completed ? 'bg-[#81c784] text-white' : isLocked ? 'bg-slate-200 text-slate-500' : 'bg-[#fdfcf0] text-[#4a342e] border border-[#4a342e]/20'}
                            `}>
                                {challenge.day}
                            </div>

                            {/* Center Content */}
                            <div className="flex flex-col items-center justify-center mt-6 w-full px-2">
                                {isLocked ? (
                                    <>
                                        <Lock className="w-8 h-8 text-slate-300 mb-2" />
                                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Locked</div>
                                    </>
                                ) : challenge.completed ? (
                                    <>
                                        <CheckCircle className="w-10 h-10 text-[#66bb6a] mb-2 drop-shadow-sm" />
                                        <div className="text-[9px] font-black uppercase tracking-widest text-[#4caf50]">Done</div>
                                        <div className="text-[10px] font-bold text-[#81c784] mt-1">+{challenge.points} XP</div>
                                    </>
                                ) : challenge.isMystery ? (
                                    <>
                                        <Gift className="w-10 h-10 text-secondary mb-2 animate-pulse" />
                                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#d4a373]">Mystery</div>
                                        <div className="text-[10px] font-bold text-[#d4a373] mt-1">+{challenge.points} XP</div>
                                    </>
                                ) : (
                                    <>
                                        <textarea
                                            value={challenge.task}
                                            onChange={(e) => {
                                                e.stopPropagation(); // Prevent closing/opening challenge when typing
                                                updateChallengeText(challenge.day, e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full text-[11px] sm:text-xs font-bold text-[#4a342e] leading-snug text-center bg-transparent resize-none outline-none overflow-hidden"
                                            rows={3}
                                            placeholder="Write a custom challenge..."
                                        />
                                        <div className="text-[10px] font-black text-secondary/60 mt-1 uppercase tracking-widest">+{challenge.points} XP</div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
