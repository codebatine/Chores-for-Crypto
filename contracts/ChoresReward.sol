// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import Chainlink Aggregator interface
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChoresReward {
    AggregatorV3Interface public priceFeed; // Chainlink price feed (ETH/USD)

    event RewardSent(
        address indexed parent,
        address indexed child,
        uint256 ethAmount,
        uint256 usdAmount
    );

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // Parent sends a USD-denominated reward to child (converted to ETH)
    function sendReward(
        address payable child,
        uint256 usdAmount
    ) public payable {
        uint256 ethAmount = getETHAmountFromUSD(usdAmount);
        require(msg.value >= ethAmount, "Not enough ETH sent for reward!");

        child.transfer(ethAmount);

        emit RewardSent(msg.sender, child, ethAmount, usdAmount);

        // Refund any excess
        if (msg.value > ethAmount) {
            payable(msg.sender).transfer(msg.value - ethAmount);
        }
    }

    // Get how much ETH is needed for a given USD amount (uses Chainlink price feed)
    function getETHAmountFromUSD(
        uint256 usdAmount
    ) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        // Chainlink price is 8 decimals, so 1 ETH = price / 10**8 USD
        // USD has 18 decimals, so we scale up accordingly
        require(price > 0, "Invalid price feed value");
        return ((usdAmount * 1e18) / uint256(price)) * 1e8;
    }
}
