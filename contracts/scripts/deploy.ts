import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    throw new Error("No deployer configured. Set DEPLOYER_PRIVATE_KEY in .env");
  }

  console.log(`Deploying contracts with account: ${deployer.address}`);

  const mineTokenFactory = await ethers.getContractFactory("MineToken");
  const mineToken = await mineTokenFactory.deploy(deployer.address);
  await mineToken.waitForDeployment();

  const tokenAddress = await mineToken.getAddress();
  console.log(`MineToken deployed to: ${tokenAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
