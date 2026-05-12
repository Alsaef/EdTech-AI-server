# Backend (Express + MongoDB)

This is a minimal scaffold for the AI application backend.

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET` and an API key.

```bash
cd backend
npm install
npm run dev
```

Endpoints

- `POST /api/auth/register` — register { name, email, password }
- `POST /api/auth/login` — login { email, password }
- `POST /api/ai/generate` — generate text { prompt } (optional auth)
- `GET /api/materials` — list materials
- `POST /api/materials` — create (requires auth)

Notes

- Replace `utils/gemini.js` with provider-specific calls to Gemini or OpenAI.
- Secure JWT secret and mongoose URI in production.
