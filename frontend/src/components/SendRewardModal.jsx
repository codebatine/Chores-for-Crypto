import React, { useState, useEffect } from 'react';
import { useChoresContract } from '../hooks/useChoresContract';
import TransactionSuccessModal from './TransactionSuccessModal';
import AddressBook from './AddressBook';

export default function SendRewardModal({ isOpen, onClose, onSuccess }) {
  const [childAddress, setChildAddress] = useState('');
  const [usdAmount, setUsdAmount] = useState('');
  const [ethEquivalent, setEthEquivalent] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const { sendReward, getETHAmountFromUSD, isLoading, error } =
    useChoresContract();

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
      setTransactionData(result.transactionData);
      setShowSuccessModal(true);
      setChildAddress('');
      setUsdAmount('');
      setEthEquivalent('');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setTransactionData(null);
    onClose();
    if (onSuccess) {
      onSuccess('Reward sent successfully!');
    }
  };

  const handleAddressSelect = (address) => {
    setChildAddress(address);
    setShowAddressBook(false);
    // Optional: Add visual feedback that address was selected
    console.log('Address selected from address book:', address);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgb(253, 253, 253)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-md w-full m-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Reward</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child's Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={childAddress}
                onChange={(e) => setChildAddress(e.target.value)}
                placeholder="0x... or select from address book"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowAddressBook(true)}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                title="Choose from address book"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                📒
              </button>
            </div>
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

      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        transactionData={transactionData}
      />

      <AddressBook
        isOpen={showAddressBook}
        onClose={() => setShowAddressBook(false)}
        onSelectAddress={handleAddressSelect}
      />
    </div>
  );
}
