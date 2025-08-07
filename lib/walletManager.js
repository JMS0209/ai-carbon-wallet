import { Wallet } from 'ethers';
import fs from 'fs';
import path from 'path';

const burnerPath = path.resolve(process.cwd(), 'burner.json');

export function getOrCreateBurnerWallet() {
  if (fs.existsSync(burnerPath)) {
    const { privateKey } = JSON.parse(fs.readFileSync(burnerPath, 'utf8'));
    return new Wallet(privateKey);
  } else {
    const wallet = Wallet.createRandom();
    fs.writeFileSync(burnerPath, JSON.stringify({ privateKey: wallet.privateKey }));
    return wallet;
  }
}
