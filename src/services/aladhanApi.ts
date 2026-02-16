export interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
    Firstthird: string;
    Lastthird: string;
}

export interface AladhanResponse {
    code: number;
    status: string;
    data: {
        timings: PrayerTimings;
        date: {
            readable: string;
            timestamp: string;
            hijri: {
                date: string;
                format: string;
                day: string;
                weekday: { en: string; ar: string };
                month: { number: number; en: string; ar: string };
                year: string;
                designation: { abbreviated: string; expanded: string };
            };
            gregorian: {
                date: string;
                format: string;
                day: string;
                weekday: { en: string };
                month: { number: number; en: string };
                year: string;
            };
        };
        meta: {
            latitude: number;
            longitude: number;
            timezone: string;
            method: {
                id: number;
                name: string;
                params: { Fajr: number; Isha: number };
                location: { latitude: number; longitude: number };
            };
        };
    };
}

/**
 * Fetches prayer timings for a given city and country.
 * @param city - The name of the city.
 * @param country - The name of the country.
 * @param method - The calculation method (default is 5 - Egyptian General Authority of Survey).
 * @returns A promise that resolves to the prayer timings.
 */
export async function getPrayerTimingsByCity(
    city: string,
    country: string,
    method: number = 5
): Promise<PrayerTimings | null> {
    try {
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch timings: ${response.statusText}`);
        }

        const data: AladhanResponse = await response.json();

        if (data.code === 200 && data.data) {
            return data.data.timings;
        }

        return null;
    } catch (error) {
        console.error('Error fetching Aladhan prayer timings:', error);
        return null;
    }
}

/**
 * Specifically gets Sehri (Imsak) and Iftar (Maghrib) times.
 */
export async function getSehriIftarTimings(city: string, country: string) {
    const timings = await getPrayerTimingsByCity(city, country);
    if (timings) {
        return {
            sehri: timings.Imsak,
            iftar: timings.Maghrib
        };
    }
    return null;
}
