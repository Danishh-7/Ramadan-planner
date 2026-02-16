'use client';

import React, { useState } from 'react';
import { useRamadanStore, DailyPrayers } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, Plus, Trash2, Clock, BookOpen, Utensils, Heart } from 'lucide-react';

export const NotebookPlanner: React.FC = () => {
    const {
        currentDay, tasks, addTask, toggleTask, deleteTask,
        prayers, updatePrayerStatus, meals, updateMeal,
        dailyPages, updateDailyPages, fetchTimings, userCity
    } = useRamadanStore();

    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('');

    const dayTasks = tasks[currentDay] || [];
    const dayPrayers = prayers[currentDay] || {
        fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null, taraweeh: null,
        sunnah: null, tahajjud: null, witr: null, sehri: false, iftar: false
    } as DailyPrayers;
    const dayMeals = meals[currentDay] || { suhoor: '', iftar: '' };
    const quranPages = dailyPages[currentDay] || 0;

    const handleAddTask = () => {
        if (newTaskText.trim()) {
            addTask(currentDay, newTaskText, newTaskTime);
            setNewTaskText('');
            setNewTaskTime('');
        }
    };

    const prayerList: (keyof DailyPrayers)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'taraweeh'];

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in font-serif">
            {/* Header Section */}
            <div className="text-center space-y-4 border-b-2 border-dashed border-border/60 pb-8">
                <h1 className="text-6xl font-black italic tracking-tight text-foreground/90">Ramadan Planner</h1>
                <div className="flex items-center justify-center gap-4 text-2xl font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <div className="h-px w-12 bg-border" />
                    Day {currentDay}
                    <div className="h-px w-12 bg-border" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Column: Quran & Tasks */}
                <div className="space-y-10">
                    {/* Quran Tracker */}
                    <div className="notebook-border rounded-3xl p-8 space-y-6 bg-card/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen className="w-16 h-16" />
                        </div>
                        <h2 className="text-2xl font-black flex items-center gap-3">
                            <BookOpen className="w-7 h-7 text-primary" />
                            Quran Tracker
                        </h2>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between border-b-2 border-dotted border-border pb-2 group">
                                <span className="font-bold text-muted-foreground uppercase text-sm tracking-widest">Pages Read Today</span>
                                <input
                                    type="number"
                                    value={quranPages}
                                    onChange={(e) => updateDailyPages(currentDay, parseInt(e.target.value) || 0)}
                                    className="bg-transparent text-right font-black text-2xl w-20 focus:outline-none focus:text-primary transition-colors"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium italic">&quot;The Quran is a guidance for mankind and clear proofs for the guidance and the criterion.&quot;</p>
                        </div>
                    </div>

                    {/* To-Do List */}
                    <div className="bg-primary text-primary-foreground rounded-[2.5rem] p-8 shadow-2xl relative notebook-shadow border border-white/10">
                        <h2 className="text-3xl font-black mb-8 border-b border-primary-foreground/10 pb-4 tracking-tighter italic text-secondary/90">TO DO LIST</h2>

                        <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {dayTasks.length === 0 ? (
                                <p className="text-white/30 italic text-sm py-4">No tasks added yet...</p>
                            ) : (
                                dayTasks.map(task => (
                                    <div key={task.id} className="group flex items-center justify-between gap-4 border-b border-white/5 pb-3 hover:border-white/15 transition-all">
                                        <div className="flex items-center gap-4 flex-1">
                                            <button
                                                onClick={() => toggleTask(currentDay, task.id)}
                                                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-completed border-completed' : 'border-primary-foreground/20 hover:border-primary-foreground/40'}`}
                                            >
                                                {task.completed && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                            </button>
                                            <div className="flex flex-col">
                                                <span className={`font-bold transition-all ${task.completed ? 'line-through opacity-40' : 'text-white/90'}`}>{task.text}</span>
                                                {task.time && <span className="text-[10px] uppercase font-black tracking-widest text-secondary/70 flex items-center gap-1"><Clock className="w-2 h-2" /> {task.time}</span>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteTask(currentDay, task.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-missed transition-all text-white/40"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Task UI */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    placeholder="Add a new task..."
                                    className="bg-primary-foreground/10 border border-primary-foreground/10 rounded-2xl px-5 py-4 flex-1 text-sm focus:ring-2 focus:ring-secondary/50 outline-none placeholder:text-primary-foreground/40 font-bold text-primary-foreground transition-all placeholder:italic"
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                                />
                                <input
                                    type="time"
                                    className="bg-primary-foreground/10 border border-primary-foreground/10 rounded-2xl px-3 py-4 w-24 text-center text-xs focus:ring-2 focus:ring-secondary/50 outline-none font-bold text-primary-foreground transition-all"
                                    value={newTaskTime}
                                    onChange={(e) => setNewTaskTime(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleAddTask}
                                className="w-full bg-secondary text-secondary-foreground hover:bg-card font-black rounded-2xl py-6 shadow-xl shadow-black/20 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-2 ">
                                    <Plus className="w-5 h-5" />
                                    <span className="tracking-widest">ADD TASK</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Prayers & Meals */}
                <div className="space-y-10">
                    {/* Daily Prayers */}
                    <Card glow className="p-8 rounded-[2.5rem] shadow-xl border border-border/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Heart className="w-24 h-24" />
                        </div>
                        <h2 className="text-3xl font-black text-center mb-10 tracking-tight text-foreground/80">Daily Prayers</h2>
                        <div className="space-y-4">
                            {prayerList.map((prayer) => (
                                <div key={prayer} className="flex items-center justify-between py-4 border-b border-border/60 group px-2">
                                    <span className="text-xl font-bold capitalize text-foreground/70 group-hover:text-foreground transition-colors">{prayer}</span>
                                    <button
                                        onClick={() => updatePrayerStatus(currentDay, prayer, dayPrayers[prayer] === 'completed' ? null : 'completed')}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${dayPrayers[prayer] === 'completed' ? 'bg-completed text-white shadow-lg shadow-completed/30 scale-110' : 'bg-muted/50 border-2 border-border/40 hover:border-primary/40'}`}
                                    >
                                        <CheckCircle2 className={`w-6 h-6 ${dayPrayers[prayer] === 'completed' ? 'opacity-100' : 'opacity-20'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-black flex items-center gap-3 italic mb-6">
                            <Utensils className="w-8 h-8 text-secondary" />
                            Meal Plan
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-3xl border-2 border-secondary/20 shadow-xl bg-card p-6 flex flex-col items-center justify-center gap-2 group hover:border-secondary transition-all">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Khatam Sehri</div>
                                <div className="text-2xl font-black text-foreground">{dayMeals.suhoor || '--:--'}</div>
                                <textarea
                                    className="w-full mt-2 bg-transparent border-t border-secondary/10 focus:outline-none resize-none font-bold text-xs text-muted-foreground placeholder:italic text-center pt-2"
                                    placeholder="Meal plan..."
                                    rows={2}
                                    value={dayMeals.suhoor}
                                    onChange={(e) => updateMeal(currentDay, 'suhoor', e.target.value)}
                                />
                            </div>
                            <div className="rounded-3xl border-2 border-secondary/20 shadow-xl bg-card p-6 flex flex-col items-center justify-center gap-2 group hover:border-secondary transition-all">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Iftar</div>
                                <div className="text-2xl font-black text-foreground">{dayMeals.iftar || '--:--'}</div>
                                <textarea
                                    className="w-full mt-2 bg-transparent border-t border-secondary/10 focus:outline-none resize-none font-bold text-xs text-muted-foreground placeholder:italic text-center pt-2"
                                    placeholder="Meal plan..."
                                    rows={2}
                                    value={dayMeals.iftar}
                                    onChange={(e) => updateMeal(currentDay, 'iftar', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};
