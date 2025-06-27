import React, { useState, useEffect } from 'react';

export default function AddressBook({ isOpen, onClose, onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load addresses from localStorage on component mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem('chores-address-book');
    if (savedAddresses) {
      try {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        console.log('Loaded addresses from localStorage:', parsedAddresses);
      } catch (error) {
        console.error('Error parsing saved addresses:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save addresses to localStorage whenever addresses change (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('chores-address-book', JSON.stringify(addresses));
      console.log('Saved addresses to localStorage:', addresses);
    }
  }, [addresses, isLoaded]);

  const addAddress = () => {
    if (!newName.trim() || !newAddress.trim()) {
      alert('Please fill in both name and address');
      return;
    }

    // Basic address validation (Ethereum address format)
    if (!newAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: newName.trim(),
      address: newAddress.trim(),
    };

    console.log('Adding new address entry:', newEntry);
    setAddresses([...addresses, newEntry]);
    setNewName('');
    setNewAddress('');
    setIsAddingNew(false);
  };

  const deleteAddress = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const copyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(''), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const selectAddress = (address) => {
    onSelectAddress(address);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full m-4 shadow-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            📒 Address Book ({addresses.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const saved = localStorage.getItem('chores-address-book');
                console.log('Raw localStorage data:', saved);
                console.log('Current addresses state:', addresses);
              }}
              className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
              title="Debug localStorage"
            >
              🐛
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Add New Address Section */}
        {isAddingNew ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              ✨ Add New Address
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name (e.g., Alice, Bob)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  onClick={addAddress}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingNew(true)}
            className="w-full mb-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            ➕ Add New Address
          </button>
        )}

        {/* Address List */}
        <div className="space-y-3">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>📭 No saved addresses yet</p>
              <p className="text-sm">Add some addresses to get started!</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    👤 {addr.name}
                  </div>
                  <div className="text-sm text-gray-500 font-mono">
                    {addr.address.slice(0, 8)}...{addr.address.slice(-6)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyAddress(addr.address)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1"
                    title="Copy address"
                  >
                    <span className="text-xs">📋</span>
                    {copiedAddress === addr.address ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => selectAddress(addr.address)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    ✅ Select
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete address"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
