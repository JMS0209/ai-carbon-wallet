import { SealClient } from '@mysten/seal';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

export const sealClient = new SealClient({
  suiClient,
  serverObjectIds: ['0xKEY_SERVER_ID_1', '0xKEY_SERVER_ID_2'], // Replace with actual IDs
  verifyKeyServers: true,
});