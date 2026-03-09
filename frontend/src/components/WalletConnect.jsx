import React, { useState } from 'react';
import { ethers } from 'ethers';

const ARC_TESTNET_CHAIN_ID = '0xd8'; // 216 in decimal

export default function WalletConnect({ onConnect }) {
    const [account, setAccount] = useState('');
    const [error, setError] = useState('');

    const connectWallet = async () => {
        if (!window.ethereum) {
            setError('MetaMask is not installed. Please install it to use this app.');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Request accounts
            const accounts = await provider.send('eth_requestAccounts', []);
            const address = accounts[0];

            // Switch to Arc Testnet
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ARC_TESTNET_CHAIN_ID }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: ARC_TESTNET_CHAIN_ID,
                                    chainName: 'Arc Testnet',
                                    rpcUrls: ['https://testnet.arcscan.app/rpc'],
                                    nativeCurrency: {
                                        name: 'Ethereum',
                                        symbol: 'ETH', // Update if Arc native token is different
                                        decimals: 18,
                                    },
                                    blockExplorerUrls: ['https://testnet.arcscan.app/'],
                                },
                            ],
                        });
                    } catch (addError) {
                        setError('Failed to add Arc Testnet to MetaMask');
                        return;
                    }
                } else {
                    setError('Failed to switch to Arc Testnet');
                    return;
                }
            }

            setAccount(address);
            onConnect(address);
        } catch (err) {
            setError('Failed to connect wallet: ' + err.message);
        }
    };

    return (
        <div className="flex flex-col items-center">
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="relative group px-8 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl transition-all duration-300 font-bold overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                    <span className="relative z-10 flex items-center gap-2">Connect Web3 Wallet</span>
                </button>
            ) : (
                <div className="flex items-center gap-3 px-5 py-2.5 glass-panel rounded-full border border-purple-500/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="font-mono text-sm text-purple-200 font-medium tracking-wide">
                        {account.substring(0, 6)}...{account.substring(account.length - 4)}
                    </span>
                </div>
            )}
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>
    );
}
