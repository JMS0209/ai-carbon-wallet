"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "~~/components/ProtectedRoute";
import { WithRoleGuard } from "~~/providers/withRoleGuard";
import { useAccount } from 'wagmi';
import { getTokenMeta, getBalances, getAllowance, approveIfNeeded, purchaseOffset } from "~~/services/payments";
import { formatUnits } from 'viem';

export default function OffsetsPage() {
  const { address } = useAccount();
  const [meta, setMeta] = useState<{ symbol: string; decimals: number } | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [amount, setAmount] = useState<string>("10"); // USDC units (decimal-aware)
  const [jobId, setJobId] = useState<string>(() => `demo-${Date.now()}`);
  const [busy, setBusy] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const m = await getTokenMeta();
        setMeta(m);
        if (address) {
          const b = await getBalances(address);
          setBalance(b.usdcBalance);
          const a = await getAllowance(address);
          setAllowance(a.allowance);
        }
      } catch (e) {
        // ignore read errors
      }
    })();
  }, [address]);
  return (
    <ProtectedRoute>
      <WithRoleGuard>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">USDC Offsets</h1>

          <div className="bg-base-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Read</h2>
            <div className="text-sm">Token: {meta ? `${meta.symbol} (decimals ${meta.decimals})` : '...'}</div>
            <div className="text-sm">Balance: {meta ? formatUnits(balance, meta.decimals) : '...'} {meta?.symbol}</div>
            <div className="text-sm">Allowance: {meta ? formatUnits(allowance, meta.decimals) : '...'} {meta?.symbol}</div>
          </div>

          <div className="bg-base-100 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-3">Actions (dev)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="label"><span className="label-text">Amount ({meta?.symbol || 'USDC'})</span></label>
                <input className="input input-bordered w-full" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div>
                <label className="label"><span className="label-text">Job ID</span></label>
                <input className="input input-bordered w-full" value={jobId} onChange={e => setJobId(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button className="btn" disabled={!address || busy==='approve'} onClick={async () => {
                  if (!meta || !address) return;
                  setBusy('approve');
                  const required = parseUnits(amount || '0', meta.decimals);
                  const res = await approveIfNeeded({ owner: address, requiredAmount: required });
                  setBusy('');
                  alert(res.hash ? `Approve tx: ${res.hash}` : 'Allowance sufficient');
                  const a = await getAllowance(address);
                  setAllowance(a.allowance);
                }}>Approve USDC</button>
                <button className="btn btn-primary" disabled={!address || busy==='buy'} onClick={async () => {
                  if (!meta) return;
                  setBusy('buy');
                  const value = parseUnits(amount || '0', meta.decimals);
                  const res = await purchaseOffset({ amount: value, carbonCredits: value, jobId });
                  setBusy('');
                  alert(`Purchase tx: ${res.hash}`);
                }}>Purchase Offsets</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </WithRoleGuard>
    </ProtectedRoute>
  );
}


