# Project Summary

## Project Purpose

A web application for creating, managing, and reviewing image-based safety observations. Users can upload images, annotate them with notes, specify sites, categories and status, while supervisors review and manage observations.

**Current status:** The application has been extended beyond the Laravel scaffold with three implemented feature sets: (1) user account status system (Active/Inactive/Suspended) with registration-as-inactive flow and middleware-based access gating, (2) full Role-Based Access Control (RBAC) using Spatie Laravel Permission with 5 roles and 20 permissions, and (3) an admin dashboard with complete CRUD for users and master data (projects, sites, observation categories). Observation CRUD (the core domain feature) has not been implemented yet.

## Technology Stack

### Backend
- **Framework:** Laravel 13.x (`laravel/framework ^13.17`)
- **Language:** PHP 8.3+
- **Database:** SQLite (development), MySQL (production intended via `.env.example`)
- **Auth:** Laravel Fortify 1.x (`laravel/fortify ^1.37.2`)
- **Inertia:** `inertiajs/inertia-laravel ^3.0`
- **Wayfinder:** `laravel/wayfinder ^0.1.14` (typed route generation)
- **Chisel:** `laravel/chisel ^0.1.0` (Laravel dev server)
- **RBAC:** `spatie/laravel-permission` (role and permission management)

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
- Authorization is handled server-side by Spatie Laravel Permission with Inertia-shared permission data.
- No separate backend/frontend split — the React app is served from within Laravel.

## Folder Structure

```
/
├── app/                          # Laravel application code
│   ├── Actions/Fortify/          # Fortify action classes (CreateNewUser, ResetUserPassword)
│   ├── Concerns/                 # Shared traits (PasswordValidationRules, ProfileValidationRules)
│   ├── Console/                  # Artisan commands
│   │   ├── Commands/SyncPermissions.php    # permissions:sync command
│   │   └── Commands/UsersStatusCommand.php # users:status command
│   ├── Enums/
│   │   ├── UserStatus.php        # Active=1, Inactive=2, Suspended=3
│   │   ├── Permission.php        # 20 permission string enum cases
│   │   └── Role.php              # 5 role cases with permission mapping method
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── UserController.php
│   │   │   │   ├── ProjectController.php
│   │   │   │   ├── SiteController.php
│   │   │   │   └── ObservationCategoryController.php
│   │   │   └── Settings/         # Settings controllers (Profile, Security)
│   │   ├── Middleware/
│   │   │   ├── CheckUserStatus.php    # Blocks inactive/suspended users
│   │   │   ├── HandleAppearance
│   │   │   └── HandleInertiaRequests
│   │   ├── Responses/
│   │   └── Requests/
│   │       ├── Admin/            # Form requests for admin CRUD
│   │       └── Settings/         # Form requests (PasswordUpdate, ProfileDelete, etc.)
│   ├── Models/
│   │   ├── User.php              # With HasRoles trait, UserStatus cast
│   │   ├── Project.php           # SoftDeletes, fillable name, hasMany sites
│   │   ├── Site.php              # SoftDeletes, fillable name+project_id, belongsTo project
│   │   └── ObservationCategory.php # SoftDeletes, fillable name
│   └── Providers/
│       ├── AppServiceProvider
│       └── FortifyServiceProvider
├── bootstrap/
├── config/
│   ├── permissions.php           # Resource-action mapping + master data list
│   └── permission.php            # Spatie package config
├── database/
│   ├── factories/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2026_07_05_192536_add_status_to_users.php
│   │   ├── 2026_07_07_150618_create_permission_tables.php
│   │   ├── 2026_07_09_000001_create_projects_table.php
│   │   ├── 2026_07_09_000002_create_locations_table.php
│   │   ├── 2026_07_09_000003_create_observation_categories_table.php
│   │   └── 2026_07_11_000001_rename_locations_table_to_sites.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── RoleAndPermissionSeeder.php
├── docs/
│   ├── project-summary.md        # This file
│   └── decision-log.md           # Architectural decisions
├── openspec/                     # OpenSpec workflow directory
│   ├── changes/                  # Active/archived changes
│   │   └── archive/              # 3 archived changes
│   ├── specs/                    # Canonical specifications
│   │   ├── auth/spec.md          # Auth + user account status
│   │   ├── rbac/spec.md          # RBAC (permissions, roles, authorization)
│   │   └── admin-dashboard/spec.md # Admin dashboard + user mgmt + master data
│   └── config.yaml
├── resources/
│   └── js/                       # React SPA frontend
│       ├── components/
│       │   └── ui/               # Radix UI wrapper components
│       ├── hooks/
│       ├── layouts/
│       ├── lib/
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── dashboard.tsx
│       │   │   ├── users/index.tsx, create.tsx, edit.tsx
│       │   │   ├── projects/index.tsx, create.tsx, edit.tsx
│   │   │   ├── sites/index.tsx, create.tsx, edit.tsx
│       │   │   └── categories/index.tsx, create.tsx, edit.tsx
│       │   ├── auth/
│       │   └── settings/
│       ├── routes/
│       └── wayfinder/
├── routes/
│   ├── web.php                   # Requires admin.php, defines main routes
│   ├── admin.php                 # Admin routes (dashboard, users, projects, sites, categories)
│   └── settings.php
├── tests/
│   ├── Feature/
│   │   ├── Rbac/                 # RBAC authorization tests
│   │   └── ...
│   ├── Unit/
│   ├── Pest.php
│   └── TestCase.php
├── vendor/
├── node_modules/
├── composer.json
├── package.json
└── vite.config.ts
```

