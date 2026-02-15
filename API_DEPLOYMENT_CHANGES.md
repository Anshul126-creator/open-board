# API Deployment Changes Guide

This document lists what to change when deploying the API to the internet, and how domain and hosting should be set up.

**Scope**: `backend` (Laravel API) and `frontend` (Vite/React or similar).

---

**1) Public API Base URL**

When deploying, your frontend must call the public API URL instead of `http://localhost:8000`.

Set a single source of truth in the frontend, typically via an environment variable:

- `VITE_API_BASE_URL=https://api.example.com`

Then use it everywhere you make HTTP calls.

If your code hardcodes `http://localhost:8000`, change it to use the env var.

---

**2) CORS (Backend)**

Your API must allow the frontend domain.

Update `backend/config/cors.php`:

- Add your frontend domain to `allowed_origins`, for example:
  - `https://app.example.com`
  - `https://example.com`

If you have multiple environments, consider using an env variable:

- `CORS_ALLOWED_ORIGINS=https://app.example.com,https://example.com`

Then parse it in `config/cors.php`.

Also ensure you do not set manual CORS headers in `backend/public/index.php`.

---

**3) Session/Auth Cookies (If Using Sanctum)**

If you use cookie-based auth:

- Set `SANCTUM_STATEFUL_DOMAINS=app.example.com`
- Set `SESSION_DOMAIN=.example.com`
- Ensure `SESSION_SECURE_COOKIE=true` in production.

If you use token-based auth, this section can be skipped.

---

**4) HTTPS**

Your API must be served via HTTPS, and your frontend should call the HTTPS URL.

Most browsers will block requests from an HTTPS site to an HTTP API.

---

**5) API Routes**

Your API routes should be under `/api/*`.

Your frontend should call:

- `https://api.example.com/api/auth/login`

Avoid calling `/` unless you expose a health check route.

---

**6) Environment Files**

Backend `.env` (examples):

- `APP_ENV=production`
- `APP_URL=https://api.example.com`
- `APP_DEBUG=false`
- `FRONTEND_URL=https://app.example.com` (if referenced in CORS or redirects)

Frontend `.env` (examples):

- `VITE_API_BASE_URL=https://api.example.com`

---

**7) Domain and Hosting Setup**

Typical structure:

- Frontend: `https://app.example.com` or `https://example.com`
- API: `https://api.example.com`

DNS:

- `A` record for `api.example.com` -> API server IP
- `A` record for `app.example.com` -> frontend hosting IP (or use CNAME if required)

Hosting:

- API server should point the web root to `backend/public`
- Frontend hosting should serve the built static assets (e.g., `frontend/dist`)

---

**8) Laravel Cache and Config**

After changing `.env` in production:

1. `php artisan optimize:clear`
2. `php artisan config:cache`
3. `php artisan route:cache` (optional)

---

**9) Smoke Test Checklist**

Before launch:

1. Open `https://api.example.com/` (if you keep a health check).
2. Call a login endpoint from the deployed frontend.
3. Check browser console for CORS errors.
4. Verify auth/session behavior.

---

**Recommended Minimal Health Check**

Add a safe health check in `backend/routes/web.php`:

```
Route::get('/', fn () => response()->json(['status' => 'OK']));
```

This should not expose app internals.
