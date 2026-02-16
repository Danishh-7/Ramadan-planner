'use client';

import React, { useEffect, useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Moon, Sun, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const Header: React.FC = () => {
    const { currentDay, ramadanStartDate, theme, setTheme } = useRamadanStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Apply theme to document
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getCurrentDate = () => {
        const startDate = new Date(ramadanStartDate);
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (currentDay - 1));
        return format(currentDate, 'MMMM dd, yyyy');
    };

    if (!mounted) return null;

    return (
        <header className="sticky top-0 z-30 bg-card/70 border-b border-border/40 backdrop-blur-xl">
            <div className="flex items-center justify-between px-8 py-5">
                {/* Current Day Info */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-teal-600 text-primary-foreground shadow-xl transform transition hover:scale-105 duration-300">
                            <div className="text-center">
                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Day</div>
                                <div className="text-2xl font-black">{currentDay}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                            Ramadan {currentDay} <span className="text-muted-foreground font-medium text-sm">/ 30</span>
                        </h2>
                        <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            {getCurrentDate()}
                        </p>
                    </div>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-3.5 rounded-2xl bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/50 transition-all duration-300 shadow-inner group"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? (
                        <Moon className="w-5 h-5 transform group-hover:-rotate-12 transition-transform duration-300" />
                    ) : (
                        <Sun className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-300" />
                    )}
                </button>
            </div>
        </header>
    );
};