## Authentication Mechanism

**Laravel Fortify** handles all authentication:

- **Features enabled:** Registration, Password Reset, Email Verification
- **2FA:** Two-factor authentication is configured in the User model and Security settings page (under development)
- **Rate limiting:** Login is throttled to 5 attempts per minute per email+IP
- **Password rules:** Minimum 12 characters with mixed case, letters, numbers, symbols, and uncompromised check (production); no constraints in development
- **Verification:** Email verification is required for certain routes (e.g., profile deletion, security settings)
- **Session-based:** Authentication uses the `web` guard with database session driver
- **Redirection:** New users register as `Inactive` and are redirected to `/login` with a flash message (no auto-login)
- **Redirection:** Post-login redirects to `/dashboard`

### User Account Status

The `UserStatus` enum (`App\Enums\UserStatus`) defines three states:

| Status | Value | Description |
|---|---|---|
| `Active` | 1 | Full access to the application |
| `Inactive` | 2 | Default on registration; blocked from authenticated routes |
| `Suspended` | 3 | Set by admin; blocked from authenticated routes |

- `CheckUserStatus` middleware runs on all authenticated routes
- Non-active users are logged out and redirected to login with a flash message
- Admin can change status via `php artisan users:status {email} {status}`

## Database Structure

### Default Laravel Tables

| Table | Purpose |
|---|---|
| `users` | User accounts (id, name, email, password, status, 2FA fields, timestamps) |
| `password_reset_tokens` | Password reset tokens |
| `sessions` | User sessions |
| `cache` | Cache store |
| `cache_locks` | Cache lock management |
| `jobs` | Queue jobs |
| `job_batches` | Batch job tracking |
| `failed_jobs` | Failed job records |

### Custom Tables

| Table | Purpose |
|---|---|
| `permissions` | Spatie permissions (20 rows: users.view, observations.create, etc.) |
| `roles` | Spatie roles (5 rows: System Administrator, General Manager, Project Manager, Analyst, Observer) |
| `role_has_permissions` | Role-permission assignments |
| `model_has_roles` | User-role assignments |
| `model_has_permissions` | Direct user-permission assignments (unused — roles only) |
| `projects` | Project master data (name, soft deletes, timestamps) |
| `locations` | Site master data (name, soft deletes, timestamps) — renamed to `sites` |
| `sites` | Site master data (name, `project_id` FK to projects, soft deletes, timestamps) |
| `observation_categories` | Observation category master data (name, soft deletes, timestamps) |

## Existing Features and Modules

### Authentication (fully implemented)
- User registration (creates as Inactive, redirects to login)
- Login (authenticated users only allowed if Active)
- Password reset (via email)
- Email verification
- Password confirmation
- Login rate limiting
- User status middleware (CheckUserStatus)

### User Settings (fully implemented)
- **Profile:** Edit name and email, delete account
- **Security:** Update password, manage two-factor authentication
- **Appearance:** Theme toggle (light/dark mode)

### User Account Status (fully implemented)
- Backed int enum: `UserStatus::Active`, `UserStatus::Inactive`, `UserStatus::Suspended`
- Registration creates users as Inactive (no auto-login)
- `CheckUserStatus` middleware blocks non-active users on all authenticated routes
- `php artisan users:status {email} {status}` CLI command for status management
- Existing users preserved as Active via migration

