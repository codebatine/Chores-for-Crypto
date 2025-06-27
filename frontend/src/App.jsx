import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

function App() {
  const [address, setAddress] = useState(null);

  // Setup Web3Modal
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    theme: 'light',
  });

  // Connect wallet
  const connectWallet = async () => {
    const instance = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(instance);
    const signer = await provider.getSigner();
    const _address = await signer.getAddress();
    setAddress(_address);
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAddress(null);
    web3Modal.clearCachedProvider();
  };

  // Auto-connect if previously connected
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-200 to-yellow-100">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        Chores for Crypto
      </h1>

      {address ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg text-gray-800 bg-white px-4 py-2 rounded-xl shadow">
            Connected:{' '}
            <span className="font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg shadow"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-3 rounded-xl text-lg shadow-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;
