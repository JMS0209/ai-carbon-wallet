import { id } from 'ethers';
import { sealClient } from '../../oracle-relay/src/sealVerifier';

const secret = new TextEncoder().encode();
const encryptedObject = await sealClient.encrypt({
    threshold: 2,
    packageId: 'placeholder',
    id: 'placeholder',
    data: {kemType, demType, threshold, packageId, id, data, aad, }: { kemType?: KemType; demType?: DemType; threshold: 2; packageId: 'ok'; id: 'yay'; data: Uint8Array; aad?: Uint8Array;},
});
