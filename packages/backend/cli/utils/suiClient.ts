import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

export function getSuiClient(): SuiClient {
  return new SuiClient({ url: getFullnodeUrl('mainnet') });
}
