'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const HabitTracker: React.FC = () => {
    const { currentDay, habits, addHabit, toggleHabit, deleteHabit } = useRamadanStore();
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitTime, setNewHabitTime] = useState<'morning' | 'afternoon' | 'night'>('morning');

    const dayHabits = habits[selectedDay] || [];
    const handleAddHabit = () => {
        if (newHabitName.trim()) {
            addHabit(selectedDay, { name: newHabitName, timeOfDay: newHabitTime, completed: false });
            setNewHabitName('');
        }
    };

    const HabitSection = ({ title, timeOfDay, icon }: any) => {
        const sectionHabits = dayHabits.filter(h => h.timeOfDay === timeOfDay);
        return (
            <Card glass className="notebook-border rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-dotted border-border pb-3">
                    <span className="text-2xl">{icon}</span>
                    <h3 className="text-xl font-black italic">{title}</h3>
                </div>
                <div className="space-y-3">
                    {sectionHabits.length === 0 ? <p className="text-sm text-muted-foreground italic font-medium py-4">No habits yet...</p> :
                        sectionHabits.map((habit: any) => (
                            <div key={habit.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-border/30 group">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => toggleHabit(selectedDay, habit.id)} className={`w-6 h-6 rounded flex items-center justify-center transition-all ${habit.completed ? 'bg-completed text-white' : 'border-2 border-border/60'}`}>
                                        {habit.completed && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                    <span className={`font-bold ${habit.completed ? 'line-through opacity-50' : ''}`}>{habit.name}</span>
                                </div>
                                <button onClick={() => deleteHabit(selectedDay, habit.id)} className="p-2 text-missed opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))
                    }
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-10 animate-fade-in pb-12 font-serif">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Daily Habits</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Build consistent habits throughout Ramadan</p>
            </div>
            <div className="flex items-center justify-center gap-8 bg-white/40 p-6 rounded-[2.5rem] notebook-border mx-auto max-w-sm">
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))} disabled={selectedDay === 1} className="rounded-full w-10 h-10 p-0"><ChevronLeft className="w-6 h-6" /></Button>
                <h2 className="text-3xl font-black italic">Day {selectedDay}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))} disabled={selectedDay === 30} className="rounded-full w-10 h-10 p-0"><ChevronRight className="w-6 h-6" /></Button>
            </div>
            <Card glass="dark" className="bg-[#4a342e] text-white rounded-[2.5rem] p-8 notebook-shadow border-none">
                <h3 className="text-2xl font-black italic mb-6 text-secondary/90">New Habit</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="Habit name..."
                        className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-secondary outline-none font-bold placeholder:italic"
                    />
                    <select
                        value={newHabitTime}
                        onChange={(e) => setNewHabitTime(e.target.value as any)}
                        className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold outline-none focus:ring-2 focus:ring-secondary [&>option]:text-[#4a342e] [&>option]:font-bold"
                    >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="night">Night</option>
                    </select>
                    <Button
                        onClick={handleAddHabit}
                        className="bg-secondary text-[#4a342e] hover:bg-white px-10 rounded-2xl font-black shadow-lg shadow-black/20"
                    >
                        ADD
                    </Button>
                </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <HabitSection title="Morning" timeOfDay="morning" icon="🌅" />
                <HabitSection title="Afternoon" timeOfDay="afternoon" icon="☀️" />
                <HabitSection title="Night" timeOfDay="night" icon="🌙" />
            </div>
        </div>
    );
};
