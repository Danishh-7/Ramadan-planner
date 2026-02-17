'use client';
// Clock component with HMR fix verified

import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { Clock as ClockIcon, Calendar } from 'lucide-react';

export const Clock: React.FC = () => {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) return null; // Hydration mismatch prevention

    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondAngle = seconds * 6;
    const minuteAngle = minutes * 6 + seconds * 0.1;
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;

    const dateFormat = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(time);

    const timeString = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <Card className="h-full w-full p-6 rounded-[3rem] notebook-border bg-card relative overflow-hidden flex flex-col items-center justify-between shadow-xl group hover:shadow-2xl transition-all duration-500">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg width="90%" height="90%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Header */}
            <div className="relative z-10 text-center space-y-2 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <ClockIcon className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Local Time</span>
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter text-foreground decoration-secondary/30 underline decoration-4 underline-offset-4">{timeString}</h3>
            </div>

            {/* Analog Clock Face */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-border/40 shadow-inner bg-background/50" />

                {/* Clock Marks */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-2 bg-foreground/20 rounded-full"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-85px)`,
                        }}
                    />
                ))}

                {/* Center Dot */}
                <div className="absolute w-3 h-3 bg-primary rounded-full z-20 shadow-lg border-2 border-background" />

                {/* Hour Hand */}
                <div
                    className="absolute w-1.5 h-12 bg-foreground rounded-full origin-bottom z-10 shadow-sm"
                    style={{
                        bottom: '50%',
                        transform: `rotate(${hourAngle}deg)`,
                        transformOrigin: 'bottom center',
                    }}
                />

                {/* Minute Hand */}
                <div
                    className="absolute w-1 h-16 bg-muted-foreground rounded-full origin-bottom z-10 shadow-sm opacity-80"
                    style={{
                        bottom: '50%',
                        transform: `rotate(${minuteAngle}deg)`,
                        transformOrigin: 'bottom center',
                    }}
                />

                {/* Second Hand */}
                <div
                    className="absolute w-0.5 h-20 bg-secondary rounded-full origin-bottom z-10 shadow-sm"
                    style={{
                        bottom: '50%',
                        transform: `rotate(${secondAngle}deg)`,
                        transformOrigin: 'bottom center',
                    }}
                />
            </div>

            {/* Date Footer */}
            <div className="relative z-10 text-center pb-2">
                <div className="flex items-center justify-center gap-2 text-muted-foreground opacity-80 bg-background/50 px-3 py-1.5 rounded-full border border-border/20 shadow-sm">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{dateFormat}</span>
                </div>
            </div>
        </Card>
    );
};
