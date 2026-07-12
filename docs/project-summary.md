# Project Summary

## Project Purpose

A web application for creating, managing, and reviewing image-based safety observations. Users can upload images, annotate them with notes, specify sites, categories and status, while supervisors review and manage observations.

**Current status:** The application has been extended beyond the Laravel scaffold with four implemented feature sets: (1) user account status system (Active/Inactive/Suspended) with registration-as-inactive flow and middleware-based access gating, (2) full Role-Based Access Control (RBAC) using Spatie Laravel Permission with 5 roles and 20 permissions, (3) an admin dashboard with complete CRUD for users and master data (projects, sites, observation categories), and (4) a complete Observation CRUD system with image upload, status lifecycle, and a statistics dashboard.

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
│   │   ├── Role.php              # 5 role cases with permission mapping method
│   │   ├── ObservationShift.php  # Morning=1, Evening=2, Night=3
│   │   ├── RiskDegree.php        # Low=1, Medium=2, High=3
│   │   └── ObservationStatus.php # Open=1, Close=2
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── UserController.php
│   │   │   │   ├── ProjectController.php
│   │   │   │   ├── SiteController.php
│   │   │   │   └── ObservationCategoryController.php
│   │   │   ├── ObservationController.php  # Full CRUD + dashboard + sitesByProject
│   │   │   └── Settings/         # Settings controllers (Profile, Security)
│   │   ├── Middleware/
│   │   │   ├── CheckUserStatus.php    # Blocks inactive/suspended users
│   │   │   ├── HandleAppearance
│   │   │   └── HandleInertiaRequests
│   │   ├── Responses/
│   │   └── Requests/
│   │       ├── Admin/            # Form requests for admin CRUD
│   │       ├── Observation/      # StoreObservationRequest, UpdateObservationRequest
│   │       └── Settings/         # Form requests (PasswordUpdate, ProfileDelete, etc.)
│   ├── Models/
│   │   ├── User.php              # With HasRoles trait, UserStatus cast, hasMany observations
│   │   ├── Project.php           # SoftDeletes, fillable name, hasMany sites, hasMany observations
│   │   ├── Site.php              # SoftDeletes, fillable name+project_id, belongsTo project, hasMany observations
│   │   ├── ObservationCategory.php # SoftDeletes, fillable name, hasMany observations
│   │   └── Observation.php       # Int-backed enum casts, relationships to project/site/category/creator
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
│   │   ├── 2026_07_11_000001_rename_locations_table_to_sites.php
│   │   └── 2026_07_11_010000_create_observations_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── RoleAndPermissionSeeder.php
├── docs/
│   ├── project-summary.md        # This file
│   └── decision-log.md           # Architectural decisions
├── openspec/                     # OpenSpec workflow directory
│   ├── changes/                  # Active/archived changes
│   │   └── archive/              # 4 archived changes
│   ├── specs/                    # Canonical specifications
│   │   ├── auth/spec.md          # Auth + user account status
│   │   ├── rbac/spec.md          # RBAC (permissions, roles, authorization)
│   │   ├── admin-dashboard/spec.md # Admin dashboard + user mgmt + master data
│   │   └── observations/spec.md  # Observation CRUD, status lifecycle, dashboard
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
│   ├── web.php                   # Requires admin.php, observations.php, defines main routes
│   ├── admin.php                 # Admin routes (dashboard, users, projects, sites, categories)
│   ├── observations.php          # 9 observation routes (index, create, store, show, edit, update, destroy, dashboard, sitesByProject)
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
| `observations` | Safety observations with image_before, image_after, comments, shift (int enum: 1/2/3), risk_degree (int enum: 1/2/3), status (int enum: 1/2), FKs to projects/sites/categories/creators |

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

### Observations CRUD & Dashboard (fully implemented)
- **Int-backed enums:** ObservationShift (1=Morning, 2=Evening, 3=Night), RiskDegree (1=Low, 2=Medium, 3=High), ObservationStatus (1=Open, 2=Close)
- **Create observation** at `/observations/create` — form with image_before, comments, project/site/category selects, shift/risk_degree selects, custom_site free-text
- **Site filtering:** All sites pre-loaded from controller and filtered client-side when a project is selected; custom_site fallback for unlisted sites
- **List observations** at `/observations` — paginated (20/page), filterable by project, site, category, shift, risk_degree, status, and date range; actions (view/edit/delete) gated by permissions and 2-day time window
- **Detail view** at `/observations/{id}` — full observation display with both images and all metadata
- **Edit observation** at `/observations/{id}/edit` — pre-populated form; uploading image_after transitions status to Close (2); edit restricted to 48-hour window (server-enforced)
- **Delete observation** with image cleanup from storage; also restricted to 48-hour window
- **Dashboard** at `/observations/dashboard` — statistics cards for today, this week, this month, previous month with total/open/close counts and risk_degree distribution
- Images stored on `public` disk under `observations/Y/m/`; served via `/storage/` symlink
- Routes defined in `routes/observations.php` behind `observations.*` permission middleware

### Pages
- Welcome/landing page (`/`)
- Dashboard (`/dashboard`) — authenticated, verified, active users only
- Admin pages (`/admin/*`) — System Administrator only
- Observation pages (`/observations/*`) — users with `observations.view` permission
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

1. **Four feature sets implemented** — User account status, RBAC with Spatie, admin dashboard with user management and master data CRUD, and Observation CRUD with dashboard are all fully implemented.

2. **Enum-driven design** — Roles, permissions, user status, and observation enums all use PHP backed enums with logic rather than database-driven configuration. Observation enums (shift, risk_degree, status) are int-backed for database efficiency.

3. **Four archived OpenSpec changes** — The project has completed 4 specification-driven changes: `2026-07-05-add-inactive-user-status`, `2026-07-07-implement-rbac-spatie-permission`, `2026-07-11-admin-dashboard`, and `2026-07-11-observations-crud-dashboard`. Each was designed, specified, implemented, and archived.

4. **Specs consolidated** — The RBAC change initially produced 3 separate delta specs (authorization, permissions, roles) which were consolidated into a single `openspec/specs/rbac/spec.md` file. The auth spec was also merged with the user-account-status delta spec.

5. **Canonical specs in `openspec/specs/`** — Four specification files exist: `auth/spec.md` (authentication + user status), `rbac/spec.md` (permissions, roles, authorization), `admin-dashboard/spec.md` (dashboard, user management, master data), and `observations/spec.md` (observation CRUD, status lifecycle, dashboard).

6. **Admin sidebar is permission-gated** — The "Administration" navigation group in the sidebar renders only for users with the System Administrator role, using Inertia-shared permission data.

7. **Observations sidebar is permission-gated** — The "Observations" navigation group (Dashboard, All Observations, Create) renders for users with `observations.view` permission.

8. **Soft deletes for master data** — Projects, sites, and observation categories all use soft deletes with a restore action, preventing accidental data loss.

9. **Spatie permission caching** — Permissions are cached by Spatie; the `permissions:sync` command automatically resets the cache after seeding.

10. **Observation status lifecycle** — Status defaults to Open (1) on creation; uploading image_after transitions to Close (2). No other transitions exist.

11. **2-day edit/delete window** — Observations can only be edited or deleted within 48 hours of creation, enforced server-side on both update and destroy actions.

12. **Sites filtered by project** — Site dropdown on create/edit pages shows all sites initially and filters client-side when a project is selected; custom_site free-text field serves as fallback for unlisted sites.
