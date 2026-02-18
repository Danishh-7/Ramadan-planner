'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Calendar as CalendarIcon, Bell, Plus, Clock, Volume2, Trash2 } from 'lucide-react';
import { useNotifications } from '../providers/NotificationProvider';
import { SearchableSelect } from '../ui/SearchableSelect';
import { COUNTRIES, getCitiesForCountry } from '@/data/locations';

export const Settings: React.FC = () => {
    const {
        ramadanStartDate, setRamadanStartDate, alarms, addAlarm, toggleAlarm, deleteAlarm,
        notificationsEnabled, setNotificationsEnabled,
        selectedSound, setSelectedSound, customSounds, addCustomSound,
        userCity, userCountry, setLocation, fetchTimings, meals, currentDay
    } = useRamadanStore();

    const { requestPermission } = useNotifications();
    const [showAddAlarm, setShowAddAlarm] = useState(false);
    const [newAlarm, setNewAlarm] = useState({ type: 'General', time: '05:00', day: 1 });

    // Local state for immediate UI updates (prevents API call on every keystroke)
    const [localCity, setLocalCity] = useState(userCity);
    const [localCountry, setLocalCountry] = useState(userCountry);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Sync local state when store updates
    useEffect(() => {
        setLocalCity(userCity);
        setLocalCountry(userCountry);
    }, [userCity, userCountry]);

    // Get available cities for selected country
    const availableCities = getCitiesForCountry(localCountry);

    // Handle country change - reset city if not in new country's list
    const handleCountryChange = (country: string) => {
        setLocalCountry(country);
        const citiesInCountry = getCitiesForCountry(country);
        if (citiesInCountry.length > 0 && !citiesInCountry.includes(localCity)) {
            setLocalCity(citiesInCountry[0]); // Set to first city in list
        }
    };

    // Debounced API call - only triggers 1 second after user stops typing
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            if (localCity && localCountry && (localCity !== userCity || localCountry !== userCountry)) {
                setLocation(localCity, localCountry);
            }
        }, 1000); // Wait 1 second after user stops typing

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [localCity, localCountry]);

    const handleAddAlarm = () => {
        addAlarm({ ...newAlarm, enabled: true });
        setShowAddAlarm(false);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 overflow-hidden font-serif">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold gradient-text mb-2">Settings</h1>
                <p className="text-muted-foreground font-medium italic">Configure your spiritual environment</p>
            </div>

            {/* Ramadan Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex flex-col gap-4 bg-card shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-card-foreground">Ramadan Start Date</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-bold px-1 opacity-70">
                        Ensures your 30-day tracking aligns with the lunar calendar.
                    </p>
                    <input
                        type="date"
                        value={ramadanStartDate}
                        onChange={(e) => setRamadanStartDate(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-border dark:border-white dark:[color-scheme:dark] bg-background/50 focus:border-primary focus:outline-none font-black text-foreground shadow-inner cursor-not-allowed opacity-80"
                        readOnly
                    />
                    <p className="text-xs text-secondary font-bold italic px-1">
                        * Auto-detected based on {userCountry} ({ramadanStartDate})
                    </p>
                </Card>

                <Card className="flex flex-col gap-4 bg-white shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-[#4a342e]">Location Settings</h3>
                    </div>
                    <p className="text-sm text-[#8d6e63] font-bold px-1 opacity-70">
                        Set your city and country to get accurate prayer timings.
                    </p>
                    <div className="space-y-4">

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">Country</label>
                            <SearchableSelect
                                value={localCountry}
                                options={COUNTRIES}
                                onChange={handleCountryChange}
                                placeholder="Select Country"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">City</label>
                            <SearchableSelect
                                value={localCity}
                                options={availableCities}
                                onChange={setLocalCity}
                                placeholder="Select City"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={() => fetchTimings(currentDay)}
                            className="w-full rounded-2xl py-6 font-black tracking-widest text-xs bg-secondary text-secondary-foreground hover:bg-card shadow-lg"
                        >
                            <Clock className="w-4 h-4 mr-2" /> GET TIMINGS
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col gap-4 bg-card shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-card-foreground">Reminders & Notifications</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-background p-5 rounded-2xl border border-border/40 shadow-inner">
                            <div>
                                <div className="font-black text-foreground text-sm">Browser Notifications</div>
                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Get alerts for tasks</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Button size="sm" variant="ghost" onClick={requestPermission} className="rounded-xl text-[10px] font-black h-9 border-2 border-border hover:bg-card px-4">
                                    ENABLE
                                </Button>
                                <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`w-12 h-7 rounded-full transition-colors relative shadow-inner ${notificationsEnabled ? 'bg-completed' : 'bg-muted'}`}>
                                    <div className={`absolute top-1 w-5 h-5 bg-card rounded-full transition-all shadow-sm ${notificationsEnabled ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto max-h-40 p-1 custom-scrollbar">
                            {alarms.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic font-medium px-2 py-4">No alarms set yet...</p>
                            ) : (
                                alarms.map(alarm => (
                                    <div key={alarm.id} className="flex items-center justify-between bg-card p-4 rounded-xl border-2 border-border/40 hover:border-secondary/30 transition-all group">
                                        <div>
                                            <div className="text-sm font-black text-foreground">{alarm.type}</div>
                                            <div className="text-xs font-bold text-muted-foreground">{alarm.time}</div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => toggleAlarm(alarm.id)} className={`w-10 h-6 rounded-full transition-colors relative shadow-inner ${alarm.enabled ? 'bg-completed' : 'bg-muted'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-card rounded-full transition-all ${alarm.enabled ? 'left-5' : 'left-1'}`} />
                                            </button>
                                            <button onClick={() => deleteAlarm(alarm.id)} className="text-missed opacity-40 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Button onClick={() => setShowAddAlarm(true)} className="w-full rounded-2xl py-6 font-black tracking-widest text-xs bg-foreground text-background hover:bg-secondary hover:text-secondary-foreground shadow-lg">
                            <Plus className="w-4 h-4 mr-2" /> ADD REMINDER
                        </Button>
                    </div>
                </Card>

                {/* Sound Selection */}
                <Card className="flex flex-col gap-4 bg-card shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <Volume2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-card-foreground">Alarm Sound</h3>
                    </div>

                    <div className="space-y-4 flex-1 flex flex-col">
                        <div className="grid grid-cols-1 gap-2 flex-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Sound Gallery</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {[

                                    { id: 'adhan', name: 'Fajr Adhan' },
                                    { id: 'nasheed', name: 'Soft Nasheed' },
                                    ...customSounds
                                ].map((sound) => (
                                    <button
                                        key={sound.id}
                                        onClick={() => setSelectedSound(sound.id)}
                                        className={`flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all shadow-sm ${selectedSound === sound.id
                                            ? 'border-secondary bg-secondary/5 text-foreground font-black'
                                            : 'border-border bg-background text-muted-foreground font-bold hover:border-secondary/40'
                                            }`}
                                    >
                                        <span className="text-[10px] uppercase truncate mr-1">{sound.name}</span>
                                        {selectedSound === sound.id && <div className="w-2 h-2 rounded-full bg-secondary animate-pulse flex-shrink-0" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-dotted border-border mt-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 block mb-3">Upload Custom</label>
                            <label className="flex items-center justify-center gap-3 px-4 py-8 rounded-2xl border-2 border-dashed border-border hover:border-secondary transition-all cursor-pointer group bg-background shadow-inner">
                                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black tracking-[0.15em] text-muted-foreground group-hover:text-secondary uppercase">AUDIO FILE (MP3/WAV)</span>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                const url = ev.target?.result as string;
                                                addCustomSound(file.name.replace(/\.[^/.]+$/, ""), url);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Add Alarm Modal */}
            <Modal isOpen={showAddAlarm} onClose={() => setShowAddAlarm(false)} title="Set Reminder" size="sm">
                <div className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Type</label>
                            <select value={newAlarm.type} onChange={e => setNewAlarm({ ...newAlarm, type: e.target.value })} className="w-full px-5 py-3 rounded-2xl border-2 border-border bg-background focus:border-primary focus:outline-none font-bold">
                                <option>Suhur</option>
                                <option>Iftar</option>
                                <option>Tahajjud</option>
                                <option>Fajr</option>
                                <option>Dhuhr</option>
                                <option>Asr</option>
                                <option>Maghrib</option>
                                <option>Isha</option>
                                <option>General</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Time</label>
                            <input type="time" value={newAlarm.time} onChange={e => setNewAlarm({ ...newAlarm, time: e.target.value })} className="w-full px-5 py-3 rounded-2xl border-2 border-border dark:border-white dark:[color-scheme:dark] bg-background focus:border-primary focus:outline-none font-bold text-xl" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setShowAddAlarm(false)} className="flex-1 rounded-2xl py-4 font-bold">Cancel</Button>
                        <Button onClick={handleAddAlarm} className="flex-1 rounded-2xl py-4 font-bold">Save Alarm</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
