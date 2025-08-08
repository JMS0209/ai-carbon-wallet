# UI Migration Documentation

## Overview

This document describes the migration of the AI-Carbon Wallet frontend from a basic Next.js setup to the Scaffold-ETH 2 app shell and styles.

## What Was Migrated

### 1. Package Dependencies
- **Updated package.json** with SE-2 dependencies:
  - `@rainbow-me/rainbowkit` for wallet connection
  - `wagmi` for Ethereum interactions
  - `daisyui` for UI components
  - `next-themes` for dark/light mode
  - `react-hot-toast` for notifications
  - `zustand` for state management

### 2. Configuration Files
- **next.config.js**: Updated with SE-2 webpack configuration
- **postcss.config.js**: Updated to use `@tailwindcss/postcss`
- **tsconfig.json**: Added path aliases for `~~/*` imports
- **tailwind.config.js**: Using SE-2 Tailwind v4 configuration

### 3. App Structure
- **App Router**: Migrated from Pages Router to App Router
- **Layout**: Created `app/layout.tsx` with SE-2 providers
- **Pages**: Created dashboard and placeholder pages
- **Components**: Adopted SE-2 component structure

### 4. Styling
- **globals.css**: Updated with SE-2 Tailwind v4 imports and carbon theme colors
- **Theme**: Green color scheme for carbon/environmental branding
- **Components**: SE-2 styled components with carbon theme

### 5. Components Migrated
- **Header**: SE-2 header with AI-Carbon Wallet branding
- **Footer**: SE-2 footer with custom links
- **ThemeProvider**: Next-themes integration
- **SwitchTheme**: Dark/light mode toggle
- **ScaffoldEthAppWithProviders**: Main app wrapper with providers
- **StatCard**: Custom component for dashboard metrics

### 6. Pages Created
- **Dashboard** (`/dashboard`): Main metrics page with 4 stat cards
- **NFTs** (`/nfts`): Placeholder for NFT management
- **Offsets** (`/offsets`): Placeholder for offset tracking
- **Settings** (`/settings`): Placeholder for app settings
- **Debug** (`/debug`): Placeholder for contract debugging

### 7. Providers
- **WagmiProvider**: Ethereum wallet integration
- **RainbowKitProvider**: Wallet connection UI
- **SignerProvider**: Custom provider for zkLogin integration (placeholder)
- **ThemeProvider**: Dark/light mode support

## Dashboard Metrics

The dashboard displays four key metrics:

1. **Energy Tracking**: Real-time AI energy consumption (kWh)
2. **Carbon NFTs**: Number of Carbon-AI Pack NFTs minted
3. **Offsets Retired**: Total carbon offsets retired (tCO2e)
4. **Integration Status**: System integration overview

## Integration Status

The dashboard shows integration status for:

### Energy Collectors
- CodeCarbon - Ready for integration
- MELODI - Ready for integration
- EcoLogits - Ready for integration
- Slurm acct_gather_energy - Ready for integration

### Blockchain Infrastructure
- Sui Move contracts - Deployed
- Sapphire Oracle - Ready
- Ethereum L2 payments - Ready
- The Graph subgraph - Configured

## Next Steps

### 1. Real Data Integration
- Connect to energy monitoring APIs
- Integrate with Sui blockchain for NFT minting
- Connect to carbon offset providers
- Implement real-time data fetching

### 2. zkLogin Integration
- Complete the SignerProvider implementation
- Add zkLogin authentication flow
- Integrate with Sui zkLogin SDK

### 3. Contract Integration
- Connect to deployed Sui Move contracts
- Implement NFT minting functionality
- Add carbon offset purchasing

### 4. Enhanced UI
- Add charts and graphs for data visualization
- Implement real-time updates
- Add transaction history
- Create detailed NFT and offset management pages

## File Structure

```
frontend/
├── app/
│   ├── layout.tsx              # SE-2 app layout
│   ├── page.tsx                # Home page (redirects to dashboard)
│   ├── dashboard/page.tsx      # Main dashboard
│   ├── nfts/page.tsx          # NFT management
│   ├── offsets/page.tsx       # Offset tracking
│   ├── settings/page.tsx      # App settings
│   └── debug/page.tsx         # Contract debugging
├── components/
│   ├── Header.tsx             # SE-2 header with custom branding
│   ├── Footer.tsx             # SE-2 footer
│   ├── ThemeProvider.tsx      # Next-themes provider
│   ├── SwitchTheme.tsx        # Theme toggle
│   ├── StatCard.tsx           # Dashboard metric cards
│   └── scaffold-eth/          # SE-2 components
├── providers/
│   └── SignerProvider.tsx     # zkLogin integration (placeholder)
├── services/
│   ├── store/store.ts         # Zustand global state
│   └── web3/                  # Wagmi configuration
├── hooks/scaffold-eth/        # SE-2 hooks
├── utils/scaffold-eth/        # SE-2 utilities
└── styles/
    └── globals.css            # SE-2 styles with carbon theme
```

## Environment Variables

Add these to your `.env.local`:

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Running the Application

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.
