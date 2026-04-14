const address = "0x362d313fE39Dd9670425049f7D8e380849aF419a";

const abi = [
  {
    "inputs": [{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"}],
    "stateMutability":"nonpayable","type":"constructor"
  },
  {
    "inputs":[],"name":"chairperson",
    "outputs":[{"internalType":"address","name":"","type":"address"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"to","type":"address"}],
    "name":"delegate","outputs":[],
    "stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"voter","type":"address"}],
    "name":"giveRightToVote","outputs":[],
    "stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "name":"proposals",
    "outputs":[
      {"internalType":"bytes32","name":"name","type":"bytes32"},
      {"internalType":"uint256","name":"voteCount","type":"uint256"}
    ],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"proposal","type":"uint256"}],
    "name":"vote","outputs":[],
    "stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"","type":"address"}],
    "name":"voters",
    "outputs":[
      {"internalType":"uint256","name":"weight","type":"uint256"},
      {"internalType":"bool","name":"voted","type":"bool"},
      {"internalType":"address","name":"delegate","type":"address"},
      {"internalType":"uint256","name":"vote","type":"uint256"}
    ],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"winnerName",
    "outputs":[{"internalType":"bytes32","name":"winnerName_","type":"bytes32"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"winningProposal",
    "outputs":[{"internalType":"uint256","name":"winningProposal_","type":"uint256"}],
    "stateMutability":"view","type":"function"
  }
];

let contract;
let signer;

async function connect() {
  if (!window.ethereum) return alert("Install Metamask!");

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  contract = new ethers.Contract(address, abi, signer);

  const userAddr = await signer.getAddress();
  document.getElementById("wallet").innerText =
    userAddr.slice(0, 6) + "..." + userAddr.slice(-4);

  loadProposals();
}


async function loadProposals() {
  let html = "";

  try {
    let i = 0;

    while (true) {
      try {
        const p = await contract.proposals(i);

        const name = ethers.decodeBytes32String(p.name);

        html += `
          <div class="proposal-item">
            <medium style="color: var(--accent); font-weight: bold;">
              Кандидат №${i + 1}
            </medium>
            <h3>${name}</h3>
            <p style="color: #64748b">
              Голосов: <b>${p.voteCount}</b>
            </p>
            <button onclick="vote(${i})">Голосовать</button>
          </div>
        `;

        i++;
      } catch {
        break;
      }
    }

    document.getElementById("proposals").innerHTML = html;

  } catch (e) {
    console.error("Ошибка загрузки:", e);
  }
}


async function vote(i) {
  try {
    const tx = await contract.vote(i);
    document.getElementById("status").innerText = "⏳ Транзакция...";
    await tx.wait();
    document.getElementById("status").innerText = "✅ Голос учтен!";
    loadProposals();
  } catch (e) {
    alert("Ошибка голосования");
    console.error(e);
  }
}


async function giveRight() {
  const addr = document.getElementById("addr").value;

  try {
    const tx = await contract.giveRightToVote(addr);
    await tx.wait();
    alert("Право выдано!");
  } catch (e) {
    alert("Ошибка (ты не админ?)");
    console.error(e);
  }
}


async function delegateVote() {
  const addr = document.getElementById("delegateAddr").value;

  try {
    const tx = await contract.delegate(addr);
    document.getElementById("status").innerText = "⏳ Делегирование...";
    await tx.wait();
    document.getElementById("status").innerText = "✅ Делегировано!";
  } catch (e) {
    alert("Ошибка делегирования");
    console.error(e);
  }
}


async function winner() {
  try {
    const w = await contract.winnerName();
    const name = ethers.decodeBytes32String(w);

    document.getElementById("winner").innerText =
      "🎉 Победитель: " + name;

  } catch (e) {
    alert("Ошибка определения победителя");
    console.error(e);
  }
}