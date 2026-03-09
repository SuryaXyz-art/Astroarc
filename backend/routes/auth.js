const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Fallback memory store for hackathon/demo when MongoDB is not running locally
const memoryStore = {};

router.post('/profile', async (req, res) => {
    try {
        const { walletAddress, name, birthDate, birthTime, birthLocation } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
        }

        try {
            let user = await User.findOne({ walletAddress });
            if (user) {
                user.name = name || user.name;
                user.birthDate = birthDate || user.birthDate;
                user.birthTime = birthTime || user.birthTime;
                user.birthLocation = birthLocation || user.birthLocation;
                await user.save();
            } else {
                user = new User({ walletAddress, name, birthDate, birthTime, birthLocation });
                await user.save();
            }
            return res.json({ success: true, user });
        } catch (dbError) {
            console.warn("MongoDB not available, using memory store for profile.");
            memoryStore[walletAddress] = { walletAddress, name, birthDate, birthTime, birthLocation };
            return res.json({ success: true, user: memoryStore[walletAddress] });
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: 'Server error saving profile' });
    }
});

router.get('/profile/:walletAddress', async (req, res) => {
    try {
        try {
            const user = await User.findOne({ walletAddress: req.params.walletAddress });
            if (user) {
                return res.json({ success: true, user });
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        } catch (dbError) {
            const user = memoryStore[req.params.walletAddress];
            if (user) {
                return res.json({ success: true, user });
            } else {
                return res.status(404).json({ error: 'User not found in memory store' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching profile' });
    }
});

module.exports = router;
