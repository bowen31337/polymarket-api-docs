> ## Documentation Index
> Fetch the complete documentation index at: https://docs.polymarket.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Create withdrawal addresses

> Generate unique deposit addresses for withdrawing USDC.e from your Polymarket wallet to any supported chain and token.

<Card>
**⚠️ Important:** Do not pre-generate withdrawal addresses. Only generate them when you are ready to execute the withdrawal. Each address is configured for a specific destination.
</Card>

**How it works:**
1. Specify your Polymarket wallet address, destination chain, token, and recipient address
2. Receive deposit addresses for each blockchain type (EVM, Solana, Bitcoin)
3. Send USDC.e from your Polymarket wallet to the appropriate deposit address
4. Funds are automatically bridged and swapped to your desired token
5. Funds arrive at your destination wallet

**Supported Destinations:**
Use `/supported-assets` to see all available chains and tokens you can withdraw to.




## OpenAPI

````yaml api-reference/bridge-api-openapi.yaml post /withdraw
openapi: 3.0.3
info:
  title: Polymarket Bridge API
  version: 1.0.0
  description: >
    HTTP API for Polymarket bridge and swap operations. 


    Polymarket uses USDC.e (Bridged USDC) on Polygon as collateral for all
    trading activities. This API enables users to bridge assets from various
    chains and swap them to USDC.e on Polygon for seamless trading.
servers:
  - url: https://bridge.polymarket.com
    description: Polymarket Bridge API
security: []
tags:
  - name: Bridge
    description: Bridge and swap operations for Polymarket
paths:
  /withdraw:
    post:
      tags:
        - Bridge
      summary: Create withdrawal addresses
      description: >
        Generate unique deposit addresses for withdrawing USDC.e from your
        Polymarket wallet to any supported chain and token.


        <Card>

        **⚠️ Important:** Do not pre-generate withdrawal addresses. Only
        generate them when you are ready to execute the withdrawal. Each address
        is configured for a specific destination.

        </Card>


        **How it works:**

        1. Specify your Polymarket wallet address, destination chain, token, and
        recipient address

        2. Receive deposit addresses for each blockchain type (EVM, Solana,
        Bitcoin)

        3. Send USDC.e from your Polymarket wallet to the appropriate deposit
        address

        4. Funds are automatically bridged and swapped to your desired token

        5. Funds arrive at your destination wallet


        **Supported Destinations:**

        Use `/supported-assets` to see all available chains and tokens you can
        withdraw to.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WithdrawalRequest'
            example:
              address: '0x9156dd10bea4c8d7e2d591b633d1694b1d764756'
              toChainId: '1'
              toTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
              recipientAddr: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      responses:
        '201':
          description: Withdrawal addresses created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DepositResponse'
              example:
                address:
                  evm: '0x23566f8b2E82aDfCf01846E54899d110e97AC053'
                  svm: CrvTBvzryYxBHbWu2TiQpcqD5M7Le7iBKzVmEj3f36Jb
                  btc: bc1q8eau83qffxcj8ht4hsjdza3lha9r3egfqysj3g
                note: >-
                  Send funds to these addresses to bridge to your destination
                  chain and token.
        '400':
          description: Bad Request - Invalid or missing parameters
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
components:
  schemas:
    WithdrawalRequest:
      type: object
      required:
        - address
        - toChainId
        - toTokenAddress
        - recipientAddr
      properties:
        address:
          $ref: '#/components/schemas/Address'
          description: Source Polymarket wallet address on Polygon
        toChainId:
          type: string
          description: >-
            Destination chain ID (e.g., "1" for Ethereum, "8453" for Base,
            "1151111081099710" for Solana)
          example: '1'
        toTokenAddress:
          type: string
          description: Destination token contract address
          example: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        recipientAddr:
          type: string
          description: Destination wallet address where funds will be sent
          example: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    DepositResponse:
      type: object
      properties:
        address:
          type: object
          description: Deposit addresses for different blockchain networks
          properties:
            evm:
              type: string
              description: >-
                EVM-compatible deposit address (Ethereum, Polygon, Arbitrum,
                Base, etc.)
              example: '0x23566f8b2E82aDfCf01846E54899d110e97AC053'
            svm:
              type: string
              description: Solana Virtual Machine deposit address
              example: CrvTBvzryYxBHbWu2TiQpcqD5M7Le7iBKzVmEj3f36Jb
            btc:
              type: string
              description: Bitcoin deposit address
              example: bc1q8eau83qffxcj8ht4hsjdza3lha9r3egfqysj3g
        note:
          type: string
          description: Additional information about the deposit addresses
          example: >-
            Only certain chains and tokens are supported. See /supported-assets
            for details.
    ErrorResponse:
      type: object
      properties:
        error:
          type: string
      required:
        - error
    Address:
      type: string
      description: Ethereum address (0x-prefixed, 40 hex chars)
      pattern: ^0x[a-fA-F0-9]{40}$
      example: '0x56687bf447db6ffa42ffe2204a05edaa20f55839'

````