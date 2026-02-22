'use client';

import React, { useMemo } from 'react';
import { useRamadanStore } from '@/store/store';
import { MealPlan, DietaryProfile } from '@/store/store';
import { getSuggestions, DietaryGoal, HealthCondition, Region, MealItem } from '@/data/mealsDB';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { UtensilsCrossed, Flame, Leaf, Plus, X } from 'lucide-react';

export const MealPlanner: React.FC = () => {
    const { currentDay, meals, addFoodToMeal, removeFoodFromMeal, clearMeal, dietaryProfile, updateDietaryProfile } = useRamadanStore();

    const dayMeals: MealPlan = meals[currentDay] || {};

    const handleProfileChange = (updates: Partial<DietaryProfile>) => {
        const newProfile = { ...dietaryProfile, ...updates };
        updateDietaryProfile(newProfile);
    };

    // Memoize suggestions so they don't randomly re-shuffle on every render unless profile changes
    const suhoorSuggestions = useMemo(() => getSuggestions('suhoor', dietaryProfile), [dietaryProfile]);
    const iftarSuggestions = useMemo(() => getSuggestions('iftar', dietaryProfile), [dietaryProfile]);
    const snackSuggestions = useMemo(() => getSuggestions('snack', dietaryProfile), [dietaryProfile]);

    const renderMealBuilder = (
        type: 'suhoor' | 'iftar' | 'snack',
        title: string,
        subtitle: string,
        suggestions: MealItem[]
    ) => {
        const selectedIds = dayMeals[`${type}Ids` as keyof MealPlan] as string[] || [];
        // Map Ids to actual food items, filtering out any undefineds if a DB item was removed
        const selectedItems = selectedIds.map(id => [...suhoorSuggestions, ...iftarSuggestions, ...snackSuggestions, ...suggestions].find(m => m.id === id) ||
            // Fallback search in entire DB if not in current suggestion lists
            require('@/data/mealsDB').mealsDB.find((m: MealItem) => m.id === id)
        ).filter(Boolean) as MealItem[];

        const availableSuggestions = suggestions.filter(s => !selectedIds.includes(s.id));

        const sectionMacros = selectedItems.reduce((acc, item) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return (
            <Card className={`p-4 sm:p-6 rounded-[2rem] notebook-border flex flex-col h-[750px] shadow-xl relative group 
                ${type === 'suhoor' ? 'bg-card' : type === 'iftar' ? 'bg-secondary/5 border-secondary/20' : 'bg-primary/5'}
            `}>
                {/* Header & Meal Macros */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-dotted border-border pb-4 gap-4 mb-6 shrink-0">
                    <div>
                        <h3 className={`text-2xl font-black italic flex items-center gap-2 ${type === 'iftar' ? 'text-foreground' : 'text-card-foreground'}`}>
                            {type === 'suhoor' ? '🌙' : type === 'iftar' ? '🌅' : '☕'} {title}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{subtitle}</span>
                    </div>

                    {selectedItems.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[#4a342e] uppercase bg-background px-3 py-2 rounded-xl border border-border/40 w-fit">
                            <span className="text-secondary flex items-center gap-1"><Flame className="w-3 h-3" /> {sectionMacros.calories} kcal</span>
                            <span className="opacity-40">|</span>
                            <span>P: {sectionMacros.protein}g</span>
                            <span className="opacity-40">|</span>
                            <span>C: {sectionMacros.carbs}g</span>
                            <span className="opacity-40">|</span>
                            <span>F: {sectionMacros.fat}g</span>
                        </div>
                    )}
                </div>

                {/* Selected Basket */}
                <div className="shrink-0 space-y-3 min-h-[100px] max-h-[220px] overflow-y-auto border-2 border-dashed border-border/30 rounded-2xl p-4 bg-background/30 mb-6">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <UtensilsCrossed className="w-3 h-3" /> Selected For {title}
                        </span>
                        {selectedItems.length > 0 && (
                            <button onClick={() => clearMeal(currentDay, type)} className="text-[9px] font-bold text-destructive uppercase hover:underline">
                                Clear All
                            </button>
                        )}
                    </div>

                    {selectedItems.length === 0 ? (
                        <div className="text-center text-sm font-medium text-muted-foreground/60 italic py-4">
                            Your {title} is empty. Add items from below.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {selectedItems.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex items-center justify-between bg-background p-3 rounded-xl border border-border/60 shadow-sm animate-fade-in group/item">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-card-foreground truncate">{item.name}</span>
                                            {item.isSunnah && <span title="Sunnah Food" className="flex-shrink-0"><Leaf className="w-3 h-3 text-completed" /></span>}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-bold flex gap-2 mt-1">
                                            <span className="text-secondary">{item.calories} kcal</span>
                                            <span>P: {item.protein} | C: {item.carbs} | F: {item.fat}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFoodFromMeal(currentDay, type, item.id)}
                                        className="p-2 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors flex-shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Suggestions Vertical List */}
                <div className="flex flex-col min-h-0 flex-1">
                    <span className="text-[10px] shrink-0 font-black uppercase tracking-widest text-secondary block mb-3">Add Suggestions</span>
                    <div className="flex flex-col overflow-y-auto pb-4 gap-3 pr-2 custom-scrollbar">
                        {availableSuggestions.map(item => (
                            <div key={item.id} className="w-full shrink-0 bg-background border border-border/40 rounded-xl p-3 shadow-sm flex flex-col hover:border-secondary/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    {item.isSunnah ? (
                                        <span className="text-[8px] font-black uppercase text-completed bg-completed/10 px-1.5 py-0.5 rounded-sm flex items-center gap-1 shrink-0">
                                            <Leaf className="w-2 h-2" /> Sunnah
                                        </span>
                                    ) : (
                                        <span className="text-[8px] font-black uppercase text-muted-foreground/50 bg-muted/20 px-1.5 py-0.5 rounded-sm shrink-0">
                                            Option
                                        </span>
                                    )}
                                    <span className="text-[10px] font-bold text-secondary shrink-0">{item.calories} kcal</span>
                                </div>

                                <h4 className="text-xs font-black text-[#4a342e] leading-snug line-clamp-2 min-h-[34px]">{item.name}</h4>
                                <p className="text-[10px] font-medium text-muted-foreground italic line-clamp-2 mt-1 mb-3 flex-1">{item.description}</p>

                                <Button
                                    size="sm"
                                    onClick={() => addFoodToMeal(currentDay, type, item.id)}
                                    className="w-full rounded-lg py-1.5 h-auto text-[10px] font-black shadow-none bg-secondary/10 text-secondary hover:bg-secondary hover:text-white mt-auto"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Add
                                </Button>
                            </div>
                        ))}
                        {availableSuggestions.length === 0 && (
                            <div className="w-full shrink-0 flex items-center justify-center p-4 border border-dashed border-border/40 rounded-xl text-xs font-medium text-muted-foreground italic">
                                No more suggestions available.
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    // Calculate Daily Totals
    const dailyTotals = useMemo(() => {
        const suhoorIds = dayMeals.suhoorIds || [];
        const iftarIds = dayMeals.iftarIds || [];
        const snackIds = dayMeals.snackIds || [];

        const allIds = [...suhoorIds, ...iftarIds, ...snackIds];
        const allMeals = require('@/data/mealsDB').mealsDB as MealItem[];

        return allIds.reduce((acc, id) => {
            const item = allMeals.find(m => m.id === id);
            if (!item) return acc;
            return {
                calories: acc.calories + item.calories,
                protein: acc.protein + item.protein,
                carbs: acc.carbs + item.carbs,
                fat: acc.fat + item.fat,
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [dayMeals]);

    return (
        <div className="space-y-8 animate-fade-in pb-12 font-serif px-2 sm:px-0">
            <div className="text-center space-y-3">
                <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter gradient-text underline decoration-secondary decoration-4 text-[#4a342e]">Smart Planner</h1>
                <p className="text-[#8D6E63] font-bold uppercase tracking-widest text-[10px] sm:text-xs">Tailored to your habits & health</p>
            </div>

            {/* Always Visible Profile Settings */}
            <div className="bg-card rounded-[2rem] p-6 shadow-md border-2 border-border/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Active Dietary Profile</span>
                    <div className="h-px flex-1 bg-border/40" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fitness Goal</label>
                        <select
                            value={dietaryProfile.goal}
                            onChange={(e) => handleProfileChange({ goal: e.target.value as DietaryGoal })}
                            className="w-full p-4 rounded-xl border-2 border-border bg-background focus:border-secondary outline-none text-sm font-bold shadow-inner"
                        >
                            <option value="fatLoss">Fat Loss (Deficit)</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="muscleGain">Muscle Gain (Surplus)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Health Condition</label>
                        <select
                            value={dietaryProfile.condition}
                            onChange={(e) => handleProfileChange({ condition: e.target.value as HealthCondition })}
                            className="w-full p-4 rounded-xl border-2 border-border bg-background focus:border-secondary outline-none text-sm font-bold shadow-inner"
                        >
                            <option value="none">None (Standard)</option>
                            <option value="diabetic">Diabetic Friendly</option>
                            <option value="hypertension">Low Sodium (Hypertension)</option>
                            <option value="lactoseIntolerant">Lactose Intolerant</option>
                            <option value="glutenFree">Gluten Free</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cuisine / Region</label>
                        <select
                            value={dietaryProfile.region}
                            onChange={(e) => handleProfileChange({ region: e.target.value as Region })}
                            className="w-full p-4 rounded-xl border-2 border-border bg-background focus:border-secondary outline-none text-sm font-bold shadow-inner"
                        >
                            <option value="desi">Desi / South Asian</option>
                            <option value="middleEastern">Middle Eastern</option>
                            <option value="western">Western / General</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Smart Meal Builders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {renderMealBuilder('suhoor', 'Suhoor', 'Pre-Dawn Meal', suhoorSuggestions)}
                {renderMealBuilder('iftar', 'Iftar', 'Breaking Fast', iftarSuggestions)}
                {renderMealBuilder('snack', 'Snack', 'Post Taraweeh', snackSuggestions)}
            </div>

            {/* Nutritional Daily Summary */}
            {(dailyTotals.calories > 0) && (
                <div className="bg-[#4a342e] text-white p-6 sm:p-8 rounded-[2rem] shadow-xl animate-fade-in mt-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Flame className="w-48 h-48" />
                    </div>

                    <h3 className="text-sm font-black uppercase tracking-widest text-white/70 mb-6 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-secondary" /> Grand Daily Macros
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                        <div className="space-y-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="text-[10px] font-bold text-white/50 uppercase">Total Calories</div>
                            <div className="text-2xl font-black text-secondary">
                                {dailyTotals.calories} <span className="text-sm font-bold text-white/50 lowercase">kcal</span>
                            </div>
                        </div>
                        <div className="space-y-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="text-[10px] font-bold text-white/50 uppercase">Protein</div>
                            <div className="text-2xl font-black text-white">
                                {dailyTotals.protein}<span className="text-sm font-bold text-white/50">g</span>
                            </div>
                        </div>
                        <div className="space-y-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="text-[10px] font-bold text-white/50 uppercase">Carbohydrates</div>
                            <div className="text-2xl font-black text-white">
                                {dailyTotals.carbs}<span className="text-sm font-bold text-white/50">g</span>
                            </div>
                        </div>
                        <div className="space-y-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="text-[10px] font-bold text-white/50 uppercase">Fats</div>
                            <div className="text-2xl font-black text-white">
                                {dailyTotals.fat}<span className="text-sm font-bold text-white/50">g</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
