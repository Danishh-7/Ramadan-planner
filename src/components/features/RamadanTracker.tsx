'use client';

import React, { useState } from 'react';
import { useRamadanStore, PrayerStatus, DailyPrayers } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, CheckCircle2, Moon, Sun, Star } from 'lucide-react';

const prayerList = [
    { key: 'fajr', label: 'Fajr', icon: Moon },
    { key: 'dhuhr', label: 'Dhuhr', icon: Sun },
    { key: 'asr', label: 'Asr', icon: Sun },
    { key: 'maghrib', label: 'Maghrib', icon: Sun },
    { key: 'isha', label: 'Isha', icon: Moon },
    { key: 'taraweeh', label: 'Taraweeh', icon: Moon },
];

export const RamadanTracker: React.FC = () => {
    const { currentDay, prayers: prayerData, updatePrayerStatus, ramadanStartDate } = useRamadanStore();
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const dayPrayers = prayerData[selectedDay] || {} as any;

    const getStatusColor = (status: PrayerStatus | boolean) => {
        if (typeof status === 'boolean') return status ? 'bg-completed' : 'bg-muted/30';
        switch (status) {
            case 'completed': return 'bg-completed';
            case 'missed': return 'bg-missed';
            case 'qadha': return 'bg-qadha';
            default: return 'bg-muted/30';
        }
    };

    const getNextStatus = (current: PrayerStatus): PrayerStatus => {
        if (!current) return 'completed';
        if (current === 'completed') return 'missed';
        if (current === 'missed') return 'qadha';
        return null;
    };

    const isFriday = (day: number) => {
        const start = new Date(ramadanStartDate);
        const target = new Date(start);
        target.setDate(start.getDate() + (day - 1));
        return target.getDay() === 5;
    };

    const ashra = selectedDay <= 10 ? 'Mercy' : selectedDay <= 20 ? 'Forgiveness' : 'Salvation';

    return (
        <div className="space-y-10 animate-fade-in pb-12 font-serif">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Spiritual Journal</h1>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-border" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">{ashra} Ashra</span>
                    <div className="h-px w-8 bg-border" />
                </div>
            </div>

            <div className="flex items-center justify-center gap-8 bg-card/40 p-6 rounded-[2.5rem] notebook-border mx-auto max-w-sm">
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))} disabled={selectedDay === 1} className="rounded-full w-10 h-10 p-0"><ChevronLeft className="w-6 h-6" /></Button>
                <div className="text-center">
                    <h2 className="text-3xl font-black italic">Day {selectedDay}</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))} disabled={selectedDay === 30} className="rounded-full w-10 h-10 p-0"><ChevronRight className="w-6 h-6" /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card glass className="p-8 rounded-[3rem] notebook-border space-y-8">
                    <h3 className="text-2xl font-black italic border-b-2 border-dotted border-border pb-4">Daily Prayers</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {prayerList.map((prayer) => {
                            const status = dayPrayers[prayer.key as keyof DailyPrayers];
                            return (
                                <button
                                    key={prayer.key}
                                    onClick={() => updatePrayerStatus(selectedDay, prayer.key as keyof DailyPrayers, getNextStatus(status as PrayerStatus))}
                                    className={`p-6 rounded-[2rem] transition-all transform hover:scale-105 border-2 ${status ? 'border-transparent' : 'border-border/30'} ${getStatusColor(status as PrayerStatus)} ${status ? 'text-white shadow-lg' : 'text-muted-foreground'}`}
                                >
                                    <prayer.icon className={`w-6 h-6 mx-auto mb-2 ${status ? 'opacity-100' : 'opacity-20'}`} />
                                    <div className="font-black text-sm uppercase tracking-widest">{prayer.label}</div>
                                </button>
                            );
                        })}
                    </div>
                </Card>

                <div className="space-y-10">


                    <Card glass className="p-8 rounded-[3rem] bg-primary text-primary-foreground notebook-shadow text-center space-y-4">
                        <Star className="w-10 h-10 mx-auto text-secondary fill-secondary animate-pulse" />
                        <p className="text-lg font-bold italic">"Whoever fasts Ramadan out of faith and in the hope of reward, his previous sins will be forgiven."</p>
                        <p className="text-xs font-black uppercase tracking-widest text-secondary/60">Hadith Bukhari</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
