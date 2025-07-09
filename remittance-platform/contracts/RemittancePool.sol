// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

contract RemittancePool {
    IPool public aavePool;
    IERC20 public usdc;

    struct Remittance {
        uint256 amount;
        address sender;
        uint256 depositedAt;
    }

    mapping(address => Remittance) public remittances;

    constructor(address _usdc, address _aavePool) {
        usdc = IERC20(_usdc);
        aavePool = IPool(_aavePool);
    }

    function depositRemittance(address recipient, uint256 amount) external {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        usdc.approve(address(aavePool), amount);
        aavePool.supply(address(usdc), amount, address(this), 0);

        remittances[recipient] = Remittance({
            amount: amount,
            sender: msg.sender,
            depositedAt: block.timestamp
        });
    }

    function withdrawRemittance() external {
        Remittance memory r = remittances[msg.sender];
        require(r.amount > 0, "No remittance found");

        // Withdraw full balance from Aave
        aavePool.withdraw(address(usdc), type(uint256).max, msg.sender);

        delete remittances[msg.sender];
    }
}
