// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CCIPReceiver} from "@chainlink/contracts-ccip/contracts/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ChildRewardReceiver is CCIPReceiver, Ownable {
    address public rewardToken;

    event RewardReceived(address indexed child, uint256 amount);

    constructor(
        address _router,
        address _rewardToken,
        address initialOwner
    ) CCIPReceiver(_router) Ownable(initialOwner) {
        rewardToken = _rewardToken;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (address child, uint256 amount) = abi.decode(
            message.data,
            (address, uint256)
        );
        require(IERC20(rewardToken).transfer(child, amount), "Transfer failed");
        emit RewardReceived(child, amount);
    }

    function setRewardToken(address token) external onlyOwner {
        rewardToken = token;
    }
}
