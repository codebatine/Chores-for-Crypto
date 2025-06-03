// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts-ccip/src/v0.8/CCIPSender.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ParentRewardSender is CCIPSender, Ownable {
    address public rewardToken;

    event RewardSent(bytes32 messageId, address indexed child, uint256 amount, uint64 destinationChainSelector);

    constructor(address _router, address _link, address _rewardToken)
        CCIPSender(_router, _link)
    {
        rewardToken = _rewardToken;
    }

    function sendReward(address child, uint256 amount, uint64 destinationChainSelector) external onlyOwner {
        require(IERC20(rewardToken).balanceOf(address(this)) >= amount, "Insufficient balance");
        bytes memory message = abi.encode(child, amount);
        bytes32 messageId = _send(destinationChainSelector, message, LINK_TOKEN, 0);
        emit RewardSent(messageId, child, amount, destinationChainSelector);
    }

    function setRewardToken(address token) external onlyOwner {
        rewardToken = token;
    }

    function withdrawTokens(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }
}
