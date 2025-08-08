export interface UserKeyData {
  randomness: string;
  nonce: string;
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
  maxEpoch: number;
}

export interface LoginResponse {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface GetSaltRequest {
  subject: string;
  jwt: string;
}

export interface ZKPRequest {
  jwt: string;
  extendedEphemeralPublicKey: string;
  maxEpoch: string;
  jwtRandomness: string;
  salt: string;
  keyClaimName: string;
}

export interface ZKPPayload {
  proofPoints: {
    a: string[];
    b: string[][];
    c: string[];
  };
  issBase64Details: {
    value: string;
    indexMod4: number;
  };
  headerBase64: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userAddress: string | null;
  userKeyData: UserKeyData | null;
  zkProof: any | null;
  isLoading: boolean;
}
