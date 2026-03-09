const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    name: { type: String },
    birthDate: { type: String },
    birthTime: { type: String },
    birthLocation: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
