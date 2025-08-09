import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const provider = new SuiClient({
  url: getFullnodeUrl('testnet'), // or 'mainnet' if you're on mainnet
});

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

const signerAddress = '0xed0a425bd5906684bd77be372ee98e9603f44208f5a46b3b427d4ee90dcf4d7b';



const txBlock = await provider.getTransactionBlock({
  digest: "yoG3kLSJ3RXQo1EtdiyPgAznozukKi11KXztfX5oh2J",
  options: {
    showInput: true,
    showEvents: true,
    showEffects: true,
    showObjectChanges: true,
    showBalanceChanges: true,
  },
});
console.log(JSON.stringify(txBlock, null, 2));











async function debugOwnedObjects() {
  const response = await client.getOwnedObjects({ owner: signerAddress });

  console.log('🔍 Owned object types:\n');

  for (const objRef of response.data) {
    const objectId = objRef.data?.objectId;
    if (!objectId) continue;

    const fullObject = await client.getObject({
  id: objectId,
  options: { showType: true, showContent: true }
});


    const type = fullObject.data?.type;
    if (type) {
      console.log(`✅ ${objectId} — ${type}`);
    } else {
      console.log(`⚠️ No type info for object ${objectId}`);
    }
  }
}

async function fetchOracleCapId() {
  const { data } = await client.getOwnedObjects({ owner: signerAddress });

  const cap = data.find(obj =>
    obj.data?.type?.includes('OracleCap')
  );

  if (!cap) {
    throw new Error('❌ OracleCap not found for this address');
  }

  console.log('✅ OracleCap ID:', cap.data?.objectId);
}

// 👇 Choose which function to run:
//debugOwnedObjects();
// fetchOracleCapId();
