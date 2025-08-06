const { Wallet } = require("ethers");

function generateBurnerWallet() {
    const burner = Wallet.createRandom();
    return {
        address: burner.address,
        privateKey: burner.privateKey,
    };
}

module.exports = generateBurnerWallet;