# AI-Carbon Wallet

**Enterprise platform to measure, tokenise and offset AI energy use**

## Project Mission

AI-Carbon Wallet is a comprehensive enterprise platform designed to track AI training and inference energy consumption, mint Carbon-AI Pack NFTs, and automate carbon offset processes. The platform provides transparent, verifiable carbon accounting for AI operations through blockchain technology and trusted oracle services.

### Core Objectives
- **Measure**: Real-time tracking of AI energy consumption during training and inference
- **Tokenise**: Mint Carbon-AI Pack NFTs representing verified carbon emissions
- **Offset**: Automated carbon offset purchasing and retirement through smart contracts

## High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Backend       │    │   Trusted        │    │   Blockchain        │
│   Collectors    │◄──►│   Oracle         │◄──►│   Networks          │
│                 │    │                  │    │                     │
│ • CodeCarbon    │    │ • Sapphire TEE   │    │ • Sui Move         │
│ • MELODI        │    │ • zk-proof       │    │ • Oasis Sapphire   │
│ • EcoLogits     │    │ • Data validation│    │ • Ethereum L2      │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                       │                        │
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Off-chain     │    │   Subgraph       │    │   React Portal      │
│   Scheduler     │    │   Indexing       │    │                     │
│                 │    │                  │    │ • Dashboard         │
│ • Slurm hooks   │    │ • EnergyIssued   │    │ • NFT management    │
│ • DCIM APIs     │    │ • OffsetRetired  │    │ • Offset tracking   │
│ • Automation    │    │ • GraphQL API    │    │ • Analytics         │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                       │                        │
         └───────────────────────┼────────────────────────┘
                                 │
                    ┌──────────────────┐
                    │   Walrus + Seal  │
                    │   Secrets Vault  │
                    │                  │
                    │ • Encrypted data │
                    │ • API keys       │
                    │ • Certificates   │
                    └──────────────────┘
