const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with:', deployer.address);

  const router = '0xCCIP_ROUTER_ADDRESS'; // Replace with correct router address
  const link = '0xLINK_TOKEN_ADDRESS'; // Replace with correct LINK address
  const rewardToken = '0xERC20_REWARD_TOKEN'; // Replace with token you're rewarding

  const Parent = await hre.ethers.getContractFactory('ParentRewardSender');
  const parent = await Parent.deploy(router, link, rewardToken);
  await parent.deployed();
  console.log('Parent deployed at:', parent.address);

  const Child = await hre.ethers.getContractFactory('ChildRewardReceiver');
  const child = await Child.deploy(router, rewardToken);
  await child.deployed();
  console.log('Child deployed at:', child.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
