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
    iftar: string;
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
    notes: Note[];
    alarms: Alarm[];

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

const defaultChallenges: Challenge[] = Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(), day: i + 1, task: `Day ${i + 1} Challenge`, completed: false
}));

export const useRamadanStore = create<RamadanStore>()(
    persist(
        (set, get) => ({
            ramadanStartDate: new Date().toISOString().split('T')[0],
            currentDay: 1,
            theme: 'light',
            notificationsEnabled: true,
            prayers: {},
            fasting: {},
            tasks: {},
            habits: {},
            meals: {},
            dailyPages: {},
            juzCompleted: Array(30).fill(false),
            challenges: defaultChallenges,
            duas: defaultDuas,
            notes: [],
            alarms: [],
            activeAlarm: null,
            selectedSound: 'beep',
            customSounds: [],
            khatamPlan: { totalPages: 604, pagesPerDay: 20 },

            setRamadanStartDate: (date) => set({ ramadanStartDate: date }),
            setCurrentDay: (day) => set({ currentDay: day }),
            setTheme: (theme) => set({ theme }),
            setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

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
