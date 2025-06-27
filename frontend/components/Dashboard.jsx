import React from 'react';

export default function Dashboard({ address, onDisconnect }) {
  return (
    <div className="flex flex-col items-center gap-8 bg-white/30 p-10 rounded-3xl shadow-2xl max-w-md w-full backdrop-blur-md transition-all duration-300 border border-white/40">
      <div className="text-lg text-blue-900 font-semibold tracking-wide">
        Connected as{' '}
        <span className="font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded shadow-inner">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>

      <div className="w-full flex flex-col gap-5 mt-2">
        <button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 active:scale-95 text-white px-7 py-3 rounded-xl font-bold shadow-lg ring-2 ring-green-300/30 focus:outline-none focus:ring-4 transition-all duration-200">
          Send Reward (parent)
        </button>
        <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-95 text-white px-7 py-3 rounded-xl font-bold shadow-lg ring-2 ring-purple-300/30 focus:outline-none focus:ring-4 transition-all duration-200">
          Receive Reward (child)
        </button>
      </div>

      <button
        onClick={onDisconnect}
        className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 active:scale-95 text-white px-8 py-3 rounded-xl text-lg mt-4 shadow-xl font-bold focus:outline-none focus:ring-4 focus:ring-red-400/50 transition-all duration-200"
      >
        Disconnect
      </button>
    </div>
  );
}
