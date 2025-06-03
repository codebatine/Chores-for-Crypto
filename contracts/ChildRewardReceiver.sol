// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts-ccip/src/v0.8/CCIPReceiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ChildRewardReceiver is CCIPReceiver {
    address public rewardToken;

    event RewardReceived(address indexed child, uint256 amount);

    constructor(address _router, address _rewardToken)
        CCIPReceiver(_router)
    {
        rewardToken = _rewardToken;
    }

    function _ccipReceive(bytes memory message) internal override {
        (address child, uint256 amount) = abi.decode(message, (address, uint256));
        require(IERC20(rewardToken).transfer(child, amount), "Transfer failed");
        emit RewardReceived(child, amount);
    }

    function setRewardToken(address token) external {
        rewardToken = token;
    }
}