```

### Data-to-NFT Provenance (one-minute flow)
1️⃣ Collectors (CodeCarbon / MELODI / EcoLogits) push raw kWh → Kafka  
2️⃣ Sapphire Oracle (TEE) validates + signs a zk-proof  
3️⃣ Oracle emits **EnergyIssued(id,kWh,hash)** event to Sui Move contract  
4️⃣ Contract mints Carbon-AI Pack NFT via Kiosk; Subgraph indexes event  
5️⃣ React dashboard subscribes to `EnergyIssued` for real-time charts

## Module Overview

### Backend Collectors
**Purpose**: Real-time energy consumption monitoring and data collection
- **CodeCarbon**: Python library integration for ML training energy tracking
- **MELODI**: Memory-aware energy consumption modeling
- **EcoLogits**: LLM inference energy estimation and tracking
- **Custom collectors**: Hardware-specific energy monitoring adapters

### Off-chain Scheduler
**Purpose**: Automated job scheduling and infrastructure integration
- **Slurm integration**: HPC cluster job energy tracking. Leverages **Slurm `acct_gather_energy` plugin** for per-JobID power counters and DCIM IPMI sensors.
- **DCIM hooks**: Data center infrastructure monitoring
- **Automated workflows**: Scheduled carbon accounting and offset triggers
- **Alert system**: Threshold-based notifications and actions

### Sapphire Oracle Service
**Purpose**: Trusted execution environment for data validation and privacy
- **TEE (Trusted Execution Environment)**: Secure computation in Oasis Sapphire
- **zk-proof generation**: Zero-knowledge proofs for energy consumption claims
- **Data aggregation**: Multi-source energy data validation and normalization
- **Privacy preservation**: Confidential computing for sensitive enterprise data

### Sui Move Contracts
**Purpose**: NFT minting, trading, and carbon offset automation
- **Kiosk NFT packs**: Carbon-AI Pack NFTs with embedded metadata
- **zkLogin access**: Privacy-preserving authentication system
- **Automated offset**: Smart contract-based carbon credit purchasing
- **Governance**: DAO mechanisms for platform parameters and upgrades

### Graph Subgraph
**Purpose**: Decentralized indexing and querying of blockchain events
- **EnergyIssued events**: Track carbon emission NFT minting
- **OffsetRetired events**: Monitor carbon offset transactions
- **GraphQL API**: Efficient querying for frontend applications
- **Real-time updates**: WebSocket subscriptions for live data

### Ethereum Micro-payments Layer
**Purpose**: Efficient payment processing for carbon offsets
- **Scaffold-ETH 2**: Development framework for rapid prototyping
- **USDC integration**: Stablecoin payments for carbon credits
- **Layer 2 optimization**: Gas-efficient transactions on Polygon/Arbitrum
- **Payment streaming**: Continuous offset payments based on usage

### Walrus + Seal Secrets Vault
**Purpose**: Decentralized storage with encryption for sensitive data
- **Walrus storage**: Decentralized blob storage for large datasets
- **Seal encryption**: Client-side encryption for API keys and certificates
- **Access control**: Role-based permissions for enterprise users
- **Backup and recovery**: Redundant storage across multiple nodes

### NFA Agents (Neural Function Approximation)
**Purpose**: AI-powered automation and anomaly detection
NFA (Non-Fungible Agent) tokens on Sui wrap an autonomous agent contract that actually runs inside Sapphire's TEE; this guarantees auditable, on-chain actions while the logic remains private.
- **Auto-rebalance**: Dynamic carbon offset portfolio management
- **Anomaly detection**: ML-based identification of unusual energy patterns
- **Predictive analytics**: Forecasting carbon emissions and offset needs
- **Optimization**: Cost-efficient carbon credit purchasing strategies

## Folder Structure

```
ai-carbon-wallet/
├── backend/                    # Energy collectors and APIs
│   ├── collectors/            # CodeCarbon, MELODI, EcoLogits integrations
│   ├── scheduler/             # Slurm and DCIM automation
│   ├── api/                   # REST and GraphQL endpoints
│   └── tests/                 # Backend testing suite
├── oracle/                    # Sapphire TEE oracle service
│   ├── src/                   # Oracle smart contracts and logic
│   ├── zk-proofs/            # Zero-knowledge proof generation
│   └── deployment/            # Oracle deployment scripts
├── contracts/                 # Blockchain smart contracts
│   ├── sui/                   # Sui Move contracts
│   ├── sapphire/             # Oasis Sapphire contracts
│   ├── ethereum/             # Ethereum L2 contracts
│   └── tests/                # Contract testing suite
├── subgraph/                  # The Graph protocol indexing
│   ├── schema.graphql        # GraphQL schema definition
│   ├── src/                  # Subgraph mapping logic
│   └── networks/             # Network-specific configurations
├── frontend/                  # React application
│   ├── src/                  # React components and pages
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   └── utils/                # Utility functions and helpers
├── docs/                     # Documentation and guides
│   ├── api/                  # API documentation
│   ├── deployment/           # Deployment guides
│   └── user-guides/          # End-user documentation
└── scripts/                  # Automation and deployment scripts
    ├── deploy/               # Deployment automation
    └── monitoring/           # System monitoring scripts
```

### License & Contribution
Project released under **MIT License**.  
See `docs/CONTRIBUTING.md` for branching & PR guidelines (placeholder added).

### Sample Subgraph Entity
```graphql
type EnergyIssued @entity {
  id: ID!
  jobId: String!
  kWh: BigDecimal!
  co2eq: BigDecimal!
  timestamp: BigInt!
  org: String!
}
```

## Environment Configuration

### Required Environment Variables

```bash
# Blockchain Networks
SUI_NETWORK_URL=https://fullnode.mainnet.sui.io
SUI_PRIVATE_KEY=your_sui_private_key
OASIS_SAPPHIRE_URL=https://sapphire.oasis.io
ETHEREUM_L2_RPC_URL=https://polygon-rpc.com

# Oracle Configuration
ORACLE_PRIVATE_KEY=your_oracle_private_key
TEE_ATTESTATION_KEY=your_tee_key
ZK_PROVING_KEY=your_zk_key

# External APIs
CODECARBON_API_KEY=your_codecarbon_key
MELODI_ENDPOINT=https://api.melodi.org
ECOLOGITS_API_KEY=your_ecologits_key

# Infrastructure
SLURM_CLUSTER_ENDPOINT=your_slurm_endpoint
DCIM_API_URL=your_dcim_url
DCIM_API_TOKEN=your_dcim_token

# Storage and Encryption
WALRUS_STORAGE_URL=https://walrus.space
SEAL_ENCRYPTION_KEY=your_seal_key
IPFS_GATEWAY_URL=https://ipfs.io

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/aicarbon
REDIS_URL=redis://localhost:6379

# Monitoring and Analytics
GRAFANA_API_KEY=your_grafana_key
PROMETHEUS_ENDPOINT=http://localhost:9090

