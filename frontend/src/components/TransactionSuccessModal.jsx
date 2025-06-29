import React, { useEffect, useState } from 'react';

export default function TransactionSuccessModal({
  isOpen,
  onClose,
  transactionData,
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkClicked, setLinkClicked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      console.log('TransactionSuccessModal opened');
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleWindowFocus = () => {
      console.log('Window gained focus, modal should stay open');
    };

    const handleWindowBlur = () => {
      console.log('Window lost focus (probably opened external link)');
    };

    if (isOpen) {
      window.addEventListener('focus', handleWindowFocus);
      window.addEventListener('blur', handleWindowBlur);
      
      return () => {
        window.removeEventListener('focus', handleWindowFocus);
        window.removeEventListener('blur', handleWindowBlur);
      };
    }
  }, [isOpen]);

  if (!isOpen || !transactionData) return null;

  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatEthAmount = (amount) => parseFloat(amount).toFixed(6);

  const formatUsdAmount = (amount) => parseFloat(amount).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transform rotate-45"></div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-slideIn relative overflow-hidden">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-green-600"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎉 Reward Sent Successfully!
          </h2>
          <p className="text-gray-600">
            Your crypto reward has been sent to the child's wallet.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-3">
              Transaction Details
            </h3>

            {/* Child Address */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Child Address:</span>
              <span className="font-mono text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {formatAddress(transactionData.childAddress)}
              </span>
            </div>

            {/* USD Amount */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">USD Value:</span>
              <span className="font-bold text-green-600">
                ${formatUsdAmount(transactionData.usdAmount)}
              </span>
            </div>

            {/* ETH Amount */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">ETH Sent:</span>
              <span className="font-mono text-sm">
                {formatEthAmount(transactionData.ethAmount)} ETH
              </span>
            </div>

            {/* Buffer Applied */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Buffer Applied:</span>
              <span className="text-sm text-orange-600 font-medium">
                +10% (price protection)
              </span>
            </div>

            {/* Transaction Hash */}
            <div className="border-t pt-3">
              <span className="text-sm text-gray-600 block mb-1">
                Transaction Hash:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex-1 truncate">
                  {transactionData.txHash}
                </span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${transactionData.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    // Prevent any event bubbling that might close the modal
                    e.stopPropagation();
                    setLinkClicked(true);
                    console.log('Opening blockchain explorer in new tab');
                    setTimeout(() => setLinkClicked(false), 3000);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  🔗 View {linkClicked && '✓'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            ✅ Close
          </button>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(transactionData.txHash);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
              } catch (err) {
                // Fallback for older browsers
                console.error('Failed to copy:', err);
              }
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors relative"
          >
            {copySuccess ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2"
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
                Copied!
              </span>
            ) : (
              '📋 Copy Hash'
            )}
          </button>
        </div>

        {/* Tip for blockchain viewing */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">
            💡 Tip: Click "🔗 View" to see on blockchain - this modal will stay open!
          </p>
        </div>

        {/* Celebration Message */}
        <div className="text-center mt-4 text-sm text-gray-500">
          The child will receive their reward once the transaction is confirmed!
          🚀
          <br />
          <span className="text-xs text-gray-400">
            Transaction saved to history 📊
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
