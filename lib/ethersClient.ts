import { ethers } from "ethers";
import { Wallet, JsonRpcProvider } from "ethers";
const RPC_URL = process.env.RPC_URL;
const provider = new JsonRpcProvider(RPC_URL);
const signer = new Wallet(privateKey, provider);


export const getProvider = (rpcUrl: string) => {
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

export const getSigner = (privateKey: string, rpcUrl: string) => {
  const provider = getProvider(rpcUrl);
  return new ethers.Wallet(privateKey, provider);
};
