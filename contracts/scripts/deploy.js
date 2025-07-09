const hre = require("hardhat");

async function main() {
  const RemittancePool = await hre.ethers.getContractFactory("RemittancePool");
  const contract = await RemittancePool.deploy();
  await contract.deployed();

  console.log("RemittancePool deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
