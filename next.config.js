/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  env: {
    NEXT_PUBLIC_SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_SALT_API: process.env.NEXT_PUBLIC_SALT_API,
    NEXT_PUBLIC_PROVER_API: process.env.NEXT_PUBLIC_PROVER_API,
  },
  sapphire: {
    rpcUrl: "https://sapphire.oasis.io/rpc"
  },
}

export default nextConfig
