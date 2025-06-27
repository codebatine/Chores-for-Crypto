import { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contractUtils.js';
import { PRICE_BUFFER_PERCENTAGE } from '../config/contract.js';

export function useChoresContract() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendReward = async (childAddress, usdAmount) => {
    try {
      setIsLoading(true);
      setError(null);

      const contract = await getContract(true);

      // Convert USD to wei (contract expects USD in wei format)
      const usdInWei = ethers.parseEther(usdAmount.toString());

      // Get required ETH amount
      const ethAmount = await contract.getETHAmountFromUSD(usdInWei);

      // Send transaction with buffer for price fluctuations
      const ethWithBuffer =
        (ethAmount * BigInt(PRICE_BUFFER_PERCENTAGE)) / BigInt(100);

      const tx = await contract.sendReward(childAddress, usdInWei, {
        value: ethWithBuffer,
      });

      await tx.wait();

      // Return detailed transaction data for the success modal
      return {
        success: true,
        txHash: tx.hash,
        transactionData: {
          childAddress,
          usdAmount: usdAmount.toString(),
          ethAmount: ethers.formatEther(ethAmount),
          ethWithBuffer: ethers.formatEther(ethWithBuffer),
          txHash: tx.hash,
        },
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const getETHAmountFromUSD = async (usdAmount) => {
    try {
      const contract = await getContract(false);
      const usdInWei = ethers.parseEther(usdAmount.toString());
      const ethAmount = await contract.getETHAmountFromUSD(usdInWei);
      return ethers.formatEther(ethAmount);
    } catch (err) {
      console.error('Error getting ETH amount:', err.message);
      return null;
    }
  };

  return { sendReward, getETHAmountFromUSD, isLoading, error };
}
