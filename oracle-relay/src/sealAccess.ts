import { sealClient } from './sealVerifier';

export async function requestPrivateKey(identity: string): Promise<Uint8Array | null> {
  try {
    const privateKey = await sealClient.fetchKeys(identity);
    return privateKey;
  } catch (err) {
    console.error('❌ Seal access denied or failed:', err);
    return null;
  }
}
