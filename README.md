# URL Shortener API

A URL-shortening backend built with **TypeScript**, **Express**, **tRPC**,
**MongoDB**, and **Redis**. The API validates submitted URLs, creates compact
Base62 short codes, stores URL records in MongoDB, and uses Redis for ID
generation and URL-mapping cache.

## Highlights

- Create short links using a validated tRPC mutation.
- Resolve short codes using a tRPC query.
- Generate compact Base62 codes from an atomic Redis counter.
- Persist URL records in MongoDB with Mongoose.
- Validate procedure inputs with Zod.
- Add request correlation IDs and structured logging with Winston.
- Test the API with the included Postman collection.

## Technology

| Area               | Technology                                       |
| ------------------ | ------------------------------------------------ |
| Language           | TypeScript                                       |
| HTTP server        | Express 5                                        |
| API                | tRPC                                             |
| Validation         | Zod                                              |
| Persistent storage | MongoDB and Mongoose                             |
| Counter and cache  | Redis                                            |
| Logging            | Winston, daily rotating files, MongoDB transport |

## Requirements

- Node.js 20+
- npm
- MongoDB
- Redis

The default local configuration expects MongoDB at
`mongodb://localhost:27017/urlshortner` and Redis at `redis://localhost:6379`.
The MongoDB logger transport uses the `urlshortnerlog` database by default.

## Getting started

```bash
git clone https://github.com/<your-github-username>/<your-repository>.git
cd <your-repository>
npm install
```

Configure the following environment variables for your environment:

| Variable            | Default                                    | Purpose                              |
| ------------------- | ------------------------------------------ | ------------------------------------ |
| `PORT`              | `3004`                                     | HTTP server port                     |
| `MONGO_URI`         | `mongodb://localhost:27017/urlshortner`    | URL database connection              |
| `MONGO_URL`         | `mongodb://localhost:27017/urlshortnerlog` | MongoDB log transport connection     |
| `REDIS_URL`         | `redis://localhost:6379`                   | Redis connection                     |
| `REDIS_COUNTER_KEY` | `url_shornter_counter`                     | Redis key for the short-code counter |
| `BASE_URL`          | `shortner.com`                             | Configured public base URL           |

Start the development server:

```bash
npm run dev
```

By default, the API is available at `http://localhost:3004`. Start MongoDB and
Redis before creating URLs. Use your deployment's environment-variable settings
for hosted services; do not commit credentials or private connection strings.

## API reference

The tRPC Express adapter is mounted at `/trpc`.

### Create a short URL

**Procedure:** `url.create`  
**Method:** `POST`  
**Endpoint:** `http://localhost:3004/trpc/url.create`

Send the procedure input as JSON:

```json
{
  "originalUrl": "https://example.com/articles/getting-started"
}
```

Example:

```bash
curl -X POST http://localhost:3004/trpc/url.create \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com/articles/getting-started"}'
```

Successful response (`200 OK`):

```json
{
  "result": {
    "data": {
      "id": "65a000000000000000000000",
      "shortUrl": "1",
      "originalUrl": "https://example.com/articles/getting-started",
      "createdAt": "2026-01-01T12:00:00.000Z",
      "updatedAt": "2026-01-01T12:00:00.000Z"
    }
  }
}
```

The returned `shortUrl` is the short code. Use it as input to the lookup
procedure.

### Look up the original URL

**Procedure:** `url.getOriginalUrl`  
**Method:** `GET`  
**Endpoint:** `http://localhost:3004/trpc/url.getOriginalUrl`

The `input` query parameter is JSON containing the short code. For example, to
look up code `1`:

```text
http://localhost:3004/trpc/url.getOriginalUrl?input=%7B%22shortUrl%22%3A%221%22%7D
```

Example with curl:

```bash
curl --get http://localhost:3004/trpc/url.getOriginalUrl \
  --data-urlencode 'input={"shortUrl":"1"}'
```

Successful response (`200 OK`):

```json
{
  "result": {
    "data": {
      "originalUrl": "https://example.com/articles/getting-started",
      "shortUrl": "1"
    }
  }
}
```

### Validation errors

`url.create` requires a valid absolute URL. Invalid input returns `400 Bad
Request` with a Zod validation error:

```json
{
  "originalUrl": "not a valid URL"
}
```

### Ping and health routes

| Method | Path                  | Description                                                                     |
| ------ | --------------------- | ------------------------------------------------------------------------------- |
| `GET`  | `/api/v1/ping/health` | Returns `OK` when the server responds                                           |
| `GET`  | `/api/v1/ping`        | Ping route; currently validates a request body containing a non-empty `message` |

## Postman

Import [`postman/URL-Shortener.postman_collection.json`](./postman/URL-Shortener.postman_collection.json)
into Postman. The collection includes:

1. A valid URL creation request.
2. A lookup request that uses the short code saved by the create request.
3. An invalid URL request to check validation behavior.

The collection's `baseUrl` variable defaults to `http://localhost:3004`.

## Development scripts

| Command                | Description                                 |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Run the TypeScript server using Nodemon     |
| `npm run build`        | Compile TypeScript from `src/` into `dist/` |
| `npm run format`       | Format TypeScript files with Prettier       |
| `npm run format:check` | Check TypeScript formatting                 |

Build the application with:

```bash
npm run build
```

To run the generated entry point directly:

```bash
node dist/server.js
```

> **Note:** The current `npm start` script references `dist/server,js` (comma)
> rather than `dist/server.js` (period). Until that script is corrected, use
> `node dist/server.js` to start the compiled application.

Automated tests are not configured yet; `npm test` is currently a placeholder.

## Project structure

```text
src/
├── config/          # Application, database, Redis, and logger configuration
├── controllers/     # Ping and URL handlers
├── dtos/            # URL data transfer types
├── middlewares/     # Error handling and request correlation
├── models/          # Mongoose URL model
├── repositories/    # MongoDB and Redis data access
├── routes/          # tRPC and versioned Express routes
├── service/         # URL shortening and lookup logic
├── utils/           # Base62 conversion and shared errors/helpers
└── validators/      # Request schemas

postman/
└── URL-Shortener.postman_collection.json
```

## License

ISC
