'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Download, Trash2, Calendar as CalendarIcon, Bell, Upload, Plus, Clock, Volume2 } from 'lucide-react';
import { useNotifications } from '../providers/NotificationProvider';

export const Settings: React.FC = () => {
    const {
        ramadanStartDate, setRamadanStartDate, resetAllData, exportData,
        importData, alarms, addAlarm, toggleAlarm, deleteAlarm,
        notificationsEnabled, setNotificationsEnabled,
        selectedSound, setSelectedSound, customSounds, addCustomSound,
        userCity, userCountry, setLocation, fetchTimings, meals, currentDay
    } = useRamadanStore();

    const { requestPermission } = useNotifications();
    const [showResetModal, setShowResetModal] = useState(false);
    const [showAddAlarm, setShowAddAlarm] = useState(false);
    const [newAlarm, setNewAlarm] = useState({ type: 'General', time: '05:00', day: 1 });

    const handleExport = () => {
        const data = exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ramadan-planner-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                importData(content);
            };
            reader.readAsText(file);
        }
    };

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
                <Card className="flex flex-col gap-4 bg-white shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-[#4a342e]">Ramadan Start Date</h3>
                    </div>
                    <p className="text-sm text-[#8d6e63] font-bold px-1 opacity-70">
                        Ensures your 30-day tracking aligns with the lunar calendar.
                    </p>
                    <input
                        type="date"
                        value={ramadanStartDate}
                        onChange={(e) => setRamadanStartDate(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-[#fdfcf0] focus:border-primary focus:outline-none font-black text-[#4a342e] shadow-inner"
                    />
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
                            <label className="text-[10px] font-black uppercase tracking-wider text-[#8d6e63] ml-1">City</label>
                            <input
                                type="text"
                                value={userCity}
                                onChange={(e) => setLocation(e.target.value, userCountry)}
                                placeholder="Enter City"
                                className="w-full px-5 py-3 rounded-2xl border-2 border-border bg-[#fdfcf0] focus:border-primary focus:outline-none font-black text-[#4a342e] shadow-inner"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-wider text-[#8d6e63] ml-1">Country</label>
                            <input
                                type="text"
                                value={userCountry}
                                onChange={(e) => setLocation(userCity, e.target.value)}
                                placeholder="Enter Country"
                                className="w-full px-5 py-3 rounded-2xl border-2 border-border bg-[#fdfcf0] focus:border-primary focus:outline-none font-black text-[#4a342e] shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        <Button
                            onClick={() => fetchTimings(currentDay)}
                            className="w-full rounded-2xl py-6 font-black tracking-widest text-xs bg-secondary text-[#4a342e] hover:bg-white shadow-lg"
                        >
                            <Clock className="w-4 h-4 mr-2" /> GET TIMINGS
                        </Button>

                        {meals[currentDay] && (meals[currentDay].suhoor || meals[currentDay].iftar) && (
                            <div className="grid grid-cols-2 gap-4 bg-[#fdfcf0] p-4 rounded-2xl border-2 border-dashed border-secondary/30">
                                <div className="text-center">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#8d6e63]">Suhur</div>
                                    <div className="text-lg font-black text-[#4a342e]">{meals[currentDay].suhoor || '--:--'}</div>
                                </div>
                                <div className="text-center border-l-2 border-secondary/20">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#8d6e63]">Iftar</div>
                                    <div className="text-lg font-black text-[#4a342e]">{meals[currentDay].iftar || '--:--'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="flex flex-col gap-4 bg-white shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <Bell className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-[#4a342e]">Reminders & Notifications</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-[#fdfcf0] p-5 rounded-2xl border border-border/40 shadow-inner">
                            <div>
                                <div className="font-black text-[#4a342e] text-sm">Browser Notifications</div>
                                <div className="text-[10px] text-[#8d6e63] font-black uppercase tracking-wider">Get alerts for tasks</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Button size="sm" variant="ghost" onClick={requestPermission} className="rounded-xl text-[10px] font-black h-9 border-2 border-border hover:bg-white px-4">
                                    ENABLE
                                </Button>
                                <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={`w-12 h-7 rounded-full transition-colors relative shadow-inner ${notificationsEnabled ? 'bg-completed' : 'bg-muted'}`}>
                                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${notificationsEnabled ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto max-h-40 p-1 custom-scrollbar">
                            {alarms.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic font-medium px-2 py-4">No alarms set yet...</p>
                            ) : (
                                alarms.map(alarm => (
                                    <div key={alarm.id} className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-border/40 hover:border-secondary/30 transition-all group">
                                        <div>
                                            <div className="text-sm font-black text-[#4a342e]">{alarm.type}</div>
                                            <div className="text-xs font-bold text-[#8d6e63]">{alarm.time}</div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => toggleAlarm(alarm.id)} className={`w-10 h-6 rounded-full transition-colors relative shadow-inner ${alarm.enabled ? 'bg-completed' : 'bg-muted'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alarm.enabled ? 'left-5' : 'left-1'}`} />
                                            </button>
                                            <button onClick={() => deleteAlarm(alarm.id)} className="text-missed opacity-40 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Button onClick={() => setShowAddAlarm(true)} className="w-full rounded-2xl py-6 font-black tracking-widest text-xs bg-[#4a342e] text-white hover:bg-secondary hover:text-[#4a342e] shadow-lg">
                            <Plus className="w-4 h-4 mr-2" /> ADD REMINDER
                        </Button>
                    </div>
                </Card>

                {/* Sound Selection */}
                <Card className="flex flex-col gap-4 bg-white shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <Volume2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-[#4a342e]">Alarm Sound</h3>
                    </div>

                    <div className="space-y-4 flex-1 flex flex-col">
                        <div className="grid grid-cols-1 gap-2 flex-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8d6e63] ml-1">Sound Gallery</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {[
                                    { id: 'beep', name: 'Digital Beep' },
                                    { id: 'siren', name: 'Emergency Siren' },
                                    { id: 'adhan', name: 'Fajr Adhan' },
                                    { id: 'nasheed', name: 'Soft Nasheed' },
                                    ...customSounds
                                ].map((sound) => (
                                    <button
                                        key={sound.id}
                                        onClick={() => setSelectedSound(sound.id)}
                                        className={`flex items-center justify-between px-4 py-4 rounded-xl border-2 transition-all shadow-sm ${selectedSound === sound.id
                                            ? 'border-secondary bg-secondary/5 text-[#4a342e] font-black'
                                            : 'border-border bg-[#fdfcf0] text-[#8d6e63] font-bold hover:border-secondary/40'
                                            }`}
                                    >
                                        <span className="text-[10px] uppercase truncate mr-1">{sound.name}</span>
                                        {selectedSound === sound.id && <div className="w-2 h-2 rounded-full bg-secondary animate-pulse flex-shrink-0" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-dotted border-border mt-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8d6e63] ml-1 block mb-3">Upload Custom</label>
                            <label className="flex items-center justify-center gap-3 px-4 py-8 rounded-2xl border-2 border-dashed border-border hover:border-secondary transition-all cursor-pointer group bg-[#fdfcf0] shadow-inner">
                                <Plus className="w-5 h-5 text-[#8d6e63] group-hover:text-secondary group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black tracking-[0.15em] text-[#8d6e63] group-hover:text-secondary uppercase">AUDIO FILE (MP3/WAV)</span>
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

                {/* Data Backup */}
                <Card className="flex flex-col gap-4 bg-white shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-completed/10 rounded-2xl text-completed">
                            <Download className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-[#4a342e]">Cloud Backup</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#fdfcf0] p-6 rounded-2xl border-2 border-dashed border-border/60 space-y-4 shadow-inner">
                            <p className="text-xs text-[#8d6e63] font-black uppercase tracking-widest leading-relaxed">Safety first: Keep your spiritual progress backed up locally.</p>
                            <Button variant="ghost" onClick={handleExport} className="w-full rounded-xl font-black py-7 border-2 border-border bg-white hover:bg-completed hover:text-white hover:border-completed transition-all shadow-sm">
                                <Download className="w-5 h-5 mr-2" /> EXPORT JSON
                            </Button>
                        </div>

                        <div className="bg-[#fdfcf0] p-6 rounded-2xl border-2 border-dashed border-border/60 space-y-4 shadow-inner">
                            <p className="text-xs text-[#8d6e63] font-black uppercase tracking-widest leading-relaxed">Returning after a break? Restore your journey here.</p>
                            <label className="block">
                                <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-input" />
                                <Button variant="ghost" className="w-full rounded-xl font-black py-7 cursor-pointer border-2 border-border bg-white hover:bg-secondary hover:text-[#4a342e] hover:border-secondary transition-all shadow-sm" onClick={() => document.getElementById('import-input')?.click()}>
                                    <Upload className="w-5 h-5 mr-2" /> IMPORT JSON
                                </Button>
                            </label>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="border-missed/30 bg-missed/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2.5rem]">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-black text-missed">Danger Zone</h3>
                    <p className="text-sm text-missed/80 font-bold uppercase tracking-wider">Reset all tracking data forever</p>
                </div>
                <Button variant="danger" onClick={() => setShowResetModal(true)} className="rounded-2xl px-10 py-6 font-black shadow-xl shadow-missed/20">
                    <Trash2 className="w-6 h-6 mr-3" /> WIPE EVERYTHING
                </Button>
            </Card>

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
                            <input type="time" value={newAlarm.time} onChange={e => setNewAlarm({ ...newAlarm, time: e.target.value })} className="w-full px-5 py-3 rounded-2xl border-2 border-border bg-background focus:border-primary focus:outline-none font-bold text-xl" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="ghost" onClick={() => setShowAddAlarm(false)} className="flex-1 rounded-2xl py-4 font-bold">Cancel</Button>
                        <Button onClick={handleAddAlarm} className="flex-1 rounded-2xl py-4 font-bold">Save Alarm</Button>
                    </div>
                </div>
            </Modal>

            {/* Reset Modal */}
            <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="Are you absolutely sure?" size="sm">
                <div className="space-y-6">
                    <p className="text-muted-foreground font-semibold leading-relaxed">This will erase your entire 30-day journey. This action is irreversible.</p>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setShowResetModal(false)} className="flex-1 rounded-2xl">Cancel</Button>
                        <Button variant="danger" onClick={() => { resetAllData(); setShowResetModal(false); }} className="flex-1 rounded-2xl shadow-lg">Confirm Wipe</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
