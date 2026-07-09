# RBAC Authorization

## Purpose

Define how permissions are enforced on the User model, through route middleware, and in Inertia frontend views.

## Requirements

### Requirement: User model has roles
The `User` model SHALL use Spatie's `HasRoles` trait to enable role and permission checks.

#### Scenario: User role assignment
- **WHEN** a role is assigned to a user
- **THEN** the user SHALL inherit all permissions associated with that role

### Requirement: Authorization middleware on routes
Routes that manage system master data (users, projects, locations, categories) SHALL be protected by permission middleware allowing only users with the corresponding permissions.

#### Scenario: Master data routes protected
- **WHEN** an unauthenticated or unauthorized user requests a master data route
- **THEN** the system SHALL return a 403 Forbidden response

### Requirement: Observation routes authorized
All observation routes SHALL be protected by the relevant `observations.*` permission middleware.

#### Scenario: Observation route access denied
- **WHEN** a user without `observations.view` permission tries to access an observation route
- **THEN** the system SHALL deny access

#### Scenario: Observation creation authorized
- **WHEN** a user with `observations.create` permission submits a create observation request
- **THEN** the system SHALL allow the operation

### Requirement: Inertia views respect permissions
The frontend SHALL conditionally show/hide UI elements (buttons, links, navigation) based on the authenticated user's permissions.

#### Scenario: Permission-gated UI
- **WHEN** a user lacks a permission for an action
- **THEN** the corresponding UI element (e.g., create button, edit link, delete button) SHALL NOT be rendered

### Requirement: Permission checks via helper methods
The system SHALL expose permission-checking helpers available in controllers, views, and the frontend (via Inertia shared data).

#### Scenario: Controller permission check
- **WHEN** a controller needs to verify authorization
- **THEN** it SHALL use Spatie's `$this->authorize()` or `$user->can()` methods

#### Scenario: Frontend permission context
- **WHEN** the Inertia page renders
- **THEN** the authenticated user's effective permissions SHALL be available to the frontend




# RBAC Roles

## Purpose

Define the 5 system roles and their permission assignments. Restrict master data management to System Administrator only.

## Requirements

### Requirement: Predefined roles
The system SHALL define exactly 5 roles: `System Administrator`, `General Manager`, `Project Manager`, `Analyst`, `Observer`.

#### Scenario: Roles exist after seeding
- **WHEN** the seeder runs
- **THEN** all 5 roles SHALL exist in the `roles` table

### Requirement: System Administrator has all permissions
The `System Administrator` role SHALL have every permission (`users.*`, `projects.*`, `locations.*`, `categories.*`, `observations.*`).

#### Scenario: System Administrator full access
- **WHEN** a user has the `System Administrator` role
- **THEN** they SHALL pass authorization for any resource action

### Requirement: General Manager has read-only observation access
The `General Manager` role SHALL have only `observations.view` permission and any observation summary/dashboard/statistics permissions.

#### Scenario: General Manager observation access
- **WHEN** a user has the `General Manager` role
- **THEN** they SHALL be able to view observations
- **THEN** they SHALL be able to view observation summaries, dashboards, and statistics
- **THEN** they SHALL NOT be able to create, update, or delete observations
- **THEN** they SHALL NOT have any permissions for `users`, `projects`, `locations`, or `categories`

### Requirement: Project Manager has read-only observation access
The `Project Manager` role SHALL have only `observations.view` permission and any observation summary/dashboard/statistics permissions.

#### Scenario: Project Manager observation access
- **WHEN** a user has the `Project Manager` role
- **THEN** they SHALL be able to view observations
- **THEN** they SHALL be able to view observation summaries, dashboards, and statistics
- **THEN** they SHALL NOT be able to create, update, or delete observations
- **THEN** they SHALL NOT have any permissions for `users`, `projects`, `locations`, or `categories`

### Requirement: Analyst has read-only observation access
The `Analyst` role SHALL have only `observations.view` permission and any observation summary/dashboard/statistics permissions.

