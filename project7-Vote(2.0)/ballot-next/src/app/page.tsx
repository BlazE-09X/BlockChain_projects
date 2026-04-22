"use client";

import { useState } from "react";
import { CONTRACT_ADDRESS } from "@/lib/contract";
import { useWallet } from "@/hooks/useWallet";
import { useBallot } from "@/hooks/useBallot";

import Header from "@/components/Header";
import DashboardCard from "@/components/DashboardCard";
import ActionsPanel from "@/components/ActionsPanel";
import ProposalsList from "@/components/ProposalsList";
import WinnerCard from "@/components/WinnerCard";


export default function Home() {
  const { signer, contract, account, status, setStatus, connectWallet } = useWallet();

  const {
    chairperson,
    proposals,
    winnerName,
    winnerIndex,
    voterData,
    giveRightToVote,
    delegateVote,
    voteForProposal,
  } = useBallot(contract, signer, setStatus);

  return (
    <main className="container">

      <Header
        account={account}
        status={status}
        onConnect={connectWallet}
      />

      {/* DASHBOARD */}
      <div className="info-grid">
        <DashboardCard title="Chairperson" value={chairperson} />
        <DashboardCard title="Ваш вес" value={voterData.weight} />
        <DashboardCard title="Голос" value={voterData.vote} />
        <DashboardCard title="Делегат" value={voterData.delegate} />
      </div>

      <ActionsPanel
        onGive={giveRightToVote}
        onDelegate={delegateVote}
        onVote={voteForProposal}
      />

      <ProposalsList
        proposals={proposals}
        onVote={voteForProposal}
      />

      <WinnerCard
        winnerIndex={winnerIndex}
        winnerName={winnerName}
      />

    </main>
  );
}