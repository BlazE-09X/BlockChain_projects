import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm";

const CONTRACT_ADDRESS = "0x287321AB5532e7071C4D0CB539B6A97ffDdc332e";
const ABI = [
    "function createDocument(string _hash, address[] _signers)",
    "function signDocument(uint256 id)",
    "function isAllowed(uint256 id, address user) view returns (bool)",
    "function isSigned(uint256 id, address user) view returns (bool)",
    "function isCompleted(uint256 id) view returns (bool)"
];

let provider, signer, contract;

const statusDisplay = document.getElementById("status");

function updateStatus(msg, isError = false) {
    statusDisplay.innerText = msg;
    statusDisplay.style.color = isError ? "#f87171" : "#94a3b8";
}

async function connect() {
    try {
        if (!window.ethereum) return updateStatus("Установите MetaMask!", true);
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        const addr = await signer.getAddress();
        document.getElementById("connect").innerText = addr.substring(0,6) + "..." + addr.slice(-4);
        updateStatus("Кошелек подключен ✅");
    } catch (e) {
        updateStatus("Ошибка подключения", true);
    }
}

async function getHash(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

async function createDoc() {
    if (!contract) return updateStatus("Сначала подключите кошелек!", true);
    
    const fileInput = document.getElementById("fileInput");
    const addressElements = document.querySelectorAll(".address-item");
    const signers = Array.from(addressElements).map(el => el.innerText.trim().toLowerCase());
    
    if (fileInput.files.length === 0) return updateStatus("Выберите файл! ❌", true);
    if (signers.length === 0) return updateStatus("Список подписантов пуст! ❌", true);

    try {
        updateStatus("Хеширование файла...");
        const hash = await getHash(fileInput.files[0]);
        
        updateStatus("Ожидание транзакции...");
        const tx = await contract.createDocument(hash, signers);
        await tx.wait();
        updateStatus("Документ создан в блоке! ✅");
    } catch (e) {
        updateStatus("Ошибка при создании", true);
    }
}

async function signDoc() {
    if (!contract) return updateStatus("Сначала подключите кошелек!", true);
    const id = document.getElementById("docId").value;
    if (!id) return updateStatus("Введите ID! ❌", true);

    try {
        updateStatus("Проверка доступа...");
        const addr = await signer.getAddress();
        const ok = await contract.isAllowed(id, addr);
        if (!ok) return updateStatus("Вас нет в списке подписантов! ❌", true);

        updateStatus("Подписание...");
        const tx = await contract.signDocument(id);
        await tx.wait();
        updateStatus("Подписано успешно! ✅");
    } catch (e) {
        updateStatus(e.reason || "Ошибка подписания", true);
    }
}

// Привязка событий
document.getElementById("connect").onclick = connect;
document.getElementById("create").onclick = createDoc;
document.getElementById("sign").onclick = signDoc;