// OracleReceiver ABI - read-only functions only
export const OracleReceiverABI = [
  {
    "inputs": [],
    "name": "latestOracleData",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "trustedSigner",
    "outputs": [{"type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
