# AI Carbon Wallet - zkLogin Authentication Module

## Overview

This project has successfully integrated zkLogin (Zero Knowledge Login) functionality, enabling users to perform secure Web3 authentication through Google OAuth.

## Key Features

1. **Zero-Knowledge Authentication**: Using zkLogin technology, users can log in through Google accounts while protecting privacy
2. **Sui Blockchain Integration**: Deep integration with Sui network, supporting on-chain operations
3. **Local Data Storage**: Using SQLite database to store user data and proofs

## Project Structure

```
app/
├── page.tsx                 # Main login page
├── auth/
│   └── page.tsx            # Authentication handler page
├── api/
│   ├── userinfo/get/salt/  # Get user salt API
│   └── zkp/get/            # Get zero-knowledge proof API
├── hooks/
│   └── useSui.ts           # Sui client hook
├── lib/
│   └── sqlite-kv.ts        # SQLite key-value storage
└── types/
    └── zklogin.ts          # zkLogin type definitions
```

## Starting the Application

### Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use dedicated zkLogin development script
npm run zklogin:dev
```

### Environment Configuration

Configure the following variables in `.env.local` file:

```bash
# Google OAuth Client ID (required for zkLogin)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=595966210064-3nnnqvmaelqnqsmq448kv05po362smt2.apps.googleusercontent.com

# Sui Network URL
NEXT_PUBLIC_SUI_NETWORK=https://rpc.testnet.sui.io:443

# Mysten Labs APIs for zkLogin
NEXT_PUBLIC_SALT_API=https://salt.api.mystenlabs.com/get_salt
NEXT_PUBLIC_PROVER_API=https://prover.mystenlabs.com/v1
```

## Usage Flow

1. **Access Homepage**: Open `http://localhost:3000`
2. **Google Login**: Click "Continue with Google" button
3. **Authentication**: Complete Google OAuth flow
4. **Generate Proof**: System automatically generates zero-knowledge proof
5. **Get Address**: Display user's Sui blockchain address

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Blockchain**: Sui Network, @mysten/sui
- **Authentication**: zkLogin, Google OAuth
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## API Endpoints

### Get User Salt
- **URL**: `/api/userinfo/get/salt`
- **Method**: POST
- **Description**: Get user's unique salt value for address generation

### Get Zero-Knowledge Proof
- **URL**: `/api/zkp/get`
- **Method**: POST
- **Description**: Generate or retrieve user's zero-knowledge proof

## Data Storage

The project uses SQLite database (`zklogin.db`) to store:
- User salt values
- Zero-knowledge proofs
- Other temporary data

## Security

- Uses zero-knowledge proof technology to protect user privacy
- Ephemeral keypairs are generated and stored locally
- Supports forced proof update mechanism

## Important Notes

1. Ensure Google OAuth Client ID is properly configured
2. Use testnet in development environment
3. Production environment requires correct redirect URI configuration
4. SQLite database file will be automatically created in project root

## Troubleshooting

If you encounter issues:
1. Check environment variable configuration
2. Confirm network connection
3. Check browser console error messages
4. Review server logs
