// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title MultiSigWallet
 * @author Eduardo Moreno
 * @notice A multi-signature wallet that requires multiple confirmations for transaction execution
 * @dev This contract implements a secure multi-signature wallet with configurable threshold
 */
contract MultiSigWallet {
    /**
     * @notice Emitted when ETH is deposited into the wallet
     * @param sender The address that sent the deposit
     * @param amount The amount of ETH deposited
     * @param balance The new balance of the wallet
     */
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    
    /**
     * @notice Emitted when a new transaction is submitted
     * @param owner The owner who submitted the transaction
     * @param txIndex The index of the submitted transaction
     * @param to The destination address of the transaction
     * @param value The ETH value to be sent
     * @param data The transaction data payload
     */
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );
    
    /**
     * @notice Emitted when an owner confirms a transaction
     * @param owner The owner who confirmed the transaction
     * @param txIndex The index of the confirmed transaction
     */
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    
    /**
     * @notice Emitted when an owner revokes their confirmation
     * @param owner The owner who revoked the confirmation
     * @param txIndex The index of the transaction
     */
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    
    /**
     * @notice Emitted when a transaction is executed successfully
     * @param owner The owner who executed the transaction
     * @param txIndex The index of the executed transaction
     */
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    /// @notice Array of wallet owner addresses
    address[] public owners;
    
    /// @notice Mapping to check if an address is an owner
    mapping(address => bool) public isOwner;
    
    /// @notice Number of confirmations required to execute a transaction
    uint256 public numConfirmationsRequired;

    /**
     * @notice Structure representing a pending transaction
     * @param to Destination address for the transaction
     * @param value Amount of ETH to send (in wei)
     * @param data Transaction data payload
     * @param executed Whether the transaction has been executed
     * @param numConfirmations Current number of confirmations received
     */
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
    }

    /// @notice Mapping from transaction index to owner to confirmation status
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    /// @notice Array of all submitted transactions
    Transaction[] public transactions;

    /**
     * @notice Restricts function access to wallet owners only
     * @dev Reverts if caller is not an owner
     */
    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    /**
     * @notice Ensures the transaction exists
     * @dev Reverts if transaction index is invalid
     * @param _txIndex Index of the transaction to check
     */
    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    /**
     * @notice Ensures the transaction has not been executed
     * @dev Reverts if transaction is already executed
     * @param _txIndex Index of the transaction to check
     */
    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    /**
     * @notice Ensures the caller has not confirmed the transaction
     * @dev Reverts if caller already confirmed this transaction
     * @param _txIndex Index of the transaction to check
     */
    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    /**
     * @notice Initializes the multi-signature wallet
     * @dev Sets up owners and confirmation threshold
     * @param _owners Array of owner addresses (must be unique and non-zero)
     * @param _numConfirmationsRequired Number of confirmations required for execution
     */
    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0
                && _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    /**
     * @notice Receives ETH deposits and emits Deposit event
     * @dev Automatically called when ETH is sent to the contract
     */
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    /**
     * @notice Submits a new transaction for multi-signature approval
     * @dev Only owners can submit transactions
     * @param _to Destination address for the transaction
     * @param _value Amount of ETH to send (in wei)
     * @param _data Transaction data payload
     */
    function submitTransaction(address _to, uint256 _value, bytes memory _data)
        public
        onlyOwner
    {
        uint256 txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    /**
     * @notice Confirms a pending transaction
     * @dev Only owners who haven't confirmed yet can confirm
     * @param _txIndex Index of the transaction to confirm
     */
    function confirmTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    /**
     * @notice Executes a transaction if it has enough confirmations
     * @dev Only owners can execute transactions that meet the threshold
     * @param _txIndex Index of the transaction to execute
     */
    function executeTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        transaction.executed = true;

        (bool success,) =
            transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    /**
     * @notice Revokes a previous confirmation for a transaction
     * @dev Only owners who have previously confirmed can revoke
     * @param _txIndex Index of the transaction to revoke confirmation
     */
    function revokeConfirmation(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    /**
     * @notice Returns the list of wallet owners
     * @return Array of owner addresses
     */
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /**
     * @notice Returns the total number of submitted transactions
     * @return Total count of transactions
     */
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    /**
     * @notice Returns transaction details by index
     * @param _txIndex Index of the transaction to retrieve
     * @return to Destination address
     * @return value ETH value to send
     * @return data Transaction data payload
     * @return executed Whether transaction is executed
     * @return numConfirmations Number of confirmations received
     */
    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }
}