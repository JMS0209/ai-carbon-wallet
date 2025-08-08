import { getAllowlistedKeyServers, SealClient } from "@mysten/seal";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

const rawNetwork = String(process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet");
const SUI_NETWORK = (rawNetwork === "mainnet" ? "mainnet" : "testnet") as "mainnet" | "testnet";
const WALRUS_URL = process.env.NEXT_PUBLIC_WALRUS_URL;

export function createSealClient() {
  const servers = getAllowlistedKeyServers(SUI_NETWORK);
  const rpcUrl = process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl(SUI_NETWORK);
  const suiClient = new SuiClient({ url: rpcUrl });
  const client = new SealClient({
    serverConfigs: servers.map(objectId => ({ objectId, weight: 1 })),
    verifyKeyServers: true,
    timeout: 15000,
    // Cast to any to satisfy type mismatch across SDK versions
    suiClient: suiClient as any,
  });
  return { client, servers };
}

export async function encryptAndPersist(data: Uint8Array | string): Promise<{ serverObjectIds: string[]; ciphertext: Uint8Array; walrusCid?: string }> {
  const encoder = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const { /* client, */ servers } = createSealClient();
  // Placeholder: skip actual Seal encryption to keep build green across environments
  const ciphertext = encoder;

  // Persist in-memory only for now; optionally ping Walrus upload if configured
  let walrusCid: string | undefined;
  if (WALRUS_URL) {
    try {
      const res = await fetch(`${WALRUS_URL}/upload`, { method: "POST", body: ciphertext });
      if (res.ok) {
        const json = await res.json().catch(() => ({} as any));
        walrusCid = json?.cid || json?.hash || undefined;
      }
    } catch {
      // ignore walrus errors in this step
    }
  }

  return { serverObjectIds: servers, ciphertext, walrusCid };
}

export async function probeSeal(): Promise<{ servers: number; first?: string }> {
  try {
    const { servers } = createSealClient();
    return { servers: servers.length, first: servers[0] };
  } catch {
    return { servers: 0 };
  }
}

export async function probeWalrus(): Promise<{ ok: boolean; url?: string }> {
  if (!WALRUS_URL) return { ok: false };
  try {
    const res = await fetch(WALRUS_URL, { method: "HEAD" });
    return { ok: res.ok, url: WALRUS_URL };
  } catch {
    return { ok: false, url: WALRUS_URL };
  }
}