### Role-Based Access Control (fully implemented)
- **Spatie Laravel Permission** package integration
- **20 permissions** across 5 resources: users, projects, sites, categories, observations (each with view/create/update/delete)
- **5 predefined roles** with permission mappings:
  - `System Administrator`: all 20 permissions
  - `General Manager`: `observations.view` only
  - `Project Manager`: `observations.view` only
  - `Analyst`: `observations.view` only
  - `Observer`: `observations.view`, `observations.create`, `observations.update`, `observations.delete`
- `RoleAndPermissionSeeder` for idempotent seeding
- `php artisan permissions:sync` command for syncing enums to database
- Permission middleware on all admin and observation routes
- Permissions shared to frontend via Inertia (`HandleInertiaRequests`)
- `config/permissions.php` as the permission registry

### Admin Dashboard (fully implemented)
- Landing page at `/admin` with summary counts (users, projects, sites, categories)
- Navigation cards linking to each management module
- Protected by `role:System Administrator` middleware

### User Management (fully implemented)
- Paginated user list with search by name/email at `/admin/users`
- Create user form with name, email, password, role dropdown, status select
- Edit user form with optional password, role sync, status toggle
- Self-edit protection: cannot change own role or status
- Self-deletion protection: cannot delete own account

### Master Data (fully implemented)
- **Projects** — full CRUD with soft deletes and restore; cascade soft-deletes all associated sites
- **Sites** — full CRUD with soft deletes and restore; belongs to a project via `project_id` foreign key; list view shows associated project name; create/edit forms include a project selection dropdown with required validation
- **Observation Categories** — full CRUD with soft deletes and restore
- Unique name validation per entity type (ignoring current record on edit)
- Soft-deleted records excluded from list views and selects

### Pages
- Welcome/landing page (`/`)
- Dashboard (`/dashboard`) — authenticated, verified, active users only
- Admin pages (`/admin/*`) — System Administrator only
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
- **RBAC via Spatie** — authorization uses `spatie/laravel-permission` middleware and helpers, not policies
- **Admin controllers** — grouped under `Admin/` namespace with resource routing
- **Soft deletes** — master data entities use `SoftDeletes` trait

### Frontend Conventions
- **React functional components** — no class components
- **Custom hooks** — reusable logic extracted into hooks (useAppearance, useClipboard, etc.)
- **Small, focused components** — each component has a single responsibility
- **Radix UI primitives** — accessible, unstyled UI components wrapped in project-specific components
- **Tailwind CSS** — utility-first styling with no CSS modules or styled-components
- **TypeScript** — typed throughout with strict mode
- **Permission-gated UI** — frontend conditionally renders elements based on Inertia-shared permissions

### Testing Conventions
- **Pest PHP** — test framework for both Feature and Unit tests
- **SQLite in-memory** — test database
- **Composer scripts** — `composer test` runs lint, static analysis, and Pest tests

## Notable Observations

1. **Three feature sets implemented** — User account status, RBAC with Spatie, and admin dashboard with user management and master data CRUD are fully implemented. Observation CRUD (the core domain feature) remains to be built.

2. **Enum-driven design** — Both roles, permissions, and user status use PHP backed enums with logic (e.g., `Role::permissions()`) rather than database-driven configuration. This makes the permission model explicit and type-safe.

3. **Three archived OpenSpec changes** — The project has completed 3 specification-driven changes: `2026-07-05-add-inactive-user-status`, `2026-07-07-implement-rbac-spatie-permission`, and `2026-07-11-admin-dashboard`. Each was designed, specified, implemented, and archived.

4. **Specs consolidated** — The RBAC change initially produced 3 separate delta specs (authorization, permissions, roles) which were consolidated into a single `openspec/specs/rbac/spec.md` file. The auth spec was also merged with the user-account-status delta spec.

5. **Canonical specs in `openspec/specs/`** — Three specification files exist: `auth/spec.md` (authentication + user status), `rbac/spec.md` (permissions, roles, authorization), and `admin-dashboard/spec.md` (dashboard, user management, master data).

6. **Admin sidebar is permission-gated** — The "Administration" navigation group in the sidebar renders only for users with the System Administrator role, using Inertia-shared permission data.

7. **Soft deletes for master data** — Projects, sites, and observation categories all use soft deletes with a restore action, preventing accidental data loss.

8. **Spatie permission caching** — Permissions are cached by Spatie; the `permissions:sync` command automatically resets the cache after seeding.
