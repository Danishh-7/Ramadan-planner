import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type PrayerStatus = 'completed' | 'missed' | 'qadha' | null;
export type FastingStatus = 'completed' | 'missed' | 'excused' | null;

export interface DailyPrayers {
    fajr: PrayerStatus;
    dhuhr: PrayerStatus;
    asr: PrayerStatus;
    maghrib: PrayerStatus;
    isha: PrayerStatus;
    sunnah: PrayerStatus;
    taraweeh: PrayerStatus;
    tahajjud: PrayerStatus;
    witr: PrayerStatus;
    sehri: boolean;
    iftar: boolean;
}

export interface Habit {
    id: string;
    name: string;
    timeOfDay: 'morning' | 'afternoon' | 'night';
    completed: boolean;
}

export interface Challenge {
    id: string;
    day: number;
    task: string;
    completed: boolean;
}

export interface Dua {
    id: string;
    title: string;
    arabic: string;
    transliteration: string;
    translation: string;
    isCustom: boolean;
    isFavorite: boolean;
    isHighlighted?: boolean;
}

export interface Task {
    id: string;
    day: number;
    text: string;
    completed: boolean;
    time?: string;
}

export interface Note {
    id: string;
    day: number;
    date: string;
    content: string;
}

export interface MealPlan {
    suhoor: string;
    khatamSehri?: string; // Fajr time - end of Sehri
    iftar: string;
}

export interface QuranBookmark {
    para: number;
    aya: number;
}

export interface Alarm {
    id: string;
    day: number;
    type: string;
    time: string;
    enabled: boolean;
}

interface RamadanStore {
    // Settings
    ramadanStartDate: string;
    currentDay: number;
    theme: 'light' | 'dark';
    notificationsEnabled: boolean;
    userCity: string;
    userCountry: string;

    // Daily Activities (30 days)
    prayers: Record<number, DailyPrayers>;
    fasting: Record<number, FastingStatus>;
    tasks: Record<number, Task[]>;
    habits: Record<number, Habit[]>;
    meals: Record<number, MealPlan>;
    dailyPages: Record<number, number>;

    // Global Collections
    juzCompleted: boolean[];
    challenges: Challenge[];
    duas: Dua[];
    duasLoading: boolean;
    notes: Note[];
    alarms: Alarm[];

    // Quran Tracking
    quranBookmark: QuranBookmark;
    quranCompletionCount: number;

    // Configuration
    khatamPlan: {
        totalPages: number;
        pagesPerDay: number;
    };

    // Actions
    setRamadanStartDate: (date: string) => void;
    setCurrentDay: (day: number) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    setLocation: (city: string, country: string) => Promise<void>;
    fetchTimings: (day: number) => Promise<void>;
    fetchDuas: () => Promise<void>;

    // Quran Actions
    setQuranBookmark: (para: number, aya: number) => void;
    completeQuranJourneys: () => void;
    resetJuzForNewJourney: () => void;
    setQuranCompletionCount: (count: number) => void;
    syncRamadanDay: () => void;

    // Activity Actions
    updatePrayerStatus: (day: number, prayer: keyof DailyPrayers, status: PrayerStatus | boolean) => void;
    updateFastingStatus: (day: number, status: FastingStatus) => void;
    updateMeal: (day: number, type: 'suhoor' | 'iftar', meal: string) => void;
    updateDailyPages: (day: number, pages: number) => void;
    updateChallengeText: (day: number, text: string) => void;

    // Task Actions
    addTask: (day: number, text: string, time?: string) => void;
    toggleTask: (day: number, taskId: string) => void;
    deleteTask: (day: number, taskId: string) => void;
    updateTask: (day: number, taskId: string, text: string, time?: string) => void;

    // Other Actions
    toggleJuz: (juzNumber: number) => void;
    setKhatamPlan: (totalPages: number, pagesPerDay: number) => void;
    addHabit: (day: number, habit: Omit<Habit, 'id'>) => void;
    toggleHabit: (day: number, habitId: string) => void;
    deleteHabit: (day: number, habitId: string) => void;
    updateChallenge: (day: number, task: string, completed: boolean) => void;
    addDua: (dua: Omit<Dua, 'id'>) => void;
    toggleFavoriteDua: (duaId: string) => void;
    deleteDua: (duaId: string) => void;
    addNote: (note: Omit<Note, 'id'>) => void;
    updateNote: (noteId: string, content: string) => void;
    deleteNote: (noteId: string) => void;
    addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
    toggleAlarm: (alarmId: string) => void;
    updateAlarm: (alarmId: string, time: string) => void;
    deleteAlarm: (alarmId: string) => void;

