const hre = require("hardhat");
const { ethers } = hre;

const USDC_ADDRESS = "0xD21A4B13F51C090FA75FD6EE0C3C38D08B64B3F5";
const REMITTANCE_POOL_ADDRESS = "0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99";

async function main() {
  const [sender] = await ethers.getSigners();
  const recipient = sender; // use same account for testing

  console.log("🔑 Sender address:", sender.address);

  const usdcAbi = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function allowance(address owner, address spender) external view returns (uint256)",
  ];

  const usdc = new ethers.Contract(USDC_ADDRESS, usdcAbi, sender);

  const remittance = await ethers.getContractAt(
    "RemittancePool",
    REMITTANCE_POOL_ADDRESS
  );
  console.log("🔗 Remittance contract address:", remittance);

  const amount = ethers.parseUnits("0.00001", 6); // 10 USDC

  console.log("🔒 Approving USDC...");
  const approveTx = await usdc
    .connect(sender)
    .approve(REMITTANCE_POOL_ADDRESS, amount);
  await approveTx.wait();
  console.log("✅ Approval complete");

  console.log("💸 Depositing into contract...");
  const depositTx = await remittance
    .connect(sender)
    .depositRemittance(recipient.address, amount);
  await depositTx.wait();
  console.log("✅ Deposit complete");

  console.log("💰 Withdrawing by recipient...");
  const withdrawTx = await remittance.connect(recipient).withdrawRemittance();
  await withdrawTx.wait();
  console.log("✅ Withdrawal complete!");
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exitCode = 1;
});
