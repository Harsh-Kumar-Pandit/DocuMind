# DocuMind authentication backend

## Strategy

DocuMind uses opaque, random session tokens stored in an HttpOnly cookie. Only a SHA-256 hash of the token is stored in PostgreSQL. Sessions expire after `SESSION_DAYS` days and logout deletes the current session. Cookies are `Secure` in production and use `SameSite=lax` by default; the frontend must send requests with credentials. This same-site cookie policy provides the CSRF boundary for the current browser deployment. If the frontend and API become cross-site, add a deliberate CSRF token strategy before changing SameSite to `none`.

Passwords are hashed with bcrypt using `BCRYPT_ROUNDS` (12 by default). Passwords, tokens, cookies, authorization headers, and hashes are not returned to clients or logged.

## Environment

Copy `.env.example` to `.env` and set `DATABASE_URL`, `FRONTEND_ORIGIN`, and the existing AI provider variables. Never commit `.env`. `FRONTEND_ORIGIN` accepts a comma-separated allow-list.

## Database migration and legacy documents

Inspect migration state before applying changes:

```bash
npx prisma migrate status
npx prisma migrate deploy
npx prisma generate
```

The additive migration `20261023130000_add_auth_and_document_ownership` creates `User` and `Session`, then adds nullable `Document.ownerId`. Existing documents remain with `NULL` ownership and are not assigned to an arbitrary user. They cannot be listed or accessed through the authenticated document/conversation API until an explicit future ownership-assignment workflow exists. New uploads always require authentication and receive the current user's ID. No reset or destructive migration is used.

## Endpoints

All auth responses contain safe user fields only.

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{"name":"Ada Lovelace","email":"ada@example.com","password":"correct-horse-42"}
```

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{"email":"ada@example.com","password":"correct-horse-42"}
```

After login, keep the returned cookie in Postman and call:

```http
GET http://localhost:5000/api/auth/me
POST http://localhost:5000/api/auth/logout
```

Registration and login are rate-limited in memory per IP and route. In a multi-instance production deployment, replace this limiter with shared storage.

## Frontend integration

Use `credentials: "include"` with every API request, including `/api/auth/login`, `/api/auth/me`, and document/conversation requests. Do not store the session token in localStorage or expose it to JavaScript. The future `/signin` and `/signup` pages should display generic login errors and handle `401` responses by redirecting to authentication.

Start the API with:

```bash
npm install
npm run dev
```

Social login, email verification, password reset, billing, and legacy-document claiming are intentionally future work.
