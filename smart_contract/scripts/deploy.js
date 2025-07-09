const hre = require("hardhat");

async function main() {
  const aavePoolAddress = "0xf3C3351D6Bd0098EEb33ca8f830FAf2a141Ea2E1";
  const dataProviderAddress = "0xAf6190a59bE1bC29f02c941794D6d9f6bFbE66FA";

  const RemittancePool = await hre.ethers.getContractFactory("RemittancePool");

  console.log("🚀 Deploying...");
  const contract = await RemittancePool.deploy(
    aavePoolAddress,
    dataProviderAddress
  );

  await contract.deployed(); // 👈 Use this in Remix (Ethers v5)

  console.log("✅ Deployed to:", contract.address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
