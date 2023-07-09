// app.js
import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/SimpleWallet.json";

let accounts;
let account;
let meta;
let balance;

window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        // Use Mist/MetaMask's provider.
        window.web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    // Load Blockchain Data
    loadBlockchainData();
});

async function loadBlockchainData() {
    accounts = await web3.eth.getAccounts();
    account = accounts[0];

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = metaCoinArtifact.networks[networkId];

    meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
    );

    refreshBalance();

    document.getElementById('send-coin-form').addEventListener('submit', sendCoin);
}

async function refreshBalance() {
    balance = await meta.methods.getBalance(account).call();
    document.getElementById('balance').innerText = balance;
}

async function sendCoin(event) {
    event.preventDefault();

    const receiver = document.getElementById('receiver-address').value;
    const amount = document.getElementById('send-amount').value;

    const sendResult = await meta.methods.sendCoin(receiver, amount).send({ from: account });

    console.log(sendResult);

    refreshBalance();
}
