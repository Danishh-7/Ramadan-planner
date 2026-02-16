'use client';

import React, { useEffect, useRef } from 'react';
import { useRamadanStore } from '@/store/store';
import { Bell, X, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const AlarmOverlay: React.FC = () => {
    const { activeAlarm, dismissAlarm, selectedSound, customSounds } = useRamadanStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (activeAlarm) {
            let soundUrl = '';

            const builtInSounds: Record<string, string> = {
                'beep': 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
                'siren': 'https://assets.mixkit.co/active_storage/sfx/950/950-preview.mp3',
                'adhan': 'https://www.islamcan.com/audio/adhan/azan1.mp3',
                'nasheed': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
            };

            const customSound = customSounds.find(s => s.id === selectedSound);
            if (customSound) {
                soundUrl = customSound.url;
            } else {
                soundUrl = builtInSounds[selectedSound] || builtInSounds['beep'];
            }

            const audio = new Audio(soundUrl);
            audio.loop = true;
            audio.volume = 0.5;

            audio.play().catch(e => console.warn('Audio playback failed', e));
            audioRef.current = audio;

            return () => {
                audio.pause();
                audio.currentTime = 0;
            };
        }
    }, [activeAlarm, selectedSound, customSounds]);

    if (!activeAlarm) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] p-12 max-w-md w-full mx-4 shadow-[0_0_100px_rgba(255,109,0,0.4)] border-4 border-secondary animate-in zoom-in-95 duration-300 text-center space-y-8 relative overflow-hidden">
                {/* Visual pulse background */}
                <div className="absolute inset-0 bg-secondary/5 animate-pulse" />

                <div className="relative space-y-6">
                    <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <Bell className="w-12 h-12 text-secondary" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-4xl font-black italic text-[#3e2723] uppercase tracking-tighter">
                            {activeAlarm.type}
                        </h2>
                        <p className="text-xl font-bold text-muted-foreground italic">
                            {activeAlarm.text}
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col gap-4">
                        <Button
                            className="w-full py-8 text-2xl font-black rounded-3xl shadow-xl shadow-secondary/20"
                            onClick={dismissAlarm}
                        >
                            <X className="w-6 h-6 mr-3" /> DISMISS ALARM
                        </Button>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            <Volume2 className="w-3 h-3" /> Alarm Sound Playing
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
