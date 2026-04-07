import { ethers, NonceManager } from "ethers";
import fs from "fs";
import "dotenv/config";

async function main(){

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY,
        provider
    );
    const account = new NonceManager(wallet);

    //добавила чтобы проверить тот или не тот
    const myAddress = await wallet.getAddress();
    const balance = await provider.getBalance(myAddress);
    console.log(`Работаем с адресом: ${myAddress}`);
    console.log(`Баланс: ${ethers.formatEther(balance)} tBNB`);

    if (balance === 0n) {
        console.error("ОШИБКА: На этом кошельке нет денег для оплаты газа!");
        return;
    }



    const abi = JSON.parse(fs.readFileSync("./Note_sol_Note.abi", "utf8"));
    const binary = "0x" + fs.readFileSync("./Note_sol_Note.bin", "utf8").trim();

    const contractFactory = new ethers.ContractFactory(abi, binary, account);

    console.log("Deploying...");
    const contract = await contractFactory.deploy();

    //console.log(contract);
    // Хэш транзакции деплоя
    console.log("Хэш транзакции деплоя:", contract.deploymentTransaction().hash);
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("Contract deployed at:", address);

    let curNote = await contract.getNote();
    console.log(`First request of note: ${curNote}`);

    const txResponse = await contract.setNote("My first note");
    console.log("Waiting for transaction...");
    console.log("Hash: ", txResponse.hash);

    await txResponse.wait();
    curNote = await contract.getNote();
    console.log(`New note: ${curNote}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Произошла ошибка: ",error);
    process.exit(1);
  });



