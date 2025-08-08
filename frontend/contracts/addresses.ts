// Contract addresses configuration
// All addresses are read from environment variables

export const addresses = {
  oracleReceiver: process.env.NEXT_PUBLIC_ORACLE_RECEIVER_ADDRESS as `0x${string}` | undefined,
  usdc: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` | undefined,
  chainId: Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID || '84532'),
} as const;

export const isConfigured = {
  oracleReceiver: !!addresses.oracleReceiver,
  usdc: !!addresses.usdc,
  chainId: addresses.chainId > 0,
} as const;
