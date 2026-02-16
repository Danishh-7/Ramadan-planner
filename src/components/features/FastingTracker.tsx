'use client';

import React, { useState } from 'react';
import { useRamadanStore, FastingStatus } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Heart, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const FastingTracker: React.FC = () => {
    const { currentDay, fasting, updateFastingStatus } = useRamadanStore();
    const statuses: { value: FastingStatus; label: string; icon: any; color: string; bg: string }[] = [
        { value: 'completed', label: 'Fasted', icon: CheckCircle2, color: 'text-completed', bg: 'bg-completed' },
        { value: 'missed', label: 'Missed', icon: XCircle, color: 'text-missed', bg: 'bg-missed' },
        { value: 'excused', label: 'Excused', icon: AlertCircle, color: 'text-qadha', bg: 'bg-qadha' },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12 font-serif">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Fasting Journal</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Purity of body, mind, and soul</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
                {Array.from({ length: 30 }, (_, i) => {
                    const day = i + 1;
                    const status = fasting[day];
                    const currentStatus = statuses.find(s => s.value === status);
                    const isFuture = day > currentDay;

                    return (
                        <Card
                            key={day}
                            className={`p-4 rounded-[2rem] notebook-border text-center space-y-3 transition-all shadow-md ${isFuture ? 'opacity-30 bg-white/50' : 'hover:scale-105 bg-white'} ${currentStatus ? `shadow-lg border-${currentStatus.bg}` : ''}`}
                        >
                            <div className="text-sm font-black text-[#8d6e63] uppercase opacity-60">Day {day}</div>
                            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center transition-all ${currentStatus ? `${currentStatus.bg} text-white shadow-lg` : 'bg-[#fdfcf0] text-muted-foreground border-2 border-dashed border-border'}`}>
                                {currentStatus ? <currentStatus.icon className="w-6 h-6" /> : <Heart className="w-6 h-6 opacity-40" />}
                            </div>

                            {!isFuture && (
                                <div className="flex flex-col gap-1 pt-2">
                                    {statuses.map(s => (
                                        <button
                                            key={s.value}
                                            onClick={() => updateFastingStatus(day, s.value)}
                                            className={`text-[10px] font-black uppercase tracking-widest py-1.5 rounded-lg transition-all ${status === s.value ? `${s.bg} text-white shadow-sm` : 'hover:bg-muted text-muted-foreground'}`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                    {status && (
                                        <button
                                            onClick={() => updateFastingStatus(day, null)}
                                            className="text-[10px] font-black text-missed/60 hover:text-missed mt-1 p-1 uppercase tracking-tighter"
                                        >
                                            CLEAR
                                        </button>
                                    )}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
