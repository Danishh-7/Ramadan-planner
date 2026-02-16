'use client';

import React, { useState } from 'react';
import { useRamadanStore } from '@/store/store';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Plus, Trash2, Edit2, Book, PenLine } from 'lucide-react';
import { format } from 'date-fns';

export const NotesSection: React.FC = () => {
    const { notes, addNote, updateNote, deleteNote, currentDay } = useRamadanStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingNote, setEditingNote] = useState<string | null>(null);
    const [noteContent, setNoteContent] = useState('');
    const [selectedDay, setSelectedDay] = useState(currentDay);

    const handleAddNote = () => {
        if (noteContent.trim()) {
            addNote({ day: selectedDay, date: new Date().toISOString(), content: noteContent });
            setNoteContent('');
            setShowAddModal(false);
        }
    };

    const handleUpdateNote = () => {
        if (editingNote && noteContent.trim()) {
            updateNote(editingNote, noteContent);
            setEditingNote(null);
            setNoteContent('');
        }
    };

    const startEdit = (note: any) => {
        setEditingNote(note.id);
        setNoteContent(note.content);
        setShowAddModal(true);
    };

    const sortedNotes = [...notes].sort((a, b) => b.day - a.day);

    return (
        <div className="space-y-12 animate-fade-in pb-12 font-serif text-[#3e2723]">
            <div className="text-center space-y-3">
                <h1 className="text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4">Reflections</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Penning down the echoes of the soul</p>
            </div>

            <div className="flex justify-center border-b-2 border-dashed border-border/40 pb-8">
                <Button onClick={() => setShowAddModal(true)} className="rounded-[2rem] px-10 py-8 font-black bg-[#4a342e] text-white hover:bg-[#3e2723] shadow-2xl flex items-center gap-4 text-xl">
                    <PenLine className="w-8 h-8 text-secondary" /> START A REFLECTION
                </Button>
            </div>

            {sortedNotes.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                    <Book className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-2xl font-black italic">Your journey awaits its first word...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sortedNotes.map((note) => (
                        <Card key={note.id} className="p-8 rounded-[3rem] notebook-border flex flex-col space-y-6 bg-white relative group hover:rotate-1 transition-transform shadow-lg">
                            <div className="flex items-center justify-between border-b-2 border-dotted border-border pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black uppercase tracking-widest bg-secondary text-[#4a342e] px-4 py-1.5 rounded-full shadow-sm">Day {note.day}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8d6e63] opacity-60">{format(new Date(note.date), 'MMM dd, p')}</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(note)} className="p-2 hover:bg-secondary/20 rounded-xl transition-all"><Edit2 className="w-4 h-4 text-[#4a342e]" /></button>
                                    <button onClick={() => deleteNote(note.id)} className="p-2 text-missed hover:bg-missed/10 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <p className="text-xl font-bold leading-relaxed whitespace-pre-wrap text-[#4a342e]">{note.content}</p>
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setEditingNote(null); setNoteContent(''); }} title={editingNote ? 'Edit Reflection' : 'New Reflection'} size="lg">
                <div className="space-y-8 pt-4">
                    {!editingNote && (
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Journey Day</label>
                            <select value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))} className="w-full px-6 py-4 rounded-2xl border-2 border-border font-black text-xl focus:border-[#4a342e] outline-none">
                                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => <option key={day} value={day}>Day {day}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Thoughts</label>
                        <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="What did today teach you about your heart?" className="w-full h-64 px-8 py-6 rounded-[2.5rem] border-2 border-border font-bold text-xl leading-relaxed focus:border-[#4a342e] outline-none resize-none" />
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => { setShowAddModal(false); setEditingNote(null); setNoteContent(''); }} className="flex-1 py-6 rounded-2xl font-black">CLOSE</Button>
                        <Button onClick={editingNote ? handleUpdateNote : handleAddNote} className="flex-1 py-6 rounded-2xl font-black bg-secondary text-[#3e2723] hover:bg-white">{editingNote ? 'UPDATE' : 'RECORD'}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
