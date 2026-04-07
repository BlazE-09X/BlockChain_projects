import { network } from "hardhat";

const BASE_URI = "ipfs://bafybeiew5r7estvuo4ioekshagyle3qemz4vkdgereckqjwofrip2vadhq/";

async function main() {
  const { ethers } = await network.connect();

  const nft = await ethers.deployContract("MyNFT", [BASE_URI]);

  await nft.waitForDeployment();

  console.log("Deployed at:", await nft.getAddress());
}

main().catch(console.error);