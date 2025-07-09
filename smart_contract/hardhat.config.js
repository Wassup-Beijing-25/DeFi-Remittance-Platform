require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ARBITRUM_SEPOLIA_RPC = process.env.ARBITRUM_SEPOLIA_RPC;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "arbitrum-sepolia": {
      url: ARBITRUM_SEPOLIA_RPC,
      accounts: [PRIVATE_KEY],
      gasPrice: 100000000, // 0.1 gwei
      gas: 2000000,
    },
    hardhat: {
      forking: {
        url: ARBITRUM_SEPOLIA_RPC,
        blockNumber: undefined, // Use latest block
      },
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: "YourArbitrumSepoliaApiKey", // Get from arbiscan.io
    },
  },
};
