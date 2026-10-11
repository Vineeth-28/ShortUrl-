# URL Shortener API

A TypeScript backend starter for a URL shortener, built with Express. Redis and
tRPC are included in the dependency stack for the planned URL storage and
type-safe API, alongside request validation, correlation IDs, and structured
logging.

> **Status:** This repository is still a scaffold. The current server exposes
> ping and health-check routes; Redis is not connected and no tRPC router or
> URL-shortening procedures have been implemented yet. The README distinguishes
> the current behavior from the intended stack so setup instructions stay
> accurate.

---

## Features and current status

- ⚡ **Express 5 + TypeScript** — HTTP server and TypeScript source
- 🔢 **Versioned routes** — Express routers mounted under `/api/v1` and `/api/v2`
- ✅ **Zod validation** — request-body schema used by the ping route
- 🔍 **Request correlation IDs** — each request receives a UUID used by the logger
- 📝 **Winston logging** — console, daily-rotating file, and MongoDB transports
- 🔴 **Redis** — `redis` package is installed; connection and URL storage are not
  wired up yet
- 🔗 **tRPC** — `@trpc/server` is installed; router, adapter, and procedures are
  not wired up yet
- 🎨 **Prettier** — formatting scripts for TypeScript source
- 🔄 **Nodemon** — restarts the development server when files change

### Planned URL-shortener API

The intended application can use tRPC procedures to create and resolve short
links, with Redis storing the short-code-to-destination mapping. These
procedures and the Redis integration are not available in the current code yet.

---

## Tech stack

| Category | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| HTTP framework | Express 5 |
| RPC server | tRPC (`@trpc/server`, integration pending) |
| URL storage | Redis (`redis`, integration pending) |
| Validation | Zod |
| Logging | Winston, daily-rotate-file, winston-mongodb |
| Dev tools | Nodemon, ts-node, tsx, Prettier |

---

## Project structure

```text
.
├── src/
│   ├── config/             # Server configuration and logger
│   ├── controllers/        # Ping controller
│   ├── middlewares/        # Error handling and request correlation
│   ├── routes/
│   │   ├── v1/             # Ping routes
│   │   └── v2/             # Empty route namespace
│   ├── utils/              # Errors and request-context helpers
│   ├── validators/         # Ping request schema
│   └── server.ts           # Express entry point
├── logs/                   # Runtime log files
├── package.json
├── tsconfig.json
└── README.md
```

---

## Requirements

- Node.js 18 or newer
- npm
- MongoDB is optional for startup, but the Winston MongoDB transport defaults
  to `mongodb://localhost:27017/urlshortnerlog` when `MONGODB_URI` is not set
- Redis is not required by the current scaffold; it will be needed once the
  planned Redis integration is implemented

---

## Quick start

```bash
git clone <your-repository-url>
cd <your-repository-directory>
npm install
npm run dev
```

The server listens on `http://localhost:3004` by default. Set `PORT` in the
process environment to use a different port.

There is no committed `.env.example` file at this time. The current server reads
`PORT` from the process environment. The logger reads `MONGODB_URI` and falls
back to its local MongoDB URL if it is unset. Redis configuration is not
implemented yet.

---

## Current endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/ping/health` | Health check; responds with `OK` |
| `GET` | `/api/v1/ping` | Ping endpoint; validates a body containing a non-empty `message` |

The `/api/v2` namespace is mounted but currently has no routes. There are no
short-link creation or redirect endpoints yet.

---

## Available scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `npx nodemon src/server.ts` | Start the development server |
| `npm run build` | `tsc` | Compile TypeScript into `dist/` |
| `npm start` | `node dist/server,js` | Start the compiled server (**currently has a typo; see note below**) |
| `npm run format` | `prettier --write "src/**/*.ts"` | Format TypeScript source |
| `npm run format:check` | `prettier --check "src/**/*.ts"` | Check TypeScript formatting |
| `npm test` | — | Not configured yet |

> **Production start script:** `package.json` currently uses
> `node dist/server,js`. The comma is a typo; change it to
> `node dist/server.js` before using `npm start`.

---

## Logging and request tracing

Winston is configured to write logs to:

1. The console.
2. Daily rotating files under `logs/` (up to 20 MB per file, retained for
   14 days).
3. A MongoDB collection named `logs`, using `MONGODB_URI` or the local fallback.

The correlation middleware assigns a UUID to each request. The logger includes
the correlation ID in its structured log output.

---

## Building for production

```bash
npm run build
```

This compiles the TypeScript in `src/` to `dist/`. After correcting the `start`
script typo in `package.json`, run the compiled server with:

```bash
npm start
```

---

## Next steps

- Configure and connect a Redis client.
- Add tRPC initialization, an Express adapter, and typed procedures.
- Implement short-link creation, lookup, and redirect behavior.
- Add environment validation and document Redis connection settings.
- Add tests for URL creation, lookup, validation, and error handling.

---

## License

ISC