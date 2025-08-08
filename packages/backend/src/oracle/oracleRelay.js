/**
 * Sends signed oracle data to a smart contract
 * @param {Wallet} wallet - Signer wallet
 * @param {Contract} oracleContract - Ethers contract instance
 * @param {string} data - Oracle data to send
 */
export async function relayOracleData(wallet, oracleContract, data) {
  const signature = await wallet.signMessage(data);
  const tx = await oracleContract.receiveOracleData(data, signature);
  await tx.wait();
  console.log('Oracle data relayed:', tx.hash);
}
