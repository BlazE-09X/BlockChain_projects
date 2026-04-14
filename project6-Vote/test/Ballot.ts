import { describe, it, before } from "node:test";
import assert from "node:assert";
import { network } from "hardhat";
import { ethers as ethersLib } from "ethers";

function toBytes32(text: string): string {
  return ethersLib.encodeBytes32String(text);
}

describe("Ballot", () => {
  let contract: any;
  let chairperson: any;
  let voter1: any;
  let voter2: any;
  let voter3: any; 

  before(async () => {
    const { ethers } = await network.connect();
    [chairperson, voter1, voter2, voter3] = await ethers.getSigners(); 

    const proposalNames = [
      toBytes32("Кандидат 1"),
      toBytes32("Кандидат 2"),
      toBytes32("Кандидат 3"),
      toBytes32("Кандидат 4")
    ];

    contract = await ethers.deployContract("Ballot", [proposalNames]);
    await contract.waitForDeployment();
  });

  it("chairperson should have weight 1", async () => {
    const voter = await contract.voters(chairperson.address);
    assert.equal(voter.weight.toString(), "1");
  });

  it("chairperson can give right to vote", async () => {
    await contract.giveRightToVote(voter1.address);

    const voter = await contract.voters(voter1.address);
    assert.equal(voter.weight.toString(), "1");
  });

  it("voter1 can vote for Кандидат 1", async () => {
    await contract.connect(voter1).vote(0);

    const voter = await contract.voters(voter1.address);
    assert.equal(voter.voted, true);
    assert.equal(voter.vote.toString(), "0");

    const proposal = await contract.proposals(0);
    assert.equal(proposal.voteCount.toString(), "1");
  });

  it("voter2 delegates to voter3, voter3 votes", async () => {
    await contract.giveRightToVote(voter2.address);
    await contract.giveRightToVote(voter3.address);

    // voter2 → voter3
    await contract.connect(voter2).delegate(voter3.address);

    await contract.connect(voter3).vote(0);

    const p = await contract.proposals(0);


    assert.equal(p.voteCount.toString(), "3");
  });

  it("winner should be Кандидат 1", async () => {
    const winner = await contract.winnerName();
    const winnerName = ethersLib.decodeBytes32String(winner);

    assert.equal(winnerName, "Кандидат 1");
  });
});