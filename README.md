# Blockchain Visualizer

An interactive web application that demonstrates how blockchain works through a
dark neon coder interface. Users can view block links, mine proof-of-work
blocks, tamper with block data, and watch real-time validation detect failures.

## Features

- Chain display with block cards for index, timestamp, data, nonce, hash, and previous hash
- Visual linkage using arrows and color-coded hash matching
- Mining flow with difficulty selector (1-4), live progress, and mining time
- Real-time validation indicator with first invalid block detection
- Inline tampering controls on block cards
- Optional auto-mine and ledger view

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- `crypto-js` for SHA-256 hashing
- Zod for runtime validation
- Vitest + Testing Library + Playwright

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test and Lint

```bash
npm run lint
npm run test
npm run test:e2e
```

## Project Structure

```text
app/
components/blockchain/
lib/blockchain/
lib/constants/
lib/schemas/
lib/theme/
types/
tests/
```