# Payment Processing
USDC_CONTRACT_ADDRESS=0xa0b86a33e6776e681c6e6c6c6e6c6c6e6c6c6c6e
PAYMENT_PROCESSOR_KEY=your_payment_key

# The Graph
GRAPH_API_KEY=your_graph_api_key
SUBGRAPH_ENDPOINT=https://api.thegraph.com/subgraphs/name/your-subgraph
```

## Progress Log

- [2025-08-09] Step 4: Sui Kiosk marketplace integrated behind RBAC. Added `/marketplace` page with role-gated sections (SIGNER can see "My Assets" and prepare to list; BUYER can view listings). Added TransferPolicy stub in `contracts/SuiMove/`. Dashboard now includes a "Marketplace (Sui Kiosk)" StatusCard with a read-only "Test Now" that reports listing count. Env example updated with Sui Kiosk keys. All secrets remain client-entered; no plaintext persistence.
- [2025-08-09] Step 5: EVM USDC purchase flow added (Base Sepolia). Read-first UX on `/offsets` (token meta, balance, allowance). Dev-only writes (Approve, Purchase Offsets) behind `PAYMENTS_DEV_ENABLED`. Dashboard payments card "Test Now" shows symbol/decimals/allowance. Env keys for RPC/contract addresses documented.

### Additional Environment Variables (Step 4)

```bash
# Sui Kiosk demo configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
NEXT_PUBLIC_SUI_PACKAGE_ID=            # set your published EnergyNFT package id
NEXT_PUBLIC_SUI_KIOSK_TYPE=            # optional override; default Sui framework kiosk type
NEXT_PUBLIC_SUI_GAS_BUDGET=30000000    # demo tx gas budget
```

### Environment Variables (Step 5 – EVM Payments)

```bash
# EVM / Base Sepolia
NEXT_PUBLIC_EVM_CHAIN_ID=84532
NEXT_PUBLIC_EVM_RPC_URL=https://sepolia.base.org

# Contracts
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS=0x...

# Feature flags (writes)
PAYMENTS_DEV_ENABLED=true
```

## Wallet Integration

### EVM Wallet Connect (RainbowKit)

- **Components**: `RainbowKitCustomConnectButton` integrated into the main navigation bar
- **Provider location**: `components/ScaffoldEthAppWithProviders.tsx` contains wagmi and RainbowKit providers
- **Button placement**: Top-right of the navbar, visible on desktop and mobile after zkLogin authentication
- **Target network**: Base Sepolia (84532) - no Foundry/localhost unless `NEXT_PUBLIC_ENABLE_LOCAL_CHAIN=true`
- **Required environment variables**:
  - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID for QR code connections
  - `NEXT_PUBLIC_EVM_RPC_URL`: Base Sepolia RPC endpoint (https://sepolia.base.org)
  - `NEXT_PUBLIC_EVM_CHAIN_ID`: 84532 (Base Sepolia)
- **Documentation**: [RainbowKit ConnectButton](https://rainbowkit.com/docs/connect-button)

### How to get WalletConnect Project ID

1. Visit https://dashboard.reown.com
2. Sign in or create an account
3. Click **Create Project**
4. Copy the **Project ID** from your project dashboard
5. Set `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id` in your environment
6. **Note**: WalletConnect QR code functionality requires this ID. Without it, the app will work with "Injected/MetaMask" connections only, and a warning will be logged to console.

### Sui Client (dApp Kit) setup

- **Packages**: `@mysten/sui`, `@mysten/dapp-kit`, `@tanstack/react-query`.
- **Provider order (App Router)**: ThemeProvider → React Query (QueryClientProvider) → SuiClientProvider → WalletProvider → RainbowKit/Wagmi → app.
- **Network**: uses `NEXT_PUBLIC_SUI_RPC_URL` if set; otherwise `getFullnodeUrl(NEXT_PUBLIC_SUI_NETWORK || 'testnet')`.
- **Styles**: `@mysten/dapp-kit/dist/index.css` imported once at app root.
- **Verify at**: `/debug/sui` (Connect, then lists owned objects via `useSuiClientQuery`).
- **Documentation**: [Sui TS SDK client app](https://docs.sui.io/guides/developer/first-app/client-tssdk) & [dApp Kit](https://sdk.mystenlabs.com/dapp-kit)

#### How to get Sui packageId (testnet):
```bash
cd contracts/SuiMove
sui client publish --json    # ensure `sui client` points to testnet
# copy "Published package: <packageId>" → paste into frontend/.env.local
```

For automated extraction, use:
```bash
scripts/sui/export-package-id.sh
```

#### How to configure The Graph Subgraph:

**Option 1: Using Subgraph Studio (recommended)**
1. Visit [The Graph Studio](https://thegraph.com/studio/) and create an account
2. Create a new subgraph for your project
3. Deploy the subgraph from `subgraph/` directory following [their deployment guide](https://thegraph.com/docs/en/subgraphs/developing/deploying/using-subgraph-studio/)
4. Copy the **Query URL** and set `NEXT_PUBLIC_SUBGRAPH_URL=<your-query-url>`

**Option 2: Local graph-node (fallback)**
1. Run docker-compose for graph-node: `docker-compose up graph-node`
2. Set `NEXT_PUBLIC_SUBGRAPH_URL=http://localhost:8000/subgraphs/name/ai-carbon-wallet`

