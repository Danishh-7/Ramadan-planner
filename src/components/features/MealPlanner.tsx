'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, UtensilsCrossed, Sparkles, AlertCircle } from 'lucide-react';

export const MealPlanner: React.FC = () => {
    const { currentDay, meals, updateMeal } = useRamadanStore();
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const dayMeals = meals[selectedDay] || { suhoor: '', iftar: '' };

    return (
        <div className="space-y-12 animate-fade-in pb-12 font-serif">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Meal Planner</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Plan your nourishment for body and soul</p>
            </div>

            <div className="flex items-center justify-center gap-8 bg-[#fdfcf0] p-6 rounded-[2.5rem] notebook-border mx-auto max-w-sm shadow-inner">
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))} disabled={selectedDay === 1} className="rounded-full w-10 h-10 p-0 hover:bg-muted"><ChevronLeft className="w-6 h-6" /></Button>
                <h2 className="text-3xl font-black italic">Day {selectedDay}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))} disabled={selectedDay === 30} className="rounded-full w-10 h-10 p-0 hover:bg-muted"><ChevronRight className="w-6 h-6" /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-8 rounded-[3rem] notebook-border space-y-6 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b-2 border-dotted border-border pb-4">
                        <h3 className="text-2xl font-black italic flex items-center gap-3 text-[#4a342e]">🌙 Suhoor</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8d6e63]">Pre-Dawn</span>
                    </div>
                    <textarea
                        value={dayMeals.suhoor}
                        onChange={(e) => updateMeal(selectedDay, 'suhoor', e.target.value)}
                        placeholder="Nourishing oats, protein, and plenty of water..."
                        className="w-full h-48 bg-transparent border-none focus:outline-none font-bold text-xl placeholder:text-muted-foreground/30 resize-none leading-relaxed text-[#4a342e] placeholder:italic"
                    />
                </Card>

                <Card className="p-8 rounded-[3rem] notebook-border space-y-6 bg-[#fff8e1] border-secondary/40 shadow-xl">
                    <div className="flex items-center justify-between border-b-2 border-dotted border-secondary/30 pb-4">
                        <h3 className="text-2xl font-black italic flex items-center gap-3 text-[#4a342e]">🌅 Iftar</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8d6e63]">Sunset</span>
                    </div>
                    <textarea
                        value={dayMeals.iftar}
                        onChange={(e) => updateMeal(selectedDay, 'iftar', e.target.value)}
                        placeholder="Dates, fresh soup, and a balanced main course..."
                        className="w-full h-48 bg-transparent border-none focus:outline-none font-bold text-xl placeholder:text-muted-foreground/30 resize-none leading-relaxed text-[#4a342e] placeholder:italic"
                    />
                </Card>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black italic text-[#4a342e]">Pantry Wisdom</h3>
                    <div className="h-px flex-1 bg-border/40" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: 'Sustained Energy', icon: '🔋', items: ['Overnight oats with walnuts', 'Avocado & eggs on rye', 'Greek yogurt with berries'] },
                        { title: 'Quick Rehydration', icon: '💧', items: ['Water-rich fruits (Melon)', 'Slow-cooked lentil soup', 'Grilled lean protein'] }
                    ].map((tip, idx) => (
                        <Card key={idx} className="p-8 rounded-[2.5rem] notebook-border relative group overflow-hidden bg-white shadow-lg">
                            <span className="text-4xl absolute top-6 right-6 opacity-20 group-hover:scale-110 transition-transform">{tip.icon}</span>
                            <h4 className="text-xl font-black mb-4 text-[#4a342e]">{tip.title}</h4>
                            <ul className="space-y-3">
                                {tip.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-bold text-[#5d4037]">
                                        <Sparkles className="w-4 h-4 text-secondary" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
