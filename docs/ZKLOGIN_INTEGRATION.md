# zkLogin Integration Documentation

## Overview
This document describes the integration of zkLogin authentication module into the ai-carbon-wallet project. The zkLogin functionality provides zero-knowledge authentication using Google OAuth and Sui blockchain technology.

## Changes Made to the Project

### 1. Project Structure Additions

#### New Directories and Files Created:
```
app/                          # Next.js app directory (new)
├── layout.tsx               # Root layout component
├── page.tsx                 # Main landing page with Google OAuth
├── auth/
│   └── page.tsx            # OAuth callback handler and results display
├── api/
│   ├── userinfo/get/salt/
│   │   └── route.ts        # API endpoint for salt generation
│   └── zkp/get/
│       └── route.ts        # API endpoint for ZK proof generation
├── components/
│   ├── ClientLayout.tsx    # Client-side layout wrapper
│   └── GoogleOAuthButton.tsx # Google OAuth button component
├── hooks/
│   └── useSui.tsx          # Custom hook for Sui client
├── lib/
│   └── storage.ts          # SQLite storage implementation
├── types/
│   └── zklogin.ts          # TypeScript type definitions
└── globals.css             # Global styles with Tailwind
```

### 2. Package Dependencies Added

#### Core zkLogin Dependencies:
```json
{
  "@mysten/sui": "^1.0.0",
  "@mysten/bcs": "^1.0.0",
  "jwt-decode": "^4.0.0",
  "bigint-buffer": "^1.1.5",
  "axios": "^1.6.0"
}
```

#### Database and UI Dependencies:
```json
{
  "better-sqlite3": "^9.2.2",
  "@types/better-sqlite3": "^7.6.8",
  "react-loader-spinner": "^6.1.6"
}
```

#### Next.js Framework:
```json
{
  "next": "14.2.31",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0"
}
```

### 3. Configuration Files Modified

#### TypeScript Configuration (`tsconfig.json`):
- Updated to exclude backend, contracts, and oracle directories
- Configured for Next.js app directory structure
- Added proper include/exclude patterns

#### Next.js Configuration (`next.config.js`):
- Added webpack externals for compatibility
- Configured environment variables for APIs
- Set up proper module resolution

#### Tailwind CSS Configuration (`tailwind.config.js`):
- Updated content paths for Next.js app directory
- Configured for proper CSS compilation

### 4. Environment Variables Required

Create a `.env.local` file with the following variables:
```bash
# Google OAuth Client ID (required for zkLogin)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Sui Network URL
NEXT_PUBLIC_SUI_NETWORK=https://rpc.testnet.sui.io:443

# Mysten Labs APIs for zkLogin
NEXT_PUBLIC_SALT_API=https://salt.api.mystenlabs.com/get_salt
NEXT_PUBLIC_PROVER_API=https://prover.mystenlabs.com/v1
```

## Technical Architecture

### 1. Authentication Flow
1. **Landing Page**: User clicks "Login with Google" button
2. **OAuth Redirect**: User is redirected to Google OAuth consent screen
3. **Callback Handling**: JWT token is received and processed
4. **Salt Generation**: User salt is generated and stored via Mysten Labs API
5. **Address Derivation**: Sui address is derived from JWT and salt
6. **ZK Proof Generation**: Zero-knowledge proof is created for the user
7. **Result Display**: User sees their Sui address, salt, and proof status

### 2. Database Storage
- **SQLite Database**: Local storage replacing Vercel KV
- **Storage Location**: `zklogin.db` in project root
- **Data Stored**: User salts, ephemeral keypairs, ZK proofs
- **Storage Implementation**: Custom SQLiteKV class in `app/lib/storage.ts`

### 3. API Endpoints
- **Salt Generation**: `/api/userinfo/get/salt` - Generates and stores user salt
- **ZK Proof**: `/api/zkp/get` - Creates zero-knowledge proof for authentication

## How to Run the Project

### Prerequisites
1. **Node.js**: Version 18+ required
2. **Google OAuth Setup**: 
   - Create a Google Cloud Project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins

### Installation Steps

1. **Clone and Navigate**:
   ```bash
   git clone <repository-url>
   cd ai-carbon-wallet
   git checkout yiming  # Switch to the zkLogin branch
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Google OAuth Client ID
   ```

4. **Database Setup**:
   ```bash
   # SQLite database will be created automatically on first run
   # Location: ./zklogin.db
   ```

5. **Development Server**:
   ```bash
   npm run dev
   ```

6. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

### Accessing the Application
- **Development**: http://localhost:3000
- **Landing Page**: Main page with Google OAuth login
- **Auth Results**: http://localhost:3000/auth (after OAuth callback)

## Key Features

### 1. Zero-Knowledge Authentication
- **Google OAuth Integration**: Seamless login with Google accounts
- **Sui Address Generation**: Deterministic address creation from JWT
- **Privacy Preserving**: No Google account information stored on blockchain

### 2. Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Card-Based Layout**: Clean, modern interface design
- **Loading States**: Proper loading indicators for async operations
- **Copy to Clipboard**: Easy copying of addresses and proofs

### 3. Robust Error Handling
- **Network Error Handling**: Graceful handling of API failures
- **Validation**: Proper JWT and proof validation
- **User Feedback**: Clear error messages and success indicators

## Troubleshooting

### Common Issues

1. **Styles Not Loading**:
   - Ensure Tailwind CSS is properly configured
   - Check content paths in `tailwind.config.js`
   - Verify global styles are imported

2. **Database Errors**:
   - Ensure write permissions in project directory
   - Check SQLite installation: `npm install better-sqlite3`

3. **OAuth Errors**:
   - Verify Google Client ID in `.env.local`
   - Check OAuth redirect URIs in Google Cloud Console
   - Ensure domain is authorized

4. **Build Failures**:
   - Ensure TypeScript configuration excludes backend files
   - Check for import path issues
   - Verify all dependencies are installed

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Rotate Google OAuth credentials regularly
3. **Database**: SQLite file should be in `.gitignore`
4. **HTTPS**: Use HTTPS in production for OAuth callbacks

## Future Enhancements

1. **Multi-Provider Support**: Add support for other OAuth providers
2. **Session Management**: Implement proper session handling
3. **User Profile**: Add user profile management features
4. **Wallet Integration**: Connect with existing wallet functionality
5. **Error Analytics**: Add error tracking and monitoring

## Contact and Support

For questions or issues related to this zkLogin integration, please:
1. Check this documentation first
2. Review the code comments in the implementation
3. Test with the provided development setup
4. Contact the development team with specific error messages

---

**Last Updated**: August 6, 2025  
**Version**: 1.0.0  
**Branch**: yiming  
**Maintainer**: Development Team
