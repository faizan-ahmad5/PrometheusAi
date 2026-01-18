# PrometheusAi Server — Informal Guide

A friendly walkthrough of the backend that powers PrometheusAi.

## What this server does

- Handles auth (register/login) with JWT
- Stores users, chats, and transactions in MongoDB
- Talks to Gemini for text responses
- Generates & stores images via ImageKit
- Sells credits via Stripe Checkout + webhooks
- Enforces CORS, input validation, and basic rate limiting

## Quick setup

1. Copy `server/.env.example` → `server/.env`
2. Fill in all required values (MongoDB, Gemini, ImageKit, Stripe, JWT)
3. Install & run:

```bash
cd server
npm install
npm run server   # dev (nodemon)
# or
npm start        # prod
```

Default port: `3000`.

## Required environment vars

- `MONGODB_URI` — your MongoDB connection string
- `GEMINI_API_KEY` — Google Gemini key
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `JWT_SECRET`
- `PORT` (optional, defaults to 3000)
- `ALLOWED_ORIGINS` (comma-separated; defaults to localhost dev URLs)

Tip: On startup, the server validates required env vars and exits if any are missing.

## API routes (short tour)

- `GET /` — sanity check ("Server is Live!")
- `POST /api/stripe` — Stripe webhooks (raw body)

- `POST /api/user/register` — create account
- `POST /api/user/login` — login and receive JWT
- `GET /api/user/data` — get current user (requires `Authorization: <token>`)
- `GET /api/user/published-images` — public gallery

- `POST /api/chat/create` — new chat (auth)
- `GET /api/chat/get` — list chats (auth)
- `POST /api/chat/delete` — delete chat (auth)

- `POST /api/message/text` — send prompt to Gemini (auth)
- `POST /api/message/image` — generate image via ImageKit (auth)

- `GET /api/credit/plans` — credit bundles
- `POST /api/credit/purchase` — Stripe Checkout session (auth)

## Webhooks

- Stripe sends events to `POST /api/stripe`
- We verify signatures with `STRIPE_WEBHOOK_SECRET`
- On successful payment, user credits are incremented and transaction is marked paid

## Data models (in short)

- `User` — name, email (indexed), password (bcrypt), credits
- `Chat` — `userId`, `userName`, `name`, `messages[]`
- `Transaction` — `userId`, `planId`, `amount`, `credits`, `isPaid`

## Common gotchas

- Webhooks require `express.raw()`—don’t move the middleware order
- If MongoDB fails, server exits early (check `.env`)
- Invalid origins are rejected by CORS

Happy hacking! 🚀
