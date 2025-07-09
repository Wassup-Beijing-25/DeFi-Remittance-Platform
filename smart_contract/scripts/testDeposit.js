const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("📡 Starting deposit test script...");

  const [sender] = await ethers.getSigners();
  console.log("🔑 Sender address:", sender.address);

  const remittanceAddress = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";
  const tokenAddress = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e"; // Mumbai USDC

  const remittance = await ethers.getContractAt(
    "RemittancePool",
    remittanceAddress
  );
  const usdc = await ethers.getContractAt("IERC20", tokenAddress);

  const recipient = "0xb614AFA3D36d2914072cb2B1bf6CD204c4087ECD"; // ✅ Change this
  const amount = ethers.parseUnits("0.0001", 6); // ✅ Ethers v6 syntax

  console.log("🔒 Approving USDC...");
  const approveTx = await usdc.approve(remittanceAddress, amount);
  await approveTx.wait();
  console.log("✅ Approval complete");

  console.log("💸 Depositing into contract...");
  const depositTx = await remittance.deposit(tokenAddress, recipient, amount);
  await depositTx.wait();
  console.log("✅ Deposit complete!");
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exitCode = 1;
});
