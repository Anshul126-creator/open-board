# Next Steps to Complete the Openboard Project

This checklist summarizes the highest–impact actions required to bring the backend into a production-ready state. Work from top to bottom; items are grouped so that environment setup issues are resolved before feature polishing.

---

## 1. Restore the Laravel Runtime Skeleton

- **Bootstrap files:** recreate `bootstrap/app.php` and `public/index.php` from a stock Laravel 12 installation so Artisan and HTTP entrypoints function.
- **Route & provider stubs:** add the default `routes/web.php` and populate `app/Providers/*` (AppServiceProvider, AuthServiceProvider, RouteServiceProvider). Wire them up in `config/app.php`.
- **Environment template:** ensure `.env` mirrors Laravel defaults plus project-specific variables (JWT, queue, mail, storage, etc.).

## 2. Configuration Baseline

- **Complete `/config`** with the standard files (app, auth, broadcasting, cache, cors, database, filesystems, hashing, logging, mail, queue, services, session, view, etc.).
- **Database driver defaults:** confirm `config/database.php` references `Illuminate\Support\Str` and includes all needed connections (mysql/pgsql/sqlite/testing).
- **Storage disks:** configure a `public` disk for timetable & certificate uploads and run `php artisan storage:link`.
- **Cache/queue/mail:** decide on redis vs. database queues, SMTP settings, etc., and update `.env` placeholders accordingly.

## 3. Authentication & Authorization

- **JWT dependency:** add `tymon/jwt-auth` (or Laravel Sanctum/Passport) via Composer, publish its config, and generate the signing secret.
- **Auth guards:** update `config/auth.php` to expose an `api` guard backed by JWT and ensure middleware stacks reference it (e.g., `Route::middleware('auth:api')`).
- **Role/permission policy:** extract `User::isAdmin()` helpers into Gates/Policies; lock down controllers with middleware (admin-only center mgmt, etc.).

## 4. File & Document Handling

- **TimetableController syntax:** fix the stray brace, round out exception handling, and centralize validation responses via `ApiResponder` to avoid copy/paste logic.
- **Certificate PDF templates:** add `resources/views/certificates/template.blade.php` and test PDF generation locally (install `barryvdh/laravel-dompdf` or equivalent).
- **Upload validation:** move hard-coded size/type checks into config so the front end can display accurate limits.

## 5. Database & Domain Logic

- **Migrations:** verify foreign keys & cascading rules across all tables (`results`, `timetables`, `fee_structures`, etc.) and fill in seeders/factories for demo data.
- **Eloquent models:** align relationships (e.g., `ClassModel` vs. `Class` naming) and add scopes for center/session filtering to avoid N+1 queries.
- **Business rules:** implement aggregate helpers (result publication, fee calculations, payment reconciliation) inside service classes instead of controllers.

## 6. API Experience

- **Request validation classes:** replace inline Validator usage with Form Request objects (e.g., `StoreStudentRequest`) for consistency and automatic authorization hooks.
- **Error format:** standardize on `ApiResponder` for success/error payloads; ensure every controller returns the same JSON schema.
- **Pagination & filtering:** avoid returning entire tables; add pagination, search, and center-based filtering to `index` endpoints.
- **OpenAPI spec:** generate Swagger documentation (e.g., `darkaonline/l5-swagger`) so the front end and integrators know the contract.

## 7. Testing & Quality Gates

- **Unit/feature tests:** cover auth, CRUD modules, file uploads, and result calculations. Seed an in-memory SQLite database for CI.
- **Static analysis & style:** configure `laravel/pint` plus `phpstan` (level 5+) and add them to CI scripts.
- **CI workflow:** create a GitHub Actions pipeline to run lint → phpunit → build (including `npm run build`).

## 8. Frontend/Build Tooling

- **Vite/Tailwind:** ensure `npm install`, `npm run dev`, and `npm run build` succeed; add a `resources/` tree (JS, CSS, Blade) rather than shipping empty directories.
- **Env parity:** document how to run `composer run dev` which concurrently starts `php artisan serve`, queue workers, log tailing, and Vite.

## 9. Deployment & Ops

- **Docker:** finalize the provided `Dockerfile` or add docker-compose with services for app + database + queue + cache.
- **Logging & monitoring:** configure centralized logging (Stack channel) and health checks (`/health` already exists—wire into infrastructure).
- **Backups & migrations:** add scripts or GitHub Actions to run migrations and seed default admin accounts on deploy.

## 10. Documentation & Handover

- Update `README.md` to describe:
  - Prerequisites (PHP, Node, Postgres, Redis, queue workers)
  - Installation steps (`composer install`, `.env`, migrations, npm build)
  - Available npm/composer scripts
  - API reference & auth flow
- Add a CHANGELOG and CONTRIBUTING guide once the base is stable.

---

### How to Use This File
Check off each bullet as you complete it. Once everything here is done, the backend will resemble a standard, fully‑wired Laravel 12 application that is safe to expose to other teams and environments.
