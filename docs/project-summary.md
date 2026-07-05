# Project Summary

## Project Purpose

A web application for creating, managing, and reviewing image-based safety observations. Users can upload images, annotate them with notes, specify locations, categories and status, while supervisors review and manage observations.

**Current status:** This is a fresh scaffold from the Laravel React Starter Kit. No custom domain logic, migrations, models, or business features have been implemented yet. The codebase is at the starting point with only authentication and user settings in place.

## Technology Stack

### Backend
- **Framework:** Laravel 13.x (`laravel/framework ^13.17`)
- **Language:** PHP 8.3+
- **Database:** SQLite (development), MySQL (production intended via `.env.example`)
- **Auth:** Laravel Fortify 1.x (`laravel/fortify ^1.37.2`)
- **Inertia:** `inertiajs/inertia-laravel ^3.0`
- **Wayfinder:** `laravel/wayfinder ^0.1.14` (typed route generation)
- **Chisel:** `laravel/chisel ^0.1.0` (Laravel dev server)

### Frontend
- **Framework:** React 19 with TypeScript
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS 4 with `tailwind-merge`, `clsx`, `class-variance-authority`, `tw-animate-css`
- **UI primitives:** Radix UI (avatar, checkbox, collapsible, dialog, dropdown-menu, navigation-menu, select, separator, sidebar, toggle, tooltip)
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Linting/Formatting:** ESLint 9, Prettier (with Tailwind plugin), TypeScript ESLint

### Testing & Quality
- **Testing:** Pest PHP 4.x (`pestphp/pest ^4.7`)
- **Static analysis:** PHPStan via Larastan (`larastan/larastan ^3.9`)
- **Code style:** Laravel Pint (`laravel/pint ^1.27`)

### Infrastructure
- **Package manager:** pnpm (with `pnpm-workspace.yaml`)
- **Concurrent dev:** `concurrently` runs Vite + Laravel dev server

## High-Level Architecture

**Monolithic Laravel application serving a React SPA via Inertia.js.**

- No separate API layer (`routes/api.php` does not exist).
- All routing is server-side (Laravel routes return Inertia page responses).
- Frontend is a full React SPA managed through Inertia's client-side routing.
- Authentication is handled server-side by Laravel Fortify with Inertia-powered views.
- No separate backend/frontend split — the React app is served from within Laravel.

## Folder Structure

```
/
├── app/                          # Laravel application code
│   ├── Actions/Fortify/          # Fortify action classes (CreateNewUser, ResetUserPassword)
│   ├── Concerns/                 # Shared traits (PasswordValidationRules, ProfileValidationRules)
│   ├── Console/                  # Artisan commands (empty)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php    # Base controller
│   │   │   └── Settings/         # Settings controllers (Profile, Security)
│   │   ├── Middleware/           # HandleAppearance, HandleInertiaRequests
│   │   └── Requests/Settings/    # Form requests (PasswordUpdate, ProfileDelete, ProfileUpdate, TwoFactorAuth)
│   ├── Models/                   # User model (only model)
│   └── Providers/                # AppServiceProvider, FortifyServiceProvider
├── bootstrap/                    # Laravel bootstrap
├── config/                       # Configuration files
├── database/
│   ├── factories/                # Model factories
│   ├── migrations/               # Only default Laravel migrations (users, cache, jobs)
│   └── seeders/                  # Database seeders
├── docs/                         # Project documentation
│   ├── project-summary.md        # This file
│   └── decision-log.md           # Architectural decisions
├── openspec/                     # OpenSpec workflow directory
│   ├── changes/                  # Active/archived changes (empty)
│   ├── specs/                    # Specification files (empty)
│   └── config.yaml               # OpenSpec config
├── resources/
│   └── js/                       # React SPA frontend
│       ├── actions/              # Server-side action classes (mirrored for Wayfinder types)
│       ├── components/           # Reusable React components
│       │   └── ui/               # Radix UI wrapper components
│       ├── hooks/                # Custom React hooks
│       ├── layouts/              # Page layouts (app, auth, settings)
│       ├── lib/                  # Utility functions
│       ├── pages/                # Page components (auth/, settings/, welcome, dashboard)
│       ├── routes/               # Wayfinder route definitions
│       ├── types/                # TypeScript type definitions
│       └── wayfinder/            # Auto-generated route types
├── routes/
│   ├── web.php                   # Web routes (home, dashboard, settings)
│   └── settings.php              # Settings routes (profile, security, appearance)
├── tests/
│   ├── Feature/                  # Feature tests (Pest)
│   ├── Unit/                     # Unit tests (Pest)
│   ├── Pest.php                  # Pest configuration
│   └── TestCase.php              # Base test case
├── vendor/                       # Composer dependencies
├── node_modules/                 # npm dependencies
├── composer.json
├── package.json
├── pnpm-workspace.yaml
├── vite.config.ts
└── tsconfig.json
```

