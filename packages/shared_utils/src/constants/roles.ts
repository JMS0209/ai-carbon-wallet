export const ROLES = {
  BUYER: 'buyer',
  VERIFIER: 'verifier',
  ORACLE_SIGNER: 'oracle-signer',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];