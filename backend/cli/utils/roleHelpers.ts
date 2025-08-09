import { SuiClient, TransactionBlock } from '@mysten/sui.js/client';

export async function assignRoleOnChain(
  suiClient: SuiClient,
  targetAddress: string,
  role: string
) {
  const txb = new TransactionBlock();
  const method = role === 'oracle' ? 'add_oracle' : 'add_admin';

  txb.moveCall({
    target: `0xYourPackageId::RoleAccess::${method}`,
    arguments: [
      txb.object('0xYourRoleObjectId'),
      txb.pure(targetAddress, 'address'),
    ],
  });

  txb.setSender('0xYourAdminAddress');
  await suiClient.signAndExecuteTransactionBlock({ transactionBlock: txb });
}


export async function revokeRoleOnChain(
  suiClient: SuiClient,
  targetAddress: string,
  role: string
) {
  const txb = new TransactionBlock();
  const method = role === 'oracle' ? 'remove_oracle' : 'remove_admin';

  txb.moveCall({
    target: `0xYourPackageId::RoleAccess::${method}`,
    arguments: [
      txb.object('0xYourRoleObjectId'),
      txb.pure(targetAddress, 'address'),
    ],
  });

  txb.setSender('0xYourAdminAddress');
  await suiClient.signAndExecuteTransactionBlock({ transactionBlock: txb });
}

export async function checkRoleOnChain(
  suiClient: SuiClient,
  targetAddress: string,
  role: string
): Promise<boolean> {
  const txb = new TransactionBlock();
  const method = role === 'oracle' ? 'is_oracle' : 'is_admin';

  txb.moveCall({
    target: `0xYourPackageId::RoleAccess::${method}`,
    arguments: [
      txb.object('0xYourRoleObjectId'),
      txb.pure(targetAddress, 'address'),
    ],
  });

  const result = await suiClient.devInspectTransactionBlock({
    sender: targetAddress,
    transactionBlock: txb,
  });

  const returnVal = result.results?.[0]?.returnValues?.[0]?.[0];
  return returnVal === true;
}
