> ## Documentation Index
> Fetch the complete documentation index at: https://docs.polymarket.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Bridge and swap assets to Polymarket

The Polymarket Bridge API enables seamless deposits and withdrawals between multiple networks and Polymarket.

### USDC.e on Polygon

**Polymarket uses USDC.e (Bridged USDC) on Polygon as collateral** for all trading activities. USDC.e is the bridged version of USDC from Ethereum, and it serves as the native currency for placing orders and settling trades on Polymarket.

When you deposit assets to Polymarket:

1. You can deposit from various supported chains (Ethereum, Solana, Arbitrum, Base, etc.)
2. Your assets are automatically bridged/swapped to USDC.e on Polygon
3. USDC.e is credited to your Polymarket wallet so you can trade on any market

## Base URL

```
https://bridge.polymarket.com
```

## Key Features

* **Multi-chain deposits**: Bridge assets from EVM chains (Ethereum, Arbitrum, Base, etc.), Solana, and Bitcoin
* **Multi-chain withdrawals**: Withdraw USDC.e to any supported chain and token
* **Automatic conversion**: Assets are automatically bridged and swapped
* **Simple addressing**: One deposit address per blockchain type (EVM, SVM, BTC)

## Endpoints

* `GET /supported-assets` - Get all supported chains and tokens
* `POST /quote` - Get a quote for a deposit or withdrawal
* `POST /deposit` - Create deposit addresses for bridging assets to Polymarket
* `POST /withdraw` - Create withdrawal addresses for bridging assets from Polymarket
* `GET /status/{address}` - Get transaction status for a given address
