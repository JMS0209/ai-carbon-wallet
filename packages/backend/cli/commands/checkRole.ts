import { SuiClient } from '@mysten/sui.js/client';
import { getSuiClient } from '../utils/suiClient';
import { checkRoleOnChain } from '../utils/roleHelpers';

export async function checkRole(opts: { address: string; role: string }) {
  const suiClient: SuiClient = getSuiClient();
  const { address, role } = opts;

  const hasRole = await checkRoleOnChain(suiClient, address, role);
  console.log(`🔍 ${address} ${hasRole ? '✅ has' : '❌ does not have'} role '${role}'`);
}
