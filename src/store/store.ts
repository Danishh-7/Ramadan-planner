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
    points: number;
    isMystery: boolean;
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

import { DietaryGoal, HealthCondition, Region } from '@/data/mealsDB';

export interface MealPlan {
    suhoor?: string;
    iftar?: string;
    suhoorIds?: string[];
    iftarIds?: string[];
    snackIds?: string[];
}

export interface DietaryProfile {
    goal: DietaryGoal;
    condition: HealthCondition;
    region: Region;
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
    notes: Note[];
    alarms: Alarm[];

    // Gamification
    hasanatPoints: number;
    currentStreak: number;
    completedChallengeDays: number[]; // Record days successfully completed to compute streak

    // Dietary
    dietaryProfile: DietaryProfile;

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
    setLocation: (city: string, country: string) => void;
    updateDietaryProfile: (profile: Partial<DietaryProfile>) => void;
    fetchTimings: (day: number) => Promise<void>;
    syncRamadanDay: () => void;
    detectLocation: () => Promise<void>;

    // Quran Actions
    setQuranBookmark: (para: number, aya: number) => void;
    completeQuranJourneys: () => void;
    resetJuzForNewJourney: () => void;
    setQuranCompletionCount: (count: number) => void;

    // Activity Actions
    updatePrayerStatus: (day: number, prayer: keyof DailyPrayers, status: PrayerStatus | boolean) => void;
    updateFastingStatus: (day: number, status: FastingStatus) => void;
    addFoodToMeal: (day: number, type: 'suhoor' | 'iftar' | 'snack', mealId: string) => void;
    removeFoodFromMeal: (day: number, type: 'suhoor' | 'iftar' | 'snack', mealId: string) => void;
    clearMeal: (day: number, type: 'suhoor' | 'iftar' | 'snack') => void;
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

const prefilledTasks = [
    "Donate money to a charity",
    "Learn a new dua",
    "Read a story of our prophets",
    "Pray an extra sunnah prayer",
    "Listen to an Islamic podcast",
    "Memorize a short Surah",
    "Visit someone who is ill",
    "Give up a bad habit for the day",
    "Do extra Dhikr after prayers",
    "Pray Tahajjud tonight",
    "Read 5 pages of the Quran with translation",
    "Help your family with Iftar prep",
    "Share food with a neighbor or the needy",
    "Make heartfelt Dua for your parents",
    "Visit the mosque for congregational prayer",
    "Read a book on Islamic History",
    "Learn the meaning of your favorite Ayah",
    "Reach out to reunite with an old friend",
    "Listen to a full Surah recitation",
    "Perform a random act of kindness",
    "Sponsor an orphan or feed a fasting person",
    "Learn the 99 Names of Allah (Al Asma Ul Husna)",
    "Avoid backbiting, gossip, and arguments all day",
    "Spend 15 minutes contemplating in silence",
    "Do 100x Istighfar (seeking forgiveness)",
    "Clean the mosque or your local prayer area",
    "Forgive someone in your heart who wronged you",
    "Write down 5 things you are grateful for today",
    "Pray 20 rakat Taraweeh",
    "Make a grand, heartfelt Dua for the entire Ummah"
];

const defaultChallenges: Challenge[] = Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
    day: i + 1,
    task: prefilledTasks[i],
    completed: false,
    points: (i + 1) % 5 === 0 ? 50 : 10, // Mystery days every 5 days
    isMystery: (i + 1) % 5 === 0
}));

