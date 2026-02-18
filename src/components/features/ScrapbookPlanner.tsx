'use client';

import React, { useEffect, useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { ApiDua, fetchRamadanDhikr } from '@/services/duaApi';
import { CheckCircle2, Heart, Star, Trash2, Plus, Paperclip, Pin, Clock, BookOpen } from 'lucide-react';

export const ScrapbookPlanner: React.FC = () => {
    const {
        currentDay, tasks, toggleTask, deleteTask, addTask,
        meals, challenges, dailyPages, updateDailyPages
    } = useRamadanStore();

    const [newTask, setNewTask] = useState('');
    const [dailyDhikr, setDailyDhikr] = useState<ApiDua | null>(null);
    const [loading, setLoading] = useState(true);

    const dayTasks = tasks[currentDay] || [];
    const dayMeal = meals[currentDay] || { suhoor: '--:--', iftar: '--:--' };
    const dayChallenge = challenges.find(c => c.day === currentDay);
    const quranPages = dailyPages[currentDay] || 0;

    useEffect(() => {
        const loadDhikr = async () => {
            setLoading(true);
            const allDhikr = await fetchRamadanDhikr();
            if (allDhikr.length > 0) {
                // Stable random based on day
                const index = (currentDay - 1) % allDhikr.length;
                setDailyDhikr(allDhikr[index]);
            }
            setLoading(false);
        };
        loadDhikr();
    }, [currentDay]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask(currentDay, newTask.trim());
            setNewTask('');
        }
    };

    const ramadanHadiths = [
        { text: "When Ramadan begins, the gates of Paradise are opened.", source: "Sahih al-Bukhari 1898" },
        { text: "Fasting is a shield, so the one fasting should not use foul language nor behave foolishly.", source: "Sahih al-Bukhari 1894" },
        { text: "The smell of the mouth of a fasting person is better to Allah than the fragrance of musk.", source: "Sahih Muslim 1151" },
        { text: "Whoever provides food for a fasting person to break his fast, he will have a reward like his.", source: "Sunan al-Tirmidhi 807" },
        { text: "Allah has people He redeems from the Fire every night of Ramadan.", source: "Ibn Majah 1643" }
    ];

    const currentHadith = ramadanHadiths[(currentDay - 1) % ramadanHadiths.length];

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8 scrapbook-bg min-h-screen font-serif relative overflow-hidden">
            {/* SVG Filters for paper effects */}
            <svg className="hidden">
                <filter id="paper-edge">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>
            </svg>

            {/* Header Section */}
            <div className="relative text-center py-6 sm:py-10">
                <div className="washi-tape -top-2 left-1/2 -translate-x-1/2 w-48 opacity-40"></div>
                <h1 className="text-5xl sm:text-7xl font-['Dancing_Script'] italic text-primary/80 mb-2">Ramadan</h1>
                <div className="inline-block bg-white/60 backdrop-blur-sm px-8 py-2 rounded-full border border-black/5 shadow-sm">
                    <span className="text-xl sm:text-2xl font-bold tracking-widest uppercase tabular-nums">Day:{currentDay < 10 ? `0${currentDay}` : currentDay}</span>
                </div>
                <div className="absolute top-0 right-4 sm:right-10 animate-bounce hidden sm:block">
                    <Pin className="text-missed w-8 h-8 rotate-12" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">

                {/* Left Column: To Do List */}
                <div className="md:col-span-5 lg:col-span-4 relative order-2 md:order-1">
                    <div className="washi-tape -top-4 left-10 washi-tape-pink w-32"></div>
                    <div className="bg-[#f3e5f5] p-6 sm:p-8 rounded-lg shadow-xl scrapbook-card min-h-[400px] border-l-[12px] border-primary/20">
                        <div className="absolute top-4 right-4 text-primary/30">
                            <Paperclip className="w-8 h-8 -rotate-12" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 border-b-2 border-primary/10 pb-2 italic text-primary/70">TO DO LIST</h2>

                        <div className="notebook-lines space-y-0 text-base sm:text-lg font-medium text-foreground/80">
                            {dayTasks.length === 0 && (
                                <p className="pt-2 italic text-muted-foreground/50 text-sm">Nothing on the list today...</p>
                            )}
                            {dayTasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 py-1 group">
                                    <button
                                        onClick={() => toggleTask(currentDay, task.id)}
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-completed border-completed' : 'border-primary/30 rotate-3'}`}
                                    >
                                        {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </button>
                                    <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.text}</span>
                                    <button
                                        onClick={() => deleteTask(currentDay, task.id)}
                                        className="opacity-0 group-hover:opacity-100 text-missed transition-opacity p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddTask} className="mt-8 flex gap-2">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Add something..."
                                className="flex-1 bg-transparent border-b-2 border-primary/10 focus:border-primary/30 outline-none px-2 py-1 text-lg font-['Dancing_Script']"
                            />
                            <button type="submit" className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                                <Plus className="w-5 h-5 text-primary" />
                            </button>
                        </form>
                    </div>

                    {/* Meal Timings Card */}
                    <div className="mt-8 transform rotate-1">
                        <div className="bg-white/80 p-6 rounded-2xl shadow-lg border-2 border-dashed border-border/50 relative">
                            <div className="absolute -top-3 -right-3 p-2 bg-secondary rounded-full shadow-md">
                                <Clock className="w-5 h-5 text-secondary-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Meal Times</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                                    <span className="text-[10px] uppercase font-black text-primary/60 block mb-1">Suhoor</span>
                                    <span className="text-lg font-black tracking-tighter tabular-nums">{dayMeal.suhoor}</span>
                                </div>
                                <div className="p-3 bg-secondary/5 rounded-xl border border-secondary/10">
                                    <span className="text-[10px] uppercase font-black text-secondary/60 block mb-1">Iftar</span>
                                    <span className="text-lg font-black tracking-tighter tabular-nums">{dayMeal.iftar}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Cards */}
                <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 order-1 md:order-2">

                    {/* Hadith Sticky Note */}
                    <div className="sm:col-span-2 relative transform -rotate-1">
                        <div className="washi-tape-pink washi-tape -top-3 left-1/2 -translate-x-1/2 w-40 opacity-30"></div>
                        <div className="bg-[#fce4ec] p-6 sm:p-8 rounded-sm shadow-lg scrapbook-card border-b-4 border-r-4 border-black/5">
                            <div className="absolute -top-4 -right-4">
                                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 fill-pink-400 opacity-60 animate-pulse" />
                            </div>
                            <p className="text-[10px] sm:text-xs font-bold text-pink-600 mb-4 tracking-tighter uppercase tabular-nums">{currentHadith.source}</p>
                            <blockquote className="text-xl sm:text-2xl font-serif italic text-primary/80 leading-relaxed">
                                "{currentHadith.text}"
                            </blockquote>
                            <div className="mt-6 flex justify-end">
                                <span className="text-lg sm:text-xl font-['Dancing_Script'] text-pink-500">- Prophetic Pearl</span>
                            </div>
                        </div>
                    </div>

                    {/* Dhikr Card (Dynamic from API) */}
                    <div className="relative transform rotate-2">
                        <div className="bg-[#e1f5fe] p-6 rounded-xl shadow-md scrapbook-card border-t-8 border-sky-300/30 min-h-[220px] flex flex-col justify-center">
                            <div className="absolute top-2 right-2 flex gap-1 items-center">
                                <div className="p-1.5 bg-sky-200/50 rounded-full">
                                    <Paperclip className="w-4 h-4 text-sky-600 -rotate-12" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-['Dancing_Script'] font-bold text-sky-700 mb-2 underline decoration-sky-200 decoration-4">Daily Dhikr</h3>

                            {loading ? (
                                <div className="text-center py-4 text-sky-400/50 animate-pulse">Loading dhikr...</div>
                            ) : dailyDhikr ? (
                                <div className="text-center py-2 space-y-3">
                                    <div className="text-2xl font-serif text-sky-900 leading-relaxed" dir="rtl">{dailyDhikr.arabic}</div>
                                    <div className="text-[10px] font-bold text-sky-600 uppercase tracking-widest line-clamp-1">{dailyDhikr.title}</div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-sky-400/50 italic">SubhanAllah</div>
                            )}
                        </div>
                    </div>

                    {/* Challenge Card */}
                    <div className="relative transform -rotate-1">
                        <div className="bg-[#fff3e0] p-6 rounded-xl shadow-md scrapbook-card border-t-8 border-orange-300/30 min-h-[220px]">
                            <div className="absolute top-2 right-2">
                                <Star className="w-6 h-6 text-orange-400 fill-orange-400/20" />
                            </div>
                            <h3 className="text-2xl font-['Dancing_Script'] font-bold text-orange-700 mb-4 underline decoration-orange-200 decoration-4">Challenge</h3>
                            <div className="space-y-4">
                                {dayChallenge ? (
                                    <div className="text-center space-y-4 pt-2">
                                        <p className="font-serif italic text-orange-900 text-lg leading-snug">
                                            "{dayChallenge.task}"
                                        </p>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${dayChallenge.completed ? 'bg-completed text-white' : 'bg-orange-200/50 text-orange-700'}`}>
                                            {dayChallenge.completed ? 'Achieved' : 'In Progress'}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center text-orange-400 p-4">Plan your day...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quran Progress Card */}
                    <div className="relative transform -rotate-2">
                        <div className="washi-tape washi-tape-green -top-2 left-1/4 w-20"></div>
                        <div className="bg-[#e8f5e9] p-6 rounded-lg shadow-md scrapbook-card flex flex-col items-center justify-center text-center min-h-[160px]">
                            <div className="mb-3 p-2 bg-green-200/50 rounded-full">
                                <BookOpen className="w-6 h-6 text-green-600" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-green-800/40 mb-1">Quran Reading</h4>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={quranPages}
                                    onChange={(e) => updateDailyPages(currentDay, parseInt(e.target.value) || 0)}
                                    className="w-12 bg-transparent text-center text-3xl font-black text-green-800 outline-none tabular-nums"
                                />
                                <span className="text-xl font-serif text-green-800/40 italic">pages</span>
                            </div>
                        </div>
                    </div>

                    {/* Goal Card / Reminder */}
                    <div className="relative transform rotate-3">
                        <div className="washi-tape washi-tape-pink -top-2 right-1/4 w-20"></div>
                        <div className="bg-[#fce4ec] p-6 rounded-lg shadow-md scrapbook-card flex flex-col items-center justify-center text-center min-h-[160px]">
                            <div className="mb-3 p-2 bg-pink-200/50 rounded-full text-pink-600">
                                <Heart className="w-6 h-6 fill-pink-600/20" />
                            </div>
                            <h4 className="text-xl font-['Dancing_Script'] font-bold text-pink-800 leading-tight">Focus on Mindfulness</h4>
                            <p className="text-[10px] text-pink-600/60 uppercase font-bold tracking-widest mt-1">Spiritual Reminders</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Decoration */}
            <div className="flex justify-center pt-6 sm:pt-10">
                <div className="relative text-center">
                    <div className="absolute -top-12 -left-20 opacity-10 hidden sm:block">
                        <Star className="w-24 h-24 text-secondary fill-secondary" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-['Dancing_Script'] text-primary/40 italic">May your fast be accepted...</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/20 mt-2">RAMADAN KAREEM</p>
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                
                h1, h2, h3, h4, .font-script {
                    font-family: 'Dancing Script', cursive;
                }
                
                blockquote, .font-serif {
                    font-family: 'Playfair Display', serif;
                }
                
                .scrapbook-card {
                    @apply cursor-default select-none;
                }

                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>
        </div>
    );
};
