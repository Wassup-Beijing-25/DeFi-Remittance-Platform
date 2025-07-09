require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  networks: {
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: "0.8.20",
};
