#!/bin/bash

# Polymarket Documentation Downloader
# Downloads all markdown files from docs.polymarket.com

BASE_DIR="/Users/bowenli/development/polymarket_api/docs"
BASE_URL="https://docs.polymarket.com"

# Array of all documentation paths
DOCS=(
    # API Reference - Bridge
    "api-reference/bridge/create-deposit-addresses"
    "api-reference/bridge/create-withdrawal-addresses"
    "api-reference/bridge/get-a-quote"
    "api-reference/bridge/get-supported-assets"
    "api-reference/bridge/get-transaction-status"

    # API Reference - Builders
    "api-reference/builders/get-aggregated-builder-leaderboard"
    "api-reference/builders/get-daily-builder-volume-time-series"

    # API Reference - Comments
    "api-reference/comments/get-comments-by-comment-id"
    "api-reference/comments/get-comments-by-user-address"
    "api-reference/comments/list-comments"

    # API Reference - Core
    "api-reference/core/get-closed-positions-for-a-user"
    "api-reference/core/get-current-positions-for-a-user"
    "api-reference/core/get-top-holders-for-markets"
    "api-reference/core/get-total-value-of-a-users-positions"
    "api-reference/core/get-trader-leaderboard-rankings"
    "api-reference/core/get-trades-for-a-user-or-markets"
    "api-reference/core/get-user-activity"

    # API Reference - Data API
    "api-reference/data-api-status/data-api-health-check"

    # API Reference - Events
    "api-reference/events/get-event-by-id"
    "api-reference/events/get-event-by-slug"
    "api-reference/events/get-event-tags"
    "api-reference/events/list-events"

    # API Reference - Gamma
    "api-reference/gamma-status/gamma-api-health-check"

    # API Reference - Markets
    "api-reference/markets/get-market-by-id"
    "api-reference/markets/get-market-by-slug"
    "api-reference/markets/get-market-tags-by-id"
    "api-reference/markets/list-markets"

    # API Reference - Misc
    "api-reference/misc/download-an-accounting-snapshot-zip-of-csvs"
    "api-reference/misc/get-live-volume-for-an-event"
    "api-reference/misc/get-open-interest"
    "api-reference/misc/get-total-markets-a-user-has-traded"

    # API Reference - Orderbook
    "api-reference/orderbook/get-multiple-order-books-summaries-by-request"
    "api-reference/orderbook/get-order-book-summary"

    # API Reference - Pricing
    "api-reference/pricing/get-market-price"
    "api-reference/pricing/get-midpoint-price"
    "api-reference/pricing/get-multiple-market-prices"
    "api-reference/pricing/get-multiple-market-prices-by-request"
    "api-reference/pricing/get-price-history-for-a-traded-token"

    # API Reference - Profiles
    "api-reference/profiles/get-public-profile-by-wallet-address"

    # API Reference - Search
    "api-reference/search/search-markets-events-and-profiles"

    # API Reference - Series
    "api-reference/series/get-series-by-id"
    "api-reference/series/list-series"

    # API Reference - Sports
    "api-reference/sports/get-sports-metadata-information"
    "api-reference/sports/get-valid-sports-market-types"
    "api-reference/sports/list-teams"

    # API Reference - Spreads
    "api-reference/spreads/get-bid-ask-spreads"

    # API Reference - Tags
    "api-reference/tags/get-related-tags-relationships-by-tag-id"
    "api-reference/tags/get-related-tags-relationships-by-tag-slug"
    "api-reference/tags/get-tag-by-id"
    "api-reference/tags/get-tag-by-slug"
    "api-reference/tags/get-tags-related-to-a-tag-id"
    "api-reference/tags/get-tags-related-to-a-tag-slug"
    "api-reference/tags/list-tags"

    # Changelog
    "changelog/changelog"

    # Developers - CLOB
    "developers/CLOB/authentication"
    "developers/CLOB/clients/methods-builder"
    "developers/CLOB/clients/methods-l1"
    "developers/CLOB/clients/methods-l2"
    "developers/CLOB/clients/methods-overview"
    "developers/CLOB/clients/methods-public"
    "developers/CLOB/geoblock"
    "developers/CLOB/introduction"
    "developers/CLOB/orders/cancel-orders"
    "developers/CLOB/orders/check-scoring"
    "developers/CLOB/orders/create-order"
    "developers/CLOB/orders/create-order-batch"
    "developers/CLOB/orders/get-active-order"
    "developers/CLOB/orders/get-order"
    "developers/CLOB/orders/onchain-order-info"
    "developers/CLOB/orders/orders"
    "developers/CLOB/quickstart"
    "developers/CLOB/status"
    "developers/CLOB/timeseries"
    "developers/CLOB/trades/trades"
    "developers/CLOB/trades/trades-overview"
    "developers/CLOB/websocket/market-channel"
    "developers/CLOB/websocket/user-channel"
    "developers/CLOB/websocket/wss-auth"
    "developers/CLOB/websocket/wss-overview"

    # Developers - CTF
    "developers/CTF/deployment-resources"
    "developers/CTF/merge"
    "developers/CTF/overview"
    "developers/CTF/redeem"
    "developers/CTF/split"

    # Developers - RTDS
    "developers/RTDS/RTDS-comments"
    "developers/RTDS/RTDS-crypto-prices"
    "developers/RTDS/RTDS-overview"

    # Developers - Builders
    "developers/builders/blockchain-data-resources"
    "developers/builders/builder-intro"
    "developers/builders/builder-profile"
    "developers/builders/builder-tiers"
    "developers/builders/examples"
    "developers/builders/order-attribution"
    "developers/builders/relayer-client"

    # Developers - Gamma Markets API
    "developers/gamma-markets-api/fetch-markets-guide"
    "developers/gamma-markets-api/gamma-structure"
    "developers/gamma-markets-api/overview"

    # Developers - Market Makers
    "developers/market-makers/data-feeds"
    "developers/market-makers/introduction"
    "developers/market-makers/inventory"
    "developers/market-makers/liquidity-rewards"
    "developers/market-makers/maker-rebates-program"
    "developers/market-makers/setup"
    "developers/market-makers/trading"

    # Developers - Misc
    "developers/misc-endpoints/bridge-overview"
    "developers/neg-risk/overview"
    "developers/proxy-wallet"

    # Developers - Resolution
    "developers/resolution/UMA"

    # Developers - Sports WebSocket
    "developers/sports-websocket/message-format"
    "developers/sports-websocket/overview"
    "developers/sports-websocket/quickstart"

    # Developers - Subgraph
    "developers/subgraph/overview"

    # Polymarket Learn - FAQ
    "polymarket-learn/FAQ/does-polymarket-have-an-api"
    "polymarket-learn/FAQ/embeds"
    "polymarket-learn/FAQ/geoblocking"
    "polymarket-learn/FAQ/how-to-export-private-key"
    "polymarket-learn/FAQ/is-my-money-safe"
    "polymarket-learn/FAQ/is-polymarket-the-house"
    "polymarket-learn/FAQ/polling"
    "polymarket-learn/FAQ/recover-missing-deposit"
    "polymarket-learn/FAQ/sell-early"
    "polymarket-learn/FAQ/support"
    "polymarket-learn/FAQ/wen-token"
    "polymarket-learn/FAQ/what-are-prediction-markets"
    "polymarket-learn/FAQ/why-do-i-need-crypto"

    # Polymarket Learn - Deposits
    "polymarket-learn/deposits/coinbase"
    "polymarket-learn/deposits/how-to-withdraw"
    "polymarket-learn/deposits/large-cross-chain-deposits"
    "polymarket-learn/deposits/moonpay"
    "polymarket-learn/deposits/supported-tokens"
    "polymarket-learn/deposits/usdc-on-eth"

    # Polymarket Learn - Get Started
    "polymarket-learn/get-started/how-to-deposit"
    "polymarket-learn/get-started/how-to-signup"
    "polymarket-learn/get-started/making-your-first-trade"
    "polymarket-learn/get-started/what-is-polymarket"

    # Polymarket Learn - Markets
    "polymarket-learn/markets/dispute"
    "polymarket-learn/markets/how-are-markets-clarified"
    "polymarket-learn/markets/how-are-markets-created"
    "polymarket-learn/markets/how-are-markets-resolved"

    # Polymarket Learn - Trading
    "polymarket-learn/trading/fees"
    "polymarket-learn/trading/holding-rewards"
    "polymarket-learn/trading/how-are-prices-calculated"
    "polymarket-learn/trading/limit-orders"
    "polymarket-learn/trading/liquidity-rewards"
    "polymarket-learn/trading/maker-rebates-program"
    "polymarket-learn/trading/market-orders"
    "polymarket-learn/trading/no-limits"
    "polymarket-learn/trading/using-the-orderbook"

    # Quickstart
    "quickstart/fetching-data"
    "quickstart/first-order"
    "quickstart/introduction/rate-limits"
    "quickstart/overview"
    "quickstart/reference/endpoints"
    "quickstart/reference/glossary"
    "quickstart/websocket/WSS-Quickstart"
)

echo "Starting download of Polymarket documentation..."
echo "Total files to download: ${#DOCS[@]}"
echo ""

SUCCESS=0
FAILED=0

for doc in "${DOCS[@]}"; do
    # Create directory structure
    DIR=$(dirname "$BASE_DIR/$doc")
    mkdir -p "$DIR"

    # Download the file
    URL="${BASE_URL}/${doc}.md"
    OUTPUT="$BASE_DIR/${doc}.md"

    echo "Downloading: $doc.md"

    if curl -sS -f -o "$OUTPUT" "$URL" 2>/dev/null; then
        ((SUCCESS++))
    else
        echo "  FAILED: $URL"
        ((FAILED++))
    fi
done

echo ""
echo "Download complete!"
echo "Success: $SUCCESS"
echo "Failed: $FAILED"
