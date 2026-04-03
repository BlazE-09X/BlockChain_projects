import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm";

const CONTRACT = "0xe3b7aF5A3c3570208f2bb142237DBf501e8b8713"; 

const ABI = [
    "function mint() payable",
    "function totalSupply() view returns (uint256)",
    "function tokenURI(uint256) view returns (string)",
    "function tokensOfOwner(address) view returns (uint256[])",
    "function PRICE() view returns (uint256)" 
];

let provider, signer, contract;

async function connect() {
    if (!window.ethereum) return alert("Please install MetaMask!");
    
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT, ABI, signer);

    document.getElementById("connect").innerText = "Connected";
    updateSupply();
    loadNFTs();
}

async function updateSupply() {
    const s = await contract.totalSupply();
    document.getElementById("supply").innerText = s.toString();
}

async function mint() {
    try {
        const price = await contract.PRICE();
        const tx = await contract.mint({ value: price });
        
        console.log("Ожидаем подтверждения...");
        await tx.wait();
        
        updateSupply();
        loadNFTs();
    } catch (err) {
        console.error(err);
        alert("Ошибка при создании NFT");
    }
}

async function loadNFTs() {
    const addr = await signer.getAddress();
    const ids = await contract.tokensOfOwner(addr);

    const container = document.getElementById("nfts");
    container.innerHTML = "";

    for (let id of ids) {
        try {
            const uri = await contract.tokenURI(id);
 
            const url = uri.replace("ipfs://", "https://beige-worrying-cod-911.mypinata.cloud/ipfs/");

            const meta = await fetch(url).then(r => r.json());
            const img = meta.image.replace("ipfs://", "https://beige-worrying-cod-911.mypinata.cloud/ipfs/");

            const div = document.createElement("div");
            div.className = "nft-card";
            div.innerHTML = `
                <img src="${img}">
                <div class="info">
                    <h3>${meta.name}</h3>
                    <p class="desc">${meta.description}</p>
                    <div class="stats-grid">
                        ${meta.attributes.map(a => `
                            <div class="attr-box">
                                <span class="label">${a.trait_type}</span>
                                <span class="value">${a.value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            container.appendChild(div);
        } catch (e) {
            console.log("Error loading metadata for ID:", id);
        }
    }
}

document.getElementById("connect").onclick = connect;
document.getElementById("mint").onclick = mint;