# Quick Start Guide - zkLogin Integration

## TL;DR - Get Running in 5 Minutes

### 1. Setup
```bash
git checkout yiming
npm install
```

### 2. Environment
Create `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=595966210064-3nnnqvmaelqnqsmq448kv05po362smt2.apps.googleusercontent.com
NEXT_PUBLIC_SUI_NETWORK=https://rpc.testnet.sui.io:443
NEXT_PUBLIC_SALT_API=https://salt.api.mystenlabs.com/get_salt
NEXT_PUBLIC_PROVER_API=https://prover.mystenlabs.com/v1
```

### 3. Run
```bash
npm run dev
```

### 4. Test
- Open http://localhost:3000
- Click "Login with Google"
- Complete OAuth flow
- See your Sui address and ZK proof

## What Was Added

### Core Files
- `app/` - Complete Next.js application
- `app/api/` - Salt generation and ZK proof APIs
- `app/lib/storage.ts` - SQLite database for user data
- New dependencies: @mysten/sui, jwt-decode, better-sqlite3

### Database
- SQLite replaces Vercel KV
- Stores user salts and ZK proofs
- Auto-created at `./zklogin.db`

### Authentication Flow
1. Google OAuth → JWT token
2. Generate user salt via Mysten Labs API
3. Derive Sui address from JWT + salt
4. Create zero-knowledge proof
5. Display results to user

## Key Changes Made
- Migrated from @mysten/sui.js to @mysten/sui v1.0.0
- Added Next.js 14 app directory structure
- Implemented SQLite storage layer
- Created modern UI with Tailwind CSS
- Fixed TypeScript configuration for Next.js
- Added proper error handling and loading states

## Troubleshooting
- **Styles not working?** Check Tailwind config
- **Build errors?** Ensure backend files are excluded in tsconfig.json
- **OAuth issues?** Verify Google Client ID in .env.local
- **Database errors?** Check file permissions for SQLite

For detailed documentation, see `docs/ZKLOGIN_INTEGRATION.md`
