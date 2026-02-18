'use client';

import { useState, useEffect } from 'react';
import { useRamadanStore } from '@/store/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/features/Dashboard';
import { RamadanTracker } from '@/components/features/RamadanTracker';
import { QuranTracker } from '@/components/features/QuranTracker';
import { FastingTracker } from '@/components/features/FastingTracker';
import { HabitTracker } from '@/components/features/HabitTracker';
import { ChallengeTracker } from '@/components/features/ChallengeTracker';
import { MealPlanner } from '@/components/features/MealPlanner';
import { DuasSection } from '@/components/features/DuasSection';
import { NotesSection } from '@/components/features/NotesSection';
import { Settings } from '@/components/features/Settings';
import { NotebookPlanner } from '@/components/features/NotebookPlanner';

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { syncRamadanDay } = useRamadanStore();

  useEffect(() => {
    syncRamadanDay();
  }, [syncRamadanDay]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'notebook-planner':
        return <NotebookPlanner />;
      case 'ramadan-tracker':
        return <RamadanTracker />;
      case 'quran-tracker':
        return <QuranTracker />;
      case 'fasting-tracker':
        return <FastingTracker />;
      case 'habits':
        return <HabitTracker />;
      case 'challenge':
        return <ChallengeTracker />;
      case 'meals':
        return <MealPlanner />;
      case 'duas':
        return <DuasSection />;
      case 'notes':
        return <NotesSection />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background islamic-pattern">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
