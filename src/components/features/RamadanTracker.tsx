'use client';

import React, { useState } from 'react';
import { useRamadanStore, PrayerStatus, DailyPrayers } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, Moon, Sun, Star, Trophy, Plus, Trash2, CheckSquare, Sparkles, CheckCircle2 } from 'lucide-react';

const prayerList = [
    { key: 'fajr', label: 'Fajr', icon: Moon },
    { key: 'dhuhr', label: 'Dhuhr', icon: Sun },
    { key: 'asr', label: 'Asr', icon: Sun },
    { key: 'maghrib', label: 'Maghrib', icon: Sun },
    { key: 'isha', label: 'Isha', icon: Moon },
    { key: 'taraweeh', label: 'Taraweeh', icon: Moon },
];

export const RamadanTracker: React.FC = () => {
    const {
        currentDay, prayers: prayerData, updatePrayerStatus, ramadanStartDate,
        challenges, tasks, addTask, toggleTask, deleteTask
    } = useRamadanStore();

    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [newTask, setNewTask] = useState('');

    const dayPrayers = prayerData[selectedDay] || {} as any;
    const dayChallenge = challenges.find(c => c.day === selectedDay);
    const dayTasks = tasks[selectedDay] || [];

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

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask(selectedDay, newTask.trim());
            setNewTask('');
        }
    };

    const ashra = selectedDay <= 10 ? 'Mercy' : selectedDay <= 20 ? 'Forgiveness' : 'Salvation';

    return (
        <div className="space-y-6 animate-fade-in pb-12 font-serif">
            {/* Header & Navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/40 p-4 rounded-[2rem] notebook-border">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))} disabled={selectedDay === 1} className="rounded-full w-12 h-12 p-0 bg-background shadow-sm hover:scale-110 transition-transform"><ChevronLeft className="w-6 h-6" /></Button>
                    <div className="text-center">
                        <h2 className="text-3xl font-black italic text-foreground">Day {selectedDay}</h2>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{ashra} Ashra</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))} disabled={selectedDay === 30} className="rounded-full w-12 h-12 p-0 bg-background shadow-sm hover:scale-110 transition-transform"><ChevronRight className="w-6 h-6" /></Button>
                </div>

                {dayChallenge && (
                    <div className="flex-1 w-full md:w-auto bg-[#4a342e] text-[#fdfcf0] p-4 rounded-2xl flex items-center gap-4 shadow-lg transform transition-all hover:scale-[1.02]">
                        <div className="p-3 bg-white/10 rounded-full animate-pulse">
                            <Trophy className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Daily Challenge</div>
                            <div className="font-bold text-sm leading-tight">{dayChallenge.task}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Prayers (Compatible width) */}
                <div className="lg:col-span-7 space-y-6">
                    <Card glass className="p-6 rounded-[2.5rem] notebook-border">
                        <h3 className="text-xl font-black italic border-b-2 border-dotted border-border pb-4 mb-6 flex items-center gap-2 text-[#4a342e]">
                            <Moon className="w-5 h-5 text-secondary" /> Daily Prayers
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {prayerList.map((prayer) => {
                                const status = dayPrayers[prayer.key as keyof DailyPrayers];

                                // Calculate Real-Time Day (Simplified for display logic, actual locking logic relies on store/time)
                                const todayDate = new Date();
                                const startDate = new Date(ramadanStartDate);
                                const diffTime = todayDate.getTime() - startDate.getTime();
                                const realTimeDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                // Fix: Allow manual override or basic logic. For now, we trust store.currentDay sync or manual nav.
                                // Simplification: Just allow editing for now to fix "Locked" issues if date is wrong.
                                const isFuture = false; // selectedDay > realTimeDay; // Disabled lock for better UX testing
                                const isLocked = false;

                                return (
                                    <button
                                        key={prayer.key}
                                        onClick={() => updatePrayerStatus(selectedDay, prayer.key as keyof DailyPrayers, getNextStatus(status as PrayerStatus))}
                                        className={`p-4 rounded-2xl transition-all transform border-2 flex flex-col items-center justify-center gap-2
                                            ${status ? 'border-transparent scale-105' : 'border-border/30 hover:border-secondary/50'} 
                                            ${getStatusColor(status as PrayerStatus)} 
                                            ${status ? 'text-white shadow-md' : 'text-muted-foreground hover:bg-secondary/5'}
                                        `}
                                    >
                                        <prayer.icon className={`w-5 h-5 ${status ? 'opacity-100' : 'opacity-40'}`} />
                                        <span className="font-black text-xs uppercase tracking-wider">{prayer.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <Card glass className="p-6 rounded-[2.5rem] bg-secondary/10 border-secondary/20 text-center relative overflow-hidden">
                        <Sparkles className="absolute top-4 right-4 w-12 h-12 text-secondary opacity-10" />
                        <p className="text-lg font-bold italic text-[#4a342e] mb-2">"Whoever fasts Ramadan out of faith and in the hope of reward, his previous sins will be forgiven."</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#4a342e]/80">Hadith Bukhari</p>
                    </Card>
                </div>

                {/* Right Column: To-Do List */}
                <div className="lg:col-span-5 space-y-6">
                    <Card glass className="p-6 rounded-[2.5rem] notebook-border h-full flex flex-col">
                        <h3 className="text-xl font-black italic border-b-2 border-dotted border-border pb-4 mb-4 flex items-center gap-2 text-[#4a342e]">
                            <CheckSquare className="w-5 h-5 text-secondary" /> Daily Goals
                        </h3>

                        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Add a goal..."
                                className="flex-1 bg-white border-2 border-[#4a342e]/30 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#4a342e] outline-none text-black placeholder:text-gray-500"
                            />
                            <Button type="submit" size="sm" className="rounded-xl aspect-square p-0 flex items-center justify-center bg-[#4a342e] text-white hover:bg-secondary hover:text-[#4a342e]">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </form>

                        <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                            {dayTasks.length === 0 ? (
                                <div className="text-center py-10 opacity-30">
                                    <Trophy className="w-12 h-12 mx-auto mb-2" />
                                    <p className="text-sm font-bold italic">No goals set for today</p>
                                </div>
                            ) : (
                                dayTasks.map(task => (
                                    <div key={task.id} className="group flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-border/30 hover:border-secondary/30 transition-all shadow-sm">
                                        <button
                                            onClick={() => toggleTask(selectedDay, task.id)}
                                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-completed border-completed text-white' : 'border-muted-foreground/40 hover:border-secondary'}`}
                                        >
                                            {task.completed && <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                        <span className={`flex-1 text-sm font-bold transition-all ${task.completed ? 'text-muted-foreground line-through decoration-2 decoration-secondary/50' : 'text-foreground'}`}>
                                            {task.text}
                                        </span>
                                        <button
                                            onClick={() => deleteTask(selectedDay, task.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-missed hover:bg-missed/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
