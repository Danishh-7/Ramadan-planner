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

    const dayColors = [
        '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
        '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
        '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40',
        '#FF6E40', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
        '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
    ];

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
            color: dayColors[i % dayColors.length],
            progress: getDailyProgress(i + 1)
        });
    }

    return beads;
}, [currentDay, prayers, fasting, dailyPages]);


    return (
        <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-[3.5rem] bg-[#fdfaf5] p-6 notebook-border shadow-2xl overflow-hidden group flex flex-col">
            {/* Minimalist Header - Moved to Top Outside the Heart Path */}
            {/* <div className="pt-4 pb-2 text-center border-b border-dashed border-[#3e2723]/10">
                <h2 className="text-3xl font-black italic tracking-tighter text-[#3e2723] opacity-90 leading-none">
                    Heart of Ramadan
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-px w-6 bg-[#3e2723]/20" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-secondary">Progress Record</span>
                    <div className="h-px w-6 bg-[#3e2723]/20" />
                </div>
            </div> */}

            <div className="flex-1 relative">
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
                    </defs>

                    {/* Clean background */}
                    <rect width="500" height="500" fill="transparent" />

                    {heartBeads.map((b) => {
                        const isFuture = b.day > currentDay;
                        const isToday = b.day === currentDay;
                        const radius = isToday ? 24 : 20;

                        return (
                            <g
                                key={b.day}
                                className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110"
                                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                            >
                                {/* Shadow backing */}
                                <circle
                                    cx={b.x}
                                    cy={b.y + 2}
                                    r={radius}
                                    fill="rgba(62, 39, 35, 0.1)"
                                />

                                {/* Main Bead */}
                                <circle
                                    cx={b.x}
                                    cy={b.y}
                                    r={radius}
                                    fill={isFuture ? 'white' : `url(#fill-${b.day})`}
                                    stroke={isToday ? b.color : '#3e2723'}
                                    strokeWidth={isToday ? 4 : 1.5}
                                    strokeOpacity={isFuture ? 0.2 : 0.8}
                                />

                                {/* Glow for today */}
                                {isToday && (
                                    <circle
                                        cx={b.x}
                                        cy={b.y}
                                        r={radius + 5}
                                        fill="none"
                                        stroke={b.color}
                                        strokeWidth={2}
                                        strokeOpacity={0.4}
                                        filter="url(#soft-glow)"
                                        className="animate-pulse"
                                    />
                                )}

                                {/* Glossy point */}
                                <circle
                                    cx={b.x - radius / 3}
                                    cy={b.y - radius / 3}
                                    r={radius / 4}
                                    fill="rgba(255,255,255,0.4)"
                                />

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
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-8 py-2 bg-white/40 border-t border-[#3e2723]/5 ">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-[#3e2723] bg-white" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#3e2723]/60">Upcoming</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-[#3e2723] bg-secondary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#3e2723]/60">Filled</span>
                </div>
            </div>
        </div>
    );
};