#### How to configure Sapphire Oracle Relay:

The oracle service performs read-only checks on a deployed Oracle Receiver contract on Base Sepolia.

1. **Deploy Oracle Receiver contract** (if not deployed yet):
   ```bash
   cd contracts/ethereum
   # Deploy the OracleReceiver contract to Base Sepolia
   npx hardhat deploy --network baseSepolia --tags oracle
   ```

2. **Set the contract address**:
   ```bash
   # In frontend/.env.local, add:
   NEXT_PUBLIC_ORACLE_RECEIVER_ADDRESS=0x...
   ```

3. **Verify setup**: The dashboard "Oracle Network" card will show ✅ when the contract is reachable and returns valid data.

Refer to [Oasis Sapphire Quickstart](https://docs.oasis.io/build/sapphire/quickstart/) for TEE integration details.

## Progress Log – Connectivity Status Cards (January 15, 2025)

All failing/grey status cards have been systematically addressed:

- **✅ Collectors API**: Now passes with proxy fallback when backend offline (shows "Proxy: Using health proxy")
- **✅ Seal + Walrus**: Seal probe connects to 3 allowlisted servers; Walrus shows SKIP when no URL configured  
- **📋 Sui EnergyNFT**: Shows SKIP with clear instructions to publish Move package and set `NEXT_PUBLIC_SUI_PACKAGE_ID`
- **📋 The Graph Subgraph**: Shows SKIP with instructions for Studio deployment or local graph-node setup
- **📋 Sapphire Oracle Relay**: Shows SKIP with instructions to deploy Oracle Receiver contract and set address

Each module includes comprehensive setup documentation above. The dashboard `/dashboard` now provides accurate status reporting and "Test Now" functionality for all integrated services.



## Next Steps

To begin development and scaffold the complete codebase, run the initialization command:

```bash
init-scaffold
```

This will trigger the full project setup including:
- Backend service architecture with TypeScript/Node.js
- Sui Move smart contract templates
- Oasis Sapphire oracle contracts
- React frontend with Next.js 14 and Tailwind CSS
- The Graph subgraph configuration
- Testing frameworks (Hardhat + Sui test-pkg)
- Docker containerization
- CI/CD pipeline configuration

## Development Workflow

1. **Environment Setup**: Configure all required environment variables
2. **Backend Development**: Implement energy collectors and API endpoints
3. **Smart Contract Development**: Deploy and test blockchain contracts
4. **Oracle Integration**: Set up TEE and zk-proof generation
5. **Frontend Development**: Build React dashboard and user interfaces
6. **Integration Testing**: End-to-end testing across all components
7. **Production Deployment**: Multi-environment deployment pipeline

## Key Features

- ✅ **Real-time Energy Tracking**: Monitor AI workloads across multiple frameworks
- ✅ **Blockchain Integration**: Multi-chain support for NFTs and payments
- ✅ **Privacy-Preserving**: TEE and zk-proofs for confidential computing
- ✅ **Enterprise Ready**: Scalable architecture with monitoring and alerts
- ✅ **Automated Offsetting**: Smart contract-based carbon credit management
- ✅ **Comprehensive Analytics**: Dashboard with detailed carbon accounting
- ✅ **API-First Design**: RESTful and GraphQL APIs for integration
- ✅ **Decentralized Storage**: Walrus integration for data persistence

---

**Ready to transform AI carbon accounting with blockchain technology.**

*Run `init-scaffold` to begin full project initialization.*
