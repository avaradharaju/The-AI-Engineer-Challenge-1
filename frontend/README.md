# Mindful Coach — Frontend

A Next.js chat interface for the FastAPI mental coach backend.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (includes `npm`)
- The FastAPI backend running on port 8000 (see `api/README.md`)

## Setup

From the `frontend` directory:

```bash
npm install
```

## Run locally

You need **two terminals** — one for the backend, one for the frontend.

### Terminal 1 — Backend

From the project root:

```bash
export OPENAI_API_KEY=sk-your-key-here
uv run uvicorn api.index:app --reload
```

The API will be available at `http://localhost:8000`.

### Terminal 2 — Frontend

From the `frontend` directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The Next.js dev server proxies `/api/*` requests to the FastAPI backend on port 8000 (configured in `next.config.ts`). You can override the backend URL with:

```bash
BACKEND_URL=http://localhost:8000 npm run dev
```

## Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

From the **project root** (not `frontend/`):

```bash
npm install -g vercel
vercel
```

The root `vercel.json` routes:

- `/api/*` → FastAPI Python serverless function
- everything else → Next.js frontend

Set `OPENAI_API_KEY` in your Vercel project environment variables.

## Project structure

```
src/
  app/              # Next.js App Router pages & layout
  components/chat/  # Chat UI components
  lib/              # API client & shared types
```
