import { useState } from 'react';
import { ethers } from 'ethers';

// Your deployed contract details
const CONTRACT_ADDRESS = '0x210b858E80253117e7a572112810ECc07c44A98C';
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: 'address', name: '_priceFeed', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'parent',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'child',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'ethAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'usdAmount',
        type: 'uint256',
      },
    ],
    name: 'RewardSent',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'usdAmount', type: 'uint256' }],
    name: 'getETHAmountFromUSD',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address payable', name: 'child', type: 'address' },
      { internalType: 'uint256', name: 'usdAmount', type: 'uint256' },
    ],
    name: 'sendReward',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

export function useChoresContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendReward = async (childAddress, usdAmount) => {
    try {
      setIsLoading(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer,
      );

      // Convert USD to wei (contract expects USD in wei format)
      const usdInWei = ethers.parseEther(usdAmount.toString());

      // Get required ETH amount
      const ethAmount = await contract.getETHAmountFromUSD(usdInWei);

      // Send transaction with 10% buffer for price fluctuations
      const ethWithBuffer = (ethAmount * BigInt(110)) / BigInt(100);

      const tx = await contract.sendReward(childAddress, usdInWei, {
        value: ethWithBuffer,
      });

      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getETHAmountFromUSD = async (usdAmount) => {
    try {
      console.log('=== Starting getETHAmountFromUSD ===');
      console.log('USD Amount input:', usdAmount);

      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      console.log('Network:', network.name, 'Chain ID:', network.chainId);

      if (network.chainId !== 11155111n) {
        throw new Error('Please switch to Sepolia testnet');
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider,
      );
      console.log('Contract address:', CONTRACT_ADDRESS);

      const usdInWei = ethers.parseEther(usdAmount.toString());
      console.log('USD in wei:', usdInWei.toString());

      console.log('Calling contract.getETHAmountFromUSD...');
      const ethAmount = await contract.getETHAmountFromUSD(usdInWei);
      console.log('Raw ETH amount from contract:', ethAmount, typeof ethAmount);

      if (typeof ethAmount === 'bigint') {
        const formattedEth = ethers.formatEther(ethAmount);
        console.log('Formatted ETH:', formattedEth);
        return formattedEth;
      } else {
        console.error('Contract did not return a BigInt:', ethAmount);
        return null;
      }
    } catch (err) {
      console.error('=== Error in getETHAmountFromUSD ===');
      console.error('Error message:', err.message);
      console.error('Full error:', err);
      return null;
    }
  };

  return { sendReward, getETHAmountFromUSD, isLoading, error };
}