export const useRamadanStore = create<RamadanStore>()(
    persist(
        (set, get) => ({
            ramadanStartDate: new Date().toISOString().split('T')[0],
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
            notes: [],
            alarms: [],
            hasanatPoints: 0,
            currentStreak: 0,
            completedChallengeDays: [],
            dietaryProfile: { goal: 'maintenance', condition: 'none', region: 'desi' },
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
            setLocation: (city, country) => set({ userCity: city, userCountry: country }),
            updateDietaryProfile: (profile) => set((state) => ({ dietaryProfile: { ...state.dietaryProfile, ...profile } })),

            syncRamadanDay: () => {
                const { ramadanStartDate } = get();
                if (ramadanStartDate) {
                    const [year, month, day] = ramadanStartDate.split('T')[0].split('-').map(Number);
                    const start = new Date(year, month - 1, day);
                    const today = new Date();
                    start.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);
                    const diffTime = today.getTime() - start.getTime();
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                    const newDay = Math.min(30, Math.max(1, diffDays + 1));

                    if (get().currentDay !== newDay) {
                        set({ currentDay: newDay });
                    }
                }
            },

            detectLocation: async () => {
                try {
                    const res = await fetch('https://ipapi.co/json/');
                    if (res.ok) {
                        const data = await res.json();
                        if (data.city && data.country_name) {
                            set({ userCity: data.city, userCountry: data.country_name });
                        }
                    }
                } catch (e) {
                    console.error('Failed to detect location', e);
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
                                iftar: timings.iftar
                            }
                        }
                    }));
                }
            },

            updatePrayerStatus: (day, prayer, status) => {
                set((state) => ({ prayers: { ...state.prayers, [day]: { ...(state.prayers[day] || defaultPrayers), [prayer]: status } } }));
            },

            updateFastingStatus: (day, status) => {
                set((state) => ({ fasting: { ...state.fasting, [day]: status } }));
            },

            addFoodToMeal: (day, type, mealId) =>
                set((state) => {
                    const currentDayMeals = state.meals[day] || {};
                    const arrayName = `${type}Ids` as 'suhoorIds' | 'iftarIds' | 'snackIds';
                    const currentIds = currentDayMeals[arrayName] || [];
                    if (currentIds.includes(mealId)) return state;
                    return {
                        meals: {
                            ...state.meals,
                            [day]: { ...currentDayMeals, [arrayName]: [...currentIds, mealId] }
                        }
                    };
                }),

            removeFoodFromMeal: (day, type, mealId) =>
                set((state) => {
                    const currentDayMeals = state.meals[day] || {};
                    const arrayName = `${type}Ids` as 'suhoorIds' | 'iftarIds' | 'snackIds';
                    const currentIds = currentDayMeals[arrayName] || [];
                    return {
                        meals: {
                            ...state.meals,
                            [day]: { ...currentDayMeals, [arrayName]: currentIds.filter(id => id !== mealId) }
                        }
                    };
                }),

            clearMeal: (day, type) =>
                set((state) => {
                    const currentDayMeals = state.meals[day] || {};
                    return {
                        meals: {
                            ...state.meals,
                            [day]: { ...currentDayMeals, [`${type}Ids`]: [] }
                        }
                    };
                }),

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

            updateChallenge: (day, task, completed) => set((state) => {
                const challengeIndex = state.challenges.findIndex(c => c.day === day);
                if (challengeIndex === -1) return state;

                const challenge = state.challenges[challengeIndex];

                // If checking it off
                let newPoints = state.hasanatPoints;
                let newCompletedDays = [...state.completedChallengeDays];

                if (completed && !challenge.completed) {
                    newPoints += challenge.points;
                    if (!newCompletedDays.includes(day)) {
                        newCompletedDays.push(day);
                        newCompletedDays.sort((a, b) => a - b);
                    }
                } else if (!completed && challenge.completed) {
                    newPoints -= challenge.points;
                    newCompletedDays = newCompletedDays.filter(d => d !== day);
                }

                // Calculate simple streak (consecutive days leading up to last completed day)
                let newStreak = 0;
                if (newCompletedDays.length > 0) {
                    newStreak = 1;
                    for (let i = newCompletedDays.length - 1; i > 0; i--) {
                        if (newCompletedDays[i] - newCompletedDays[i - 1] === 1) {
                            newStreak++;
                        } else {
                            break;
                        }
                    }
                }

                const newChallenges = [...state.challenges];
                newChallenges[challengeIndex] = { ...challenge, task, completed };

                return {
                    challenges: newChallenges,
                    hasanatPoints: Math.max(0, newPoints),
                    currentStreak: newStreak,
                    completedChallengeDays: newCompletedDays
                };
            }),
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

            resetAllData: () => set({ prayers: {}, fasting: {}, tasks: {}, habits: {}, meals: {}, dailyPages: {}, juzCompleted: Array(30).fill(false), notes: [], alarms: [], hasanatPoints: 0, currentStreak: 0, completedChallengeDays: [], activeAlarm: null, selectedSound: 'beep', customSounds: [], dietaryProfile: { goal: 'maintenance', condition: 'none', region: 'desi' } }),
            exportData: () => JSON.stringify(get(), null, 2),
            importData: (json) => {
                try {
                    const data = JSON.parse(json);

                    // Migration: Ensure old placeholder tasks are upgraded but completion state is preserved
                    if (data.challenges && Array.isArray(data.challenges)) {
                        const needsMigration = data.challenges.some((c: any) =>
                            c.points === undefined ||
                            c.isMystery === undefined ||
                            (c.task.startsWith('Day ') && c.task.endsWith(' Challenge'))
                        );

                        if (needsMigration) {
                            console.log('Migrating old challenge data from Supabase...');
                            data.challenges = defaultChallenges.map((defaultChallenge, index) => {
                                const oldChallenge = data.challenges[index];
                                return {
                                    ...defaultChallenge,
                                    completed: oldChallenge ? oldChallenge.completed : false
                                };
                            });
                        }
                    }

                    set(data);
                    get().syncRamadanDay();
                } catch (e) {
                    console.error('Import failed', e);
                }
            },
        }),
        { name: 'ramadan-planner-v2' }
    )
);
