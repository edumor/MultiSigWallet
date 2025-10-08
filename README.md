# 🔐 MultiSig Wallet - Ethereum Smart Contract

A secure multi-signature wallet implementation in Solidity that requires multiple confirmations for transaction execution. This project demonstrates advanced smart contract development with comprehensive security features and multi-party fund management.

## 📋 Project Overview

This repository contains a complete MultiSig Wallet implementation deployed and verified on Ethereum Sepolia Testnet. The wallet requires multiple owner signatures to execute transactions, providing enhanced security for fund management and contract interactions.

**Author:** Eduardo Moreno  
**License:** MIT  
**Solidity Version:** ^0.8.26  
**Network:** Ethereum Sepolia Testnet  

## 🚀 Deployed Contracts

### MultiSigWallet (Main Contract)
- **Remix Deploy Address:** `0x254190748c4fC38585B3Bb1439A30D3eE9aDAD30`
- **Etherscan Verified:** https://sepolia.etherscan.io/address/0x254190748c4fC38585B3Bb1439A30D3eE9aDAD30#code
- **Status:** ✅ Successfully verified and functional

### TestContract (Testing Contract)
- **Remix Deploy Address:** `0x7047052C241e02bc36f4c4c3E1F137D7fa3ba6D7`
- **Etherscan Verified:** https://sepolia.etherscan.io/address/0x7047052C241e02bc36f4c4c3E1F137D7fa3ba6D7#code
- **Status:** ✅ Successfully verified and functional

## 📖 Code Reference

The MultiSigWallet.sol contract implementation is based on the educational example published at:
**https://www.cyfrin.io/glossary/multisig-wallet-solidity-code-example**

This implementation has been enhanced with comprehensive NatSpec documentation, additional security features, and professional-grade code structure.

## 🏗️ Contract Configuration

### Wallet Owners
- **Owner 1:** `0x4829f4f3aadee47Cb1cc795B2eC78A166042e918`
- **Owner 2:** `0xbEdeE081acb0c97341DBB6005050307667957F60`
- **Confirmation Threshold:** 2 out of 2 signatures required

### Security Model
- **Type:** 2-of-2 MultiSig (Maximum Security)
- **Access Control:** Owner-only functions
- **Protection:** Duplicate confirmation prevention
- **Validation:** Comprehensive input validation

## 🛠️ Core Functions

### Read Functions (View)

| Function | Description | Parameters |
|----------|-------------|------------|
| `getOwners()` | Returns array of wallet owners | None |
| `getTransactionCount()` | Returns total number of transactions | None |
| `getTransaction(uint256)` | Returns transaction details | `_txIndex` |
| `numConfirmationsRequired()` | Returns required confirmation threshold | None |
| `isOwner(address)` | Checks if address is an owner | `address` |
| `isConfirmed(uint256, address)` | Checks confirmation status | `_txIndex, _owner` |

### Write Functions (Owner Only)

| Function | Description | Parameters |
|----------|-------------|------------|
| `submitTransaction()` | Submit new transaction for approval | `_to, _value, _data` |
| `confirmTransaction()` | Confirm a pending transaction | `_txIndex` |
| `executeTransaction()` | Execute confirmed transaction | `_txIndex` |
| `revokeConfirmation()` | Revoke previous confirmation | `_txIndex` |

## 🧪 Testing on Etherscan

### Step 1: Verify Contract State
Visit the MultiSigWallet on Etherscan and use the **Read Contract** tab:

1. **Check Owners:**
   ```
   getOwners() → Should return both owner addresses
   ```

2. **Check Threshold:**
   ```
   numConfirmationsRequired() → Should return 2
   ```

3. **Check Transaction Count:**
   ```
   getTransactionCount() → Should return current number of transactions
   ```

### Step 2: Prepare Test Transaction
Visit the TestContract on Etherscan:

