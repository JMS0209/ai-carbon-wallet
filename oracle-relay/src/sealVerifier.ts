import { getAllowlistedKeyServers, SealClient } from '@mysten/seal';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const serverObjectIds = getAllowlistedKeyServers('testnet');

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

export const sealClient = new SealClient({
  suiClient,
  serverConfigs: serverObjectIds.map((id) => ({
  objectId: id,
  weight: 1,
  verifyKeyServers: true,
  }))
});