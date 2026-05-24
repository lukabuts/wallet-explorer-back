# Wallet Explorer - Backend

A Fastify + ethers.js REST API that reads live on-chain data from Ethereum and Polygon via Alchemy.

---

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Fastify
- **Blockchain** — ethers.js v6
- **RPC Provider** — Alchemy
- **Language** — TypeScript

---

## Features

- ETH / MATIC balance lookup
- ERC-20 token holdings
- Transaction history with pagination
- In-memory cache to reduce RPC calls
- Fallback RPC providers for reliability
- Address and chain validation middleware
- Multi-chain support (Ethereum, Polygon)

---

## Project Structure

```
src/
  constants/
    index.ts         # Constants
  routes/
    wallet.ts            # API route definitions
  services/
    ethereum.ts          # ethers.js blockchain calls
    chains.ts            # RPC provider management
    cache.ts             # In-memory cache
  plugins/
    validateAddress.ts   # Middleware setup
    validateChain.ts
  types/
    index.ts
  app.ts                 # Fastify instance + plugins
  server.ts              # Entry point
```

---

## API Endpoints

### Health Check
```
GET /api/health
```

### Wallet Balance
```
GET /api/wallet/:address/balance?chain=ethereum
```
**Params:**
- `address` — Ethereum wallet address
- `chain` — `ethereum` or `polygon` (default: `ethereum`)

**Response:**
```json
{
  "address": "0x123...",
  "chain": "ethereum",
  "balance": "1.5"
}
```

### Transaction History
```
GET /api/wallet/:address/transactions?chain=ethereum&pageKey=abc123
```
**Params:**
- `address` — Ethereum wallet address
- `chain` — `ethereum` or `polygon` (default: `ethereum`)
- `pageKey` — pagination cursor from previous response (optional)

**Response:**
```json
{
  "address": "0x123...",
  "transactions": [
    {
      "hash": "0xabc...",
      "from": "0x123...",
      "to": "0x456...",
      "value": "0.5",
      "asset": "ETH",
      "blockNumber": "0x1234"
    }
  ],
  "nextPageKey": "abc123"
}
```

### ERC-20 Token Holdings
```
GET /api/wallet/:address/tokens?chain=ethereum
```
**Params:**
- `address` — Ethereum wallet address
- `chain` — `ethereum` or `polygon` (default: `ethereum`)

**Response:**
```json
{
  "address": "0x123...",
  "tokens": [
    {
      "contract": "0xA0b8...",
      "symbol": "USDC",
      "balance": "150.50"
    }
  ]
}
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Alchemy API key — [Get one free](https://alchemy.com)

### Installation

```bash
git clone https://github.com/lukabuts/wallet-explorer-back
cd wallet-explorer-back
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
ALCHEMY_API_KEY=your_alchemy_api_key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```
---

## Caching

Responses are cached in-memory with a 30 second TTL. This reduces Alchemy API calls and keeps response times under 5ms for cached requests.

---

## Error Handling

| Status | Meaning |
|--------|---------|
| 400 | Invalid address or unsupported chain |
| 500 | RPC provider error |

---

## Supported Chains

| Chain | Query Value |
|-------|------------|
| Ethereum Mainnet | `ethereum` |
| Polygon Mainnet | `polygon` |

---

## License

MIT