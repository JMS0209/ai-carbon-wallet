export const getBlockExplorerUrl = (chainId: number, hash: string) => {
  return `https://etherscan.io/tx/${hash}`;
};
