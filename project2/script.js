const contractAddress = "0xdf7957b0B806f3e060E909F2436842434D825Cf0";
const ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_note",
				"type": "string"
			}
		],
		"name": "setNote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getNote",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_pureNote",
				"type": "string"
			}
		],
		"name": "pureNote",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
];
let signer = null;
let contract = null;
let provider = null;

async function init() {
	if (window.ethereum == null) {
        alert("Пожалуйста, установите MetaMask!");
        return;
    }

	provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const accounts = await provider.listAccounts();
    signer = await provider.getSigner();

    contract = new ethers.Contract(contractAddress, ABI, signer);

    console.log("Signer address:", await signer.getAddress());
}

// Убедимся, что вешаем события только когда элементы точно есть
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("writeNote").addEventListener("click", setNote);
    document.getElementById("getNote").addEventListener("click", getNote);
    init().catch(console.error);
});

async function setNote() {
    const note = document.getElementById("inputNote").value;
    const tx = await contract.setNote(note);

    await tx.wait();

    console.log("Note stored");
}

async function getNote() {
    const note = await contract.getNote();
    document.getElementById("result").innerText = note;
}

document.getElementById("writeNote").addEventListener("click", setNote);
document.getElementById("getNote").addEventListener("click", getNote);

init().catch(console.error);