'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Heart, Plus, Trash2, Sparkles, BookOpen } from 'lucide-react';

export const DuasSection: React.FC = () => {
    const { duas, addDua, toggleFavoriteDua, deleteDua } = useRamadanStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [filter, setFilter] = useState('all');
    const [newDua, setNewDua] = useState({ title: '', arabic: '', transliteration: '', translation: '' });

    const categories = [
        { id: 'all', label: 'All Duas', icon: BookOpen },
        { id: 'highlighted', label: 'Recommended', icon: Sparkles },
        { id: 'favorite', label: 'My Heart', icon: Heart },
    ];

    const filteredDuas = duas.filter(d => {
        if (filter === 'favorite') return d.isFavorite;
        if (filter === 'highlighted') return d.isHighlighted;
        return true;
    });

    return (
        <div className="space-y-12 animate-fade-in pb-12 font-serif text-[#3e2723]">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Supplications</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">"Call upon Me; I will respond to you."</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#fdfcf0] p-4 rounded-[2.5rem] notebook-border shadow-inner">
                <div className="flex gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-5 py-2.5 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${filter === cat.id ? 'bg-[#4a342e] text-white shadow-xl' : 'hover:bg-muted/50 text-muted-foreground'}`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>
                <Button onClick={() => setShowAddModal(true)} className="rounded-2xl px-6 py-6 font-black bg-secondary text-[#4a342e] hover:bg-[#4a342e] hover:text-white shadow-lg transition-all">
                    <Plus className="w-5 h-5 mr-1" /> NEW DUA
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredDuas.map((dua) => (
                    <Card key={dua.id} className={`p-8 rounded-[3rem] notebook-border flex flex-col space-y-6 relative group transform transition-all duration-300 hover:scale-[1.01] ${dua.isHighlighted ? 'bg-[#fff8e1] border-secondary/60' : 'bg-white'}`}>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                {dua.isHighlighted && <span className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary bg-[#4a342e] px-3 py-1 rounded-full">Sunnah</span>}
                                <h3 className="text-2xl font-black italic pt-2 text-[#4a342e]">{dua.title}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => toggleFavoriteDua(dua.id)} className={`p-3 rounded-full transition-all ${dua.isFavorite ? 'bg-secondary text-[#4a342e] shadow-md' : 'bg-muted/30 text-muted-foreground hover:bg-secondary/20'}`}><Heart className={`w-5 h-5 ${dua.isFavorite ? 'fill-current' : ''}`} /></button>
                                {dua.isCustom && <button onClick={() => deleteDua(dua.id)} className="p-3 bg-missed/10 text-missed rounded-full hover:bg-missed hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>}
                            </div>
                        </div>

                        {dua.arabic && (
                            <div className="bg-[#fdfcf0] p-8 rounded-[2.5rem] border-2 border-border/30 relative overflow-hidden shadow-inner">
                                <p className="text-4xl text-right leading-[1.8] font-bold text-[#4a342e]" dir="rtl">{dua.arabic}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {dua.transliteration && <p className="text-sm italic font-medium text-muted-foreground pl-4 border-l-4 border-secondary/40">{dua.transliteration}</p>}
                            <p className="font-bold text-lg leading-relaxed text-[#5d4037]">{dua.translation}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add to Journal" size="lg">
                <div className="space-y-8 pt-4">
                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Supplication Title</label>
                            <input value={newDua.title} onChange={(e) => setNewDua({ ...newDua, title: e.target.value })} className="w-full px-6 py-4 rounded-2xl border-2 border-border font-black focus:border-[#4a342e] outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Arabic Text</label>
                            <textarea value={newDua.arabic} onChange={(e) => setNewDua({ ...newDua, arabic: e.target.value })} className="w-full h-32 px-6 py-4 rounded-2xl border-2 border-border text-2xl text-right focus:border-[#4a342e] outline-none" dir="rtl" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Translation</label>
                            <textarea value={newDua.translation} onChange={(e) => setNewDua({ ...newDua, translation: e.target.value })} className="w-full h-32 px-6 py-4 rounded-2xl border-2 border-border font-bold focus:border-[#4a342e] outline-none" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1 py-6 rounded-2xl font-black">CANCEL</Button>
                        <Button onClick={() => { addDua({ ...newDua, isCustom: true, isFavorite: false }); setNewDua({ title: '', arabic: '', transliteration: '', translation: '' }); setShowAddModal(false); }} className="flex-1 py-6 rounded-2xl font-black">RECORD DUA</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
