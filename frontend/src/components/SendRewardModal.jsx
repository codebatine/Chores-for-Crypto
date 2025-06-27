import React, { useState, useEffect } from 'react';
import { useChoresContract } from '../hooks/useChoresContract';

export default function SendRewardModal({ isOpen, onClose, onSuccess }) {
  const [childAddress, setChildAddress] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [ethEquivalent, setEthEquivalent] = useState('');
  const { sendReward, getETHAmountFromUSD, isLoading, error } =
    useChoresContract();

  // Calculate ETH equivalent when USD amount changes
  useEffect(() => {
    const calculateETH = async () => {
      console.log('calculateETH called with usdAmount:', usdAmount);
      console.log('usdAmount type:', typeof usdAmount);
      console.log('parseFloat(usdAmount):', parseFloat(usdAmount));

      if (usdAmount && parseFloat(usdAmount) > 0) {
        console.log('Calling getETHAmountFromUSD...');
        const ethAmount = await getETHAmountFromUSD(usdAmount);
        console.log('ETH amount received:', ethAmount);
        setEthEquivalent(ethAmount);
      } else {
        console.log('Clearing ETH equivalent');
        setEthEquivalent('');
      }
    };

    const timeoutId = setTimeout(calculateETH, 500);
    return () => clearTimeout(timeoutId);
  }, [usdAmount, getETHAmountFromUSD]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!childAddress || !usdAmount) {
      alert('Please fill in all fields');
      return;
    }

    const result = await sendReward(childAddress, parseFloat(usdAmount));

    if (result.success) {
      onSuccess(`Reward sent! Transaction: ${result.txHash}`);
      setChildAddress('');
      setUsdAmount('');
      setEthEquivalent('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Reward</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child's Address
            </label>
            <input
              type="text"
              value={childAddress}
              onChange={(e) => setChildAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="10.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="button"
            onClick={async () => {
              console.log('Testing contract call...');
              const result = await getETHAmountFromUSD('3');
              console.log('Test result:', result);
              alert(`ETH result: ${result}`);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Test Contract Call (Remove Later)
          </button>

          <button
            type="button"
            onClick={() => {
              console.log('Debug button clicked!');
              getETHAmountFromUSD('3').then((result) => {
                console.log('Debug result:', result);
                alert(`Debug result: ${result}`);
              });
            }}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            Debug Contract
          </button>

          {ethEquivalent && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                ETH Equivalent:{' '}
                <span className="font-mono font-bold">
                  {parseFloat(ethEquivalent).toFixed(6)} ETH
                </span>
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !ethEquivalent}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
