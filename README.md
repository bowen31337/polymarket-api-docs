<div align="center">

# 🔮 Polymarket API Documentation

[![Deploy](https://github.com/bowen31337/polymarket-api-docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/bowen31337/polymarket-api-docs/actions/workflows/deploy.yml)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?logo=openapi-initiative)](https://bowen31337.github.io/polymarket-api-docs/openapi/polymarket-api.yaml)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-222?logo=github)](https://bowen31337.github.io/polymarket-api-docs/)

**Comprehensive API documentation for building prediction market integrations with Polymarket's trading APIs**

[🚀 Live Documentation](https://bowen31337.github.io/polymarket-api-docs/) · [📖 Learn Hub](https://bowen31337.github.io/polymarket-api-docs/learn/) · [⚡ Swagger UI](https://bowen31337.github.io/polymarket-api-docs/swagger/) · [📘 ReDoc](https://bowen31337.github.io/polymarket-api-docs/redoc/)

</div>

---

## 📚 Documentation Hub

| Resource | Description | Link |
|----------|-------------|------|
| **🏠 Landing Page** | Main documentation portal with quick access to all resources | [Visit →](https://bowen31337.github.io/polymarket-api-docs/) |
| **⚡ Swagger UI** | Interactive API explorer with live request testing and MetaMask wallet integration | [Explore →](https://bowen31337.github.io/polymarket-api-docs/swagger/) |
| **📘 ReDoc** | Clean, three-panel API reference documentation optimized for reading | [Read →](https://bowen31337.github.io/polymarket-api-docs/redoc/) |
| **🎓 Learn Hub** | Comprehensive tutorials, guides, and examples for getting started with Polymarket | [Learn →](https://bowen31337.github.io/polymarket-api-docs/learn/) |
| **📄 OpenAPI Spec** | Raw OpenAPI 3.0 specification file | [Download →](https://bowen31337.github.io/polymarket-api-docs/openapi/polymarket-api.yaml) |

---

## ✨ Features

### 🔌 Interactive API Explorer (Swagger UI)
- **Live Request Testing**: Execute API calls directly from the browser
- **MetaMask Integration**: Test authenticated endpoints with wallet signing
- **Real-time Authentication**: Support for API key and L2 authentication
- **Request/Response Examples**: Pre-populated examples for all endpoints

### 📖 Comprehensive Reference (ReDoc)
- **Three-Panel Layout**: Navigation, content, and code samples side-by-side
- **Deep Linking**: Share links to specific endpoints and sections
- **Search Functionality**: Quickly find endpoints and schemas
- **Mobile Responsive**: Read documentation on any device

### 🎓 Learn Hub
- **36 Comprehensive Lessons**: From basics to advanced trading strategies
- **Progress Tracking**: Track your learning journey across all modules
- **Global Search**: Press `⌘K` to quickly find any topic
- **Beautiful UI**: Modern, dark-themed interface with smooth animations

### 📋 OpenAPI 3.0 Specification
Complete API specification covering:

| Category | Endpoints |
|----------|-----------|
| **Markets** | List markets, get market details, orderbook, prices, trades |
| **Trading** | Place orders, cancel orders, get open orders |
| **Account** | Balances, positions, trade history, P&L |
| **Authentication** | API keys, L2 signing, CLOB auth |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **API Spec** | OpenAPI 3.0 (YAML) |
| **Interactive Docs** | Swagger UI |
| **Static Docs** | ReDoc |
| **Learn Hub** | React + Vite + TailwindCSS |
| **Animations** | Framer Motion + GSAP |
| **Deployment** | GitHub Actions + GitHub Pages |
| **Package Manager** | pnpm |

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/bowen31337/polymarket-api-docs.git
cd polymarket-api-docs

# Install dependencies
pnpm install

# Start the Learn Hub development server
cd polymarket-learn-ui
pnpm install
pnpm run dev
```

### Project Structure

```
polymarket-api-docs/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── assets/
│   └── polymarket-logo.svg     # Brand assets
├── docs/
│   └── polymarket-learn/       # Markdown content for Learn Hub
├── openapi/
│   └── polymarket-api.yaml     # OpenAPI 3.0 specification
├── polymarket-learn-ui/        # React Learn Hub application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── data/               # Lesson content
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utility functions
│   ├── vite.config.ts          # Vite configuration
│   └── package.json
├── redoc/
│   └── index.html              # ReDoc configuration
├── swagger/
│   └── index.html              # Swagger UI configuration
├── index.html                  # Landing page
└── package.json
```

---

## 🔄 CI/CD Pipeline

The repository uses GitHub Actions for automated deployment:

1. **Validate**: Lint and validate the OpenAPI specification
2. **Build**: Generate Swagger UI, ReDoc, and build the Learn Hub
3. **Deploy**: Publish to GitHub Pages

Deployment is triggered automatically on every push to `main`.

---

## 📝 API Coverage

### Markets API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/markets` | GET | List all active prediction markets |
| `/markets/{conditionId}` | GET | Get details for a specific market |
| `/markets/{tokenId}/orderbook` | GET | Get orderbook for a market |
| `/markets/{tokenId}/price` | GET | Get current prices for a token |
| `/markets/{tokenId}/trades` | GET | Get recent trades |

### Trading API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orders` | POST | Place a new order |
| `/orders` | GET | Get open orders |
| `/orders/{orderId}` | DELETE | Cancel an order |
| `/orders/{orderId}` | GET | Get order details |

### Account API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/balance` | GET | Get account balances |
| `/positions` | GET | Get current positions |
| `/trades` | GET | Get trade history |
| `/pnl` | GET | Get profit & loss summary |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes. The Polymarket brand and API are property of Polymarket.

---

<div align="center">

**[🔮 View Live Documentation →](https://bowen31337.github.io/polymarket-api-docs/)**

Made with ❤️ for the Polymarket community

</div>
