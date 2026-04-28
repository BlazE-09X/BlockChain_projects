"use client";

import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x10B71Ab7a380d9C2Ca46bDAfAd6894679fdf3985";
const TOKEN_ADDRESS = "0xfaE11FecfB2a0F1F2D2Efb3a4a15AAC7D8d469Fc";

export default function Home() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  const loadBalance = async (userAddress) => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const token = new ethers.Contract(
      TOKEN_ADDRESS,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );

    const rawBalance = await token.balanceOf(userAddress);
    setBalance(ethers.formatUnits(rawBalance, 18));
  };

  const connect = async () => {
    try {
      const acc = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(acc[0]);
      await loadBalance(acc[0]);
    } catch (err) {
      alert("Ошибка подключения: " + err.message);
    }
  };

  const handleAction = async (actionFn, successMsg) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return alert("Введите корректное число");
    }

    setLoading(true);

    try {
      await actionFn();
      alert(successMsg);
    } catch (err) {
      console.error(err);
      const message = err.reason || err.data?.message || err.message;
      alert("Ошибка: " + message);
    }

    setLoading(false);
  };

  const stake = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const userAddress = await signer.getAddress();
    const value = ethers.parseUnits(amount, 18);

    const token = new ethers.Contract(
      TOKEN_ADDRESS,
      [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function balanceOf(address) view returns (uint256)",
      ],
      signer
    );

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ["function stake(uint256 amount)"],
      signer
    );

    const approveTx = await token.approve(CONTRACT_ADDRESS, value);
    await approveTx.wait();

    const stakeTx = await contract.stake(value);
    await stakeTx.wait();

    await loadBalance(userAddress);
  };

  const unstake = async () => {
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ["function unstake()"],
        signer
      );

      const tx = await contract.unstake();
      await tx.wait();

      await loadBalance(userAddress);

      alert("Все токены и награды выведены!");
    } catch (err) {
      console.error(err);
      alert("Ошибка: " + (err.reason || err.data?.message || err.message));
    }

    setLoading(false);
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Staking App</h1>

        <button
          onClick={connect}
          style={account ? styles.btnConnected : styles.btnConnect}
        >
          {account ? `Connected: ${account.substring(0, 6)}...` : "Connect Wallet"}
        </button>

        {account && (
          <p style={styles.balance}>
            Осталось GP3: {Number(balance).toFixed(4)}
          </p>
        )}

        <div style={styles.inputGroup}>
          <input
            type="number"
            placeholder="0.0"
            style={styles.input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span style={styles.tokenLabel}>GP3</span>
        </div>

        <p style={styles.warning}>
          * Повторный стейкинг запрещен. Сначала нужно вывести старый стейк.
        </p>

        <div style={styles.grid}>
          <button
            disabled={loading}
            onClick={() => handleAction(stake, "Успешно застейкано!")}
            style={styles.primaryBtn}
          >
            Stake
          </button>
        </div>

        <button disabled={loading} onClick={unstake} style={styles.withdrawBtn}>
          Withdraw All & Rewards
        </button>

        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>📌 Заметка:</p>
          <p style={styles.infoText}>
            Чтобы видеть свои токены GP3 в MetaMask, добавьте их по адресу:
          </p>
          <code style={styles.code}>{TOKEN_ADDRESS}</code>
        </div>

        {loading && <div style={styles.loader}>Транзакция в процессе...</div>}
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#e2fff6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },

  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(147, 255, 230, 0.5)",
    width: "380px",
    textAlign: "center",
    color: "#334155",
  },

  title: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#0ea5e9",
    fontWeight: "bold",
  },

  btnConnect: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#0ea5e9",
    color: "white",
    marginBottom: "15px",
    cursor: "pointer",
  },

  btnConnected: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #0ea5e9",
    background: "transparent",
    color: "#0ea5e9",
    marginBottom: "15px",
  },

  balance: {
    fontSize: "14px",
    color: "#0f766e",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  inputGroup: {
    position: "relative",
    margin: "20px 0",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #99f6e4",
    background: "#f0fdfa",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
  },

  tokenLabel: {
    position: "absolute",
    right: "15px",
    top: "12px",
    color: "#0ea5e9",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
  },

  primaryBtn: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#14b8a6",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  withdrawBtn: {
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#f43f5e",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  warning: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "10px",
  },

  infoBox: {
    marginTop: "25px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
    textAlign: "left",
  },

  infoTitle: {
    margin: "0 0 5px 0",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#475569",
  },

  infoText: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    color: "#64748b",
    lineHeight: "1.4",
  },

  code: {
    fontSize: "10px",
    background: "#e2e8f0",
    padding: "4px",
    borderRadius: "4px",
    wordBreak: "break-all",
    display: "block",
    color: "#0ea5e9",
  },

  loader: {
    marginTop: "15px",
    color: "#d97706",
    fontSize: "14px",
    fontWeight: "bold",
  },
};