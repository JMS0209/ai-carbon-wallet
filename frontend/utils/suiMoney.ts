import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

export const MIST_PER_SUI = 1_000_000_000n;

export function toMist(sui: string | number): bigint {
  const s = typeof sui === "number" ? String(sui) : sui.trim();
  if (!s.includes(".")) return BigInt(s) * MIST_PER_SUI;
  const [whole, fracRaw] = s.split(".");
  const frac = (fracRaw + "000000000").slice(0, 9); // pad/truncate to 9 decimals
  return BigInt(whole || "0") * MIST_PER_SUI + BigInt(frac);
}

export function getSuiClient() {
  const rpc = process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl((process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet") as any);
  return new SuiClient({ url: rpc });
}


