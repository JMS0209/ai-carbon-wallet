// PaymentProcessor ABI - read-only functions only
export const PaymentProcessorABI = [
  {
    "inputs": [],
    "name": "usdc",
    "outputs": [{"type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "bytes32"}],
    "name": "payments",
    "outputs": [
      {"type": "address"},
      {"type": "uint256"},
      {"type": "uint256"},
      {"type": "uint256"},
      {"type": "string"},
      {"type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
