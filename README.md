# Solidity Function Declarations Guide

## Introduction

Solidity is the primary programming language for Ethereum smart contracts. Understanding function declarations and their modifiers is crucial for writing secure and efficient smart contracts. This guide provides a comprehensive overview of function visibility, state mutability, and other important function modifiers in Solidity.

## Function Visibility Specifiers

Solidity provides four visibility specifiers that control how functions can be accessed:

| Specifier | Description | Gas Cost | Access Level |
|-----------|-------------|----------|--------------|
| `public` | Accessible from within the contract, derived contracts, and externally | Higher | Universal access |
| `private` | Only accessible from within the defining contract | Lower | Contract only |
| `internal` | Accessible only from within the defining contract and derived contracts | Medium | Contract and inheritance |
| `external` | Only accessible from outside the contract | Lower for large data | External only |

### Examples

```solidity
// Public function - can be called from anywhere
function deposit() public payable {
    balances[msg.sender] += msg.value;
}

// Private function - only accessible within this contract
function _calculateFee(uint256 amount) private returns (uint256) {
    return amount * feePercentage / 100;
}

// Internal function - accessible in this contract and derivatives
function _transfer(address from, address to, uint256 amount) internal {
    balances[from] -= amount;
    balances[to] += amount;
}

// External function - only callable from outside
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;
    payable(msg.sender).transfer(amount);
}
```

## State Mutability Modifiers

State mutability modifiers indicate how a function interacts with the blockchain state:

| Modifier | Description | Gas Cost | Behavior |
|----------|-------------|----------|----------|
| No modifier | Can modify state (default) | Highest | Can change state, send ETH, emit events |
| `view` | Cannot modify state | Low (free for calls) | Can read state, cannot modify |
| `pure` | Cannot read or modify state | Lowest (free for calls) | Can't access state variables |
| `payable` | Can receive Ether | Varies | Can access and modify `msg.value` |

### Examples

```solidity
// Default function - can modify state
function updateUserData(string memory _newData) public {
    userData[msg.sender] = _newData;
}

// View function - reads but doesn't modify state
function getBalance(address user) public view returns (uint256) {
    return balances[user];
}

// Pure function - doesn't interact with state
function calculateTax(uint256 amount, uint8 taxRate) public pure returns (uint256) {
    return amount * taxRate / 100;
}

// Payable function - can receive Ether
function depositFunds() public payable {
    require(msg.value > 0, "Must send ETH");
    balances[msg.sender] += msg.value;
}
```

## Function Return Values

Solidity functions can return multiple values and need explicit return type declarations:

```solidity
// Single return value
function getBalance() public view returns (uint256) {
    return address(this).balance;
}

// Multiple return values
function getUserStats(address user) public view returns (uint256 balance, uint256 lastActive, bool isPremium) {
    UserStats memory stats = userStats[user];
    return (stats.balance, stats.lastActive, stats.isPremium);
}

// Named return values
function getAccountDetails() public view returns (address owner, uint256 balance, bool active) {
    owner = contractOwner;
    balance = address(this).balance;
    active = isActive;
    // Return statement optional with named return values
}
```

## Function Modifiers

Custom modifiers allow for adding pre-conditions to functions:

```solidity
// Defining a modifier
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _; // This represents the function code
}

modifier costs(uint256 price) {
    require(msg.value >= price, "Not enough ETH sent");
    _;
}

// Using modifiers
function withdrawFunds() public onlyOwner {
    payable(owner).transfer(address(this).balance);
}

function purchaseItem(uint256 itemId) public payable costs(itemPrices[itemId]) {
    // Function implementation
}
```

## Special Function Types

Solidity includes special function types for specific purposes:

### Constructor

```solidity
// Constructor - runs once during deployment
constructor(address _owner) {
    owner = _owner;
    creationTime = block.timestamp;
}
```

### Fallback and Receive Functions

```solidity
// Fallback function - called when no other function matches
fallback() external payable {
    emit FallbackCalled(msg.sender, msg.value);
}

// Receive function - called when Ether is sent with no data
receive() external payable {
    balances[msg.sender] += msg.value;
}
```

## Legacy Function Attributes

Some older Solidity code may use these now-deprecated attributes:

| Legacy Attribute | Modern Equivalent | Note |
|------------------|-------------------|------|
| `constant` | `view` | Use `view` instead |
| `tx.origin` | `msg.sender` | Avoid using `tx.origin` for security reasons |

## Gas Optimization Tips

1. Use `external` instead of `public` for functions called only from outside
2. Mark functions as `view` or `pure` when possible to reduce gas costs
3. Use `calldata` instead of `memory` for external function parameters
4. Batch operations to reduce the number of transactions

## Example Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenVault {
    mapping(address => uint256) private balances;
    address public owner;
    uint256 private feePercentage;
    bool public active;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    constructor(uint256 _feePercentage) {
        owner = msg.sender;
        feePercentage = _feePercentage;
        active = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier whenActive() {
        require(active, "Contract is paused");
        _;
    }

    function deposit() external payable whenActive {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external whenActive {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        uint256 fee = _calculateFee(amount);
        uint256 amountAfterFee = amount - fee;
        
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amountAfterFee);
        emit Withdrawal(msg.sender, amountAfterFee);
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function _calculateFee(uint256 amount) private view returns (uint256) {
        return amount * feePercentage / 100;
    }

    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 10, "Fee too high");
        feePercentage = _feePercentage;
    }

    function toggleActive() external onlyOwner {
        active = !active;
    }
}
```

## Best Practices

1. Always specify visibility for functions and state variables
2. Use the most restrictive visibility possible
3. Document functions with NatSpec comments
4. Apply appropriate modifiers to control access
5. Be mindful of state modifications to save gas
6. Use events to log important state changes

## Conclusion

Function declarations in Solidity are powerful tools that define not just what code runs, but how it interacts with the blockchain, who can access it, and what resources it consumes. By understanding these concepts, you can write more secure, efficient, and maintainable smart contracts.
