import { WalrusClient } from '@mysten/walrus';

const walrus = new WalrusClient({ apiKey: process.env.WALRUS_API_KEY });

export async function getSecret(key: string): Promise<string> {
  const secret = await walrus.getSecret(key);
  return secret.value;
}

export async function storeSecret(key: string, value: string): Promise<void> {
  await walrus.storeSecret(key, value);
}
