
const lat = 28.6139;
const lon = 77.2090; // Delhi
const url = `https://api.aladhan.com/v1/calendar/2026/2?latitude=${lat}&longitude=${lon}&method=5`;

console.log(`Fetching: ${url}`);

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.code !== 200) {
            console.error('API Error:', data.status);
            return;
        }

        const timezone = data.data[0]?.meta?.timezone;
        console.log('Timezone:', timezone);

        let found = false;
        for (const day of data.data) {
            const hijriMonth = day.date.hijri.month.number;
            const gregDate = day.date.gregorian.date;
            const hijriDate = day.date.hijri.date;

            // Console log a few days to see format
            if (day.date.gregorian.day === '01' || day.date.gregorian.day === '15' || day.date.gregorian.day === '28') {
                console.log(`Sample: ${gregDate} -> Hijri Month: ${hijriMonth} (${day.date.hijri.month.en})`);
            }

            if (hijriMonth === 9 || hijriMonth === '9') {
                console.log(`FOUND RAMADAN START: ${gregDate}`);
                found = true;
                break;
            }
        }

        if (!found) {
            console.log('Ramadan start (Month 9) NOT FOUND in Feb 2026 data.');
        }
    })
    .catch(err => console.error(err));
