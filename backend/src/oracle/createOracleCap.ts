import { SuiClient, getFullnodeUrl, TransactionBlock } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Replace with your actual keypair or use wallet adapter
const keypair = Ed25519Keypair.fromSecretKey(/* your secret key buffer */);

const packageId = '0x7f72c5420cc96b4af42bdc98a15663ecaf47d2c1a1dcde343cacb6b69496c447';

async function createOracleCap() {
  const txb = new TransactionBlock();

  txb.moveCall({
    target: `${packageId}::carbon_credit::create_oracle_cap`, // or whatever your function is
    arguments: [], // add signer or other args if needed
  });

  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: { showEffects: true, showObjectChanges: true },
  });

  console.log('✅ OracleCap created:', result.effects?.created);
}

createOracleCap();