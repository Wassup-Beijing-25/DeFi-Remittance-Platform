const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  console.log("🧪 Starting complete deposit and claim test...");

  const [sender] = await ethers.getSigners();
  console.log("🔑 Sender address:", sender.address);

  // ✅ Update this with your new deployed contract address
  const remittanceAddress = "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3"; // Update after redeployment
  const tokenAddress = "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E"; // USDC on Arbitrum Sepolia
  const recipient = "0x27C1E4ddA1016FBeF2Dca3Ce0ACb7caE99C6Ed00";
  const amount = ethers.parseUnits("0.00001", 6); // 0.001 USDC for better yield visibility

  // ✅ ERC20 ABI
  const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];

  const remittance = await ethers.getContractAt(
    "RemittancePool",
    remittanceAddress
  );
  const usdc = await ethers.getContractAt(ERC20_ABI, tokenAddress);

  // Check initial balances
  const senderBalance = await usdc.balanceOf(sender.address);
  const recipientBalance = await usdc.balanceOf(recipient);
  const decimals = await usdc.decimals();
  const symbol = await usdc.symbol();

  console.log(`\n💰 Initial Balances (${symbol}):`);
  console.log(`Sender: ${ethers.formatUnits(senderBalance, decimals)}`);
  console.log(`Recipient: ${ethers.formatUnits(recipientBalance, decimals)}`);

  if (senderBalance < amount) {
    throw new Error(`🚫 Insufficient ${symbol} balance for deposit`);
  }

  // Step 1: Approve and Deposit
  console.log("\n🔒 Step 1: Approving USDC...");
  const approveTx = await usdc.approve(remittanceAddress, amount);
  await approveTx.wait();
  console.log("✅ Approval complete");

  console.log("💸 Step 2: Depositing to RemittancePool...");
  try {
    const depositTx = await remittance.deposit(
      tokenAddress,
      recipient,
      amount,
      {
        gasLimit: 1000,
      }
    );
    const receipt = await depositTx.wait();

    // Extract remittance ID from events
    const depositEvent = receipt.logs.find((log) => {
      try {
        return remittance.interface.parseLog(log).name === "Deposited";
      } catch {
        return false;
      }
    });

    if (!depositEvent) {
      throw new Error("Deposit event not found");
    }

    const parsedEvent = remittance.interface.parseLog(depositEvent);
    const remittanceId = parsedEvent.args.id;

    console.log("✅ Deposit successful!");
    console.log(`📋 Remittance ID: ${remittanceId}`);
    console.log(`🔗 Tx: https://sepolia.arbiscan.io/tx/${depositTx.hash}`);

    // Step 3: Wait for yield to accumulate
    console.log("\n⏳ Step 3: Waiting for yield to accumulate (30 seconds)...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    // Check current yield
    try {
      const remittanceDetails = await remittance.getRemittance(remittanceId);
      const currentTotal = remittanceDetails.currentTotal;
      const currentYield = remittanceDetails.currentYield;

      console.log(`\n📊 Current Status:`);
      console.log(
        `Principal: ${ethers.formatUnits(amount, decimals)} ${symbol}`
      );
      console.log(
        `Current Total: ${ethers.formatUnits(currentTotal, decimals)} ${symbol}`
      );
      console.log(
        `Current Yield: ${ethers.formatUnits(currentYield, decimals)} ${symbol}`
      );

      if (currentYield > 0) {
        console.log(
          `💰 Yield earned: ${ethers.formatUnits(
            currentYield,
            decimals
          )} ${symbol}`
        );
      } else {
        console.log("⏳ No yield yet (normal for short timeframes)");
      }
    } catch (error) {
      console.log("⚠️ Could not fetch yield info:", error.message);
    }

    // Step 4: Claim (simulate recipient claiming)
    console.log("\n🎯 Step 4: Claiming funds...");

    // Switch to recipient signer for claiming
    const recipientSigner = await ethers.getImpersonatedSigner(recipient);

    // Fund recipient with ETH for gas
    await sender.sendTransaction({
      to: recipient,
      value: ethers.parseEther("0.01"),
    });

    const remittanceAsRecipient = remittance.connect(recipientSigner);

    try {
      const claimTx = await remittanceAsRecipient.claim(remittanceId, {
        gasLimit: 500000,
      });
      const claimReceipt = await claimTx.wait();

      console.log("✅ Claim successful!");
      console.log(`🔗 Tx: https://sepolia.arbiscan.io/tx/${claimTx.hash}`);

      // Check claim event for yield details
      const claimEvent = claimReceipt.logs.find((log) => {
        try {
          return remittance.interface.parseLog(log).name === "Claimed";
        } catch {
          return false;
        }
      });

      if (claimEvent) {
        const parsedClaimEvent = remittance.interface.parseLog(claimEvent);
        const { principalAmount, yieldAmount, totalAmount } =
          parsedClaimEvent.args;

        console.log(`\n🎉 Claim Details:`);
        console.log(
          `Principal: ${ethers.formatUnits(
            principalAmount,
            decimals
          )} ${symbol}`
        );
        console.log(
          `Yield: ${ethers.formatUnits(yieldAmount, decimals)} ${symbol}`
        );
        console.log(
          `Total: ${ethers.formatUnits(totalAmount, decimals)} ${symbol}`
        );
      }
    } catch (error) {
      console.error("❌ Claim failed:", error.message);
      if (error.transaction?.hash) {
        console.log(
          `🔎 Check tx: https://sepolia.arbiscan.io/tx/${error.transaction.hash}`
        );
      }
    }

    // Final balance check
    const finalRecipientBalance = await usdc.balanceOf(recipient);
    console.log(
      `\n📊 Final recipient balance: ${ethers.formatUnits(
        finalRecipientBalance,
        decimals
      )} ${symbol}`
    );
    console.log(
      `📈 Net gain: ${ethers.formatUnits(
        finalRecipientBalance - recipientBalance,
        decimals
      )} ${symbol}`
    );
  } catch (error) {
    console.error("❌ Deposit failed:", error.message);
    if (error.transaction?.hash) {
      console.log(
        `🔎 Check tx: https://sepolia.arbiscan.io/tx/${error.transaction.hash}`
      );
    }
  }
}

main().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
