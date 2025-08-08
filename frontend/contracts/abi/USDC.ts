// USDC Token ABI - read-only functions only
export const USDCABI = [
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address"}],
    "name": "balanceOf",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "address"}, {"type": "address"}],
    "name": "allowance",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
