// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";

contract RemittancePool {
    address public owner;
    IPool public aavePool;

    struct Remittance {
        address sender;
        address recipient;
        address token;
        uint256 amount;
        bool claimed;
    }

    mapping(bytes32 => Remittance) public remittances;

    event Deposited(bytes32 id, address sender, address recipient, uint256 amount);
    event Claimed(bytes32 id, address recipient);

    constructor(address _aavePoolAddress) {
        owner = msg.sender;
        aavePool = IPool(_aavePoolAddress);
    }

    function deposit(address _token, address _recipient, uint256 _amount) external {
        require(_amount > 0, "Amount must be > 0");

        bytes32 remittanceId = keccak256(abi.encodePacked(msg.sender, _recipient, block.timestamp));

        // Transfer token from sender to this contract
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        // Approve Aave Pool
        IERC20(_token).approve(address(aavePool), _amount);

        // Deposit to Aave
        aavePool.supply(_token, _amount, address(this), 0);

        // Store remittance info
        remittances[remittanceId] = Remittance({
            sender: msg.sender,
            recipient: _recipient,
            token: _token,
            amount: _amount,
            claimed: false
        });

        emit Deposited(remittanceId, msg.sender, _recipient, _amount);
    }

    function claim(bytes32 remittanceId) external {
        Remittance storage rem = remittances[remittanceId];
        require(rem.recipient == msg.sender, "Not the recipient");
        require(!rem.claimed, "Already claimed");

        rem.claimed = true;

        // Withdraw from Aave
        aavePool.withdraw(rem.token, rem.amount, rem.recipient);

        emit Claimed(remittanceId, rem.recipient);
    }
}
