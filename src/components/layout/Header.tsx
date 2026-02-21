'use client';

import React, { useEffect, useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Moon, Sun, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { UserButton } from "@clerk/nextjs";

export const Header: React.FC = () => {
    const { currentDay, ramadanStartDate, theme, setTheme } = useRamadanStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getCurrentDate = () => {
        const [year, month, day] = ramadanStartDate.split('T')[0].split('-').map(Number);
        const startDate = new Date(year, month - 1, day);
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (currentDay - 1));
        return format(currentDate, 'MMMM dd, yyyy');
    };

    if (!mounted) return null;

    return (
        <header className="sticky top-0 z-30 bg-card/70 border-b border-border/40 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5">
                {/* Current Day Info */}
                <div className="flex items-center gap-4 md:gap-6 ml-2 ml-12 md:ml-12 lg:ml-1">
                    <div className="relative group shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-br from-[#8E7C68] to-[#5D4037] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#8E7C68] to-[#5D4037] text-[#FDFCF0] shadow-xl transform transition hover:scale-105 duration-300">
                            <div className="text-center">
                                <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider opacity-80">Day</div>
                                <div className="text-lg md:text-2xl font-black leading-none">{currentDay}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight">
                            Ramadan <span className="text-primary">{currentDay}</span> <span className="text-muted-foreground font-medium text-xs md:text-sm">/ 30</span>
                        </h2>
                        <p className="text-xs md:text-sm font-semibold text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                            {getCurrentDate()}
                        </p>
                    </div>
                </div>

                {/* Theme Toggle & User Profile */}
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 md:p-3.5 rounded-2xl bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/50 transition-all duration-300 shadow-inner group"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5 transform group-hover:-rotate-12 transition-transform duration-300" />
                        ) : (
                            <Sun className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-300" />
                        )}
                    </button>

                    <UserButton afterSignOutUrl="/sign-in" appearance={{
                        elements: {
                            avatarBox: "w-10 h-10 rounded-2xl border-2 border-primary/20 hover:border-primary/50 transition-colors"
                        }
                    }} />
                </div>
            </div>
        </header>
    );
};
