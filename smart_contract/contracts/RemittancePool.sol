// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolDataProvider.sol";

contract RemittancePool {
    address public owner;
    IPool public aavePool;
    IPoolDataProvider public dataProvider;

    struct Remittance {
        address sender;
        address recipient;
        address token;
        uint256 principalAmount;
        uint256 timestamp;
        bool claimed;
        address aTokenAddress; // Track which aToken we received
    }

    mapping(bytes32 => Remittance) public remittances;
    mapping(bytes32 => bool) public remittanceExists;

    event Deposited(
        bytes32 indexed id, 
        address indexed sender, 
        address indexed recipient, 
        uint256 amount,
        uint256 timestamp
    );
    
    event Claimed(
        bytes32 indexed id, 
        address indexed recipient, 
        uint256 principalAmount,
        uint256 yieldAmount,
        uint256 totalAmount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _aavePoolAddress, address _dataProviderAddress) {
        require(_aavePoolAddress != address(0), "Invalid Aave pool");
        require(_dataProviderAddress != address(0), "Invalid data provider");
        owner = msg.sender;
        aavePool = IPool(_aavePoolAddress);
        dataProvider = IPoolDataProvider(_dataProviderAddress);
    }

    function deposit(address _token, address _recipient, uint256 _amount) external returns (bytes32) {
        require(_token != address(0), "Invalid token");
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be > 0");

        // Generate unique remittance ID
        bytes32 remittanceId = keccak256(
            abi.encodePacked(msg.sender, _recipient, _amount, block.timestamp, block.number)
        );
        
        require(!remittanceExists[remittanceId], "Remittance ID collision");

        // Get aToken address before deposit
        (address aTokenAddress, , ) = dataProvider.getReserveTokensAddresses(_token);
        require(aTokenAddress != address(0), "aToken not found");

        // Transfer token from sender to contract
        bool transferred = IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        require(transferred, "Transfer failed");

        // Approve Aave pool
        bool approved = IERC20(_token).approve(address(aavePool), _amount);
        require(approved, "Approval failed");

        // Supply to Aave
        try aavePool.supply(_token, _amount, address(this), 0) {
            // Store remittance data
            remittances[remittanceId] = Remittance({
                sender: msg.sender,
                recipient: _recipient,
                token: _token,
                principalAmount: _amount,
                timestamp: block.timestamp,
                claimed: false,
                aTokenAddress: aTokenAddress
            });

            remittanceExists[remittanceId] = true;

            emit Deposited(remittanceId, msg.sender, _recipient, _amount, block.timestamp);
            return remittanceId;
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("Aave supply failed: ", reason)));
        } catch {
            revert("Aave supply failed");
        }
    }

    function claim(bytes32 remittanceId) external {
        require(remittanceExists[remittanceId], "Remittance not found");
        
        Remittance storage rem = remittances[remittanceId];
        require(rem.recipient == msg.sender, "Not the recipient");
        require(!rem.claimed, "Already claimed");

        rem.claimed = true;

        // Get current aToken balance for this remittance
        // Since we're the only holder, we can withdraw all our aTokens
        uint256 aTokenBalance = IERC20(rem.aTokenAddress).balanceOf(address(this));
        require(aTokenBalance > 0, "No aTokens to withdraw");

        // Withdraw all aTokens (principal + yield)
        try aavePool.withdraw(rem.token, aTokenBalance, rem.recipient) returns (uint256 actualAmount) {
            uint256 yieldAmount = actualAmount > rem.principalAmount ? 
                actualAmount - rem.principalAmount : 0;

            emit Claimed(remittanceId, rem.recipient, rem.principalAmount, yieldAmount, actualAmount);
        } catch Error(string memory reason) {
            rem.claimed = false; // Reset claimed status on failure
            revert(string(abi.encodePacked("Aave withdraw failed: ", reason)));
        } catch {
            rem.claimed = false; // Reset claimed status on failure
            revert("Aave withdraw failed");
        }
    }

    /// @notice Get current yield for a remittance
    function getCurrentYield(bytes32 remittanceId) external view returns (uint256 currentTotal, uint256 yield) {
        require(remittanceExists[remittanceId], "Remittance not found");
        
        Remittance storage rem = remittances[remittanceId];
        require(!rem.claimed, "Already claimed");

        uint256 aTokenBalance = IERC20(rem.aTokenAddress).balanceOf(address(this));
        currentTotal = aTokenBalance;
        yield = aTokenBalance > rem.principalAmount ? aTokenBalance - rem.principalAmount : 0;
    }

    /// @notice Get remittance details
    function getRemittance(bytes32 remittanceId) external view returns (
        address sender,
        address recipient,
        address token,
        uint256 principalAmount,
        uint256 timestamp,
        bool claimed,
        uint256 currentTotal,
        uint256 currentYield
    ) {
        require(remittanceExists[remittanceId], "Remittance not found");
        
        Remittance storage rem = remittances[remittanceId];
        
        if (!rem.claimed) {
            uint256 aTokenBalance = IERC20(rem.aTokenAddress).balanceOf(address(this));
            currentTotal = aTokenBalance;
            currentYield = aTokenBalance > rem.principalAmount ? aTokenBalance - rem.principalAmount : 0;
        } else {
            currentTotal = 0;
            currentYield = 0;
        }

        return (
            rem.sender,
            rem.recipient,
            rem.token,
            rem.principalAmount,
            rem.timestamp,
            rem.claimed,
            currentTotal,
            currentYield
        );
    }

    /// @notice Emergency withdraw function (only owner)
    function emergencyWithdraw(address _token, address _to) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        if (balance > 0) {
            IERC20(_token).transfer(_to, balance);
        }
    }
}