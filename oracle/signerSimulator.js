import { ethers } from 'ethers';

/**
 * Simulates signing a message with a given wallet
 * @param {Wallet} wallet - Ethers wallet instance
 * @param {string} message - Message to sign
 * @returns {string} signature
 */
export async function simulateSigner(wallet, message) {
  const messageHash = ethers.utils.hashMessage(message);
  const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));
  return signature;
}
