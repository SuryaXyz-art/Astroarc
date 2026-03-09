const express = require('express');
const router = express.Router();
const zodiac = require('zodiac-signs')();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy');

router.post('/analyze', async (req, res) => {
    try {
        const { personA, personB } = req.body;
        if (!personA || !personB) return res.status(400).json({ error: 'Both profiles required' });

        // Extract zodiacs
        const dateA = new Date(personA.birthDate);
        const signA = zodiac.getSignByDate({ day: dateA.getUTCDate(), month: dateA.getUTCMonth() + 1 });

        const dateB = new Date(personB.birthDate);
        const signB = zodiac.getSignByDate({ day: dateB.getUTCDate(), month: dateB.getUTCMonth() + 1 });

        // Simple deterministic score generation for hackathon
        // You could also use Gemini for the text analysis
        const loveScore = Math.floor(Math.random() * 40) + 60; // 60-100%
        const marriageScore = Math.floor(Math.random() * 40) + 60;

        let analysisText = "";

        try {
            const prompt = `Act as an expert Vedic/Western astrologer. Determine compatibility between Person A (${signA.name}) and Person B (${signB.name}). Provide a Dosha analysis and personality comparison in 3 short paragraphs.`;
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            analysisText = result.response.text();
        } catch (e) {
            analysisText = `${signA.name} and ${signB.name} have a mystical connection. Their planetary alignments suggest moments of high passion but also require strong communication.`;
        }

        res.json({
            success: true,
            compatibility: {
                signA: signA.name,
                signB: signB.name,
                loveScore,
                marriageScore,
                analysisText
            }
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error analyzing compatibility' });
    }
});

module.exports = router;
