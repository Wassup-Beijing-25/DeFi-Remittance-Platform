const hre = require("hardhat");

async function main() {
  const aavePoolAddress = "0x9196e18Bc349B1F64BC08784eae259525329a1ad"; // Mumbai Aave Pool

  const RemittancePool = await hre.ethers.getContractFactory("RemittancePool");
  const contract = await RemittancePool.deploy(aavePoolAddress);
  await contract.deployed();

  console.log("RemittancePool with Aave deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