1. **Get Transaction Data:**
   ```
   getData() → Returns: 0x44e1c61500000000000000000000000000000000000000000000000000000000000000007b
   ```

### Step 3: Execute MultiSig Transaction
Use the **Write Contract** tab on MultiSigWallet:

1. **Connect MetaMask** (Owner 1 account)

2. **Submit Transaction:**
   ```
   submitTransaction(
     _to: 0x7047052C241e02bc36f4c4c3E1F137D7fa3ba6D7
     _value: 0
     _data: 0x44e1c61500000000000000000000000000000000000000000000000000000000000000007b
   )
   ```

3. **Switch to Owner 2** in MetaMask

4. **Confirm Transaction:**
   ```
   confirmTransaction(0)  // Index of the transaction
   ```

5. **Execute Transaction:**
   ```
   executeTransaction(0)  // Any owner can execute
   ```

6. **Verify Result:**
   Go back to TestContract and check:
   ```
   i() → Should show 123 (incremented value)
   ```

## 📊 Contract Features

### Security Features
- ✅ Multi-signature requirement (2-of-2)
- ✅ Owner-only access controls
- ✅ Duplicate confirmation prevention
- ✅ Transaction existence validation
- ✅ Execution state checking
- ✅ Confirmation revocation capability

### Events Emitted
- `Deposit` - When ETH is received
- `SubmitTransaction` - When new transaction is submitted
- `ConfirmTransaction` - When transaction is confirmed
- `RevokeConfirmation` - When confirmation is revoked
- `ExecuteTransaction` - When transaction is executed

### Gas Optimization
- Efficient storage patterns
- Minimal external calls
- Optimized loops and conditions

## 🔧 Development Setup

