'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useRamadanStore } from '@/store/store';

const NotificationContext = createContext<{
    requestPermission: () => Promise<void>;
} | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { alarms, tasks, currentDay, notificationsEnabled } = useRamadanStore();
    const notifiedRefs = useRef<Set<string>>(new Set());

    const requestPermission = async () => {
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
    };

    useEffect(() => {
        if (!notificationsEnabled || typeof window === 'undefined') return;

        const playAlarmSound = () => {
            try {
                const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
                oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);

                gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.9);

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 1);
            } catch (e) {
                console.warn('Audio feedback blocked by browser policy', e);
            }
        };

        const checkNotifications = () => {
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            const { alarms, tasks, currentDay, activeAlarm } = useRamadanStore.getState();

            // Check Alarms
            alarms.forEach(alarm => {
                if (alarm.enabled && alarm.time === currentTime) {
                    const id = `alarm-${alarm.id}-${currentTime}`;
                    if (!notifiedRefs.current.has(id)) {
                        new Notification(`Ramadan Reminder: ${alarm.type}`, {
                            body: `It's time for ${alarm.type.toLowerCase()}!`,
                        });
                        playAlarmSound();
                        useRamadanStore.setState({ activeAlarm: { type: alarm.type, text: `It's time for ${alarm.type.toLowerCase()}!` } });
                        notifiedRefs.current.add(id);
                    }
                }
            });

            // Check Scheduled Tasks
            const todayTasks = tasks[currentDay] || [];
            todayTasks.forEach(task => {
                if (!task.completed && task.time === currentTime) {
                    const id = `task-${task.id}-${currentTime}`;
                    if (!notifiedRefs.current.has(id)) {
                        new Notification(`Task Reminder`, {
                            body: task.text,
                        });
                        playAlarmSound();
                        useRamadanStore.setState({ activeAlarm: { type: 'Task Reminder', text: task.text } });
                        notifiedRefs.current.add(id);
                    }
                }
            });
        };

        const interval = setInterval(checkNotifications, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [notificationsEnabled]);

    return (
        <NotificationContext.Provider value={{ requestPermission }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
    return context;
};
