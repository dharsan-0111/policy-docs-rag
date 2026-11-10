# Policy Docs RAG

A NestJS backend that answers questions about company policy documents using
**RAG** (Retrieval-Augmented Generation): it finds the most relevant pieces of
your documents, then asks a local LLM to answer **only** from those pieces, and
tells you which documents the answer came from.

Everything runs locally: Postgres + pgvector in Docker, embeddings and chat via
[Ollama](https://ollama.com).

```
GET /search/chat?q=how many annual leaves can I take in a year?

{
  "answer": "For employees with 0-3 years of service, you can take up to 24 days ...",
  "sources": [{ "title": "acme_corp_leave_and_holiday_policy.md" }]
}
```

## How it works

```
 Ingestion (POST /ingestion/run)
 docs/*.md ──► split into ~500-word chunks ──► embed each chunk ──► Postgres (pgvector)
                (50-word overlap)              (nomic-embed-text)

 Question (GET /search/chat?q=...)
 question ──► embed ──► 3 nearest chunks ──► drop chunks with distance ≥ 0.50
                         (cosine <=>)              │
                                                   ├─ none left ──► "I don't know" (no LLM call)
                                                   └─ some left ──► prompt LLM with chunks ──► answer + sources
                                                                    (qwen2.5:7b, temperature 0)
```

1. **Ingestion** reads every Markdown file in `docs/`, saves one `document` row per
   file, splits the text into chunks, turns each chunk into a 768-number
   embedding, and saves it in the `chunk` table. Re-running replaces the old rows
   for the same file.
2. **Retrieval** embeds the question and uses pgvector's cosine distance
   (`<=>`) to find the 3 closest chunks.
3. **Cutoff** throws away chunks with distance `≥ 0.50`, so off-topic questions
   get "I don't know" quickly without asking the model.
4. **Generation** sends the remaining chunks + the question to the chat model,
   with a system prompt that says to use only the given context.
5. **Sources** returns each document title used, once.

## Tech stack

| Part | Tool |
|---|---|
| API framework | NestJS 11 (TypeScript) |
| Database | PostgreSQL 13 + pgvector (Docker) |
| ORM | TypeORM |
| Embeddings | Ollama `nomic-embed-text` (768 dims), via the OpenAI SDK |
| Chat model | Ollama `qwen2.5:7b`, via the OpenAI SDK |
| Auth | bcrypt passwords + JWT stored in an HTTP cookie |
| Tests / lint | Vitest, oxlint, Prettier |

## Project structure

```
docs/                      policy documents to ingest (.md)
src/
  authentication/          signup, login, AuthGuard (reads the `jwt` cookie)
  user/                    user entity + routes
  documents/               Document + Chunk entities, document CRUD
  ingestion/               reads docs/, chunks, embeds, saves
  embeddings/              EmbeddingService (question/chunk -> numbers)
  llm/                     LlmService (chat completion)
  search/                  vector search + RAG chat endpoint
  utils/util.service.ts    makeChunks() chunking logic
```

## Getting started

### Prerequisites

- Node.js 20+ and npm
- Docker
- [Ollama](https://ollama.com) running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Pull the models

```bash
ollama pull nomic-embed-text
```

```bash
ollama pull qwen2.5:7b
```

### 3. Start Postgres

```bash
docker compose up -d
```

Enable the pgvector extension once (the app needs it before it can create the
`vector` column):

```bash
docker exec -it postgres_db psql -U postgres -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 4. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`. Values that work with the local setup above:

| Variable | Example | Meaning |
|---|---|---|
| `EMBEDDING_BASE_URL` | `http://localhost:11434/v1` | Ollama's OpenAI-compatible API (used for chat too) |
| `EMBEDDING_API_KEY` | `ollama` | Any non-empty string; Ollama ignores it |
| `EMBEDDING_MODEL` | `nomic-embed-text` | Embedding model |
| `CHAT_MODEL` | `qwen2.5:7b` | Chat model |
| `JWT_SECRET` | a long random string | Signs and checks login tokens |
| `DB_HOST` | `localhost` | |
| `DB_PORT` | `5432` | |
| `DB_USERNAME` | `postgres` | Matches `docker-compose.yml` |
| `DB_PASSWORD` | `postgres` | Matches `docker-compose.yml` |
| `DB_DATABASE` | `postgres` | Matches `docker-compose.yml` |

### 5. Run the app

```bash
npm run start:dev
```

The API listens on `http://localhost:3000`.

### 6. Ingest the documents

```bash
curl -X POST http://localhost:3000/ingestion/run
```

## Using the API

Search routes need you to be logged in. Login sets a `jwt` cookie (valid for 1
hour) that is sent back automatically by Postman or by curl with a cookie jar.

```bash
curl -X POST http://localhost:3000/authentication/signup -H "Content-Type: application/json" -d '{"emailId":"me@example.com","password":"secret123"}'
```

```bash
curl -c cookies.txt -X POST http://localhost:3000/authentication/login -H "Content-Type: application/json" -d '{"emailId":"me@example.com","password":"secret123"}'
```

```bash
curl -b cookies.txt -G http://localhost:3000/search/chat --data-urlencode "q=how many annual leaves can I take in a year?"
```

### Endpoints

| Method | Path | Auth | What it does |
|---|---|---|---|
| POST | `/authentication/signup` | – | Create a user |
| POST | `/authentication/login` | – | Log in, sets the `jwt` cookie |
| POST | `/ingestion/run` | – | Re-ingest everything in `docs/` |
| GET | `/search?q=...` | ✅ | The 3 closest chunks with their distances (good for debugging) |
| GET | `/search/chat?q=...` | ✅ | RAG answer + sources |
| GET | `/user`, `/user/:id` | ✅ | User routes |
| GET/POST/PATCH/DELETE | `/documents...` | – | Document CRUD, `/documents/count`, `/documents/search` |

## Tuning the cutoff

The distance cutoff (`0.50` in `src/search/search.service.ts`) was picked by
testing real questions: `0.45` dropped a correct chunk at `0.46`, and `0.55` let
in an unrelated document at `0.534`. If you add documents or change the
embedding model, call `GET /search?q=...` with a few real questions and check
the `distance` values before changing it.

## Scripts

| Command | What it does |
|---|---|
| `npm run start:dev` | Run with auto-reload |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run the compiled build |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests |
| `npm run lint` | Lint with oxlint |
| `npm run format` | Format with Prettier |

## Known limitations

- `/ingestion/run` and `/documents` routes are not behind login yet.
- `synchronize: true` lets TypeORM change tables automatically, which is fine
  for development but not for production (use migrations there).
- Only Markdown files in `docs/` are ingested.
