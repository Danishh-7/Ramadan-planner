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
 * Fetches prayer timings for a given latitude and longitude.
 * @param latitude - The latitude.
 * @param longitude - The longitude.
 * @param method - The calculation method (default is 5).
 * @returns A promise that resolves to the prayer timings.
 */
export async function getPrayerTimingsByCoordinates(
    latitude: number,
    longitude: number,
    method: number = 5
): Promise<PrayerTimings | null> {
    try {
        const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`;
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
        console.error('Error fetching Aladhan prayer timings by coordinates:', error);
        return null;
    }
}

/**
 * Specifically gets Sehri and Iftar times.
 * Returns Imsak (start of Sehri), Fajr (Khatam-e-Sehri/end of eating), and Maghrib (Iftar).
 */
/**
 * Specifically gets Sehri and Iftar times.
 * Returns Imsak (start of Sehri), Fajr (Khatam-e-Sehri/end of eating), and Maghrib (Iftar).
 */
export async function getSehriIftarTimings(city?: string, country?: string, latitude?: number, longitude?: number) {
    let timings: PrayerTimings | null = null;

    if (latitude && longitude) {
        timings = await getPrayerTimingsByCoordinates(latitude, longitude);
    } else if (city && country) {
        timings = await getPrayerTimingsByCity(city, country);
    }

    if (timings) {
        return {
            sehri: timings.Imsak,
            khatamSehri: timings.Fajr, // End of Sehri time
            iftar: timings.Maghrib
        };
    }
}

/**
 * Gets the Ramadan start date for a given location (city/country or coordinates).
 * Uses the Aladhan calendar API to find the first day of Ramadan.
 */
export async function getRamadanStartDate(city?: string, country?: string, latitude?: number, longitude?: number): Promise<string> {
    try {
        let url = '';
        if (latitude && longitude) {
            url = `https://api.aladhan.com/v1/calendar/2026/2?latitude=${latitude}&longitude=${longitude}&method=5`;
        } else if (city && country) {
            url = `https://api.aladhan.com/v1/calendarByCity/2026/2?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=5`;
        } else {
            return '2026-02-18';
        }

        const response = await fetch(url);
        console.log(response, "response of date");

        if (!response.ok) {
            throw new Error(`Failed to fetch calendar: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.code === 200 && data.data) {
            // Check timezone for India adjustment (Asia/Kolkata)
            // The API returns an array for the month, we can check the first entry's meta
            const timezone = data.data[0]?.meta?.timezone;
            let offsetDays = 0;

            if (timezone === 'Asia/Kolkata') {
                offsetDays = 1; // India is usually +1 day due to moon sighting
            }

            // Find first day where Hijri month is Ramadan (month number 9)
            for (const dayData of data.data) {
                if (dayData.date.hijri.month.number === 9) {
                    // Return in YYYY-MM-DD format
                    const greg = dayData.date.gregorian;
                    const month = typeof greg.month === 'object' ? greg.month.number : greg.month;

                    if (offsetDays > 0) {
                        const date = new Date(`${greg.year}-${month.toString().padStart(2, '0')}-${greg.day.padStart(2, '0')}`);
                        date.setDate(date.getDate() + offsetDays);
                        return date.toISOString().split('T')[0];
                    }

                    return `${greg.year}-${month.toString().padStart(2, '0')}-${greg.day.padStart(2, '0')}`;
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
