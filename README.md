# MultiSig Wallet — Ethereum Smart Contract

A production-ready multi-signature wallet implemented in Solidity. Requires multiple owner confirmations before executing any transaction, enforcing shared governance over on-chain funds. Deployed and verified on Ethereum Sepolia Testnet.

**Author:** Eduardo Moreno
**License:** MIT
**Solidity:** ^0.8.26
**Network:** Ethereum Sepolia Testnet

---

## Overview

MultiSig wallets eliminate single points of failure in on-chain fund management. This implementation covers the full transaction lifecycle — submission, confirmation, revocation, and execution — with strict access control and a complete audit trail via events.

The project includes two complementary approaches:

| | Custom Implementation | Gnosis Safe |
|---|---|---|
| **Purpose** | Demonstrates smart contract development skills | Demonstrates familiarity with production tooling |
| **Security** | Self-reviewed, testnet only | Battle-tested, production-grade |
| **Upgradeability** | Static | Modular |
| **Gas** | Optimized for simplicity | Optimized for production |

---

## Deployed Contracts (Sepolia Testnet)

### MultiSigWallet (Custom)
- **Address:** `0x254190748c4fC38585B3Bb1439A30D3eE9aDAD30`
- **Etherscan:** https://sepolia.etherscan.io/address/0x254190748c4fC38585B3Bb1439A30D3eE9aDAD30#code
- **Configuration:** 2-of-2 multisig

### Gnosis Safe (Industry Standard)
- **Address:** `0x138B6DD6266ee0E1fFAF118B26cD7a68554C01bA`
- **Etherscan:** https://sepolia.etherscan.io/address/0x138B6DD6266ee0E1fFAF118B26cD7a68554C01bA
- **Safe Interface:** https://app.safe.global/sep:0x138B6DD6266ee0E1fFAF118B26cD7a68554C01bA

### TestContract (Integration target)
- **Address:** `0x7047052C241e02bc36f4c4c3E1F137D7fa3ba6D7`
- **Etherscan:** https://sepolia.etherscan.io/address/0x7047052C241e02bc36f4c4c3E1F137D7fa3ba6D7#code

---

## Architecture

### Transaction Lifecycle

```
submitTransaction()  →  confirmTransaction()  →  executeTransaction()
                              ↕
                    revokeConfirmation()
```

### Contract Interface

| Function | Type | Description |
|---|---|---|
| `submitTransaction(to, value, data)` | write | Proposes a new transaction |
| `confirmTransaction(txIndex)` | write | Adds owner confirmation |
| `executeTransaction(txIndex)` | write | Executes when threshold is met |
| `revokeConfirmation(txIndex)` | write | Withdraws a previous confirmation |
| `getOwners()` | view | Returns all owner addresses |
| `getTransaction(txIndex)` | view | Returns full transaction details |
| `getTransactionCount()` | view | Returns total transaction count |
| `isConfirmed(txIndex, address)` | view | Checks confirmation status |

### Security Model

- **Access control:** all state-changing functions restricted to owners via `onlyOwner` modifier
- **Reentrancy protection:** follows Checks-Effects-Interactions pattern — `executed = true` is set before the external call
- **Duplicate prevention:** each owner can confirm a transaction only once (`notConfirmed` modifier)
- **Validation:** transaction existence and execution state verified on every write
- **Audit trail:** five indexed events cover every state change

### Known Limitations

This implementation is intentionally minimal for clarity and educational value:

- Owners are fixed at deployment; there is no mechanism to add or remove owners post-deploy
- Transactions cannot be cancelled, only revoked (confirmation removed). A transaction with zero confirmations remains in the array indefinitely
- No timelock between confirmation threshold and execution
- Not audited for production use with real funds

---

## Local Development

### Prerequisites

- Node.js >= 18
- npm or yarn

### Setup

```bash
git clone https://github.com/edumor/MultiSigWallet.git
cd MultiSigWallet
npm install
```

### Compile

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to Sepolia

Create a `.env` file:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Then run:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Verify on Etherscan

```bash
npx hardhat verify --network sepolia DEPLOYED_ADDRESS '["OWNER_1","OWNER_2"]' 2
```

---

## Test Coverage

The test suite covers the following scenarios:

- Deployment validation (owners, threshold, rejections for invalid inputs)
- ETH deposit via `receive()`
- Transaction submission and event emission
- Single and multi-owner confirmation flows
- Threshold enforcement before execution
- Successful transaction execution with state change verification
- Confirmation revocation and subsequent execution failure
- Access control: all write functions reject non-owners
- Edge cases: double-confirmation, executing already-executed transactions

Run with:

```bash
npx hardhat test
```

---

## Events

| Event | Indexed Fields | Description |
|---|---|---|
| `Deposit` | `sender` | ETH received |
| `SubmitTransaction` | `owner`, `txIndex`, `to` | Transaction proposed |
| `ConfirmTransaction` | `owner`, `txIndex` | Confirmation added |
| `RevokeConfirmation` | `owner`, `txIndex` | Confirmation removed |
| `ExecuteTransaction` | `owner`, `txIndex` | Transaction executed |

---

## Reference

The contract architecture is based on the multisig pattern published at [Cyfrin](https://www.cyfrin.io/glossary/multisig-wallet-solidity-code-example), extended with full NatSpec documentation, a Hardhat test suite, and deployment tooling.

---

## Future Improvements

- Dynamic owner management (add/remove post-deployment)
- Configurable threshold adjustment
- Time-locked execution
- Emergency pause / recovery mechanism
- Integration with ERC-20 token transfers

---

**Eduardo Moreno** — Ethereum Sepolia Testnet, 2025
