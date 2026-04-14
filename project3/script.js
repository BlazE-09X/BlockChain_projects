// Адрес задеплоенного смарт-контракта
const contractAddress = "0x523595d263073f2d5df9d99c05e3f49486011395"; 
const contractABI = [
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subscriptionId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "have",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "want",
        "type": "address"
      }
    ],
    "name": "OnlyCoordinatorCanFulfill",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "have",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "coordinator",
        "type": "address"
      }
    ],
    "name": "OnlyOwnerOrCoordinator",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ZeroAddress",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "vrfCoordinator",
        "type": "address"
      }
    ],
    "name": "CoordinatorSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "playerChoice",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "cpuChoice",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "result",
        "type": "string"
      }
    ],
    "name": "GameFinished",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "GameRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "_playerChoice",
        "type": "uint8"
      }
    ],
    "name": "play",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "randomWords",
        "type": "uint256[]"
      }
    ],
    "name": "rawFulfillRandomWords",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_vrfCoordinator",
        "type": "address"
      }
    ],
    "name": "setCoordinator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "callbackGasLimit",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameOwner",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "keyHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_BET",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "numWords",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestConfirmations",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "",
        "type": "uint16"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "s_requests",
    "outputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "playerChoice",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "betAmount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "s_results",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "playerChoice",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "cpuChoice",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "result",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "s_subscriptionId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "s_vrfCoordinator",
    "outputs": [
      {
        "internalType": "contract IVRFCoordinatorV2Plus",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


// Публичный RPC-узел для чтения данных из блокчейна (BSC Testnet)
const PUBLIC_RPC = "https://bsc-testnet.publicnode.com";

// Переменные для работы с ethers.js
let signer;     // Подписант (кошелек пользователя через MetaMask)
let contract;   // Экземпляр контракта
let provider;   // Провайдер для чтения данных (RPC)

// Локальное хранение статистики пользователя
let wins = 0;
let losses = 0;

// Последний requestId (нужен для отслеживания результата VRF)
let lastRequestId = null;


// Функция инициализации приложения
async function init() {
    // Проверка наличия MetaMask
    if (!window.ethereum) {
        updateConsole("Ошибка: MetaMask не найден.");
        return;
    }

    try {
        // Создаем provider для чтения данных (не зависит от MetaMask RPC)
        provider = new ethers.JsonRpcProvider(PUBLIC_RPC);

        // Создаем provider для подписи транзакций через MetaMask
        const browserProvider = new ethers.BrowserProvider(window.ethereum);

        // Запрашиваем доступ к аккаунту пользователя
        await browserProvider.send("eth_requestAccounts", []);

        // Получаем signer (подписант)
        signer = await browserProvider.getSigner();

        // Создаем экземпляр контракта с возможностью отправки транзакций
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        updateConsole("Система онлайн. Модуль VRF готов ✅");

        // Обновляем интерфейс
        await updateUI();

    } catch (err) {
        console.error(err);
        updateConsole("Ошибка доступа к кошельку.");
    }
}


// Функция обновления UI (баланс и статистика)
async function updateUI() {
    if (signer) {
        try {
            // Получаем адрес пользователя
            const addr = await signer.getAddress();

            // Получаем баланс через RPC
            const balanceWei = await provider.getBalance(addr);

            // Отображаем баланс (в BNB)
            document.getElementById("user-balance").innerText =
                Number(ethers.formatEther(balanceWei)).toFixed(4);

            // Обновляем счет
            document.getElementById("score-wins").innerText = wins;
            document.getElementById("score-losses").innerText = losses;

        } catch (e) {
            console.error("UI Update Error:", e);
        }
    }
}


// Основная функция игры
async function playGame(choice) {
    try {
        // Блокируем кнопки, чтобы избежать повторных нажатий
        toggleButtons(true);

        updateConsole("Инициализация протокола... Подтвердите ставку.");

        // Отправляем транзакцию в контракт (вызов функции play)
        const tx = await contract.play(choice, {
            value: ethers.parseEther("0.0001") // отправляем ставку
        });

        updateConsole("Транзакция в сети. Ждем подтверждения блока...");

        // Ожидаем подтверждение транзакции
        const receipt = await tx.wait();

        // Извлекаем событие GameRequested из логов
        const event = receipt.logs
            .map(log => {
                try { return contract.interface.parseLog(log); }
                catch { return null; }
            })
            .find(e => e && e.name === "GameRequested");

        // Если событие найдено — сохраняем requestId
        if (event) {
            lastRequestId = event.args.requestId;

            // Отображаем ожидание результата
            document.getElementById("result").innerText = "_WAITING_FOR_ORACLE_";

            updateConsole("Запрос отправлен в Chainlink. Ожидание оракула...");

            // Запускаем опрос результата
            pollResult();

        } else {
            throw new Error("RequestId не найден");
        }

    } catch (err) {
        console.error(err);
        updateConsole("Ошибка: Транзакция отклонена или сбой сети.");
        toggleButtons(false);
    }
}


// Функция опроса результата из блокчейна
async function pollResult() {
    if (!lastRequestId) return;

    let attempts = 0;
    const maxAttempts = 60; // максимум попыток (таймаут)

    const interval = setInterval(async () => {
        try {
            // Получаем данные результата из контракта
            const rawData = await contract.s_results(lastRequestId);

            // Извлекаем строковый результат (WIN / LOSE / DRAW)
            const resultFromContract = rawData[2];

            // Если результат еще не записан — продолжаем ждать
            if (!resultFromContract || resultFromContract === "") return;

            // Останавливаем опрос
            clearInterval(interval);

            // Приводим результат к стандартному виду
            const status = String(resultFromContract).trim().toUpperCase();

            // Преобразуем числа в названия ходов
            const moves = ["ROCK", "PAPER", "SCISSORS"];
            const myMove = moves[Number(rawData[0])];
            const cpuMove = moves[Number(rawData[1])];

            // Обновляем статистику
            if (status === "WIN") wins++;
            if (status === "LOSE") losses++;

            // Вывод информации в консоль
            updateConsole(`Игра завершена. Твой ход: ${myMove}, Ход CPU(Chainlink): ${cpuMove}, Итог: ${status}`);

            // Отображение результата на экране
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML =
                `<span style="color: #00ff41">YOU: ${myMove}</span> | ` +
                `<span style="color: #ff00ea">CPU: ${cpuMove}</span><br>` +
                `<span class="blink">STATUS: ${status}</span>`;

            // Обновляем счет
            document.getElementById("score-wins").innerText = wins;
            document.getElementById("score-losses").innerText = losses;

            // Разблокируем кнопки
            toggleButtons(false);

            // Обновляем баланс
            await updateUI();

        } catch (e) {
            // Ошибка означает, что данные еще не записаны в блокчейн
            console.log("Ожидание записи в блокчейн...");
        }

        attempts++;

        // Если превышен лимит ожидания — прекращаем
        if (attempts > maxAttempts) {
            clearInterval(interval);
            updateConsole("Таймаут: Результат не найден в контракте.");
            toggleButtons(false);
        }

    }, 3000); // опрос каждые 3 секунды
}


// Функция вывода средств владельцем контракта
async function withdrawFunds() {
    try {
        updateConsole("Вывод средств...");

        // Вызов функции withdraw в контракте
        const tx = await contract.withdraw();
        await tx.wait();

        updateConsole("Средства выведены!");

        await updateUI();

    } catch (err) {
        updateConsole("Ошибка вывода.");
    }
}


// Функция обновления текстовой консоли интерфейса
function updateConsole(msg) {
    document.getElementById("status-console").innerText = `> ${msg}`;
}


// Блокировка/разблокировка кнопок выбора
function toggleButtons(state) {
    document.querySelectorAll('.choices button').forEach(b => b.disabled = state);
}


// Запуск инициализации при загрузке страницы
window.addEventListener('load', init);