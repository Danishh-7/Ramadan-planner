export type DietaryGoal = 'maintenance' | 'fatLoss' | 'muscleGain';
export type HealthCondition = 'none' | 'diabetic' | 'hypertension' | 'glutenFree' | 'lactoseIntolerant';
export type Region = 'desi' | 'middleEastern' | 'western';

export interface MealItem {
    id: string;
    type: 'suhoor' | 'iftar' | 'snack' | 'any';
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    isSunnah: boolean;
    sunnahItems?: string[];
    tags: {
        goals: DietaryGoal[];
        conditions: HealthCondition[];
        regions: Region[];
    };
}

export const mealsDB: MealItem[] = [
    // --- FULL MEALS (SUHOOR) ---
    {
        id: 's1', type: 'suhoor', name: 'Talbina (Barley Porridge)',
        description: 'A comforting, slow-digesting Sunnah meal providing sustained energy.',
        calories: 320, protein: 12, carbs: 65, fat: 4, isSunnah: true, sunnahItems: ['Barley', 'Honey'],
        tags: { goals: ['maintenance', 'muscleGain'], conditions: ['none', 'hypertension'], regions: ['middleEastern', 'desi', 'western'] }
    },
    {
        id: 's2', type: 'suhoor', name: 'Masala Oats with Egg Whites (Ande)',
        description: 'High protein, complex carbs packed with Indian spices.',
        calories: 280, protein: 22, carbs: 40, fat: 5, isSunnah: false,
        tags: { goals: ['fatLoss', 'maintenance'], conditions: ['none', 'diabetic', 'lactoseIntolerant'], regions: ['desi'] }
    },
    {
        id: 's4', type: 'suhoor', name: 'Whole Grain Roti with Paneer Bhurji',
        description: 'A classic desi breakfast packed with calcium and protein.',
        calories: 420, protein: 24, carbs: 45, fat: 18, isSunnah: false,
        tags: { goals: ['muscleGain', 'maintenance'], conditions: ['none'], regions: ['desi'] }
    },
    {
        id: 's6', type: 'suhoor', name: 'Milk & Pheni (Sootar Feni)',
        description: 'A traditional and quick Delhi-style Suhoor. Very fine roasted vermicelli with milk.',
        calories: 380, protein: 10, carbs: 55, fat: 12, isSunnah: false,
        tags: { goals: ['maintenance', 'muscleGain'], conditions: ['none'], regions: ['desi'] }
    },

    // --- FULL MEALS (IFTAR) ---
    {
        id: 'i2', type: 'iftar', name: 'Lentil Soup (Daal Shorba)',
        description: 'Warm and comforting. Gently wakes the stomach.',
        calories: 220, protein: 14, carbs: 35, fat: 6, isSunnah: true, sunnahItems: ['Olive Oil', 'Lentils'],
        tags: { goals: ['fatLoss', 'maintenance'], conditions: ['none', 'diabetic', 'hypertension', 'lactoseIntolerant', 'glutenFree'], regions: ['middleEastern', 'desi'] }
    },
    {
        id: 'i3', type: 'iftar', name: 'Mutton Yakhni Pulao',
        description: 'A rich and traditional meal. Best for replenishing high energy needs.',
        calories: 650, protein: 35, carbs: 75, fat: 22, isSunnah: false,
        tags: { goals: ['muscleGain'], conditions: ['none', 'glutenFree'], regions: ['desi'] }
    },
    {
        id: 'i4', type: 'iftar', name: 'Air-Fried Pyaz Pakodi (Onion Fritters)',
        description: 'A healthy local Delhi favorite! Air-fried instead of deep-fried to cut down calories and fat, but keeps the crunch.',
        calories: 180, protein: 6, carbs: 22, fat: 6, isSunnah: false,
        tags: { goals: ['fatLoss', 'maintenance'], conditions: ['none', 'lactoseIntolerant', 'glutenFree'], regions: ['desi'] }
    },
    {
        id: 'i6', type: 'iftar', name: 'Mixed Fruit Chaat',
        description: 'A refreshing and tangy Delhi classic. Mixed fruits with chaat masala.',
        calories: 140, protein: 2, carbs: 35, fat: 0, isSunnah: false,
        tags: { goals: ['fatLoss', 'maintenance'], conditions: ['none', 'hypertension', 'lactoseIntolerant', 'glutenFree'], regions: ['desi'] }
    },

    // --- INDIVIDUAL FOOD ITEMS (ANY) ---
    {
        id: 'f1', type: 'any', name: 'Ajwa Dates (Khajoor - 3 pieces)',
        description: 'The ultimate Sunnah rapid energy source to break fast or start suhoor.',
        calories: 60, protein: 1, carbs: 18, fat: 0, isSunnah: true, sunnahItems: ['Dates'],
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'middleEastern', 'western'] }
    },
    {
        id: 'f2', type: 'any', name: 'Water (Pani - 1 Glass)',
        description: 'Hydration is critical. Drink in 3 sips according to Sunnah.',
        calories: 0, protein: 0, carbs: 0, fat: 0, isSunnah: true, sunnahItems: ['Water'],
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'middleEastern', 'western'] }
    },
    {
        id: 'f3', type: 'any', name: 'Greek Yogurt (Dahi - 1 cup)',
        description: 'High protein and probiotics for gut health.',
        calories: 100, protein: 17, carbs: 4, fat: 0, isSunnah: false,
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'hypertension', 'glutenFree'], regions: ['middleEastern', 'western', 'desi'] }
    },
    {
        id: 'f4', type: 'any', name: 'Boiled Eggs (Ubley Ande - 2 large)',
        description: 'The gold standard for bioavailable protein.',
        calories: 156, protein: 12, carbs: 1, fat: 10, isSunnah: false,
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'middleEastern', 'western'] }
    },
    {
        id: 'f5', type: 'any', name: 'Almonds (Badaam - 1 oz)',
        description: 'Healthy fats to slow down digestion during fasting.',
        calories: 164, protein: 6, carbs: 6, fat: 14, isSunnah: false,
        tags: { goals: ['maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'middleEastern', 'western'] }
    },
    {
        id: 'f6', type: 'any', name: 'Olive Oil (Zaitoon ka Tel - 1 tbsp)',
        description: 'Blessed tree oil, excellent for heart health.',
        calories: 119, protein: 0, carbs: 0, fat: 14, isSunnah: true, sunnahItems: ['Olive Oil'],
        tags: { goals: ['maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['middleEastern', 'western'] }
    },
    {
        id: 'f7', type: 'any', name: 'Black Seed (Kalonji - 1 tsp)',
        description: 'Cure for every disease except death.',
        calories: 45, protein: 2, carbs: 2, fat: 3, isSunnah: true, sunnahItems: ['Black Seed'],
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'middleEastern', 'western'] }
    },
    {
        id: 'f8', type: 'any', name: 'Honey (Shehad - 1 tbsp)',
        description: 'Natural sweetener with healing properties.',
        calories: 64, protein: 0, carbs: 17, fat: 0, isSunnah: true, sunnahItems: ['Honey'],
        tags: { goals: ['maintenance', 'muscleGain'], conditions: ['none', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'middleEastern', 'western'] }
    },
    {
        id: 'f9', type: 'any', name: 'Cucumber (Kheera - 1 medium)',
        description: 'High water content to keep you hydrated.',
        calories: 30, protein: 1, carbs: 6, fat: 0, isSunnah: true, sunnahItems: ['Cucumber'],
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'middleEastern', 'western'] }
    },
    {
        id: 'f10', type: 'any', name: 'Watermelon (Tarbooz - 1 cup)',
        description: 'Eaten by the Prophet ﷺ with dates to balance heat.',
        calories: 46, protein: 1, carbs: 11, fat: 0, isSunnah: true, sunnahItems: ['Watermelon'],
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'middleEastern', 'western'] }
    },
    {
        id: 'f15', type: 'any', name: 'Banana (Kela - 1 medium)',
        description: 'A cheap, accessible, and excellent source of potassium and instant energy.',
        calories: 105, protein: 1, carbs: 27, fat: 0, isSunnah: false,
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'western', 'middleEastern'] }
    },
    {
        id: 'f16', type: 'any', name: 'Apple (Seb - 1 medium)',
        description: 'Affordable and rich in fiber (pectin) to keep you full longer.',
        calories: 95, protein: 0, carbs: 25, fat: 0, isSunnah: false,
        tags: { goals: ['fatLoss', 'maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi', 'western', 'middleEastern'] }
    },
    {
        id: 'f17', type: 'any', name: 'Mango (Aam - 1 cup diced)',
        description: 'The king of fruits! Delicious natural sweetness to reward you at Iftar.',
        calories: 99, protein: 1, carbs: 25, fat: 1, isSunnah: false,
        tags: { goals: ['maintenance', 'muscleGain'], conditions: ['none', 'hypertension', 'glutenFree', 'lactoseIntolerant'], regions: ['desi'] }
    },
    {
        id: 'f12', type: 'any', name: 'Basmati Rice (Chawal - 1 cup cooked)',
        description: 'Staple carbohydrate.',
        calories: 205, protein: 4, carbs: 45, fat: 0, isSunnah: false,
        tags: { goals: ['maintenance', 'muscleGain'], conditions: ['none', 'lactoseIntolerant', 'glutenFree'], regions: ['desi', 'middleEastern'] }
    },
    {
        id: 'f14', type: 'any', name: 'Milk (Doodh - 1 cup)',
        description: 'Bone health and hydration.',
        calories: 103, protein: 8, carbs: 12, fat: 2, isSunnah: true, sunnahItems: ['Milk'],
        tags: { goals: ['maintenance', 'muscleGain'], conditions: ['none', 'diabetic', 'glutenFree'], regions: ['desi', 'middleEastern', 'western'] }
    }
];

