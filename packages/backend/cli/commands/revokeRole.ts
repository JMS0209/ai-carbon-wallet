import { SuiClient } from '@mysten/sui.js/client';
import { getSuiClient } from '../utils/suiClient';
import { revokeRoleOnChain } from '../utils/roleHelpers';

export async function revokeRole(opts: { address: string; role: string }) {
  const suiClient: SuiClient = getSuiClient();
  const { address, role } = opts;

  console.log(`🗑️ Revoking role '${role}' from ${address}...`);
  await revokeRoleOnChain(suiClient, address, role);
  console.log(`✅ Role '${role}' revoked from ${address}`);
}