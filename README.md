# AstroArc ✨

Welcome to AstroArc, the premier Web3 Astrology application built on the Arc Network testnet. It provides users a modern and immersive experience exploring their cosmic destiny through on-chain birth charts, astrological compatibility, an insightful AI Astrology Agent powered by Gemini, and decentralized Prediction Markets.

## 🚀 Features

*   **Birth Chart Generation:** Calculates sun signs, ascendants, and planetary placements based on birth details.
*   **Web3 Integration:** Connect with MetaMask (on the Arc Testnet) to secure your profile and mint your customized celestial results as NFTs.
*   **AI Astrology Chat:** Talk directly to the stars! Powered by Google Gemini to offer deep, personalized astrological readings.
*   **Astrologer Market & Compatibility:** View community astrologers and check cosmic compatibility between people instantly.
*   **Premium Glassmorphism UI:** A fully responsive, modern dark cosmic theme, featuring animated gradients and a sophisticated user interface designed for both mobile and desktop.

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), Tailwind CSS (Custom Arc theme), Ethers.js, HTML2Canvas, jsPDF, Lucide React.
*   **Backend:** Node.js, Express, MongoDB (Mongoose).
*   **Smart Contracts:** Solidity (v0.8.24), Hardhat, deployed on **Arc Testnet**.
*   **AI Integration:** Google Gemini API.

## 💻 Running the App Locally

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   MetaMask Browser Extension (configured with Arc Testnet)
*   Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/SuryaXyz-art/Astroarc.git
cd Astroarc
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
ARC_RPC_URL=https://rpc.testnet.arc.network
GEMINI_API_KEY=your_gemini_api_key
PRIVATE_KEY=your_wallet_private_key
MONGODB_URI=your_mongodb_connection_string
```
Start the backend server:
```bash
npm run dev
# OR
node index.js
```

### 3. Smart Contracts
Make sure the contracts are deployed or deploy them yourself.
```bash
cd contracts
npm install
```
Create a `.env` file in the `contracts` directory:
```env
ARC_RPC_URL=https://rpc.testnet.arc.network
PRIVATE_KEY=your_wallet_private_key
```
Deploy the contract to Arc Testnet:
```bash
npx hardhat ignition deploy ignition/modules/AstroReport.js --network arcTestnet
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```
Start the development server:
```bash
npm run dev
```

## 🌐 Arc Testnet Details
Ensure your MetaMask is configured with the following Arc Testnet settings to interact with the dApp:
*   **Network Name:** Arc Testnet
*   **RPC URL:** `https://rpc.testnet.arc.network`
*   **Chain ID:** `5042002`
*   **Currency Symbol:** `USDC`
*   **Block Explorer:** `https://testnet.arcscan.app`

## 📄 License
This project is open-source and available under the terms of the **MIT License**.
