import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { toBase64 } from '@mysten/sui/utils';

const keypair = Ed25519Keypair.generate();
const fullSecretKey = keypair.getSecretKey(); // ✅ 64-byte Uint8Array
const secretKeyB64 = toBase64(fullSecretKey);    // ✅ string

console.log('🔑 Your base64 secret key:', secretKeyB64);