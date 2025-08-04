# Contributing to AI-Carbon Wallet

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-org/ai-carbon-wallet.git
   cd ai-carbon-wallet
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Start Development Environment**
   ```bash
   docker-compose up -d
   npm install
   npm run dev
   ```

4. **Branch Strategy**
   - `main` - Production ready code
   - `develop` - Integration branch
   - `feature/*` - New features
   - `fix/*` - Bug fixes

## Pull Request Guidelines

- Create feature branches from `develop`
- Include comprehensive tests
- Update documentation
- Follow TypeScript/Solidity style guides
- Add TODO comments for integration points

## Testing Requirements

- Backend: Jest unit tests
- Contracts: Hardhat/Sui test suite
- Frontend: React Testing Library
- Integration: End-to-end testing

## Code Standards

- TypeScript strict mode disabled for rapid development
- ESLint with relaxed rules for prototyping
- Comprehensive TODO comments for production integration
- Clear separation between skeleton and production code
