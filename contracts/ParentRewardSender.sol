// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/contracts/libraries/Client.sol";

contract ParentRewardSender is Ownable {
    IRouterClient public router;
    address public rewardToken;

    event RewardSent(
        bytes32 messageId,
        address indexed child,
        uint256 amount,
        uint64 destinationChainSelector
    );

    constructor(
        address _router,
        address _rewardToken,
        address initialOwner
    ) Ownable(initialOwner) {
        router = IRouterClient(_router);
        rewardToken = _rewardToken;
    }

    function sendReward(
        address receiverContract,
        address child,
        uint256 amount,
        uint64 destinationChainSelector
    ) external onlyOwner {
        require(
            IERC20(rewardToken).balanceOf(address(this)) >= amount,
            "Insufficient balance"
        );

        // Prepare payload
        bytes memory data = abi.encode(child, amount);

        // Prepare token transfer array
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: rewardToken,
            amount: amount
        });

        // Approve router to pull tokens for the transfer
        require(
            IERC20(rewardToken).approve(address(router), amount),
            "Approve failed"
        );

        // Set extra args (gas limit, etc)
        bytes memory extraArgs = Client._argsToBytes(
            Client.EVMExtraArgsV1({gasLimit: 200_000})
        );

        // Construct the message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiverContract),
            data: data,
            tokenAmounts: tokenAmounts,
            extraArgs: extraArgs,
            feeToken: address(0) // Use LINK address if paying in LINK
        });

        uint256 fee = router.getFee(destinationChainSelector, message);

        bytes32 messageId = router.ccipSend{value: fee}(
            destinationChainSelector,
            message
        );

        emit RewardSent(messageId, child, amount, destinationChainSelector);
    }

    // Withdraw ERC20 tokens mistakenly sent to this contract
    function withdrawTokens(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(IERC20(token).transfer(to, amount), "Withdraw failed");
    }

    // To receive ETH for fees if needed
    receive() external payable {}
}
