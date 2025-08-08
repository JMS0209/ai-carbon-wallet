import { SuiClient, SuiTransactionBlock } from '@mysten/sui/client';

export async function verifyOracleRole(
  suiClient: SuiClient,
  roleObjectId: string,
  signerAddress: string,
  packageId: string
): Promise<boolean> {
  const txb = new SuiTransactionBlock();
  txb.moveCall({
    target: `${packageId}::RoleAccess::is_oracle`,
    arguments: [
      txb.object(roleObjectId),
      txb.pure(signerAddress, 'address'),
    ],
  });

  const result = await suiClient.devInspectTransactionBlock({
    sender: signerAddress,
    transactionBlock: txb,
  });

  const returnVal = result.results?.[0]?.returnValues?.[0]?.[0];
  return returnVal === true;
}