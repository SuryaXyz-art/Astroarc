import { ethers } from 'ethers';

// Load from env, or fallback to the deployed arc testnet address
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x1FEE1713517C0d33c01E63D3Af8ed4789a3eA1E6";

// Human-readable ABI for AstroReport
const ASTRO_REPORT_ABI = [
    "function createReport(string _birthChartHash, string _horoscopePrediction, string _ipfsReportLink) public",
    "function getUserReports(address _user) public view returns (tuple(address user, string birthChartHash, string horoscopePrediction, string ipfsReportLink, uint256 timestamp)[])",
    "function mintReportNFT(uint256 reportIndex) public",
    "event ReportCreated(address indexed user, string birthChartHash, uint256 timestamp)",
    "event ReportNFTMinted(address indexed user, uint256 reportId, string ipfsLink)"
];

export const getAstroReportContract = async (signerOrProvider) => {
    return new ethers.Contract(CONTRACT_ADDRESS, ASTRO_REPORT_ABI, signerOrProvider);
};

export const storeReportOnChain = async (birthChartHash, horoscopePrediction, ipfsReportLink) => {
    try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contract = await getAstroReportContract(signer);
        const tx = await contract.createReport(birthChartHash, horoscopePrediction, ipfsReportLink);
        await tx.wait();
        return { success: true, hash: tx.hash };
    } catch (error) {
        console.error("Error storing report on-chain:", error);
        return { success: false, error: error.message };
    }
};

export const fetchUserReports = async (userAddress) => {
    try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        const provider = new ethers.BrowserProvider(window.ethereum);

        // We can just use the provider for reading data
        const contract = await getAstroReportContract(provider);
        const reports = await contract.getUserReports(userAddress);
        return { success: true, reports };
    } catch (error) {
        console.error("Error fetching user reports:", error);
        return { success: false, error: error.message };
    }
};

export const mintChartNFT = async (reportIndex) => {
    try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contract = await getAstroReportContract(signer);
        const tx = await contract.mintReportNFT(reportIndex);
        await tx.wait();
        return { success: true, hash: tx.hash };
    } catch (error) {
        console.error("Error minting NFT:", error);
        return { success: false, error: error.message };
    }
};

// --- AstroMarket ---
// Deployed AstroMarket Address on Arc Testnet
const STORE_MARKET_ADDRESS = "0x776B7Bc2086b75ce0603d402C2f1c0655c0A26C7";

const ASTRO_MARKET_ABI = [
    "function registerAstrologer(string _name, uint256 _priceInWei) public",
    "function bookSession(address _astrologer) public payable",
    "function submitReview(address _astrologer, uint8 _rating) public",
    "function getAllAstrologers() public view returns (tuple(address wallet, string name, uint256 price, uint256 ratingCount, uint256 totalRating, bool isActive)[])"
];

export const getAstroMarketContract = async (signerOrProvider) => {
    return new ethers.Contract(STORE_MARKET_ADDRESS, ASTRO_MARKET_ABI, signerOrProvider);
};

// --- Prediction Market ---
// Deployed AstroPrediction Address on Arc Testnet
const PREDICTION_MARKET_ADDRESS = "0x897A2406C9b2FB897bEBb9Bc7c728b303300F1D4";

const PREDICTION_MARKET_ABI = [
    "function createMarket(string _question, string _aiPredictionSignal) public",
    "function placeBet(uint256 _marketId, bool _betYes) public payable",
    "function resolveMarket(uint256 _marketId, bool _outcome) public",
    "function claimWinnings(uint256 _marketId) public"
];

export const getPredictionMarketContract = async (signerOrProvider) => {
    return new ethers.Contract(PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI, signerOrProvider);
};
