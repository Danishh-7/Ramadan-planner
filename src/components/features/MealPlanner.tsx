'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, UtensilsCrossed, Trash2 } from 'lucide-react';

export const MealPlanner: React.FC = () => {
    const { currentDay, meals, updateMeal } = useRamadanStore();
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const dayMeals = meals[selectedDay] || { suhoor: '', iftar: '' };

    // Simple local water tracker for display (persisting would require store update, doing local for now as "creative feature" or could add to store if needed. 
    // For now, let's keep it simple in UI or use a generic 'notes' field if we want persistence. 
    // Wait, user said "use creativity". I'll add a Hydration section that toggles local state for the session or just a visual guide.
    // Actually, I'll stick to the core request: Custom input for next day's meal.
    // I will add a "Tomorrow's Suhoor Intent" section? 
    // Or just make the Suhoor/Iftar inputs very clear.

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-serif">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Nourishment</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Plan your meals, maintain your energy</p>
            </div>

            <div className="flex items-center justify-center gap-8 bg-card/40 p-4 rounded-[2.5rem] notebook-border mx-auto max-w-sm">
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))} disabled={selectedDay === 1} className="rounded-full w-12 h-12 p-0"><ChevronLeft className="w-6 h-6" /></Button>
                <h2 className="text-3xl font-black italic">Day {selectedDay}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))} disabled={selectedDay === 30} className="rounded-full w-12 h-12 p-0"><ChevronRight className="w-6 h-6" /></Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 rounded-[3rem] notebook-border space-y-6 bg-card shadow-xl h-full relative group">
                    <div className="flex items-center justify-between border-b-2 border-dotted border-border pb-4">
                        <div>
                            <h3 className="text-2xl font-black italic flex items-center gap-3 text-card-foreground">🌙 Suhoor</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pre-Dawn Meal</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => updateMeal(selectedDay, 'suhoor', '')} className="p-2 text-muted-foreground hover:text-missed transition-colors opacity-0 group-hover:opacity-100" title="Clear">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <UtensilsCrossed className="w-6 h-6 text-secondary" />
                        </div>
                    </div>
                    <textarea
                        value={dayMeals.suhoor}
                        onChange={(e) => updateMeal(selectedDay, 'suhoor', e.target.value)}
                        placeholder="Plan your pre-dawn meal here (e.g., Oats, Dates, Water)..."
                        className="w-full h-64 bg-background/50 border-2 border-border/30 rounded-2xl p-4 focus:outline-none focus:border-secondary font-bold text-lg placeholder:text-muted-foreground/30 resize-none leading-relaxed text-foreground"
                    />
                </Card>

                <Card className="p-8 rounded-[3rem] notebook-border space-y-6 bg-secondary/5 border-secondary/20 shadow-xl h-full relative group">
                    <div className="flex items-center justify-between border-b-2 border-dotted border-secondary/30 pb-4">
                        <div>
                            <h3 className="text-2xl font-black italic flex items-center gap-3 text-foreground">🌅 Iftar</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Breaking Fast</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => updateMeal(selectedDay, 'iftar', '')} className="p-2 text-muted-foreground hover:text-missed transition-colors opacity-0 group-hover:opacity-100" title="Clear">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <UtensilsCrossed className="w-6 h-6 text-foreground" />
                        </div>
                    </div>
                    <textarea
                        value={dayMeals.iftar}
                        onChange={(e) => updateMeal(selectedDay, 'iftar', e.target.value)}
                        placeholder="Plan your Iftar meal here..."
                        className="w-full h-64 bg-background/50 border-2 border-border/30 rounded-2xl p-4 focus:outline-none focus:border-[#4a342e] font-bold text-lg placeholder:text-muted-foreground/30 resize-none leading-relaxed text-foreground"
                    />
                </Card>
            </div>



            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black italic text-foreground">Sunnah Foods</h3>
                    <div className="h-px flex-1 bg-border/40" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Talbina', desc: 'Barley flour with milk & honey. Soothes the heart.', ingredients: ['Barley', 'Milk', 'Honey'] },
                        { name: 'Nabeez', desc: 'Soaked dates/raisins in water. Alkalizing tonic.', ingredients: ['Dates', 'Water'] },
                        { name: 'Dates & Cucumber', desc: 'Combinations to balance body heat.', ingredients: ['Fresh Dates', 'Cucumber'] },
                    ].map((item, idx) => (
                        <Card key={idx} className="p-6 rounded-[2rem] bg-card border border-border/10 shadow-lg hover:shadow-xl transition-all group">
                            <h4 className="text-xl font-black mb-2 text-card-foreground">{item.name}</h4>
                            <p className="text-sm font-medium text-muted-foreground mb-4 italic leading-relaxed">&quot;{item.desc}&quot;</p>
                            <div className="flex flex-wrap gap-2">
                                {item.ingredients.map((ing, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-background border border-border/10 text-[10px] font-black uppercase tracking-wider text-foreground">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
