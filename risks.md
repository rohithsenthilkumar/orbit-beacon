# Risk Table (Level 0 — L0.1 / L0.3)

Major planted security, reliability, and build issues found in the `orbit-beacon` repository, sorted by severity.

| Severity | Problem | Location | How Found | Fixable? / Action |
|----------|---------|----------|-----------|-------------------|
| **High** | **SQL Injection** — `req.query.status` is concatenated directly into the SQL query string. | `services/api/src/index.js` (`GET /api/orders`) | Manual code review | **Fixable:** Use parameterized queries (`$1`) and validate `status` against an allowlist. |
| **High** | **Committed Secrets & Hardcoded Credentials** — `DB_PASSWORD` and `GITHUB_TOKEN` committed in `.env.production`; DB password and `jwtSecret` hardcoded in JS files. | `services/api/.env.production`, `services/api/src/config.js`, `services/worker/src/index.js` | File & code review | **Partially Fixable:** Move config to env vars and git-ignore `.env*`. Already-leaked `GITHUB_TOKEN` and `DB_PASSWORD` in git history **cannot** be fixed by code—must be rotated externally. |
| **High** | **Stored XSS** — Order fields (`customer`, `item`, `status`) are rendered via `li.innerHTML` without escaping. | `services/frontend/src/app.js` (`loadOrders`) | Manual code review | **Fixable:** Render text safely using `textContent` instead of `innerHTML`. |
| **High** | **Path Traversal** — Static file server joins `req.url` directly to `root` without checking directory bounds, allowing `../` arbitrary file reads. | `services/frontend/serve.js` | Manual code review | **Fixable:** Validate resolved path stays inside `root`, and serve static files via Nginx in production. |
| **Medium** | **Unbounded Memory Leak (OOM Crash)** — Worker pushes a 256 KB `Buffer.alloc` into an in-memory `history` array on every order. | `services/worker/src/index.js` (`handle`) | Manual code review | **Fixable:** Remove the `history` array and debug buffer allocation. |
| **Medium** | **Secrets Logged at Startup** — Full `config` object (including `db.password` and `jwtSecret`) is printed to stdout. | `services/api/src/index.js` | Manual code review | **Fixable:** Remove the startup config log or redact sensitive fields. |
| **Medium** | **Stack Traces Exposed in API Errors** — HTTP 500 responses return `e.message` and `e.stack` to clients. | `services/api/src/index.js` | Manual code review | **Fixable:** Log errors server-side and return a generic error message. |
| **Medium** | **No Auth & Wildcard CORS** — All `/api/orders` routes are unauthenticated and `cors()` allows any origin (`*`). | `services/api/src/index.js` | Manual code review | **Fixable:** Restrict CORS origin via env var; add auth if required by product scope (note: public demo board may intentionally allow viewing/placing orders, so rate-limiting/Nginx is key). |
| **Medium** | **Hardcoded Localhost API URL** — Frontend hardcodes `http://localhost:3000/api`, which breaks when deployed behind a domain/HTTPS. | `services/frontend/src/app.js` | Manual code review | **Fixable:** Use a relative `/api` path and route through Nginx. |
| **Low** | **Worker Status Bug & No-Op `/health`** — Worker always calls `nextStatus('placed')` instead of using current DB status; `/health` doesn't check Postgres or Redis; migrations aren't tracked. | `services/worker/src/index.js`, `services/api/src/index.js`, `services/api/src/migrate.js` | Manual code review | **Fixable:** Read/update status properly, check DB/Redis in `/health`, and make migrations idempotent. |
| **Low** | **Missing Linter, `.gitignore`, and `.dockerignore`** — `npm run lint` is a placeholder `echo`. | `services/api/package.json`, `services/worker/package.json` | Repo structure check | **Fixable:** Add ESLint, `.gitignore`, and `.dockerignore` (covered in L1/L2). |

## Not Fixable by Code Alone
- **Leaked Credentials in Git History:** Removing `.env.production` in a new commit does not revoke `GITHUB_TOKEN` or `DB_PASSWORD`; they must be rotated/revoked externally.
- **Network & TLS Isolation:** Protecting Postgres/Redis from external access and serving HTTPS require Docker network isolation, Nginx, and cloud firewall rules (handled in Level 1 & Level 3).
