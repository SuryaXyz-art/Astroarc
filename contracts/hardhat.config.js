import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
    solidity: "0.8.24",
    networks: {
        arcTestnet: {
            url: process.env.ARC_RPC_URL || "https://rpc.testnet.arc.network",
            chainId: 5042002,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        }
    }
};