### Prerequisites
- [Remix IDE](https://remix.ethereum.org)
- MetaMask wallet with Sepolia ETH
- Access to Sepolia testnet

### Local Development
1. Clone this repository
2. Open contracts in Remix IDE
3. Compile with Solidity 0.8.26
4. Deploy to Sepolia testnet
5. Verify on Etherscan

## 📚 Educational Resources

This project demonstrates:
- **Smart Contract Security:** Multi-signature patterns
- **Access Control:** Owner-based permissions
- **State Management:** Transaction lifecycle
- **Event Logging:** Comprehensive audit trail
- **Code Documentation:** Professional NatSpec standards

## 🛡️ Security Considerations

⚠️ **Important Security Notes:**
- Always verify transaction details before confirmation
- Ensure all owners are trusted parties
- Test thoroughly on testnet before mainnet deployment
- Consider upgradeability patterns for production use
- Implement additional security measures for large funds

## 📞 Support & Documentation

- **Etherscan Contract:** Verified source code and ABI available
- **Network:** Sepolia Testnet (safe for testing)
- **Gas Estimates:** ~100k gas per transaction cycle
- **Block Confirmations:** Standard Ethereum confirmations

## 🎯 Use Cases

1. **Shared Fund Management:** Multiple parties controlling funds
2. **DAO Treasury:** Decentralized organization fund management
3. **Business Partnerships:** Joint financial decisions
4. **Family Accounts:** Shared cryptocurrency management
5. **Smart Contract Governance:** Multi-party contract administration

## 🎓 Instructions for Teachers/Evaluators

### Option 1: Quick Evaluation (Review Existing Deployment)

**For code review and functionality verification without additional setup:**

1. **Review Deployed Contracts:**
   - MultiSigWallet: https://sepolia.etherscan.io/address/0x254190748c4fC38585B3Bb1439A30D3eE9aDAD30#code
   - TestContract: https://sepolia.etherscan.io/address/0x7047052C241e02bc36f4c4c3E1F137D7fa3ba6D7#code

2. **Verify Source Code:**
   - Check NatSpec documentation
   - Review security implementations
   - Analyze function structure

3. **Test Read Functions:**
   Use the "Read Contract" tab on Etherscan to verify:
   ```
   getOwners() → Returns the configured owner addresses
   numConfirmationsRequired() → Returns 2
   getTransactionCount() → Returns current transaction count
   ```

### Option 2: Full Testing with Custom Deployment

**For complete hands-on testing with your own wallet addresses:**

#### Step 1: Setup Test Environment
1. **Install MetaMask** browser extension
2. **Switch to Sepolia Testnet** in MetaMask
3. **Create 2 new test accounts** in MetaMask
4. **Get Sepolia ETH** from faucet: https://sepoliafaucet.com/
5. **Copy both wallet addresses** for deployment

#### Step 2: Deploy Contracts in Remix
1. **Open Remix IDE:** https://remix.ethereum.org
2. **Create new files:**
   - `MultiSigWallet.sol` - Copy code from this repository
   - `TestContract.sol` - Copy code from this repository

3. **Compile contracts:**
   - Select Solidity compiler version: 0.8.26
   - Enable "Auto compile"

4. **Deploy TestContract:**
   - Go to "Deploy & Run Transactions" tab
   - Environment: "Injected Provider - MetaMask"
   - Select "TestContract" and click "Deploy"
   - **Save the deployed address**

5. **Deploy MultiSigWallet:**
   - Select "MultiSigWallet"
   - Constructor parameters: `["YOUR_ADDRESS_1","YOUR_ADDRESS_2"], 2`
   - Click "Deploy"
   - **Save the deployed address**

#### Step 3: Execute Test Transaction
1. **In TestContract, call `getData()`:**
   ```
   Result: 0x44e1c61500000000000000000000000000000000000000000000000000000000000000007b
   ```

2. **In MultiSigWallet, with Account 1:**
   ```
   submitTransaction(
     _to: [TestContract_Address]
     _value: 0
     _data: [Result_from_getData]
   )
   ```

3. **Switch to Account 2 in MetaMask:**
   ```
   confirmTransaction(0)
   ```

4. **Execute the transaction:**
   ```
   executeTransaction(0)
   ```

5. **Verify result in TestContract:**
   ```
   i() → Should return 123
   ```

### Evaluation Checklist

**Code Quality:**
- [ ] NatSpec documentation present and comprehensive
- [ ] Proper access control implementation
- [ ] Input validation and error handling
- [ ] Event emission for transparency
- [ ] Gas-efficient code patterns

**Security Features:**
- [ ] Owner-only restrictions properly implemented
- [ ] Duplicate confirmation prevention
- [ ] Transaction existence validation
- [ ] Execution state checking
- [ ] Confirmation revocation capability

**Functionality Testing:**
- [ ] Contract deployment successful
- [ ] Owner configuration correct
- [ ] Transaction submission works
- [ ] Multi-signature confirmation process
- [ ] Transaction execution successful
- [ ] State changes reflected correctly

### Sample Test Scenarios

**Test Case 1: Basic Transaction Flow**
1. Submit transaction with Owner 1
2. Confirm with Owner 2
3. Execute transaction
4. Verify state change

**Test Case 2: Insufficient Confirmations**
1. Submit transaction with Owner 1
2. Attempt execution without sufficient confirmations
3. Verify transaction fails appropriately

**Test Case 3: Confirmation Revocation**
1. Submit and confirm transaction
2. Revoke confirmation
3. Verify confirmation count decreases
4. Attempt execution should fail

**Test Case 4: Access Control**
1. Attempt transaction submission from non-owner address
2. Verify proper rejection with appropriate error message

## 📈 Future Enhancements

- [ ] Dynamic owner management
- [ ] Flexible threshold adjustment
- [ ] Time-locked transactions
- [ ] Emergency recovery mechanisms
- [ ] Integration with other DeFi protocols

---

**Developed by Eduardo Moreno**  
**October 2025**  
**Ethereum Sepolia Testnet**

For questions or contributions, please refer to the verified contract code on Etherscan.