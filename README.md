# FreeMine Phase 1 (BSC Testnet)

Phase 1 MVP for FreeMine: BEP-20 token contract + backend mining platform.

## Project Structure

```
.
├── contracts/
│   ├── contracts/MineToken.sol
│   ├── hardhat.config.ts
│   ├── scripts/deploy.ts
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   └── app.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
└── README.md
```

## BSC Testnet

- RPC: `https://data-seed-prebsc-1-e.binance.org:8545`
- Chain ID: `97`
- Network Name: `BSC Testnet`
- Explorer: `https://testnet.bscscan.com`

## Smart Contract (BEP-20)

### 1) Install & compile

```bash
cd contracts
npm install
npm run compile
```

### 2) Configure env

```bash
cp .env.example .env
# set DEPLOYER_PRIVATE_KEY
```

### 3) Deploy to BSC testnet

```bash
npm run deploy:testnet
```

## Backend

### 1) Install

```bash
cd backend
npm install
```

### 2) Configure env

```bash
cp .env.example .env
```

### 3) Run

```bash
npm run dev
```

### 4) Build & test

```bash
npm run build
npm test
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/profile`
- `GET /api/user/balance`
- `POST /api/mining/claim`
- `GET /api/mining/history`
- `POST /api/token/transfer`
- `GET /api/token/transactions`
- `GET /api/packages`
- `POST /api/packages/upgrade`
- `GET /api/leaderboard/miners`

## Tokenomics (Phase 1)

- FREE: `0.5 MINE/day`
- PREMIUM: `1 MINE/day` (`9.99 USDT`)
- PRO: `2 MINE/day` (`29.99 USDT`)
- ELITE: `5 MINE/day` (`99.99 USDT`)

Transfer fee: `2%`.
Claim cooldown: `24 hours`.
