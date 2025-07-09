// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RemittancePool {
    address public owner;

    struct Remittance {
        address sender;
        address recipient;
        uint256 amount;
        bool claimed;
    }

    mapping(bytes32 => Remittance) public remittances;

    event Deposited(bytes32 id, address sender, address recipient, uint256 amount);
    event Claimed(bytes32 id, address recipient);

    constructor() {
        owner = msg.sender;
    }

    function deposit(address _token, address _recipient, uint256 _amount) external {
        require(_amount > 0, "Amount must be > 0");

        bytes32 remittanceId = keccak256(abi.encodePacked(msg.sender, _recipient, block.timestamp));

        IERC20(_token).transferFrom(msg.sender, address(this), _amount);

        remittances[remittanceId] = Remittance({
            sender: msg.sender,
            recipient: _recipient,
            amount: _amount,
            claimed: false
        });

        emit Deposited(remittanceId, msg.sender, _recipient, _amount);
    }

    function claim(bytes32 remittanceId, address _token) external {
        Remittance storage rem = remittances[remittanceId];

        require(rem.recipient == msg.sender, "Not the intended recipient");
        require(!rem.claimed, "Already claimed");

        rem.claimed = true;
        IERC20(_token).transfer(msg.sender, rem.amount);

        emit Claimed(remittanceId, msg.sender);
    }
}