export const getSuggestions = (
    type: 'suhoor' | 'iftar' | 'snack',
    profile: { goal: DietaryGoal; condition: HealthCondition; region: Region }
): MealItem[] => {
    // 1. Get exact matches (both specific meal type AND 'any')
    let pool = mealsDB.filter(m =>
        (m.type === type || m.type === 'any') &&
        m.tags.goals.includes(profile.goal) &&
        m.tags.conditions.includes(profile.condition) &&
        m.tags.regions.includes(profile.region)
    );

    // 2. If pool is too small, relax the Region constraint
    if (pool.length < 10) {
        const relaxedRegion = mealsDB.filter(m =>
            (m.type === type || m.type === 'any') &&
            m.tags.goals.includes(profile.goal) &&
            m.tags.conditions.includes(profile.condition) &&
            !pool.includes(m)
        );
        pool = [...pool, ...relaxedRegion];
    }

    // 3. If pool is STILL too small, relax the Goal constraint (prioritize Condition safely)
    if (pool.length < 10) {
        const relaxedGoal = mealsDB.filter(m =>
            (m.type === type || m.type === 'any') &&
            m.tags.conditions.includes(profile.condition) &&
            !pool.includes(m)
        );
        pool = [...pool, ...relaxedGoal];
    }

    // Shuffle array and return up to 10 items
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, 10);
};

// Keeping for backwards compatibility if needed during dev, can remove later.
export const generateMeal = (
    type: 'suhoor' | 'iftar' | 'snack',
    profile: { goal: DietaryGoal; condition: HealthCondition; region: Region }
): MealItem => {
    const suggestions = getSuggestions(type, profile);
    return suggestions[0] || mealsDB.find(m => m.type === type) || mealsDB[0];
};
