import { network } from "hardhat";

const CONTRACT = "0x3e0C8773b9Ef95E3A96cc3c61F9FDccAb7877c98";

async function main() {
  const { ethers } = await network.connect();

  const nft = await ethers.getContractAt("MyNFT", CONTRACT);

  console.log("Name:", await nft.name());
  console.log("Symbol:", await nft.symbol());
  console.log("Total:", (await nft.tokenCounter()).toString());
}

main().catch(console.error);