# 🧹 Chores for Crypto

Rewards for chores with Sepolia ETH, priced in real-time USD using Chainlink oracles

---

## Project Links

- **Contract Address:** [ChoresReward.sol on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x210b858e80253117e7a572112810ecc07c44a98c)
- **Demo Video:** [YouTube Demo](PASTE_YOUTUBE_LINK)
- **GitHub:** [Chores for Crypto Repo](https://github.com/codebatine/Chores-for-Crypto)
- **Smart Contract Source Code:** [ChoresReward.sol](https://github.com/codebatine/Chores-for-Crypto/tree/main/contracts)

---

## Description

**Chores for Crypto** lets parents pay children for chores in Sepolia Eth with the amount denominated in USD.  
Parents specify a USD amount and the smart contract uses **Chainlink's ETH/USD price feed** to determine and send the real-time equivalent in ETH.  
This ensures the reward always matches the intended value, regardless of ETH price.

---

## Architecture

- **Frontend:** React (Vite), Tailwind CSS, Ethers.js, Web3Modal
- **Smart Contracts:** Solidity (`ChoresReward.sol`) on Sepolia testnet
- **Chainlink:** ETH/USD Price Feed ([0x694AA1769357215DE4FAC081bf1f309aDC325306](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306), Sepolia)

---

## Chainlink Usage

This project uses **Chainlink Data Feeds** inside a state-changing contract function.

- In `ChoresReward.sol`, the contract:
  - Imports Chainlink's `AggregatorV3Interface`
  - Reads the current ETH/USD price directly **inside the `sendReward` function** (which sends ETH to the child).
  - This means every time a parent sends a reward, a real Chainlink oracle call determines the ETH amount.

**Relevant contract snippet:**

```solidity
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChoresReward {
    AggregatorV3Interface public priceFeed;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function sendReward(address payable child, uint256 usdAmount) public payable {
        uint256 ethAmount = getETHAmountFromUSD(usdAmount);
        require(msg.value >= ethAmount, "Not enough ETH sent for reward!");
        child.transfer(ethAmount);
        // emits event, refunds any excess
    }

    function getETHAmountFromUSD(uint256 usdAmount) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price feed value");
        return (usdAmount * 1e18) / uint256(price) * 1e8;
    }
}
```

**Chainlink usage files:**

- [`contracts/ChoresReward.sol`](contracts/ChoresReward.sol) (main contract)
- Chainlink AggregatorV3Interface used at [0x694AA1769357215DE4FAC081bf1f309aDC325306](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306) (Sepolia)

---

## How to Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/chores-for-crypto-frontend
   cd chores-for-crypto-frontend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start local dev server**
   ```bash
   npm run dev
   ```
4. **Configure MetaMask for Sepolia**
5. **Interact with the dApp locally**

_No frontend deployment—run `npm run dev` and use `localhost`!_

---

## Usage

1. **Connect your wallet (MetaMask)**
2. **Parent** can (optionally) add children’s wallet addresses to an address book for easy selection.
3. Select a child’s address from the address book (or enter a new address manually).
4. Enter the USD reward amount for the chore.
5. App calculates the ETH amount using the smart contract.
6. Parent confirms the transaction (MetaMask popup).
7. **Child receives ETH** for their hard work!

---

## Submission Checklist

- **[x]** Chainlink Data Feeds used for state change (see [ChoresReward.sol](contracts/ChoresReward.sol))
- **[x]** Public repo with code
- **[x]** Demo video (public link above)
- **[x]** README covers Chainlink usage and architecture
- **[x]** All files using Chainlink are clearly linked

---

_Thank you for reviewing our project!_
