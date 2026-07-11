# Admin Dashboard

## Purpose

Provide a dedicated landing page for System Administrators with summary statistics and navigation to all management modules.

## Requirements

### Requirement: Admin dashboard landing page

The system SHALL provide a dedicated admin dashboard page accessible at `/admin` only to users with the System Administrator role. The page SHALL display summary statistics (total users, total projects, total sites, total categories) and provide navigation cards/links to each management module.

#### Scenario: System Administrator accesses admin dashboard
- **WHEN** a user with System Administrator role navigates to `/admin`
- **THEN** the system displays the admin dashboard with summary counts and links to user management, projects, sites, and categories

#### Scenario: Non-admin user is denied access
- **WHEN** a user without System Administrator role navigates to `/admin`
- **THEN** the system returns a 403 Forbidden response

#### Scenario: Unauthenticated user is redirected
- **WHEN** a guest attempts to navigate to `/admin`
- **THEN** the system redirects to the login page

### Requirement: Admin navigation in sidebar

The system SHALL display an "Administration" section in the sidebar navigation only for users with the System Administrator role. This section SHALL contain links to the admin dashboard, user management, projects, locations, and categories pages.

#### Scenario: Admin user sees admin navigation
- **WHEN** a System Administrator views the sidebar
- **THEN** the system displays an "Administration" group with links to dashboard, users, projects, sites, and categories

#### Scenario: Non-admin user does not see admin navigation
- **WHEN** a non-admin user views the sidebar
- **THEN** the system does not display the "Administration" navigation group

---
# User Management

## Purpose

Provide System Administrators with the ability to manage registered users — list, search, create, edit, and delete accounts.

## Requirements

### Requirement: List users

The system SHALL provide a paginated table listing all registered users at `/admin/users`. The table SHALL display name, email, role, status, and registration date. The System Administrator SHALL be able to search users by name or email.

#### Scenario: Admin views user list
- **WHEN** a System Administrator navigates to `/admin/users`
- **THEN** the system displays a table of all users with columns for name, email, role, status, and registered date

#### Scenario: Admin searches users
- **WHEN** a System Administrator types a search query in the search field
- **THEN** the system filters the user list to show only users whose name or email matches the query

### Requirement: Create user

The system SHALL provide a user creation form at `/admin/users/create`. The form SHALL collect name, email, password, role (select from available Spatie roles), and status (Active/Inactive/Suspended). The system SHALL validate the input and create the user with assigned role and status.

#### Scenario: Admin creates a user successfully
- **WHEN** a System Administrator submits valid data on the create user form
- **THEN** the system creates the user, assigns the selected role, sets the status, and redirects to the user list with a success message

#### Scenario: Admin submits invalid user data
- **WHEN** a System Administrator submits the create user form with missing or invalid data (e.g., duplicate email, weak password)
- **THEN** the system displays validation errors and does not create the user

### Requirement: Edit user

The system SHALL provide a user edit form at `/admin/users/{id}/edit`. The form SHALL allow modifying name, email, role, and status. Password SHALL be optional on edit — if left blank, the existing password SHALL be preserved.

#### Scenario: Admin edits a user successfully
- **WHEN** a System Administrator submits valid changes on the edit user form
- **THEN** the system updates the user's attributes, syncs the selected role, and redirects to the user list with a success message

#### Scenario: Admin changes a user's role
- **WHEN** a System Administrator changes a user's role via the edit form
- **THEN** the system syncs the user's roles to only the selected role (previous roles are removed)

#### Scenario: Admin changes a user's status
- **WHEN** a System Administrator changes a user's status from Active to Suspended
- **THEN** the system updates the user's status and the user will be logged out on their next request via the CheckUserStatus middleware

#### Scenario: Admin edits own account
- **WHEN** a System Administrator edits their own user record
- **THEN** the system allows the update but SHALL NOT allow changing their own role or status (preventing self-lockout)

### Requirement: Delete user

The system SHALL provide a delete action on the user edit page. Deleting a user SHALL permanently remove their account. The system SHALL NOT allow a user to delete their own account.

#### Scenario: Admin deletes another user
- **WHEN** a System Administrator deletes a user other than themselves
- **THEN** the system permanently deletes the user record and redirects to the user list with a success message

#### Scenario: Admin attempts self-deletion
- **WHEN** a System Administrator attempts to delete their own account
- **THEN** the system displays an error and does not delete the account


---
# Master Data

## Purpose

Manage core reference data entities — projects, locations, and observation categories — used throughout the safety observations system.

## Requirements

### Requirement: List master data entities

The system SHALL provide paginated list views for projects (`/admin/projects`), sites (`/admin/sites`), and observation categories (`/admin/categories`). Each list SHALL display the entity name and a created-at timestamp.

#### Scenario: Admin views project list
- **WHEN** a System Administrator navigates to `/admin/projects`
- **THEN** the system displays a table of all projects with name and created date

#### Scenario: Admin views site list
- **WHEN** a System Administrator navigates to `/admin/sites`
- **THEN** the system displays a table of all sites with name and created date

#### Scenario: Admin views category list
- **WHEN** a System Administrator navigates to `/admin/categories`
- **THEN** the system displays a table of all observation categories with name and created date

### Requirement: Create master data entity

The system SHALL provide creation forms for projects, sites, and observation categories. Each form SHALL require a name field (unique per entity type). On success, the system SHALL redirect to the corresponding list view with a success message.

#### Scenario: Admin creates a project
- **WHEN** a System Administrator submits a valid project name
- **THEN** the system creates the project and redirects to the project list with a success message

#### Scenario: Admin creates a site
- **WHEN** a System Administrator submits a valid site name
- **THEN** the system creates the site and redirects to the site list with a success message

#### Scenario: Admin creates a observation category
- **WHEN** a System Administrator submits a valid category name
- **THEN** the system creates the observation category and redirects to the category list with a success message

#### Scenario: Admin submits duplicate name
- **WHEN** a System Administrator submits a name that already exists for that entity type
- **THEN** the system displays a validation error and does not create the record

### Requirement: Edit master data entity

The system SHALL provide edit forms for projects, sites, and observation categories. The form SHALL allow changing the name. The name SHALL remain unique, excluding the current record.

#### Scenario: Admin edits a project name
- **WHEN** a System Administrator updates a project's name to a new unique value
- **THEN** the system updates the project and redirects to the project list with a success message

#### Scenario: Admin edits a site name
- **WHEN** a System Administrator updates a site's name to a new unique value
- **THEN** the system updates the site and redirects to the site list with a success message

#### Scenario: Admin edits a category name
- **WHEN** a System Administrator updates a category's name to a new unique value
- **THEN** the system updates the observation category and redirects to the category list with a success message

### Requirement: Delete master data entity

The system SHALL provide soft-delete for projects, sites, and observation categories. Deleted records SHALL be excluded from list views and select inputs. The system SHALL provide a restore action.

#### Scenario: Admin soft-deletes a project
- **WHEN** a System Administrator deletes a project
- **THEN** the system soft-deletes the project and it no longer appears in the project list

#### Scenario: Admin restores a soft-deleted project
- **WHEN** a System Administrator restores a soft-deleted project
- **THEN** the system restores the project and it reappears in the project list
