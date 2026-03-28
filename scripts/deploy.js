const { ethers } = require("hardhat");

/**
 * Deployment script for MultiSigWallet and TestContract.
 *
 * Configure the owners and threshold below before running:
 *
 *   npx hardhat run scripts/deploy.js --network sepolia
 */

// ── Configuration ─────────────────────────────────────────────────────────────

const OWNERS = [
  "0xYOUR_OWNER_1_ADDRESS",
  "0xYOUR_OWNER_2_ADDRESS",
];

const NUM_CONFIRMATIONS_REQUIRED = 2;

// ── Helpers ───────────────────────────────────────────────────────────────────

function validate() {
  if (OWNERS.some((addr) => addr.startsWith("0xYOUR"))) {
    throw new Error(
      "Replace the placeholder addresses in OWNERS before deploying."
    );
  }
  if (NUM_CONFIRMATIONS_REQUIRED < 1 || NUM_CONFIRMATIONS_REQUIRED > OWNERS.length) {
    throw new Error(
      `NUM_CONFIRMATIONS_REQUIRED must be between 1 and ${OWNERS.length}.`
    );
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  validate();

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy TestContract
  console.log("Deploying TestContract...");
  const TestContract = await ethers.getContractFactory("TestContract");
  const testContract = await TestContract.deploy();
  await testContract.waitForDeployment();
  const testContractAddress = await testContract.getAddress();
  console.log("TestContract deployed to:", testContractAddress);

  // Deploy MultiSigWallet
  console.log("\nDeploying MultiSigWallet...");
  console.log("  Owners:", OWNERS);
  console.log("  Required confirmations:", NUM_CONFIRMATIONS_REQUIRED);

  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const wallet = await MultiSigWallet.deploy(OWNERS, NUM_CONFIRMATIONS_REQUIRED);
  await wallet.waitForDeployment();
  const walletAddress = await wallet.getAddress();
  console.log("MultiSigWallet deployed to:", walletAddress);

  // Summary
  console.log("\n─────────────────────────────────────────────");
  console.log("Deployment summary");
  console.log("─────────────────────────────────────────────");
  console.log("TestContract:    ", testContractAddress);
  console.log("MultiSigWallet:  ", walletAddress);
  console.log("Network:         ", (await ethers.provider.getNetwork()).name);
  console.log("─────────────────────────────────────────────");
  console.log("\nVerify on Etherscan:");
  console.log(
    `npx hardhat verify --network sepolia ${walletAddress} '${JSON.stringify(OWNERS)}' ${NUM_CONFIRMATIONS_REQUIRED}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
