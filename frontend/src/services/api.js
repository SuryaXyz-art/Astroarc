export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const saveProfile = async (profileData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
    });
    return response.json();
};

export const getProfile = async (walletAddress) => {
    const response = await fetch(`${API_URL}/auth/profile/${walletAddress}`);
    return response.json();
};

export const generateChart = async (profileData) => {
    const response = await fetch(`${API_URL}/chart/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
    });
    return response.json();
};

export const chatWithAgent = async (chatData) => {
    const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData)
    });
    return response.json();
};

export const analyzeCompatibility = async (personA, personB) => {
    const response = await fetch(`${API_URL}/compatibility/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personA, personB })
    });
    return response.json();
};
