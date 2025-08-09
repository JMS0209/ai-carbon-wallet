import { Transaction } from '@mysten/sui/transactions';
import { ORACLE_CAP_ID } from './oracleConfig';

const tx = new Transaction();
tx.moveCall({
  target: 'carbon_credit::oracle::verify_credit',
  arguments: [
    tx.object(ORACLE_CAP_ID),
    tx.object(creditId),
    tx.pure('Verified via registry XYZ'),
  ],
});
await suiClient.signAndExecuteTransactionBlock({ transactionBlock: tx });
