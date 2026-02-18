export interface ApiDua {
    id: number;
    title: string;
    arabic: string;
    latin: string;
    translation: string;
    notes: string;
    fawaid: string;
    source: string;
    category_slug?: string;
}

export interface ApiResponse {
    statusCode: number;
    code: string;
    data: ApiDua[];
}

const BASE_URL = 'https://dua-dhikr.vercel.app';

export const fetchDuasByCategory = async (category: string): Promise<(ApiDua & { category: string })[]> => {
    try {
        const response = await fetch(`${BASE_URL}/categories/${category}`, {
            headers: {
                'Accept-Language': 'en'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch duas');
        const json: ApiResponse = await response.json();
        // Return with category attached so we can fetch details later
        return json.data.map(d => ({ ...d, category }));
    } catch (error) {
        console.error(`Error fetching category ${category}:`, error);
        return [];
    }
};

export const fetchAuthenticDuas = async () => {
    // Standard categories + user requested Ramadan ones
    const categories = ['daily-dua', 'morning-dhikr', 'evening-dhikr', 'selected-dua', 'dhikr-after-salah', 'iftar', 'forgiveness', 'protection'];
    const categoryLists = await Promise.all(categories.map(cat => fetchDuasByCategory(cat)));

    // Flatten the lists of ID/Title only objects
    const allDuaStubs = categoryLists.flat();

    // Fetch details for each (in parallel)
    const detailedDuas = await Promise.all(allDuaStubs.map(async (stub) => {
        try {
            // Using stub.category which we added in fetchDuasByCategory
            const response = await fetch(`${BASE_URL}/categories/${stub.category}/${stub.id}`, {
                headers: {
                    'Accept-Language': 'en'
                }
            });
            if (!response.ok) return null;
            const json: { data: ApiDua } = await response.json();
            return { ...json.data, category_slug: stub.category };
        } catch (e) {
            console.error(`Error fetching dua details for ${stub.id}:`, e);
            return null;
        }
    }));

    return detailedDuas
        .filter((dua): dua is (ApiDua & { category_slug: string }) => dua !== null)
        .map(dua => ({
            id: `api-${dua.id}`,
            title: dua.title,
            arabic: dua.arabic,
            transliteration: dua.latin,
            translation: dua.translation,
            isCustom: false,
            isFavorite: false,
            isHighlighted:
                dua.title.toLowerCase().includes('fasting') ||
                dua.title.toLowerCase().includes('iftar') ||
                dua.title.toLowerCase().includes('forgiveness') ||
                dua.category_slug === 'selected-dua'
        }));
};

export const fetchRamadanDhikr = async (): Promise<ApiDua[]> => {
    try {
        const response = await fetch(`${BASE_URL}/categories/ramadan`, {
            headers: {
                'Accept-Language': 'en'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch Ramadan dhikr');
        const json: ApiResponse = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching Ramadan dhikr:', error);
        return [];
    }
};
