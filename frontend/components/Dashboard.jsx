import React, { useState } from 'react';
import SendRewardModal from '../src/components/SendRewardModal';
import AddressBook from '../src/components/AddressBook';
import TransactionHistory from '../src/components/TransactionHistory';
import Toast from '../src/components/Toast';

export default function Dashboard({ address, onDisconnect }) {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success',
  });
  const [addressCopied, setAddressCopied] = useState(false);

  const handleSendSuccess = (message) => {
    setToast({ isVisible: true, message, type: 'success' });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setAddressCopied(true);
      setToast({
        isVisible: true,
        message: 'Address copied to clipboard!',
        type: 'success',
      });
      setTimeout(() => setAddressCopied(false), 2000);
    } catch {
      setToast({
        isVisible: true,
        message: 'Failed to copy address',
        type: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 bg-white/30 p-10 rounded-3xl shadow-2xl max-w-md w-full backdrop-blur-md transition-all duration-300 border border-white/40">
      <div className="text-lg text-blue-900 font-semibold tracking-wide flex items-center gap-3">
        <span>Connected as</span>
        <div className="flex items-center gap-2">
          <span className="font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded shadow-inner">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button
            onClick={copyAddress}
            className="p-1 hover:bg-blue-100 rounded transition-colors flex items-center gap-1"
            title="Copy address"
          >
            <span className="text-sm">📋</span>
            {addressCopied ? (
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-5 mt-2">
        <button
          onClick={() => setShowSendModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 active:scale-95 text-white px-7 py-3 rounded-xl font-bold shadow-lg ring-2 ring-green-300/30 focus:outline-none focus:ring-4 transition-all duration-200"
        >
          Send Reward (parent)
        </button>
        <button
          onClick={() => setShowAddressBook(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 active:scale-95 text-white px-7 py-3 rounded-xl font-bold shadow-lg ring-2 ring-blue-300/30 focus:outline-none focus:ring-4 transition-all duration-200 flex items-center justify-center gap-2"
        >
          📒 Address Book
        </button>
        <button
          onClick={() => setShowTransactionHistory(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-95 text-white px-7 py-3 rounded-xl font-bold shadow-lg ring-2 ring-purple-300/30 focus:outline-none focus:ring-4 transition-all duration-200 flex items-center justify-center gap-2"
        >
          📊 View Transactions
        </button>
      </div>

      <button
        onClick={onDisconnect}
        className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 active:scale-95 text-white px-8 py-3 rounded-xl text-lg mt-4 shadow-xl font-bold focus:outline-none focus:ring-4 focus:ring-red-400/50 transition-all duration-200"
      >
        Disconnect
      </button>

      <SendRewardModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        onSuccess={handleSendSuccess}
      />

      <AddressBook
        isOpen={showAddressBook}
        onClose={() => setShowAddressBook(false)}
        onSelectAddress={() => {}}
      />

      <TransactionHistory
        isOpen={showTransactionHistory}
        onClose={() => setShowTransactionHistory(false)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
