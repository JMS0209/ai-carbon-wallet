import {
  generateNonce,
  generateRandomness,
  Ed25519Keypair,
  SuiClient,
} from '@mysten/sui/zklogin';

const FULLNODE_URL = 'https://fullnode.devnet.sui.io'; // or your preferred RPC

export async function createZkLoginSession() {
  const suiClient = new SuiClient({ url: FULLNODE_URL });
  const { epoch } = await suiClient.getLatestSuiSystemState();
  const maxEpoch = Number(epoch) + 2;

  const ephemeralKeyPair = new Ed25519Keypair();
  const randomness = generateRandomness();
  const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

  return {
    ephemeralKeyPair,
    nonce,
    maxEpoch,
    randomness,
  };
}
