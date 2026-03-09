const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Warning: In production, ensure process.env.GEMINI_API_KEY is properly set
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy');

router.post('/chat', async (req, res) => {
    try {
        const { message, profile, chartData } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Prepare Astrology Context
        let contextPrompt = `You are a mystical, highly skilled astrologer AI acting as an AstroTalk agent. `;
        if (profile) {
            contextPrompt += `The user's name is ${profile.name || 'Traveler'}, born on ${profile.birthDate} at ${profile.birthTime} in ${profile.birthLocation}. `;
        }
        if (chartData) {
            contextPrompt += `Their Sun sign is ${chartData.zodiacSign}, Ascendant is ${chartData.ascendant}. `;
            contextPrompt += `Brief planetary info: ${chartData.planets.map(p => `${p.name} in ${p.sign}`).join(', ')}. `;
        }
        contextPrompt += `\n\nUser asks: "${message}"\nProvide a personalized astrology-based response. Keep it concise, engaging, and slightly mystical but practical.\n\nAstrologer AI:`;

        // Make the call to Gemini API
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(contextPrompt);
            const output = result.response.text();
            res.json({ success: true, response: output });
        } catch (apiError) {
            console.error('Gemini API Error:', apiError);
            // Fallback for demo when API key isn't provided or invalid
            res.json({
                success: true,
                response: `[Gemini API Config Required] The stars reveal that you asked: "${message}". Connect a valid Gemini API key in backend/.env to unveil true cosmic wisdom!`
            });
        }
    } catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({ error: 'Cosmic interference prevented a response' });
    }
});

module.exports = router;
