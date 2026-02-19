'use client';

import React from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { CheckCircle2, BookOpen, Heart, Calendar, Trophy, Zap } from 'lucide-react';
import { ProgressHeart } from '../ui/ProgressHeart';
import { Clock } from '../ui/Clock';

export const Dashboard: React.FC = () => {
    const { currentDay, prayers = {}, fasting = {}, juzCompleted = [], dailyPages = {}, habits = {}, tasks = {} } = useRamadanStore();

    // Calculate stats
    const calculatePrayerStats = () => {
        let completed = 0;
        let total = 0;
        for (let day = 1; day <= currentDay; day++) {
            const dayPrayers = prayers[day];
            if (dayPrayers) {
                const prayerKeys: Array<keyof typeof dayPrayers> = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
                prayerKeys.forEach(p => {
                    total++;
                    if (dayPrayers[p as keyof typeof dayPrayers] === 'completed') completed++;
                });
            } else { total += 5; }
        }
        return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
    };

    const calculateFastingStats = () => {
        let completed = 0;
        for (let day = 1; day <= currentDay; day++) {
            if (fasting[day] === 'completed' || fasting[day] === 'excused') completed++;
        }
        return { completed, total: currentDay, percentage: currentDay > 0 ? (completed / currentDay) * 100 : 0 };
    };

    const calculateQuranStats = () => {
        const completedJuz = juzCompleted.filter(Boolean).length;
        const totalPages = Object.values(dailyPages).reduce((sum, pages) => sum + (pages || 0), 0);
        return { completedJuz, totalPages, percentage: (completedJuz / 30) * 100 };
    };

    const calculateDailyCompletion = (day: number) => {
        const dayPrayers = prayers[day];
        if (!dayPrayers) return 0;
        const prayerKeys: Array<keyof typeof dayPrayers> = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const completedCount = prayerKeys.filter(p => dayPrayers[p as keyof typeof dayPrayers] === 'completed').length;
        const fastingDone = fasting[day] === 'completed' || fasting[day] === 'excused';
        const dayHabits = habits[day] || [];
        const habitCompletedCount = dayHabits.filter(h => h.completed).length;
        const dayTasks = tasks[day] || [];
        const taskCompletedCount = dayTasks.filter(t => t.completed).length;

        const total = 6 + dayHabits.length + dayTasks.length;
        const completed = completedCount + (fastingDone ? 1 : 0) + habitCompletedCount + taskCompletedCount;

        return total > 0 ? (completed / total) : 0;
    };

    const calculateStreak = () => {
        let streak = 0;
        for (let day = currentDay; day >= 1; day--) {
            if (calculateDailyCompletion(day) >= 0.7) streak++;
            else break;
        }
        return streak;
    };

    const prayerStats = calculatePrayerStats();
    const fastingStats = calculateFastingStats();
    const quranStats = calculateQuranStats();
    const currentStreak = calculateStreak();
    const overallProgress = Math.round((prayerStats.percentage + fastingStats.percentage + quranStats.percentage) / 3);

    return (
        <div className="space-y-12 animate-fade-in pb-12 font-serif">
            <div className="text-center space-y-3">
                <h1 className="text-6xl font-black italic tracking-tighter text-foreground decoration-[#ffcc80] decoration-8 underline-offset-8">Progress Centre</h1>
                <p className="text-muted-foreground font-bold text-lg uppercase tracking-widest">
                    "Step by step towards spiritual growth"
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* 1. Progress Heart */}
                <div className="relative p-6 notebook-border rounded-[3rem] bg-card shadow-2xl flex flex-col justify-center min-h-[320px]">
                    <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none" />
                    <ProgressHeart />
                </div>

                {/* 2. Spiritual Growth Stats */}
                <Card className="p-8 rounded-[2.5rem] notebook-shadow bg-card shadow-xl flex flex-col justify-between min-h-[380px]">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black italic text-card-foreground">Spiritual Growth</h2>
                            <div className="text-2xl font-black text-primary">{overallProgress}%</div>
                        </div>
                        <ProgressBar value={overallProgress} color="primary" showPercentage={false} className="h-6 rounded-full border-4 border-background shadow-inner" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1 items-end mt-4">
                        <div className="bg-primary text-primary-foreground p-5 rounded-3xl space-y-1 shadow-lg relative overflow-hidden h-32 flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Zap className="w-12 h-12" />
                            </div>
                            <div className="flex items-center gap-2 opacity-60">
                                <Zap className="w-4 h-4 text-secondary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Streak</span>
                            </div>
                            <div className="text-3xl font-black">{currentStreak} Days</div>
                        </div>
                        <div className="bg-background border-2 border-border p-5 rounded-3xl space-y-1 shadow-md relative overflow-hidden h-32 flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <Calendar className="w-12 h-12" />
                            </div>
                            <div className="flex items-center gap-2 opacity-60">
                                <Calendar className="w-4 h-4 text-foreground" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Current</span>
                            </div>
                            <div className="text-3xl font-black text-foreground">{currentDay}<span className="text-xl opacity-30">/30</span></div>
                        </div>
                    </div>
                </Card>

                {/* 3. Clock */}
                <div className="h-full min-h-[380px]">
                    <Clock />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Prayers', icon: CheckCircle2, val: prayerStats.completed, total: prayerStats.total, perc: prayerStats.percentage, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
                    { title: 'Fasts', icon: Heart, val: fastingStats.completed, total: 30, perc: fastingStats.percentage, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
                    { title: 'Quran', icon: BookOpen, val: quranStats.completedJuz, total: 30, perc: quranStats.percentage, color: 'text-completed', bg: 'bg-completed/10', border: 'border-completed/20', unit: 'Juz' }
                ].map((stat, idx) => (
                    <Card key={idx} hover className={`p-8 rounded-[2rem] space-y-6 relative group bg-card shadow-lg border-2 ${stat.border} transition-all hover:translate-y-[-4px]`}>
                        <div className={`absolute top-0 right-0 p-5 ${stat.bg} rounded-bl-[2.5rem] shadow-sm`}>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <div className="pt-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 mb-2">{stat.title} Completion</h3>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-6xl font-black ${stat.color} tracking-tighter`}>{stat.val}</span>
                                <span className="text-muted-foreground font-black text-sm opacity-40">/ {stat.total} {stat.unit || ''}</span>
                            </div>
                        </div>
                        <ProgressBar value={stat.perc} showPercentage={false} className="h-3 rounded-full bg-background" color={stat.title === 'Prayers' ? 'primary' : stat.title === 'Fasts' ? 'secondary' : 'completed'} />
                    </Card>
                ))}
            </div>

            <div className="relative overflow-hidden rounded-[3rem] p-12 text-center bg-primary text-primary-foreground notebook-shadow">
                <div className="absolute bottom-0 right-0 p-4 opacity-5 rotate-12">
                    <Trophy className="w-64 h-64" />
                </div>
                <div className="relative space-y-6 max-w-2xl mx-auto">
                    <p className="text-3xl font-black italic leading-tight">
                        "The best of acts is that which is consistent, even if it is small."
                    </p>
                    <div className="h-px w-20 bg-secondary/30 mx-auto" />
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-secondary">Prophetic Wisdom</p>
                </div>
            </div>
        </div>
    );
};
