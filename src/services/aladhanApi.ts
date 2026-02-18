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
 * Specifically gets Sehri and Iftar times.
 * Returns Imsak (start of Sehri), Fajr (Khatam-e-Sehri/end of eating), and Maghrib (Iftar).
 */
export async function getSehriIftarTimings(city: string, country: string) {
    const timings = await getPrayerTimingsByCity(city, country);
    if (timings) {
        return {
            sehri: timings.Imsak,
            khatamSehri: timings.Fajr, // End of Sehri time
            iftar: timings.Maghrib
        };
    }
}

/**
 * Gets the Ramadan start date for a given city and country.
 * Uses the Aladhan calendar API to find the first day of Ramadan.
 */
export async function getRamadanStartDate(city: string, country: string): Promise<string> {
    try {
        // Check February 2026 calendar for Ramadan start
        const url = `https://api.aladhan.com/v1/calendarByCity/2026/2?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=5`;
        const response = await fetch(url);
        console.log(response, "response of date");

        if (!response.ok) {
            throw new Error(`Failed to fetch calendar: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.code === 200 && data.data) {
            // Find first day where Hijri month is Ramadan (month number 9)
            for (const dayData of data.data) {
                if (dayData.date.hijri.month.number === 9) {
                    // Return in YYYY-MM-DD format
                    const greg = dayData.date.gregorian;
                    return `${greg.year}-${greg.month.number.toString().padStart(2, '0')}-${greg.day.padStart(2, '0')}`;
                }
            }
        }

        // Fallback to default if not found in February
        return '2026-02-18';
    } catch (error) {
        console.error('Error fetching Ramadan start date:', error);
        return '2026-02-18'; // Fallback
    }
}
