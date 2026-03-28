const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSigWallet", function () {
  let wallet;
  let testContract;
  let owner1, owner2, owner3, nonOwner;
  const REQUIRED = 2;

  beforeEach(async function () {
    [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    wallet = await MultiSigWallet.deploy(
      [owner1.address, owner2.address, owner3.address],
      REQUIRED
    );

    const TestContract = await ethers.getContractFactory("TestContract");
    testContract = await TestContract.deploy();
  });

  // ─────────────────────────────────────────────
  // Deployment
  // ─────────────────────────────────────────────

  describe("Deployment", function () {
    it("stores the correct owners", async function () {
      const owners = await wallet.getOwners();
      expect(owners).to.deep.equal([
        owner1.address,
        owner2.address,
        owner3.address,
      ]);
    });

    it("stores the correct confirmation threshold", async function () {
      expect(await wallet.numConfirmationsRequired()).to.equal(REQUIRED);
    });

    it("marks each address as an owner", async function () {
      expect(await wallet.isOwner(owner1.address)).to.be.true;
      expect(await wallet.isOwner(owner2.address)).to.be.true;
      expect(await wallet.isOwner(owner3.address)).to.be.true;
    });

    it("does not mark a non-owner as an owner", async function () {
      expect(await wallet.isOwner(nonOwner.address)).to.be.false;
    });

    it("reverts if no owners are provided", async function () {
      const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
      await expect(MultiSigWallet.deploy([], 1)).to.be.revertedWith(
        "owners required"
      );
    });

    it("reverts if threshold is zero", async function () {
      const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
      await expect(
        MultiSigWallet.deploy([owner1.address], 0)
      ).to.be.revertedWith("invalid number of required confirmations");
    });

    it("reverts if threshold exceeds number of owners", async function () {
      const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
      await expect(
        MultiSigWallet.deploy([owner1.address, owner2.address], 3)
      ).to.be.revertedWith("invalid number of required confirmations");
    });

    it("reverts if a duplicate owner is provided", async function () {
      const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
      await expect(
        MultiSigWallet.deploy([owner1.address, owner1.address], 1)
      ).to.be.revertedWith("owner not unique");
    });

    it("reverts if the zero address is provided as an owner", async function () {
      const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
      await expect(
        MultiSigWallet.deploy([ethers.ZeroAddress], 1)
      ).to.be.revertedWith("invalid owner");
    });
  });

  // ─────────────────────────────────────────────
  // Deposit
  // ─────────────────────────────────────────────

  describe("Deposit", function () {
    it("accepts ETH and emits Deposit event", async function () {
      const amount = ethers.parseEther("1.0");
      await expect(
        owner1.sendTransaction({ to: await wallet.getAddress(), value: amount })
      )
        .to.emit(wallet, "Deposit")
        .withArgs(owner1.address, amount, amount);
    });

    it("reflects the correct balance after deposit", async function () {
      const amount = ethers.parseEther("0.5");
      await owner1.sendTransaction({
        to: await wallet.getAddress(),
        value: amount,
      });
      expect(
        await ethers.provider.getBalance(await wallet.getAddress())
      ).to.equal(amount);
    });
  });

  // ─────────────────────────────────────────────
  // submitTransaction
  // ─────────────────────────────────────────────

  describe("submitTransaction", function () {
    it("allows an owner to submit a transaction", async function () {
      await expect(
        wallet
          .connect(owner1)
          .submitTransaction(owner2.address, 0, "0x")
      )
        .to.emit(wallet, "SubmitTransaction")
        .withArgs(owner1.address, 0, owner2.address, 0, "0x");
    });

    it("increments the transaction count after submission", async function () {
      await wallet.connect(owner1).submitTransaction(owner2.address, 0, "0x");
      expect(await wallet.getTransactionCount()).to.equal(1);
    });

    it("stores the transaction with correct initial state", async function () {
      await wallet.connect(owner1).submitTransaction(owner2.address, 100, "0x");
      const tx = await wallet.getTransaction(0);
      expect(tx.to).to.equal(owner2.address);
      expect(tx.value).to.equal(100);
      expect(tx.executed).to.be.false;
      expect(tx.numConfirmations).to.equal(0);
    });

    it("reverts when called by a non-owner", async function () {
      await expect(
        wallet.connect(nonOwner).submitTransaction(owner2.address, 0, "0x")
      ).to.be.revertedWith("not owner");
    });
  });

  // ─────────────────────────────────────────────
  // confirmTransaction
  // ─────────────────────────────────────────────

  describe("confirmTransaction", function () {
    beforeEach(async function () {
      await wallet.connect(owner1).submitTransaction(owner2.address, 0, "0x");
    });

    it("allows an owner to confirm a transaction", async function () {
      await expect(wallet.connect(owner1).confirmTransaction(0))
        .to.emit(wallet, "ConfirmTransaction")
        .withArgs(owner1.address, 0);
    });

    it("increments the confirmation count", async function () {
      await wallet.connect(owner1).confirmTransaction(0);
      const tx = await wallet.getTransaction(0);
      expect(tx.numConfirmations).to.equal(1);
    });

    it("records confirmation status for the owner", async function () {
      await wallet.connect(owner1).confirmTransaction(0);
      expect(await wallet.isConfirmed(0, owner1.address)).to.be.true;
    });

    it("reverts when called by a non-owner", async function () {
      await expect(
        wallet.connect(nonOwner).confirmTransaction(0)
      ).to.be.revertedWith("not owner");
    });

    it("reverts on double confirmation by the same owner", async function () {
      await wallet.connect(owner1).confirmTransaction(0);
      await expect(
        wallet.connect(owner1).confirmTransaction(0)
      ).to.be.revertedWith("tx already confirmed");
    });

    it("reverts for a non-existent transaction index", async function () {
      await expect(
        wallet.connect(owner1).confirmTransaction(99)
      ).to.be.revertedWith("tx does not exist");
    });
  });

  // ─────────────────────────────────────────────
  // executeTransaction
  // ─────────────────────────────────────────────

  describe("executeTransaction", function () {
    beforeEach(async function () {
      // Fund the wallet
      await owner1.sendTransaction({
        to: await wallet.getAddress(),
        value: ethers.parseEther("1.0"),
      });
      // Submit and confirm up to threshold
      await wallet.connect(owner1).submitTransaction(owner2.address, 0, "0x");
      await wallet.connect(owner1).confirmTransaction(0);
      await wallet.connect(owner2).confirmTransaction(0);
    });

    it("executes a transaction that has met the threshold", async function () {
      await expect(wallet.connect(owner1).executeTransaction(0))
        .to.emit(wallet, "ExecuteTransaction")
        .withArgs(owner1.address, 0);
    });

    it("marks the transaction as executed", async function () {
      await wallet.connect(owner1).executeTransaction(0);
      const tx = await wallet.getTransaction(0);
      expect(tx.executed).to.be.true;
    });

    it("reverts if the threshold has not been met", async function () {
      // Submit a second tx with only one confirmation
      await wallet.connect(owner1).submitTransaction(owner2.address, 0, "0x");
      await wallet.connect(owner1).confirmTransaction(1);
      await expect(
        wallet.connect(owner1).executeTransaction(1)
      ).to.be.revertedWith("cannot execute tx");
    });

    it("reverts on re-execution of an already executed transaction", async function () {
      await wallet.connect(owner1).executeTransaction(0);
      await expect(
        wallet.connect(owner1).executeTransaction(0)
      ).to.be.revertedWith("tx already executed");
    });

    it("reverts when called by a non-owner", async function () {
      await expect(
        wallet.connect(nonOwner).executeTransaction(0)
      ).to.be.revertedWith("not owner");
    });

    it("transfers ETH to the recipient on execution", async function () {
      const amount = ethers.parseEther("0.1");
      await wallet
        .connect(owner1)
        .submitTransaction(owner3.address, amount, "0x");
      await wallet.connect(owner1).confirmTransaction(1);
      await wallet.connect(owner2).confirmTransaction(1);

      const balanceBefore = await ethers.provider.getBalance(owner3.address);
      await wallet.connect(owner1).executeTransaction(1);
      const balanceAfter = await ethers.provider.getBalance(owner3.address);

      expect(balanceAfter - balanceBefore).to.equal(amount);
    });
  });

  // ─────────────────────────────────────────────
  // revokeConfirmation
  // ─────────────────────────────────────────────

  describe("revokeConfirmation", function () {
    beforeEach(async function () {
      await wallet.connect(owner1).submitTransaction(owner2.address, 0, "0x");
      await wallet.connect(owner1).confirmTransaction(0);
      await wallet.connect(owner2).confirmTransaction(0);
    });

    it("allows an owner to revoke their confirmation", async function () {
      await expect(wallet.connect(owner1).revokeConfirmation(0))
        .to.emit(wallet, "RevokeConfirmation")
        .withArgs(owner1.address, 0);
    });

    it("decrements the confirmation count after revocation", async function () {
      await wallet.connect(owner1).revokeConfirmation(0);
      const tx = await wallet.getTransaction(0);
      expect(tx.numConfirmations).to.equal(1);
    });

    it("clears the confirmation status after revocation", async function () {
      await wallet.connect(owner1).revokeConfirmation(0);
      expect(await wallet.isConfirmed(0, owner1.address)).to.be.false;
    });

    it("prevents execution after revocation drops below threshold", async function () {
      await wallet.connect(owner1).revokeConfirmation(0);
      await expect(
        wallet.connect(owner2).executeTransaction(0)
      ).to.be.revertedWith("cannot execute tx");
    });

    it("reverts if the owner has not confirmed the transaction", async function () {
      await expect(
        wallet.connect(owner3).revokeConfirmation(0)
      ).to.be.revertedWith("tx not confirmed");
    });

    it("reverts when called by a non-owner", async function () {
      await expect(
        wallet.connect(nonOwner).revokeConfirmation(0)
      ).to.be.revertedWith("not owner");
    });
  });

  // ─────────────────────────────────────────────
  // Integration: full flow with TestContract
  // ─────────────────────────────────────────────

  describe("Integration — TestContract callMe(123)", function () {
    it("executes a contract call via the multisig and updates state", async function () {
      const data = await testContract.getData();
      const testContractAddress = await testContract.getAddress();

      // Step 1: submit
      await wallet
        .connect(owner1)
        .submitTransaction(testContractAddress, 0, data);

      // Step 2: confirm (2-of-3 threshold)
      await wallet.connect(owner1).confirmTransaction(0);
      await wallet.connect(owner2).confirmTransaction(0);

      // Step 3: execute
      await wallet.connect(owner1).executeTransaction(0);

      // Step 4: verify state change
      expect(await testContract.i()).to.equal(123);
    });
  });
});