#### Scenario: Analyst observation access
- **WHEN** a user has the `Analyst` role
- **THEN** they SHALL be able to view observations
- **THEN** they SHALL be able to view observation summaries, dashboards, and statistics
- **THEN** they SHALL NOT be able to create, update, or delete observations
- **THEN** they SHALL NOT have any permissions for `users`, `projects`, `locations`, or `categories`

### Requirement: Observer has full observation CRUD
The `Observer` role SHALL have all observation permissions: `observations.view`, `observations.create`, `observations.update`, `observations.delete`.

#### Scenario: Observer observation CRUD
- **WHEN** a user has the `Observer` role
- **THEN** they SHALL be able to view, create, update, and delete observations
- **THEN** they SHALL NOT have any permissions for `users`, `projects`, `locations`, or `categories`

### Requirement: Observer edit/delete respects existing business rules
The `Observer` role's `observations.update` and `observations.delete` permissions SHALL still be subject to any existing business rules (e.g., time restrictions on editing or deleting observations).

#### Scenario: Observer restricted by business rules
- **WHEN** an Observer attempts to update or delete an observation
- **THEN** any existing business rule restrictions (e.g., time window) SHALL still apply

### Requirement: Master data restricted to System Administrator
The resources `users`, `projects`, `locations`, and `categories` SHALL be considered system master data. Only the `System Administrator` role SHALL have create, update, or delete permissions on these resources.

#### Scenario: Master data protection
- **WHEN** a user without the `System Administrator` role attempts to create, update, or delete a user, project, location, or category
- **THEN** the system SHALL deny the operation

### Requirement: Role seeding is idempotent
Running the seeder multiple times SHALL NOT create duplicate roles or duplicate role-permission assignments.

#### Scenario: Idempotent role seeding
- **WHEN** the seeder runs twice
- **THEN** no duplicate role records SHALL exist
- **THEN** no duplicate role_has_permissions records SHALL exist

### Requirement: Extensible role and permission structure
The system SHALL support adding new permissions and roles without modifying existing seed logic, using an Artisan command that can be re-run to sync new additions.

#### Scenario: New permission added
- **WHEN** a new permission is added to the permission list
- **THEN** running the sync command SHALL create the new permission without affecting existing permissions

#### Scenario: New role added
- **WHEN** a new role with permission assignments is added to the role list
- **THEN** running the sync command SHALL create the new role with its permissions without affecting existing roles




# RBAC Permissions

## Purpose

Define all system permissions using a consistent naming convention, ensure they are seedable, idempotent, and cache-managed.

## Requirements

### Requirement: Permission naming convention
All permissions SHALL follow the `resource.action` naming convention using lowercase singular.
Valid resources: `users`, `projects`, `locations`, `categories`, `observations`.
Valid actions: `view`, `create`, `update`, `delete`.

#### Scenario: Permission name format
- **WHEN** a permission is created
- **THEN** its name SHALL match the pattern `resource.action` (e.g., `users.view`, `observations.create`)

### Requirement: Complete permission set
The system SHALL define exactly 20 permissions covering 5 resources with 4 actions each.

#### Scenario: All permissions exist after seeding
- **WHEN** the role and permission seeder runs
- **THEN** the following permissions SHALL exist in the database: `users.view`, `users.create`, `users.update`, `users.delete`, `projects.view`, `projects.create`, `projects.update`, `projects.delete`, `locations.view`, `locations.create`, `locations.update`, `locations.delete`, `categories.view`, `categories.create`, `categories.update`, `categories.delete`, `observations.view`, `observations.create`, `observations.update`, `observations.delete`

### Requirement: Permission seeding is idempotent
Running the seeder multiple times SHALL NOT create duplicate permissions.

#### Scenario: Idempotent seeding
- **WHEN** the seeder runs twice
- **THEN** no duplicate permission records SHALL exist in the database

### Requirement: Permission cache management
The system SHALL provide a mechanism to clear the permission cache after seeding.

#### Scenario: Cache reset after seeding
- **WHEN** permissions are seeded or modified
- **THEN** the permission cache SHALL be reset to reflect current permissions


