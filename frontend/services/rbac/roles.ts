export type AllowedRole = "SIGNER" | "BUYER";

export interface ProofReference {
  serverObjectIds: string[];
  walrusCid?: string;
  createdAt: number;
}

const ROLE_STORAGE_KEY = "rbac.currentRole";
const PROOFREF_STORAGE_KEY = "rbac.proofRef";

let inMemoryRole: AllowedRole | null = null;
let inMemoryProofRef: ProofReference | null = null;

export function getAllowedRoles(): AllowedRole[] {
  return ["SIGNER", "BUYER"];
}

export async function currentRole(): Promise<AllowedRole | null> {
  if (typeof window === "undefined") return inMemoryRole;
  try {
    const raw = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as AllowedRole) ?? null;
  } catch {
    return inMemoryRole;
  }
}

export function getCurrentProofRef(): ProofReference | null {
  if (typeof window === "undefined") return inMemoryProofRef;
  try {
    const raw = window.localStorage.getItem(PROOFREF_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProofReference;
  } catch {
    return inMemoryProofRef;
  }
}

export function setRole(role: AllowedRole, proofRef: ProofReference): void {
  inMemoryRole = role;
  inMemoryProofRef = proofRef;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(role));
    window.localStorage.setItem(PROOFREF_STORAGE_KEY, JSON.stringify(proofRef));
  }
}

export function clearRole(): void {
  inMemoryRole = null;
  inMemoryProofRef = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ROLE_STORAGE_KEY);
    window.localStorage.removeItem(PROOFREF_STORAGE_KEY);
  }
}

export async function testRbacConnection(
  probeSeal: () => Promise<{ servers: number; first?: string }>,
  probeWalrus?: () => Promise<{ ok: boolean; url?: string }>,
): Promise<{ status: "ok" | "warn" | "skip" | "fail"; details: string; role: AllowedRole | null; servers?: number }> {
  try {
    const role = await currentRole();
    if (!role) return { status: "skip", details: "No role set", role: null };
    const seal = await probeSeal();
    if (seal.servers > 0) {
      if (probeWalrus) {
        try {
          const wal = await probeWalrus();
          if (!wal.ok) return { status: "warn", details: `Seal ok; Walrus unreachable`, role, servers: seal.servers };
        } catch {
          return { status: "warn", details: `Seal ok; Walrus probe failed`, role, servers: seal.servers };
        }
      }
      return { status: "ok", details: `Seal servers=${seal.servers}`, role, servers: seal.servers };
    }
    return { status: "fail", details: "No allowlisted Seal servers", role, servers: 0 };
  } catch (e: any) {
    return { status: "fail", details: e?.message ?? "RBAC test failed", role: await currentRole() };
  }
}


