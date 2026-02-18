'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, Plus, Trash2, Clock, BookOpen } from 'lucide-react';

export const NotebookPlanner: React.FC = () => {
    const {
        currentDay, tasks, addTask, toggleTask, deleteTask,
        dailyPages, updateDailyPages
    } = useRamadanStore();

    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('');

    const dayTasks = tasks[currentDay] || [];
    const quranPages = dailyPages[currentDay] || 0;

    const handleAddTask = () => {
        if (newTaskText.trim()) {
            addTask(currentDay, newTaskText, newTaskTime);
            setNewTaskText('');
            setNewTaskTime('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 pb-12 sm:pb-20 animate-fade-in font-serif px-4 sm:px-0">
            {/* Header Section */}
            <div className="text-center space-y-3 sm:space-y-4 border-b-2 border-dashed border-border/60 pb-6 sm:pb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tight text-foreground/90">Ramadan Planner</h1>
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
                    <div className="h-px w-8 sm:w-12 bg-border" />
                    Day {currentDay}
                    <div className="h-px w-8 sm:w-12 bg-border" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {/* Single Column: Quran & Tasks */}
                <div className="space-y-10">
                    {/* Quran Tracker */}
                    <div className="notebook-border rounded-3xl p-6 sm:p-8 space-y-6 bg-card/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BookOpen className="w-16 h-16" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black flex items-center gap-3">
                            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                            Quran Tracker
                        </h2>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between border-b-2 border-dotted border-border pb-2 group">
                                <span className="font-bold text-muted-foreground uppercase text-xs sm:text-sm tracking-widest">Pages Read Today</span>
                                <input
                                    type="number"
                                    value={quranPages}
                                    onChange={(e) => updateDailyPages(currentDay, parseInt(e.target.value) || 0)}
                                    className="bg-transparent text-right font-black text-xl sm:text-2xl w-16 sm:w-20 focus:outline-none focus:text-primary transition-colors dark:[color-scheme:dark]"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground font-medium italic">&quot;The Quran is a guidance for mankind and clear proofs for the guidance and the criterion.&quot;</p>
                        </div>
                    </div>

                    {/* To-Do List - Mobile Responsive */}
                    <div className="bg-primary text-primary-foreground rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative notebook-shadow border border-white/10">
                        <h2 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 border-b border-primary-foreground/10 pb-4 tracking-tighter italic text-secondary/90">TO DO LIST</h2>

                        <div className="space-y-4 mb-6 sm:mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {dayTasks.length === 0 ? (
                                <p className="text-white/30 italic text-sm py-4">No tasks added yet...</p>
                            ) : (
                                dayTasks.map(task => (
                                    <div key={task.id} className="group flex items-center justify-between gap-4 border-b border-white/5 pb-3 hover:border-white/15 transition-all">
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                            <button
                                                onClick={() => toggleTask(currentDay, task.id)}
                                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-completed border-completed' : 'border-primary-foreground/20 hover:border-primary-foreground/40'}`}
                                            >
                                                {task.completed && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />}
                                            </button>
                                            <div className="flex flex-col">
                                                <span className={`font-bold text-sm sm:text-base transition-all ${task.completed ? 'line-through opacity-40' : 'text-white/90'}`}>{task.text}</span>
                                                {task.time && <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-secondary/70 flex items-center gap-1"><Clock className="w-2 h-2" /> {task.time}</span>}
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

                        {/* Add Task UI - Mobile Responsive Flex Column */}
                        <div className="space-y-3 sm:space-y-4 pt-4 border-t border-white/10">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                                <input
                                    placeholder="Add a new task..."
                                    className="bg-primary-foreground/10 border border-primary-foreground/10 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 flex-1 text-sm focus:ring-2 focus:ring-secondary/50 outline-none placeholder:text-primary-foreground/40 font-bold text-primary-foreground transition-all placeholder:italic"
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                                />
                                <input
                                    type="time"
                                    className="bg-primary-foreground/10 border border-primary-foreground/10 rounded-2xl px-3 py-3 sm:py-4 w-full sm:w-24 text-center text-xs focus:ring-2 focus:ring-secondary/50 outline-none font-bold text-primary-foreground transition-all"
                                    value={newTaskTime}
                                    onChange={(e) => setNewTaskTime(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleAddTask}
                                className="w-full bg-secondary text-secondary-foreground hover:bg-card font-black rounded-2xl py-5 sm:py-6 shadow-xl shadow-black/20 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-2 justify-center">
                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="tracking-widest text-sm sm:text-base">ADD TASK</span>
                                </div>
                            </Button>
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
