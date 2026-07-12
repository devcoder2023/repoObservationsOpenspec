# Observations

## Purpose

Enable users to create, review, and manage safety observations with image-based evidence, status lifecycle, and statistical dashboard.

## Requirements

### Requirement: Observation data model

The system SHALL provide an `observations` database table that stores all observation fields. The table SHALL include foreign keys to `projects`, `sites`, `observation_categories`, and `users` (creator).

#### Scenario: Observation table exists after migration
- **WHEN** the observation migration runs
- **THEN** the `observations` table SHALL exist with columns: id, image_before, comment_before, image_after, comment_after, project_id, site_id, custom_site, shift, observation_category_id, risk_degree, status, creator_id, created_at, updated_at

### Requirement: Create observation

The system SHALL provide a create observation page at `/observations/create` accessible to users with `observations.create` permission. The form SHALL collect: image_before (required file upload), comment_before (optional text), project_id (required select from active projects), site_id (optional select from active sites filtered by project), custom_site (optional free-text), shift (required select: morning/evening/night), observation_category_id (required select from active categories), risk_degree (required select: low/medium/high). On creation, creator_id SHALL be set to the authenticated user and status SHALL default to 'open'.

#### Scenario: Observer creates observation successfully
- **WHEN** an authenticated user with `observations.create` permission submits valid data on the create observation form
- **THEN** the system creates the observation with the submitted data, sets creator_id to the authenticated user, sets status to 'open', and redirects to the observation list with a success message

#### Scenario: Observer creates observation with custom site
- **WHEN** an observer does not select a site from the list but fills in custom_site
- **THEN** the system creates the observation with the custom_site text and null site_id

#### Scenario: Observer submits invalid observation data
- **WHEN** a user submits the create observation form without required fields (image_before, project_id, shift, observation_category_id, risk_degree)
- **THEN** the system displays validation errors and does not create the observation

#### Scenario: User without create permission is denied
- **WHEN** a user without `observations.create` permission navigates to `/observations/create`
- **THEN** the system returns a 403 Forbidden response

### Requirement: List observations

The system SHALL provide a paginated, filterable list of observations at `/observations` accessible to users with `observations.view` permission. The list SHALL display key fields and support filtering by project, site, category, shift, risk_degree, status, and date range.

#### Scenario: User views observation list
- **WHEN** a user with `observations.view` permission navigates to `/observations`
- **THEN** the system displays a paginated table of observations with key fields

#### Scenario: User filters observations
- **WHEN** a user applies filters (project, site, category, shift, risk_degree, status, date range)
- **THEN** the system filters the observation list accordingly

#### Scenario: Observer sees only own observations
- **WHEN** a user with the `Observer` role (who lacks `observations.view_all`) navigates to `/observations`
- **THEN** the system SHALL only display observations where `creator_id` matches the authenticated user

#### Scenario: Manager/analyst sees all observations
- **WHEN** a user with `observations.view_all` permission navigates to `/observations`
- **THEN** the system SHALL display observations created by all users

### Requirement: View observation detail

The system SHALL provide a detail view at `/observations/{observation}` showing all observation data including both images and full metadata.

#### Scenario: User views observation detail
- **WHEN** a user with `observations.view` permission navigates to `/observations/{id}`
- **THEN** the system displays the observation with image_before, image_after (if present), all comments, and all metadata

#### Scenario: Observer denied viewing another user's observation
- **WHEN** a user without `observations.view_all` permission navigates to `/observations/{id}` for an observation they did not create
- **THEN** the system SHALL return a 403 Forbidden response

### Requirement: Edit observation

The system SHALL provide an edit form at `/observations/{observation}/edit` accessible to users with `observations.update` permission. The form SHALL allow modifying all fields. The image_after upload field SHALL be available. Editing SHALL be restricted to observations created within the last 2 days (48 hours).

#### Scenario: Observer edits observation within time window
- **WHEN** a user with `observations.update` permission edits an observation that was created less than 48 hours ago
- **THEN** the system updates the observation with the submitted data and redirects to the observation list with a success message

#### Scenario: Observer adds after image to close observation
- **WHEN** an observer uploads an image_after on an open observation
- **THEN** the system saves the image and transitions the status to 'closed'

#### Scenario: Observer cannot edit observation after 2 days
- **WHEN** a user attempts to edit an observation created more than 48 hours ago
- **THEN** the system displays an error and does not allow the edit

#### Scenario: Observer cannot edit another user's observation
- **WHEN** a user without `observations.view_all` permission navigates to `/observations/{id}/edit` for an observation they did not create
- **THEN** the system returns a 403 Forbidden response

#### Scenario: User without update permission is denied
- **WHEN** a user without `observations.update` permission navigates to `/observations/{id}/edit`
- **THEN** the system returns a 403 Forbidden response

### Requirement: Delete observation

The system SHALL provide a delete action for observations. Deleting SHALL be restricted to observations created within the last 2 days (48 hours) and to users with `observations.delete` permission.

#### Scenario: Observer deletes observation within time window
- **WHEN** a user with `observations.delete` permission deletes an observation created less than 48 hours ago
- **THEN** the system permanently deletes the observation and its associated images, then redirects with a success message

#### Scenario: Observer cannot delete observation after 2 days
- **WHEN** a user attempts to delete an observation created more than 48 hours ago
- **THEN** the system displays an error and does not allow deletion

#### Scenario: Observer cannot delete another user's observation
- **WHEN** a user without `observations.view_all` permission attempts to delete an observation they did not create
- **THEN** the system returns a 403 Forbidden response

#### Scenario: User without delete permission is denied
- **WHEN** a user without `observations.delete` permission attempts to delete an observation
- **THEN** the system returns a 403 Forbidden response

### Requirement: Observation status lifecycle

The system SHALL set observation status to 'open' by default on creation. The status SHALL transition to 'closed' when an image_after is uploaded. No other status transitions SHALL exist.

#### Scenario: New observation has open status
- **WHEN** an observation is created without image_after
- **THEN** the observation status SHALL be 'open'

#### Scenario: Observation closes when after image is uploaded
- **WHEN** an observation with status 'open' receives an image_after via edit
- **THEN** the observation status SHALL transition to 'closed'

### Requirement: Observation dashboard with statistics

The system SHALL provide a dashboard page at `/observations/dashboard` accessible to users with `observations.view` permission. The dashboard SHALL display observation statistics grouped by time periods: today, this week, this month, and previous month. Each period SHALL show total count, open count, closed count, and distribution by risk_degree.

#### Scenario: User views observation dashboard
- **WHEN** a user with `observations.view` permission navigates to `/observations/dashboard`
- **THEN** the system displays statistics cards for today, this week, this month, and previous month with counts

#### Scenario: Dashboard shows risk distribution
- **WHEN** a user views the observation dashboard
- **THEN** each time period SHALL display the count of observations per risk_degree (low, medium, high)

#### Scenario: Observer dashboard is self-scoped
- **WHEN** a user without `observations.view_all` permission views the observation dashboard
- **THEN** the statistics SHALL only reflect observations where `creator_id` matches the authenticated user
