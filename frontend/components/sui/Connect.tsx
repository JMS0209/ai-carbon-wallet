'use client';

import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

export function SuiConnect() {
  const account = useCurrentAccount();
  return (
    <div className="space-y-2">
      <ConnectButton />
      {account?.address && (
        <div className="text-sm">Connected Sui: <span className="font-mono">{account.address}</span></div>
      )}
    </div>
  );
}


