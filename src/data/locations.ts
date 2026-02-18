// List of countries
export const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
    'Bahrain', 'Bangladesh', 'Belgium', 'Bosnia and Herzegovina', 'Brazil', 'Brunei',
    'Canada', 'China', 'Denmark', 'Egypt', 'France', 'Germany', 'Ghana',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kuwait', 'Lebanon', 'Libya', 'Malaysia', 'Maldives',
    'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Oman',
    'Pakistan', 'Palestine', 'Philippines', 'Poland', 'Qatar', 'Russia',
    'Saudi Arabia', 'Senegal', 'Singapore', 'Somalia', 'South Africa', 'Spain',
    'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Tanzania', 'Thailand',
    'Tunisia', 'Turkey', 'UAE', 'Uganda', 'United Kingdom', 'United States', 'Yemen'
];

// Major cities by country (popular Islamic cities)
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
    'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
    'India': ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Lucknow', 'Dadri', 'Ghaziabad'],
    'Pakistan': ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'],
    'Bangladesh': ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'],
    'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang'],
    'Malaysia': ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Malacca', 'Ipoh'],
    'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya'],
    'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan'],
    'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Bradford', 'Leicester'],
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Detroit', 'Dallas'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
    'Qatar': ['Doha', 'Al Wakrah', 'Al Rayyan'],
    'Kuwait': ['Kuwait City', 'Hawalli', 'Salmiya'],
    'Bahrain': ['Manama', 'Muharraq', 'Riffa'],
    'Oman': ['Muscat', 'Salalah', 'Sohar'],
    'Jordan': ['Amman', 'Zarqa', 'Irbid'],
    'Lebanon': ['Beirut', 'Tripoli', 'Sidon'],
    'Morocco': ['Casablanca', 'Rabat', 'Marrakech', 'Fes'],
    'Algeria': ['Algiers', 'Oran', 'Constantine'],
    'Tunisia': ['Tunis', 'Sfax', 'Sousse'],
    'Iran': ['Tehran', 'Mashhad', 'Isfahan', 'Shiraz'],
    'Iraq': ['Baghdad', 'Basra', 'Mosul', 'Erbil'],
    'Syria': ['Damascus', 'Aleppo', 'Homs'],
    'Yemen': ['Sanaa', 'Aden', 'Taiz'],
    'Somalia': ['Mogadishu', 'Hargeisa', 'Bosaso'],
    'Nigeria': ['Lagos', 'Kano', 'Abuja', 'Ibadan'],
    'South Africa': ['Johannesburg', 'Cape Town', 'Durban'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    'Singapore': ['Singapore'],
    'Brunei': ['Bandar Seri Begawan'],
};

// Get cities for a specific country, or return empty array
export const getCitiesForCountry = (country: string): string[] => {
    return CITIES_BY_COUNTRY[country] || [];
};
