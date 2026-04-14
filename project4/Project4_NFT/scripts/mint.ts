import { network } from "hardhat";

const CONTRACT = "0xe3b7aF5A3c3570208f2bb142237DBf501e8b8713";

async function main() {
  const { ethers } = await network.connect();

  const nft = await ethers.getContractAt("MyNFT", CONTRACT);

  const tx = await nft.mint({
    value: ethers.parseEther("0.001"),
  });

  await tx.wait();

  console.log("Minted!");
}

main().catch(console.error);