const express = require('express');
const router = express.Router();
const zodiac = require('zodiac-signs')();
const Astronomy = require('astronomy-engine');

router.post('/generate', async (req, res) => {
    try {
        const { birthDate, birthTime, birthLocation } = req.body;

        if (!birthDate) {
            return res.status(400).json({ error: 'Birth date is required' });
        }

        // Parse Date
        const bDate = new Date(`${birthDate}T${birthTime || '12:00'}:00Z`);

        // 1. Get Zodiac Sign
        const day = bDate.getUTCDate();
        const month = bDate.getUTCMonth() + 1; // 1-12
        const sign = zodiac.getSignByDate({ day, month });

        // 2. Planet Positions using Astronomy Engine
        // Simplified for hackathon: calculate longitude of major bodies
        const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
        const planetPositions = planets.map(body => {
            // Astronomy.EclipticLongitude gives the heliocentric or geocentric longitude
            // For astrology we need geocentric apparent ecliptic longitude
            const time = new Astronomy.AstroTime(bDate);
            const pos = Astronomy.GeoVector(body, time, true);
            const ecliptic = Astronomy.Ecliptic(pos);
            return {
                name: body,
                longitude: ecliptic.lon,
                sign: getZodiacSignFromLongitude(ecliptic.lon)
            };
        });

        // 3. Mock Ascendant and Houses (For complete chart generation, you typically need exact lat/lon)
        // Here we generate plausible static-like data based on time for demo purposes.
        const ascendantLon = (bDate.getUTCHours() * 15 + eclipticLongitudeFromName(planetPositions, 'Sun') + 90) % 360;

        const chartData = {
            zodiacSign: sign.name,
            zodiacElement: sign.element,
            ascendant: getZodiacSignFromLongitude(ascendantLon),
            planets: planetPositions,
            houses: generateHouses(ascendantLon)
        };

        res.json({ success: true, chartData });
    } catch (error) {
        console.error('Error generating chart:', error);
        res.status(500).json({ error: 'Server error generating chart' });
    }
});

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
    // Simple equal house system
    const houses = [];
    for (let i = 0; i < 12; i++) {
        const cusp = (ascendantLon + (i * 30)) % 360;
        houses.push({
            number: i + 1,
            sign: getZodiacSignFromLongitude(cusp),
            degree: cusp
        });
    }
    return houses;
}

module.exports = router;
