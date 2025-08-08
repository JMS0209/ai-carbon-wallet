const DEV_MODE = String(process.env.NEXT_PUBLIC_RBAC_DEV_MODE || "false") === "true";

export function assertDevMode() {
  if (!DEV_MODE) throw new Error("Dev key entry disabled. Set NEXT_PUBLIC_RBAC_DEV_MODE=true to enable.");
}

export function derivePublicFromPrivateHexEvm(privateKeyHex: string): { address: string } {
  assertDevMode();
  // Minimal validation; do not persist the key
  let pk = privateKeyHex.trim();
  if (pk.startsWith("0x")) pk = pk.slice(2);
  if (!/^[0-9a-fA-F]{64}$/.test(pk)) throw new Error("Invalid private key format");
  // Use viem to compute EVM address from private key
  const { privateKeyToAccount } = require("viem/accounts");
  const account = privateKeyToAccount(`0x${pk}`);
  return { address: account.address };
}


