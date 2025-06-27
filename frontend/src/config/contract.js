// Contract configuration
export const CONTRACT_ADDRESS = '0x210b858E80253117e7a572112810ECc07c44A98C';

export const CONTRACT_ABI = [
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

// Network configuration
export const SEPOLIA_CHAIN_ID = 11155111n;
export const PRICE_BUFFER_PERCENTAGE = 110; // 10% buffer for price fluctuations
