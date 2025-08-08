"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllowedRoles, setRole, currentRole, AllowedRole } from "~~/services/rbac/roles";
import { encryptAndPersist } from "~~/services/rbac/sealStore";
import { assertDevMode, derivePublicFromPrivateHexEvm } from "~~/services/rbac/devKey";

export default function RoleSetupPage() {
  const router = useRouter();
  const roles = useMemo(() => getAllowedRoles(), []);
  const [selected, setSelected] = useState<AllowedRole | null>(null);
  const [devKey, setDevKey] = useState("");
  const [status, setStatus] = useState<string>("");
  const isDev = String(process.env.NEXT_PUBLIC_RBAC_DEV_MODE || "false") === "true";

  useEffect(() => {
    currentRole().then(r => {
      if (r) router.push("/dashboard");
    });
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;

    try {
      setStatus("Preparing proof reference...");
      let payload: any = { role: selected, ts: Date.now() };

      if (selected === "SIGNER" && isDev) {
        assertDevMode();
        if (!devKey.trim()) throw new Error("Private key required in dev mode for SIGNER");
        const derived = derivePublicFromPrivateHexEvm(devKey);
        // simple challenge proof stub; in production use wallet signature flow
        payload.signer = { evmAddress: derived.address };
      }

      if (selected === "BUYER") {
        // For now, accept that user will connect a wallet later; we store the intent
        payload.buyer = { note: "wallet proof deferred" };
      }

      const ref = await encryptAndPersist(JSON.stringify(payload));
      setRole(selected, { serverObjectIds: ref.serverObjectIds, walrusCid: ref.walrusCid, createdAt: Date.now() });
      setStatus("Saved. Redirecting...");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (e: any) {
      setStatus(e?.message || "Failed to set role");
    }
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-base-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Select Your Role</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            {roles.map(r => (
              <label key={r} className={`btn ${selected === r ? "btn-primary" : "btn-outline"}`}>
                <input type="radio" name="role" className="hidden" onChange={() => setSelected(r)} />
                {r}
              </label>
            ))}
          </div>

          {selected === "SIGNER" && isDev && (
            <div className="mt-4">
              <label className="label">
                <span className="label-text">Paste private key (dev only; never stored)</span>
              </label>
              <input
                value={devKey}
                onChange={e => setDevKey(e.target.value)}
                type="password"
                placeholder="0x..."
                className="input input-bordered w-full"
              />
              <p className="text-sm opacity-70 mt-2">We will derive the public address client-side and only store a sealed proof reference.</p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={!selected}>Continue</button>
            <span className="opacity-70">{status}</span>
          </div>
        </form>
      </div>
    </div>
  );
}


