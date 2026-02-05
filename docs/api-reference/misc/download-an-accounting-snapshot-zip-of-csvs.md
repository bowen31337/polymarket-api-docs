> ## Documentation Index
> Fetch the complete documentation index at: https://docs.polymarket.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Download an accounting snapshot (ZIP of CSVs)

> Public endpoint (no auth) that returns an `application/zip` containing two CSV files generated from the same snapshot time.

**ZIP contents**

1) `positions.csv` (0+ rows)
- Columns (in order):
  - `conditionId` (string): market condition id
  - `asset` (string): outcome token id (uniquely identifies the position within a market)
  - `size` (number): tokens, 6 decimals
  - `curPrice` (number): per-token price/value in USDC, 6 decimals
  - `valuationTime` (string): RFC3339 UTC timestamp

2) `equity.csv` (0 or 1 row)
- Columns (in order):
  - `cashBalance` (number): onchain USDC `balanceOf(user)` using Polygon USDC `0x2791bca1f2de4661ed88a30c99a7a9449aa84174`, 6 decimals
  - `positionsValue` (number): \(\sum(\text{size} \times \text{curPrice})\) across `positions.csv`, 6 decimals
  - `equity` (number): `cashBalance + positionsValue`, 6 decimals
  - `valuationTime` (string): RFC3339 UTC timestamp (same snapshot time as `positions.csv`)

**Example `positions.csv`**

```csv
conditionId,asset,size,curPrice,valuationTime
0xd007d71fd17b0913b9d7ff198f617caa96a9e4aab1bed7d6f9abd76bb17dd507,65396714035221124737265515219989336303267439172398528294132309725835127126381,90548.087076,0.064500,2026-01-21T18:30:00Z
0x96f6fb6567b5938fc3c2e75f9829d7287340b9581a9c4817b8bc0aff82e1c45f,10057237541929696185971116542487795282113077727880089878027691009747516185940,45666.487374,0.495000,2026-01-21T18:30:00Z
```

**Example `equity.csv`**

```csv
cashBalance,positionsValue,equity,valuationTime
125000.000000,28481009.037705,28606009.037705,2026-01-21T18:30:00Z
```




## OpenAPI

````yaml api-reference/data-api-openapi.yaml get /v1/accounting/snapshot
openapi: 3.0.3
info:
  title: Polymarket Data API
  version: 1.0.0
  description: >
    HTTP API for Polymarket data. This specification documents all public
    routes.
servers:
  - url: https://data-api.polymarket.com
    description: Relative server (same host)
security: []
tags:
  - name: Data API Status
    description: Data API health check
  - name: Core
  - name: Builders
  - name: Misc
paths:
  /v1/accounting/snapshot:
    get:
      tags:
        - Misc
      summary: Download an accounting snapshot (ZIP of CSVs)
      description: >
        Public endpoint (no auth) that returns an `application/zip` containing
        two CSV files generated from the same snapshot time.


        **ZIP contents**


        1) `positions.csv` (0+ rows)

        - Columns (in order):
          - `conditionId` (string): market condition id
          - `asset` (string): outcome token id (uniquely identifies the position within a market)
          - `size` (number): tokens, 6 decimals
          - `curPrice` (number): per-token price/value in USDC, 6 decimals
          - `valuationTime` (string): RFC3339 UTC timestamp

        2) `equity.csv` (0 or 1 row)

        - Columns (in order):
          - `cashBalance` (number): onchain USDC `balanceOf(user)` using Polygon USDC `0x2791bca1f2de4661ed88a30c99a7a9449aa84174`, 6 decimals
          - `positionsValue` (number): \(\sum(\text{size} \times \text{curPrice})\) across `positions.csv`, 6 decimals
          - `equity` (number): `cashBalance + positionsValue`, 6 decimals
          - `valuationTime` (string): RFC3339 UTC timestamp (same snapshot time as `positions.csv`)

        **Example `positions.csv`**


        ```csv

        conditionId,asset,size,curPrice,valuationTime

        0xd007d71fd17b0913b9d7ff198f617caa96a9e4aab1bed7d6f9abd76bb17dd507,65396714035221124737265515219989336303267439172398528294132309725835127126381,90548.087076,0.064500,2026-01-21T18:30:00Z

        0x96f6fb6567b5938fc3c2e75f9829d7287340b9581a9c4817b8bc0aff82e1c45f,10057237541929696185971116542487795282113077727880089878027691009747516185940,45666.487374,0.495000,2026-01-21T18:30:00Z

        ```


        **Example `equity.csv`**


        ```csv

        cashBalance,positionsValue,equity,valuationTime

        125000.000000,28481009.037705,28606009.037705,2026-01-21T18:30:00Z

        ```
      parameters:
        - in: query
          name: user
          required: true
          schema:
            $ref: '#/components/schemas/Address'
          description: User address (0x-prefixed)
      responses:
        '200':
          description: ZIP file containing `positions.csv` and `equity.csv`.
          content:
            application/zip:
              schema:
                type: string
                format: binary
        '400':
          description: Bad Request
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
    Address:
      type: string
      description: User Profile Address (0x-prefixed, 40 hex chars)
      pattern: ^0x[a-fA-F0-9]{40}$
      example: '0x56687bf447db6ffa42ffe2204a05edaa20f55839'
    ErrorResponse:
      type: object
      properties:
        error:
          type: string
      required:
        - error

````