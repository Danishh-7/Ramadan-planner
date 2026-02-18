'use client';

import React, { useState, useEffect } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { BookOpen, Sparkles, Trophy } from 'lucide-react';

export const QuranTracker: React.FC = () => {
    const {
        juzCompleted,
        toggleJuz,
        dailyPages,
        updateDailyPages,
        currentDay,
        quranBookmark,
        setQuranBookmark,
        quranCompletionCount,
        completeQuranJourneys,
        resetJuzForNewJourney,
        setQuranCompletionCount
    } = useRamadanStore();

    const [bookmarkPara, setBookmarkPara] = useState(quranBookmark.para.toString());
    const [bookmarkAya, setBookmarkAya] = useState(quranBookmark.aya.toString());
    const [showBookmarkModal, setShowBookmarkModal] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [showEditCountModal, setShowEditCountModal] = useState(false);
    const [editCountValue, setEditCountValue] = useState(quranCompletionCount.toString());

    const completedJuzCount = juzCompleted.filter(Boolean).length;

    // Check if all Juz are completed
    useEffect(() => {
        const timer = setTimeout(() => {
            if (completedJuzCount === 30 && !showCompletionModal) {
                setShowCompletionModal(true);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [completedJuzCount, showCompletionModal]);

    const handleCompletionConfirm = () => {
        completeQuranJourneys();
        resetJuzForNewJourney();
        setShowCompletionModal(false);
    };

    const handleCompletionCancel = () => {
        // Toggle the last completed juz back to incomplete
        const lastJuzIndex = juzCompleted.findIndex((val, idx, arr) => val && arr[idx + 1] === true) || juzCompleted.lastIndexOf(true);
        if (lastJuzIndex !== -1) {
            toggleJuz(lastJuzIndex + 1);
        }
        setShowCompletionModal(false);
    };

    const handleBookmarkSave = () => {
        const para = parseInt(bookmarkPara) || 1;
        const aya = parseInt(bookmarkAya) || 1;
        setQuranBookmark(para, aya);
        setShowBookmarkModal(false);
    };

    const handleCounterEdit = () => {
        const newCount = parseInt(editCountValue) || 0;
        setQuranCompletionCount(newCount);
        setShowEditCountModal(false);
    };

    return (
        <div className="space-y-12 animate-fade-in pb-12 font-serif">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Quran Journey</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Light for the soul and guidance for mankind</p>
            </div>

            {/* Completion Counter */}
            {quranCompletionCount > 0 && (
                <Card className="p-8 rounded-[3rem] notebook-border bg-linear-to-r from-amber-100 to-yellow-100 shadow-xl border-2 border-amber-300 cursor-pointer hover:shadow-2xl transition-shadow" onClick={() => setShowEditCountModal(true)}>
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-white">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-amber-900">Mashaallah!</p>
                                <p className="text-2xl font-black text-amber-900">Quran Completed {quranCompletionCount} Time{quranCompletionCount > 1 ? 's' : ''}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-800 mt-1">(Click to Edit)</p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="p-10 rounded-[3rem] notebook-border flex flex-col items-center text-center space-y-6 bg-white shadow-xl">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-6xl font-black italic text-[#4a342e]">{completedJuzCount}</div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8d6e63]">Juz Completed</p>
                    </div>
                    <ProgressBar value={completedJuzCount} max={30} color="primary" className="h-4" />
                </Card>

                <Card className="p-10 rounded-[3rem] notebook-border flex flex-col items-center text-center space-y-6 bg-[#fdfcf0] shadow-xl">
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <div className="text-3xl font-black italic text-[#4a342e]">Para {quranBookmark.para}</div>
                        <div className="text-3xl font-black italic text-[#4a342e]">Aya {quranBookmark.aya}</div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8d6e63]">Last Bookmark</p>
                    </div>
                </Card>
            </div>

            <Card className="bg-[#4a342e] text-white p-10 rounded-[3rem] notebook-shadow space-y-8 border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BookOpen className="w-20 h-20" />
                </div>
                {/* <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-8 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-3xl font-black italic text-secondary/90">Daily Progress</h3>
                    </div>
                    <div className="flex items-center gap-6 p-4">
                        <span className="font-black text-xl text-black bg-green-500 px-2 py-1 rounded">
                            PAGES READ:
                        </span>

                        <input
                            type="number"
                            value={dailyPages[currentDay] || 0}
                            onChange={(e) =>
                                updateDailyPages(currentDay, parseInt(e.target.value) || 0)
                            }
                            className="w-28 bg-white-500/10 border-2 border-black dark:border-white/50 rounded-2xl px-4 py-5 text-4xl font-black text-center text-black dark:text-white focus:ring-2 focus:ring-secondary outline-none focus:bg-white/20 transition-all [color-scheme:dark]"
                        />
                    </div>
                </div> */}
                <div className="flex justify-center relative z-10">
                    <Button
                        variant="ghost"
                        className="text-secondary border-2 border-secondary/20 hover:bg-secondary/10 px-8 py-6 rounded-2xl font-black tracking-widest text-xs"
                        onClick={() => setShowBookmarkModal(true)}
                    >
                        ADD BOOKMARK
                    </Button>
                </div>
            </Card>

            <div className="space-y-8">
                <h3 className="text-3xl font-black italic text-center text-[#4a342e]">Juz Registry</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                        <button
                            key={juz}
                            onClick={() => toggleJuz(juz)}
                            className={`aspect-square rounded-2xl font-black text-xl transition-all shadow-md transform hover:scale-105 active:scale-95 ${juzCompleted[juz - 1] ? 'bg-completed text-white shadow-completed/20 border-2 border-white/30' : 'bg-white text-[#8d6e63] border-2 border-dashed border-border/50 hover:bg-[#fdfcf0]'}`}
                        >
                            {juz}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookmark Modal */}
            <Modal isOpen={showBookmarkModal} onClose={() => setShowBookmarkModal(false)} title="Save Your Bookmark" size="sm">
                <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Para Number</label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={bookmarkPara}
                                onChange={(e) => setBookmarkPara(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-border dark:border-white dark:[color-scheme:dark] font-black text-2xl focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Aya Number</label>
                            <input
                                type="number"
                                min="1"
                                value={bookmarkAya}
                                onChange={(e) => setBookmarkAya(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-border dark:border-white dark:[color-scheme:dark] font-black text-2xl focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>
                    <Button onClick={handleBookmarkSave} className="w-full py-6 rounded-2xl font-black">SAVE BOOKMARK</Button>
                </div>
            </Modal>

            {/* Completion Modal */}
            <Modal isOpen={showCompletionModal} onClose={() => setShowCompletionModal(false)} title="Quran Completion" size="sm">
                <div className="space-y-6 pt-4 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-2xl font-black text-primary">Mashaallah!</p>
                    <p className="text-lg font-bold text-muted-foreground">
                        You have completed reading the entire Quran!
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                        Would you like to record this completion and start a new journey?
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Button
                            onClick={handleCompletionConfirm}
                            className="flex-1 py-6 rounded-2xl font-black bg-completed hover:bg-completed/90"
                        >
                            YES, RECORD IT
                        </Button>
                        <Button
                            onClick={handleCompletionCancel}
                            variant="ghost"
                            className="flex-1 py-6 rounded-2xl font-black border-2 border-border"
                        >
                            CANCEL
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