    // Alarms
    activeAlarm: { type: string, text: string } | null;
    dismissAlarm: () => void;
    selectedSound: string;
    customSounds: { id: string, name: string, url: string }[];
    setSelectedSound: (soundId: string) => void;
    addCustomSound: (name: string, url: string) => void;

    // Settings
    resetAllData: () => void;
    exportData: () => string;
    importData: (json: string) => void;
}

const defaultPrayers: DailyPrayers = {
    fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null,
    sunnah: null, taraweeh: null, tahajjud: null, witr: null,
    sehri: false, iftar: false,
};

const defaultDuas: Dua[] = [
    { id: '1', title: 'Niyyah for Fasting', arabic: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى', transliteration: 'Nawaitu sauma ghadin...', translation: 'I intend to keep the fast...', isCustom: false, isFavorite: false, isHighlighted: true },
    { id: '2', title: 'Dua for Iftar', arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ', transliteration: 'Dhahaba az-zamau...', translation: 'The thirst has gone...', isCustom: false, isFavorite: false, isHighlighted: true },
    { id: '3', title: 'Dua for Laylatul Qadr', arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', transliteration: 'Allahumma innaka...', translation: 'O Allah, You are Forgiving...', isCustom: false, isFavorite: false, isHighlighted: true },
];

const defaultChallenges: Challenge[] = [
    { id: '1', day: 1, task: 'Read and understand Surah Al-Fatiha with translation', completed: false },
    { id: '2', day: 2, task: 'Pray all 5 daily prayers on time', completed: false },
    { id: '3', day: 3, task: 'Give charity to someone in need', completed: false },
    { id: '4', day: 4, task: 'Memorize a new short Surah', completed: false },
    { id: '5', day: 5, task: 'Make dua for your parents after every prayer', completed: false },
    { id: '6', day: 6, task: 'Read Surah Al-Kahf and reflect on its lessons', completed: false },
    { id: '7', day: 7, task: 'Fast with full consciousness and gratitude', completed: false },
    { id: '8', day: 8, task: 'Seek forgiveness from someone you may have wronged', completed: false },
    { id: '9', day: 9, task: 'Spend 30 minutes in dhikr and remembrance of Allah', completed: false },
    { id: '10', day: 10, task: 'Call a family member and strengthen your bond', completed: false },
    { id: '11', day: 11, task: 'Read about the life of Prophet Muhammad (PBUH)', completed: false },
    { id: '12', day: 12, task: 'Donate to a charitable cause', completed: false },
    { id: '13', day: 13, task: 'Pray Tahajjud and make sincere dua', completed: false },
    { id: '14', day: 14, task: 'Reflect on your blessings and write them down', completed: false },
    { id: '15', day: 15, task: 'Help someone without expecting anything in return', completed: false },
    { id: '16', day: 16, task: 'Read Tafsir of your favorite Surah', completed: false },
    { id: '17', day: 17, task: 'Make istighfar 100 times today', completed: false },
    { id: '18', day: 18, task: 'Invite someone to break fast with you', completed: false },
    { id: '19', day: 19, task: 'Recite Ayatul Kursi after every prayer', completed: false },
    { id: '20', day: 20, task: 'Spend quality time with your family', completed: false },
    { id: '21', day: 21, task: 'Seek Laylatul Qadr - increase worship and dua', completed: false },
    { id: '22', day: 22, task: 'Make dua for the Ummah and those suffering', completed: false },
    { id: '23', day: 23, task: 'Seek Laylatul Qadr - recite Quran with reflection', completed: false },
    { id: '24', day: 24, task: 'Give Sadaqah in secret', completed: false },
    { id: '25', day: 25, task: 'Seek Laylatul Qadr - pray Tahajjud and make dua', completed: false },
    { id: '26', day: 26, task: 'Forgive everyone who has wronged you', completed: false },
    { id: '27', day: 27, task: 'Seek Laylatul Qadr - maximize worship tonight', completed: false },
    { id: '28', day: 28, task: 'Plan how to maintain good habits after Ramadan', completed: false },
    { id: '29', day: 29, task: 'Make sincere tawbah and ask for Jannah', completed: false },
    { id: '30', day: 30, task: 'Thank Allah for completing Ramadan and prepare for Eid', completed: false },
];

export const useRamadanStore = create<RamadanStore>()(
    persist(
        (set, get) => ({
            ramadanStartDate: '2026-02-19', // Default for India, will be auto-fetched via API
            currentDay: 1,
            theme: 'light',
            notificationsEnabled: true,
            userCity: 'Dadri',
            userCountry: 'India',
            prayers: {},
            fasting: {},
            tasks: {},
            habits: {},
            meals: {},
            dailyPages: {},
            juzCompleted: Array(30).fill(false),
            challenges: defaultChallenges,
            duas: defaultDuas,
            duasLoading: false,
            notes: [],
            alarms: [],
            activeAlarm: null,
            selectedSound: 'beep',
            customSounds: [],
            khatamPlan: { totalPages: 604, pagesPerDay: 20 },
            quranBookmark: { para: 1, aya: 1 },
            quranCompletionCount: 0,

            setRamadanStartDate: (date) => set({ ramadanStartDate: date }),
            setCurrentDay: (day) => set({ currentDay: day }),
            setTheme: (theme) => set({ theme }),
            setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
            setLocation: async (city, country) => {
                try {
                    const { getRamadanStartDate } = await import('@/services/aladhanApi');
                    const startDate = await getRamadanStartDate(city, country);
                    console.log(startDate, "date");
                    set({ userCity: city, userCountry: country, ramadanStartDate: startDate });
                    get().syncRamadanDay();
                } catch (error) {
                    console.error('Failed to fetch Ramadan start date:', error);
                    set({ userCity: city, userCountry: country });
                }
            },
            syncRamadanDay: () => {
                const { ramadanStartDate } = get();
                const start = new Date(ramadanStartDate);
                start.setHours(0, 0, 0, 0);
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const diffTime = now.getTime() - start.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const currentDay = Math.max(1, Math.min(30, diffDays + 1));
                // Only update if it helps or if date is valid within range
                if (diffDays >= 0 && diffDays < 30) {
                    set({ currentDay });
                } else if (diffDays < 0) {
                    set({ currentDay: 1 }); // Before Ramadan
                }
            },

            fetchTimings: async (day) => {
                const { userCity, userCountry } = get();
                const { getSehriIftarTimings } = await import('@/services/aladhanApi');
                const timings = await getSehriIftarTimings(userCity, userCountry);
                if (timings) {
                    set((state) => ({
                        meals: {
                            ...state.meals,
                            [day]: {
                                suhoor: timings.sehri,
                                khatamSehri: timings.khatamSehri,
                                iftar: timings.iftar
                            }
                        }
                    }));
                }
            },

            fetchDuas: async () => {
                if (get().duasLoading) return;
                set({ duasLoading: true });
                try {
                    const { fetchAuthenticDuas } = await import('@/services/duaApi');
                    const authenticDuas = await fetchAuthenticDuas();

                    set((state) => {
                        // 1. Create a map of existing duas by ID for quick access
                        const duaMap = new Map(state.duas.map(d => [d.id, d]));

                        // 2. Process authentic duas: unique them and merge into map
                        authenticDuas.forEach(newDua => {
                            const existing = duaMap.get(newDua.id);
                            if (!existing || (!existing.arabic && newDua.arabic)) {
                                duaMap.set(newDua.id, { ...existing, ...newDua });
                            }
                        });

                        return {
                            duas: Array.from(duaMap.values()),
                            duasLoading: false
                        };
                    });
                } catch (error) {
                    console.error('Failed to fetch authentic duas:', error);
                    set({ duasLoading: false });
                }
            },

            updatePrayerStatus: (day, prayer, status) => {
                set((state) => ({ prayers: { ...state.prayers, [day]: { ...(state.prayers[day] || defaultPrayers), [prayer]: status } } }));
            },

            updateFastingStatus: (day, status) => {
                set((state) => ({ fasting: { ...state.fasting, [day]: status } }));
            },

            updateMeal: (day, type, meal) =>
                set((state) => ({ meals: { ...state.meals, [day]: { ...(state.meals[day] || { suhoor: '', iftar: '' }), [type]: meal } } })),

            updateDailyPages: (day, pages) =>
                set((state) => ({ dailyPages: { ...state.dailyPages, [day]: Math.max(0, pages) } })),

            addTask: (day, text, time) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [day]: [...(state.tasks[day] || []), { id: Date.now().toString(), day, text, completed: false, time }]
                    }
                })),

            toggleTask: (day, taskId) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [day]: (state.tasks[day] || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
                    }
                })),

            deleteTask: (day, taskId) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [day]: (state.tasks[day] || []).filter(t => t.id !== taskId)
                    }
                })),

            updateTask: (day, taskId, text, time) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [day]: (state.tasks[day] || []).map(t => t.id === taskId ? { ...t, text, time } : t)
                    }
                })),

            toggleJuz: (juzNumber) => set((state) => {
                const newJuz = [...state.juzCompleted];
                newJuz[juzNumber - 1] = !newJuz[juzNumber - 1];
                return { juzCompleted: newJuz };
            }),

            setKhatamPlan: (totalPages, pagesPerDay) => set({ khatamPlan: { totalPages, pagesPerDay } }),

            setQuranBookmark: (para, aya) => set({ quranBookmark: { para, aya } }),

            completeQuranJourneys: () => set((state) => ({
                quranCompletionCount: state.quranCompletionCount + 1
            })),

            resetJuzForNewJourney: () => set({ juzCompleted: Array(30).fill(false) }),

            setQuranCompletionCount: (count) => set({ quranCompletionCount: Math.max(0, count) }),

            addHabit: (day, habit) => set((state) => ({ habits: { ...state.habits, [day]: [...(state.habits[day] || []), { ...habit, id: Date.now().toString() }] } })),
            toggleHabit: (day, habitId) => set((state) => ({ habits: { ...state.habits, [day]: (state.habits[day] || []).map(h => h.id === habitId ? { ...h, completed: !h.completed } : h) } })),
            deleteHabit: (day, habitId) => set((state) => ({ habits: { ...state.habits, [day]: (state.habits[day] || []).filter(h => h.id !== habitId) } })),

            updateChallenge: (day, task, completed) => set((state) => ({ challenges: state.challenges.map(c => c.day === day ? { ...c, task, completed } : c) })),
            updateChallengeText: (day, text) => set((state) => ({ challenges: state.challenges.map(c => c.day === day ? { ...c, task: text } : c) })),

            addDua: (dua) => set((state) => ({ duas: [...state.duas, { ...dua, id: Date.now().toString() }] })),
            toggleFavoriteDua: (duaId) => set((state) => ({ duas: state.duas.map(d => d.id === duaId ? { ...d, isFavorite: !d.isFavorite } : d) })),
            deleteDua: (duaId) => set((state) => ({ duas: state.duas.filter(d => d.id !== duaId) })),

            addNote: (note) => set((state) => ({ notes: [...state.notes, { ...note, id: Date.now().toString() }] })),
            updateNote: (noteId, content) => set((state) => ({ notes: state.notes.map(n => n.id === noteId ? { ...n, content } : n) })),
            deleteNote: (noteId) => set((state) => ({ notes: state.notes.filter(n => n.id !== noteId) })),

            addAlarm: (alarm) => set((state) => ({ alarms: [...state.alarms, { ...alarm, id: Date.now().toString() }] })),
            toggleAlarm: (alarmId) => set((state) => ({ alarms: state.alarms.map(a => a.id === alarmId ? { ...a, enabled: !a.enabled } : a) })),
            updateAlarm: (alarmId, time) => set((state) => ({ alarms: state.alarms.map(a => a.id === alarmId ? { ...a, time } : a) })),
            deleteAlarm: (alarmId) => set((state) => ({ alarms: state.alarms.filter(a => a.id !== alarmId) })),

            dismissAlarm: () => set({ activeAlarm: null }),
            setSelectedSound: (soundId) => set({ selectedSound: soundId }),
            addCustomSound: (name, url) => set((state) => ({
                customSounds: [...state.customSounds, { id: Date.now().toString(), name, url }]
            })),

            resetAllData: () => set({ prayers: {}, fasting: {}, tasks: {}, habits: {}, meals: {}, dailyPages: {}, juzCompleted: Array(30).fill(false), notes: [], alarms: [], activeAlarm: null, selectedSound: 'beep', customSounds: [] }),
            exportData: () => JSON.stringify(get(), null, 2),
            importData: (json) => {
                try {
                    const data = JSON.parse(json);
                    set(data);
                } catch (e) { console.error('Import failed', e); }
            },
        }),
        { name: 'ramadan-planner-storage' }
    )
);
