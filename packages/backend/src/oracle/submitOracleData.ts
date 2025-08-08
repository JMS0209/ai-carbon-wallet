import { verifyOracleRole } from '@mysten/sui/client';
import { suiClient } from '@/lib/sui';
import { signerAddress } from '@/lib/wallet';
import { roleObjectId, packageId } from '@/constants/sui';

async function checkAuthorization() {
  const isAuthorized = await verifyOracleRole(
    suiClient,
    roleObjectId,
    signerAddress,
    packageId
  );

  if (!isAuthorized) {
    throw new Error('Unauthorized signer');
  }
}