import { SuiClient } from '@mysten/sui.js/client';
import { getSuiClient } from '../utils/suiClient';
import { assignRoleOnChain } from '../utils/roleHelpers';

export async function assignRole(opts: { address: string; role: string }) {
  const suiClient: SuiClient = getSuiClient();
  const { address, role } = opts;

  console.log(`🔐 Assigning role '${role}' to ${address}...`);
  await assignRoleOnChain(suiClient, address, role);
  console.log(`✅ Role '${role}' assigned to ${address}`);
}
