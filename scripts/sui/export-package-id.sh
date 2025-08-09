#!/bin/bash
# Sui package ID extraction script
# Usage: Run after sui client publish --json to extract package ID

echo "=== Sui Package Publishing Helper ==="

cd contracts/SuiMove

# Check if sui CLI is available
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI not found. Install from: https://docs.sui.io/guides/developer/getting-started/sui-install"
    echo "   Or use: cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui"
    exit 1
fi

# Check if we're on testnet
echo "📡 Current Sui client config:"
sui client envs

echo ""
echo "🚀 Publishing Sui Move package..."
echo "   (This may take a minute...)"

# Publish with JSON output and capture
PUBLISH_OUTPUT=$(sui client publish --json --gas-budget 100000000 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "❌ Publication failed:"
    echo "$PUBLISH_OUTPUT"
    exit 1
fi

# Extract package ID from JSON
PACKAGE_ID=$(echo "$PUBLISH_OUTPUT" | jq -r '.objectChanges[] | select(.type == "published") | .packageId' 2>/dev/null)

if [ -z "$PACKAGE_ID" ] || [ "$PACKAGE_ID" = "null" ]; then
    echo "⚠️  Could not extract package ID from JSON output"
    echo "Raw output:"
    echo "$PUBLISH_OUTPUT"
    echo ""
    echo "Please manually extract the package ID from the output above"
    echo "and set it in frontend/.env.local:"
    echo "NEXT_PUBLIC_SUI_PACKAGE_ID=0x..."
    exit 1
fi

# Save to artifacts
mkdir -p ../../artifacts
echo "$PACKAGE_ID" > ../../artifacts/sui.packageId

echo "✅ Package published successfully!"
echo "📝 Package ID: $PACKAGE_ID"
echo "💾 Saved to: artifacts/sui.packageId"
echo ""
echo "🔧 Next steps:"
echo "   1. Add to frontend/.env.local:"
echo "      NEXT_PUBLIC_SUI_PACKAGE_ID=$PACKAGE_ID"
echo "   2. Restart your dev server"
echo "   3. Test the dashboard Sui EnergyNFT card"
