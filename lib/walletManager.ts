import { Wallet } from 'ethers';
import fs from 'fs';
import path from 'path';

const burnerPath: string = path.resolve(process.cwd(), 'burner.json');

interface BurnerData {
  privateKey: string;
}

/**
 * Retrieves an existing burner wallet from disk or creates a new one.
 * 
 * @returns An ethers Wallet instance.
 */
export function getOrCreateBurnerWallet(): Wallet {
  if (fs.existsSync(burnerPath)) {
    const fileContent: string = fs.readFileSync(burnerPath, 'utf8');
    const { privateKey }: BurnerData = JSON.parse(fileContent);
    return new Wallet(privateKey);
  } else {
    const wallet: Wallet = Wallet.createRandom();
    const data: BurnerData = { privateKey: wallet.privateKey };
    fs.writeFileSync(burnerPath, JSON.stringify(data, null, 2));
    return wallet;
  }
}
