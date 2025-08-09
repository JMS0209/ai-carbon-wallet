'use client';

import { SuiConnect } from '~~/components/sui/Connect';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { OwnedObjects } from '~~/components/sui/OwnedObjects';

export default function SuiDebugPage() {
  const account = useCurrentAccount();
  return (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Sui dApp Kit Debug</h1>
        <p className="text-sm opacity-70">Powered by @mysten/dapp-kit + @tanstack/react-query</p>
        <SuiConnect />
        {account?.address && (
          <div className="bg-base-100 rounded-xl p-4">
            <h2 className="font-semibold mb-2">Owned Objects</h2>
            <OwnedObjects address={account.address} />
          </div>
        )}
      </div>
    </div>
  );
}


