# Decision Log

## 2026-07-05 — User Account Status (Active/Inactive/Suspended)

**Context:** New users auto-logged in and had full access upon registration. No mechanism to gate access by account state.

**Decisions:**
- Use a backed int enum (`UserStatus: int`) with Active=1, Inactive=2, Suspended=3 rather than a boolean, for expressiveness and future-proofing.
- Create `CheckUserStatus` middleware applied to all authenticated route groups instead of modifying Fortify internals.
- Override Fortify's `RegisteredResponse` to redirect to login with a flash message instead of auto-login.
- Provide `php artisan users:status` CLI command as a safety net for admins to change user status.
- Migration sets existing users to `Active` to preserve backward compatibility.

## 2026-07-07 — RBAC with Spatie Laravel Permission

**Context:** No authorization layer existed — any authenticated user could perform any action.

**Decisions:**
- Use `spatie/laravel-permission` over a custom implementation — battle-tested, caching, middleware, and Inertia helpers.
- Permissions assigned through roles only, not directly to users, for simplified management.
- Seeder-based setup (`RoleAndPermissionSeeder`) rather than migrations — roles/permissions are data, not schema.
- Create `php artisan permissions:sync` command for production-safe syncing of enums to database.
- Permission strings defined as a PHP backed string enum (`Permission`) for type safety and autocomplete.
- 5 roles: System Administrator, General Manager, Project Manager, Analyst, Observer.
- 20 permissions: 5 resources (users, projects, sites, categories, observations) × 4 actions (view, create, update, delete) following `resource.action` convention.
- Master data (users, projects, sites, categories) restricted exclusively to System Administrator.
- Observation permissions granted to Observer (full CRUD) while General Manager, Project Manager, and Analyst have read-only access.
- Permissions shared to frontend via Inertia's `HandleInertiaRequests` shared data.
- Observer edit/delete permissions remain subject to future business rules (e.g., time window restrictions).

## 2026-07-09/11 — Admin Dashboard, User Management, and Master Data CRUD

**Context:** User status management was CLI-only and master data entities had no CRUD at all.

**Decisions:**
- Resource controllers over action classes — straightforward CRUD doesn't warrant the Action pattern.
- Group all admin controllers under `app/Http/Controllers/Admin/` namespace for isolation.
- Separate React pages per resource (admin/users/, admin/projects/, admin/sites/, admin/categories/) following existing page-per-feature pattern.
- Admin sidebar conditionally rendered based on System Administrator role via Inertia-shared permissions.
- Soft deletes on master data (projects, sites, observation categories) to prevent accidental data loss.
- Self-edit protection: admins cannot change their own role or status (prevents self-lockout).
- Self-deletion protection: admins cannot delete their own account.
- Unique name validation per entity type (ignoring current record on edit).
- No pagination for list views initially — start with simple Eloquent collections.

## 2026-07-11 — Specification Consolidation

**Context:** The RBAC change produced three separate delta specs (rbac-authorization, rbac-permissions, rbac-roles) and the user-account-status spec was separate from the auth spec.

**Decisions:**
- Consolidated the three RBAC delta specs into a single canonical `openspec/specs/rbac/spec.md` to improve maintainability.
- Merged the user-account-status delta spec into `openspec/specs/auth/spec.md` as both relate to authentication concerns.
- Model specifications by business capability rather than technical components.

## 2026-07-11 — Observation CRUD, Dashboard, and Status Lifecycle

**Context:** The core domain feature — image-based safety observations — had no implementation despite existing RBAC permissions (observations.view/create/update/delete), and the existing Observer role was unusable.

**Decisions:**
- Use int-backed enums (`ObservationShift`, `RiskDegree`, `ObservationStatus`) with values 1/2/3 rather than string enums, for database storage efficiency while keeping type safety.
- Use `tinyInteger` columns in the migration rather than varchar, aligning with the int-backed enum design.
- Default observation status to Open (1) on creation; transition to Close (2) only when `image_after` is uploaded — no other transitions.
- Enforce 2-day edit/delete window server-side in `UpdateObservationRequest` and controller (`created_at` compared to `now()->subHours(48)`).
- Pass all sites from controller to create/edit pages, filter client-side on project selection, rather than fetching via API — fewer network requests, instant filtering.
- Provide `custom_site` free-text fallback for sites not in the dropdown, since not all locations may be pre-registered.
- Store images on `public` disk under `observations/Y/m/` directory structure for date-based organization; serve via `/storage/` symlink.
- Paginate observation list at 20 per page with query string preservation for filters.
- Delete associated images from storage when an observation is deleted.
- Define observation routes in a dedicated `routes/observations.php` file (included from `web.php`) behind `auth`, `verified`, `CheckUserStatus`, and `observations.*` permission middleware.
- Include previous month in dashboard stats for month-over-month comparison.
- Observer role gets view/create/update/delete; other roles (General Manager, Project Manager, Analyst) get read-only access via `observations.view` only.

## 2026-07-11 — Link Sites to Projects

**Context:** Sites and projects were independent master data entities with no relationship. Site management forms only collected a name, and database data was empty.

**Decisions:**
- Add `project_id` foreign key to the `sites` table with `cascadeOnDelete` — when a project is deleted, all its sites are soft-deleted to avoid orphaned records.
- Use `constrained()` for referential integrity rather than raw column and manual index.
- Validate `project_id` as required in both `StoreSiteRequest` and `UpdateSiteRequest` using `exists:projects,id`.
- Load project relationship eagerly (`->with('project')`) on site index queries to avoid N+1.
- Expose full projects list in site create/edit views so the admin can select from active projects.
- Seed sample data with 3 projects × 2 sites each to demonstrate the relationship.
