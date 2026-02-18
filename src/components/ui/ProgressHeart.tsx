'use client';

import React, { useMemo } from 'react';
import { useRamadanStore, DailyPrayers } from '@/store/store';

export const ProgressHeart: React.FC = () => {
    const { prayers, fasting, dailyPages, currentDay } = useRamadanStore();

    const getDailyProgress = (day: number) => {
        const dayPrayers = prayers[day];
        const dayFasting = fasting[day];
        const dayPages = dailyPages[day] || 0;

        let completedTasks = 0;
        if (dayPrayers) {
            ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(p => {
                const key = p as keyof DailyPrayers;
                if (dayPrayers[key] === 'completed') completedTasks++;
            });
        }
        if (dayFasting === 'completed') completedTasks++;
        if (dayPages > 0) completedTasks++;

        return (completedTasks / 7) * 100;
    };

    const singleHeartColor = '#FF5252'; // Consistent coral red color for all hearts

    // Generate 30 stable positions in a heart shape
    const heartBeads = useMemo(() => {
        const totalPoints = 1000; // high resolution sampling
        const rawPoints: { x: number; y: number }[] = [];

        // 1. Generate heart curve points
        for (let i = 0; i < totalPoints; i++) {
            const t = (i / totalPoints) * Math.PI * 2;

            const x = 16 * Math.pow(Math.sin(t), 3);
            const y =
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t);

            rawPoints.push({ x, y });
        }

        // 2. Calculate cumulative distances
        const distances = [0];
        for (let i = 1; i < rawPoints.length; i++) {
            const dx = rawPoints[i].x - rawPoints[i - 1].x;
            const dy = rawPoints[i].y - rawPoints[i - 1].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            distances.push(distances[i - 1] + dist);
        }

        const totalLength = distances[distances.length - 1];

        // 3. Pick 30 evenly spaced points
        const beads = [];
        for (let i = 0; i < 30; i++) {
            const target = (i / 30) * totalLength;

            // find closest point
            let index = distances.findIndex(d => d >= target);
            if (index === -1) index = distances.length - 1;

            const point = rawPoints[index];

            // scale and center
            const scale = 11;
            beads.push({
                x: 250 + point.x * scale,
                y: 250 - point.y * scale, // invert y for correct orientation
                day: i + 1,
                color: singleHeartColor, // Use single color for all
                progress: getDailyProgress(i + 1)
            });
        }

        return beads;
    }, [currentDay, prayers, fasting, dailyPages]);


    // Calculate current day from start date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(useRamadanStore.getState().ramadanStartDate);
    start.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    // ensure within 1-30 range or appropriate logic
    const calculatedCurrentDay = diffDays > 30 ? 30 : diffDays < 1 ? 1 : diffDays;


    // CLIENT-ONLY RENDERING to prevent hydration mismatches
    const [isMounted, setIsMounted] = React.useState(false);
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        // Render a placeholder or empty structure during SSR
        return (
            <div className="relative w-full aspect-square flex items-center justify-center p-6 overflow-hidden">
                <div className="animate-pulse w-full h-full bg-muted/5 rounded-full" />
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-square max-w-[400px] mx-auto flex flex-col items-center justify-center p-6 overflow-hidden group">
            {/* Creative Title */}
            <div className="absolute top-4 left-0 w-full flex flex-col items-center justify-center z-10 pointer-events-none">
                <h3 className="text-2xl font-black italic tracking-tighter text-foreground opacity-20 uppercase">Ramadan</h3>
                <div className="h-[2px] w-12 bg-secondary/30 -mt-1 mb-1" />
                <h2 className="text-4xl font-black italic tracking-tighter gradient-text underline decoration-secondary/30 decoration-2 underline-offset-4">JOURNEY</h2>
            </div>

            <div className="flex-1 relative flex items-center justify-center w-full h-full mt-12">
                <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-xl">
                    <defs>
                        {heartBeads.map((b) => (
                            <linearGradient key={`grad-${b.day}`} id={`fill-${b.day}`} x1="0" y1="1" x2="0" y2="0">
                                <stop offset={`${b.progress}%`} stopColor={b.color} />
                                <stop offset={`${b.progress}%`} stopColor="white" />
                            </linearGradient>
                        ))}
                        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                            <feOffset dx="0" dy="2" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Clean background */}
                    <rect width="500" height="500" fill="transparent" />

                    {heartBeads.map((b) => {
                        const isFuture = b.day > calculatedCurrentDay;
                        const isPast = b.day < calculatedCurrentDay;
                        const isToday = b.day === calculatedCurrentDay;
                        const radius = isToday ? 24 : 20;

                        // Past/Future: Locked (no pointer events, specific styling)
                        // Present: Unlocked (pointer events, onClick)

                        return (
                            <g
                                key={b.day}
                                onClick={() => {
                                    if (isToday) {
                                        useRamadanStore.getState().setCurrentDay(b.day);
                                    }
                                }}
                                className={`transition-all duration-300 ease-in-out ${isToday ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-60'}`}
                                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                            >
                                {/* Main Bead with shadow filter */}
                                <circle
                                    cx={b.x}
                                    cy={b.y}
                                    r={radius}
                                    fill={isFuture ? 'white' : `url(#fill-${b.day})`}
                                    filter="url(#drop-shadow)"
                                />

                                {/* Glow for today */}
                                {isToday && (
                                    <circle
                                        cx={b.x}
                                        cy={b.y}
                                        r={radius + 5}
                                        fill="none"
                                        stroke={singleHeartColor}
                                        strokeWidth={2}
                                        strokeOpacity={0.4}
                                        filter="url(#soft-glow)"
                                        className="animate-pulse"
                                    />
                                )}

                                {/* Lock Icon for Past/Future if needed, or just visual distinction. 
                                    User requested Past/Future locked. opacity-60 above helps. 
                                */}
                                {(isPast || isFuture) && (
                                    <circle cx={b.x} cy={b.y} r={radius} fill="rgba(200,200,200,0.1)" />
                                )}


                                {/* Day Number */}
                                <text
                                    x={b.x}
                                    y={b.y + 0.5}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className={`font-black pointer-events-none transition-colors duration-300 ${b.progress > 55 && !isFuture ? 'fill-white' : 'fill-[#3e2723]'
                                        }`}
                                    style={{ fontSize: isToday ? '15px' : '13px' }}
                                >
                                    {b.day}
                                </text>
                            </g>
                        );
                    })}
                </svg>



            </div>
            {/* Legend - Moved to a side or bottom area that doesn't overlap */}
            <div className="absolute bottom-4 mt-20 left-0 w-full flex justify-center gap-8 py-2 bg-white/40 border-t border-[#3e2723]/5 ">
                <div className="flex mt-2 items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white opacity-60 shadow-md" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#3e2723]/60">Locked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary shadow-lg animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#3e2723]">Active</span>
                </div>
            </div>
        </div>
    );
};
