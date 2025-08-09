import { Transaction } from '@mysten/sui/transactions';

const tx = new Transaction();

// Create a new coin with balance 100, based on the coins used as gas payment.
// You can define any balance here.
const [coin] = tx.splitCoins(tx.gas, [tx.pure('u64', 100)]);

// Transfer the split coin to a specific address.
tx.transferObjects([coin], tx.pure('address', '0xSomeSuiAddress'));