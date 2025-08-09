'use client';

import { useSuiClientQuery } from '@mysten/dapp-kit';

export function OwnedObjects({ address }: { address: string }) {
  const { data, isLoading, error } = useSuiClientQuery('getOwnedObjects', { owner: address });
  if (isLoading) return <div className="text-sm opacity-70">Loading objects…</div>;
  if (error) return <div className="text-sm text-error">Error loading objects</div>;
  const list = data?.data ?? [];
  return (
    <ul className="text-sm space-y-1">
      {list.map((o: any) => (
        <li key={o.data?.objectId} className="font-mono">{o.data?.objectId}</li>
      ))}
    </ul>
  );
}