## Authentication Mechanism

**Laravel Fortify** handles all authentication:

- **Features enabled:** Registration, Password Reset, Email Verification
- **2FA:** Two-factor authentication is configured in the User model and Security settings page (under development)
- **Rate limiting:** Login is throttled to 5 attempts per minute per email+IP
- **Password rules:** Minimum 12 characters with mixed case, letters, numbers, symbols, and uncompromised check (production); no constraints in development
- **Verification:** Email verification is required for certain routes (e.g., profile deletion, security settings)
- **Session-based:** Authentication uses the `web` guard with database session driver
- **Redirection:** Post-login redirects to `/dashboard`

## Database Structure (High-Level)

Only **default Laravel tables** exist (no custom domain tables):

| Table | Purpose |
|---|---|
| `users` | User accounts (id, name, email, password, 2FA fields, timestamps) |
| `password_reset_tokens` | Password reset tokens |
| `sessions` | User sessions |
| `cache` | Cache store |
| `cache_locks` | Cache lock management |
| `jobs` | Queue jobs |
| `job_batches` | Batch job tracking |
| `failed_jobs` | Failed job records |

The `users` table has basic fields: `id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `timestamps`.

## Existing Features and Modules

### Authentication (fully implemented)
- User registration
- Login
- Password reset (via email)
- Email verification
- Password confirmation
- Login rate limiting

### User Settings (fully implemented)
- **Profile:** Edit name and email, delete account
- **Security:** Update password, manage two-factor authentication
- **Appearance:** Theme toggle (light/dark mode)

### Pages
- Welcome/landing page (`/`)
- Dashboard (`/dashboard`) — authenticated, verified users only
- Auth pages (login, register, forgot/reset password, verify email, confirm password)
- Settings pages (profile, security, appearance)

## Coding Conventions and Architectural Patterns

### Backend Conventions
- **Small controllers** — controllers delegate to Form Requests, Actions, or Policies
- **Form Requests** — validation is always in Form Request classes, never in controllers
- **Eloquent** — models use relationships and attributes (PHP 8 attributes for fillable/hidden)
- **No API** — no REST API layer; all data flows through Inertia server-side rendering
- **Actions pattern** — complex business logic extracted into action classes (e.g., Fortify actions)
- **Concerns/traits** — shared validation rules extracted into traits
- **Policies** — to be used for authorization (none defined yet)

### Frontend Conventions
- **React functional components** — no class components
- **Custom hooks** — reusable logic extracted into hooks (useAppearance, useClipboard, etc.)
- **Small, focused components** — each component has a single responsibility
- **Radix UI primitives** — accessible, unstyled UI components wrapped in project-specific components
- **Tailwind CSS** — utility-first styling with no CSS modules or styled-components
- **TypeScript** — typed throughout with strict mode

### Testing Conventions
- **Pest PHP** — test framework for both Feature and Unit tests
- **SQLite in-memory** — test database
- **Composer scripts** — `composer test` runs lint, static analysis, and Pest tests

## Notable Observations

1. **Greenfield project** — This is a fresh Laravel React Starter Kit installation. No custom domain features (safety observations, image uploads, categories, etc.) have been implemented. All custom migrations, models, controllers, and frontend pages are yet to be built.

2. **Documentation gaps** — Both `docs/project-summary.md` and `docs/decision-log.md` were empty and have been initialized by this analysis.

3. **OpenSpec workflow** — The `.opencode/` directory and `openspec/` directory are set up for OpenSpec-driven development, but no changes or specs have been created yet.

4. **Developer environment uses SQLite** — The `.env.example` defaults to SQLite for local development, while production is expected to use MySQL. Tests also use SQLite in-memory.

5. **Wayfinder integration** — The project uses Laravel Wayfinder for typed routes, with route definitions mirrored in `resources/js/routes/` and auto-generated types in `resources/js/wayfinder/`.

6. **Frontend routes are organized by feature** — Each auth feature (login, register, password, verification) has its own route file under `resources/js/routes/`, which aligns with the backend route structure.

7. **No service layer yet** — The project currently has no service classes, which aligns with the AGENTS.md guidance to use services only for complex business logic.

8. **Pnpm over npm** — The project uses pnpm as the package manager (indicated by `pnpm-workspace.yaml` and `pnpm-lock.yaml`).

9. **PHP 8 attributes** — The User model uses PHP 8 native attributes (`#[Fillable]`, `#[Hidden]`) instead of traditional `$fillable`/`$hidden` properties.

10. **Production password rules are strict** — In production, passwords require minimum 12 characters, mixed case, letters, numbers, symbols, and uncompromised check. Development has no constraints.
