import React from 'react';

export default function Dashboard({ address, onDisconnect }) {
  return (
    <div className="flex flex-col items-center gap-6 bg-white/60 p-10 rounded-2xl shadow-2xl max-w-md w-full">
      <div className="text-lg text-blue-800 font-semibold">
        Connected as{' '}
        <span className="font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>

      <div className="w-full flex flex-col gap-4 mt-4">
        <button className="bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow">
          Send Reward (parent)
        </button>
        <button className="bg-purple-500 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow">
          Receive Reward (child)
        </button>
      </div>

      <button
        onClick={onDisconnect}
        className="bg-red-500 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg mt-6 shadow transition"
      >
        Disconnect
      </button>
    </div>
  );
}
