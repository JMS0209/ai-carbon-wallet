import { SealClient } from '@mysten/seal';
import { WalrusClient } from '@mysten/walrus';
import { SuiClient } from '@mysten/sui.js/client';

export async function decryptSecret(identity: string, secretKey: string): Promise<string> {
  const suiClient = new SuiClient({ url: process.env.SUI_RPC_URL });

  const sealClient = new SealClient({
    suiClient,
    serverObjectIds: ['0xKEY_SERVER_ID_1', '0xKEY_SERVER_ID_2'],
    verifyKeyServers: true,
  });

  const walrus = new WalrusClient({ apiKey: process.env.WALRUS_API_KEY });

  const privateKey = await sealClient.requestPrivateKey(identity);
  const encrypted = await walrus.getSecret(secretKey);

  const decrypted = await sealClient.decryptEncryptedObject(encrypted.encryptedObject, privateKey);
  return new TextDecoder().decode(decrypted);
}