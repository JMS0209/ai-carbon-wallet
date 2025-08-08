import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

const RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl((process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet") as "mainnet" | "testnet" | "devnet" | "localnet");
const PACKAGE_ID = process.env.NEXT_PUBLIC_SUI_PACKAGE_ID;
const GAS_BUDGET = Number(process.env.NEXT_PUBLIC_SUI_GAS_BUDGET || 30_000_000);

export interface OwnedEnergyNft {
  objectId: string;
  type: string;
  display?: Record<string, any> | null;
}

export function getClient() {
  return new SuiClient({ url: RPC_URL });
}

export function getEnergyNftType(): string | null {
  if (!PACKAGE_ID) return null;
  return `${PACKAGE_ID}::energy_nft::CarbonAIPack`;
}

export async function getMyEnergyNfts(owner: string): Promise<OwnedEnergyNft[]> {
  const client = getClient();
  const nftType = getEnergyNftType();
  if (!nftType) return [];
  const res = await client.getOwnedObjects({
    owner,
    filter: { StructType: nftType },
    options: { showType: true, showDisplay: true },
  });
  return (res.data || []).map(it => ({
    objectId: it.data?.objectId!,
    type: it.data?.type || nftType,
    display: (it.data as any)?.display?.data ?? null,
  }));
}

export async function getEnergyNftListings(): Promise<{ count: number; details: string }> {
  // Without a known kiosk index or ID, we return zero but mark read success if PACKAGE_ID is set
  const nftType = getEnergyNftType();
  if (!nftType) return { count: 0, details: "No PACKAGE_ID configured" };
  // TODO: integrate kiosk indexer once available; for now, return 0
  return { count: 0, details: "No kiosk index configured; returning 0" };
}

export async function listInKiosk(_args: { nftId: string; price: string }): Promise<{ ok: boolean; reason?: string }> {
  return { ok: false, reason: "Listing not enabled yet in this step (signer required)" };
}

export async function buyFromKiosk(_args: { listingId: string }): Promise<{ ok: boolean; reason?: string }> {
  return { ok: false, reason: "Buy not enabled yet in this step (signer required)" };
}


