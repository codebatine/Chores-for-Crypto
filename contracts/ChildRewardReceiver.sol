// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink-ccip/develop/chains/evm/contracts/applications/CCIPReceiver.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v4.9/contracts/token/ERC20/IERC20.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v4.9/contracts/access/Ownable.sol";

contract ChildRewardReceiver is CCIPReceiver, Ownable {
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

    function setRewardToken(address token) external onlyOwner {
        rewardToken = token;
    }
}
