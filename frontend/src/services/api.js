import { GoogleGenerativeAI } from '@google/generative-ai';
import zodiac from 'zodiac-signs';
import * as Astronomy from 'astronomy-engine';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const zodiacModule = zodiac();

// Mock backend API using LocalStorage to maintain a Serverless App

export const saveProfile = async (profileData) => {
    localStorage.setItem(`profile_${profileData.walletAddress}`, JSON.stringify(profileData));
    return { success: true, user: profileData };
};

export const getProfile = async (walletAddress) => {
    const data = localStorage.getItem(`profile_${walletAddress}`);
    if (data) {
        return { success: true, user: JSON.parse(data) };
    }
    return { success: false, error: 'User not found' };
};

export const generateChart = async (profileData) => {
    try {
        const { birthDate, birthTime } = profileData;
        const bDate = new Date(`${birthDate}T${birthTime || '12:00'}:00Z`);

        // 1. Get Zodiac Sign
        const day = bDate.getUTCDate();
        const month = bDate.getUTCMonth() + 1;
        const sign = zodiacModule.getSignByDate({ day, month });

        // 2. Planet Positions
        const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
        const planetPositions = planets.map(body => {
            const time = new Astronomy.AstroTime(bDate);
            const pos = Astronomy.GeoVector(body, time, true);
            const ecliptic = Astronomy.Ecliptic(pos);
            return {
                name: body,
                longitude: ecliptic.lon,
                sign: getZodiacSignFromLongitude(ecliptic.lon)
            };
        });

        // 3. Mock Ascendant
        const ascendantLon = (bDate.getUTCHours() * 15 + eclipticLongitudeFromName(planetPositions, 'Sun') + 90) % 360;

        const chartData = {
            zodiacSign: sign.name,
            zodiacElement: sign.element,
            ascendant: getZodiacSignFromLongitude(ascendantLon),
            planets: planetPositions,
            houses: generateHouses(ascendantLon)
        };

        return { success: true, chartData };
    } catch (error) {
        console.error('Error generating chart:', error);
        return { success: false, error: 'Failed to generate chart client-side' };
    }
};

export const chatWithAgent = async (chatData) => {
    try {
        const { message, profile, chartData } = chatData;

        if (!apiKey) {
            return { success: true, response: `[Dev Mode] The stars heard you ask: "${message}". Please set VITE_GEMINI_API_KEY to unlock true cosmic wisdom!` };
        }

        let contextPrompt = `You are a mystical, highly skilled astrologer AI acting as an AstroTalk agent. `;
        if (profile) {
            contextPrompt += `The user's name is ${profile.name || 'Traveler'}, born on ${profile.birthDate} at ${profile.birthTime} in ${profile.birthLocation}. `;
        }
        if (chartData) {
            contextPrompt += `Their Sun sign is ${chartData.zodiacSign}, Ascendant is ${chartData.ascendant}. `;
            contextPrompt += `Brief planetary info: ${chartData.planets?.map(p => `${p.name} in ${p.sign}`).join(', ')}. `;
        }
        contextPrompt += `\n\nUser asks: "${message}"\nProvide a personalized astrology-based response. Keep it concise, engaging, and slightly mystical but practical.\n\nAstrologer AI:`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(contextPrompt);
        return { success: true, response: result.response.text() };
    } catch (error) {
        console.error('Error in AI chat:', error);
        return { success: false, error: 'Cosmic interference prevented a response' };
    }
};

export const analyzeCompatibility = async (personA, personB) => {
    return {
        success: true,
        compatibilityResult: {
            overallMatch: 85,
            message: "Good energetic harmony. Keep developing your bond!"
        }
    };
};

/* --- Helpers --- */
function getZodiacSignFromLongitude(lon) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const index = Math.floor(lon / 30) % 12;
    return signs[index];
}

function eclipticLongitudeFromName(positions, name) {
    const p = positions.find(p => p.name === name);
    return p ? p.longitude : 0;
}

function generateHouses(ascendantLon) {
    const houses = [];
    for (let i = 0; i < 12; i++) {
        const cusp = (ascendantLon + (i * 30)) % 360;
        houses.push({ number: i + 1, sign: getZodiacSignFromLongitude(cusp), degree: cusp });
    }
    return houses;
}
