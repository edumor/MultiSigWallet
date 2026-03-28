export const CONTRACT_ADDRESS = "0x254190748c4fC38585B3Bb1439A30D3eE9aDAD30";
export const SEPOLIA_CHAIN_ID = 11155111;
export const ETHERSCAN_BASE = "https://sepolia.etherscan.io";
export const PUBLIC_RPCS = [
  "https://rpc.sepolia.org",
  "https://sepolia.drpc.org",
  "https://ethereum-sepolia.publicnode.com",
  "https://rpc2.sepolia.org",
];

export const ABI = [
  "event Deposit(address indexed sender, uint256 amount, uint256 balance)",
  "event SubmitTransaction(address indexed owner, uint256 indexed txIndex, address indexed to, uint256 value, bytes data)",
  "event ConfirmTransaction(address indexed owner, uint256 indexed txIndex)",
  "event RevokeConfirmation(address indexed owner, uint256 indexed txIndex)",
  "event ExecuteTransaction(address indexed owner, uint256 indexed txIndex)",
  "function getOwners() view returns (address[])",
  "function getTransactionCount() view returns (uint256)",
  "function getTransaction(uint256 _txIndex) view returns (address to, uint256 value, bytes data, bool executed, uint256 numConfirmations)",
  "function numConfirmationsRequired() view returns (uint256)",
  "function isOwner(address) view returns (bool)",
  "function isConfirmed(uint256, address) view returns (bool)",
  "function submitTransaction(address _to, uint256 _value, bytes _data)",
  "function confirmTransaction(uint256 _txIndex)",
  "function executeTransaction(uint256 _txIndex)",
  "function revokeConfirmation(uint256 _txIndex)",
];
