require('dotenv').config();

module.exports = {
  solidity: '0.8.20',
  // Only include local network for now!
  // Comment out testnets to avoid the private key error
  // networks: {
  //   baseSepolia: {
  //     url: process.env.BASE_RPC,
  //     accounts: [process.env.PRIVATE_KEY],
  //   },
  //   arbitrumSepolia: {
  //     url: process.env.ARBITRUM_RPC,
  //     accounts: [process.env.PRIVATE_KEY],
  //   },
  // },
};
