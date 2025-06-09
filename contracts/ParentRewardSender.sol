// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink-ccip/develop/chains/evm/contracts/applications/CCIPSender.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v4.9/contracts/access/Ownable.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v4.9/contracts/token/ERC20/IERC20.sol";

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
        bytes32 messageId = _send(destinationChainSelector, message, rewardToken, amount);
        emit RewardSent(messageId, child, amount, destinationChainSelector);
    }

    function setRewardToken(address token) external onlyOwner {
        rewardToken = token;
    }

    function withdrawTokens(address token, address to, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(to, amount), "Withdraw failed");
    }
}
