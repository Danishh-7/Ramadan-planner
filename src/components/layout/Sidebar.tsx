'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import {
    LayoutDashboard,
    Calendar,
    BookOpen,
    Heart,
    CheckSquare,
    Trophy,
    UtensilsCrossed,
    Sparkles,
    FileText,
    Settings,
    Menu,
    X,
} from 'lucide-react';

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notebook-planner', label: 'Notebook Planner', icon: Sparkles },
    { id: 'ramadan-tracker', label: 'Ramadan Tracker', icon: Calendar },
    { id: 'quran-tracker', label: 'Quran Tracker', icon: BookOpen },
    { id: 'fasting-tracker', label: 'Fasting Tracker', icon: Heart },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'challenge', label: '30-Day Challenge', icon: Trophy },
    { id: 'meals', label: 'Meal Planner', icon: UtensilsCrossed },
    { id: 'duas', label: 'Duas', icon: Sparkles },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <aside
                className={`
          fixed lg:sticky top-0 left-0 h-screen bg-background border-r-2 border-dashed border-border/40
          w-72 flex flex-col z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="p-8 border-b-2 border-dotted border-border/40">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-black italic tracking-tighter text-foreground font-serif">Ramadan</h1>
                        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground mt-1">
                            PLANNER
                        </p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            onViewChange(item.id);
                                            setIsOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center gap-4 px-5 py-3 rounded-2xl
                      transition-all duration-300 font-bold group
                      ${isActive
                                                ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 translate-x-2'
                                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1'
                                            }
                    `}
                                    >
                                        <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-secondary' : 'text-foreground/70'}`} />
                                        <span className="tracking-tight">{item.label}</span>
                                        {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-secondary shadow-lg" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-6 border-t-2 border-dotted border-border/40 bg-muted/10">
                    <p className="text-[10px] text-center text-muted-foreground font-black tracking-[0.2em]" dir="rtl">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};
