# Analyst Dashboard

## Purpose

Provide users with `observations.view_all` permission dedicated analytics pages for monitoring safety observation trends, current-period performance, and browsing all observations with advanced filtering.

## Requirements

### Requirement: Analyst trends page

The system SHALL provide a 12-month trends overview at `/analyst/trends` accessible to users with `observations.view_all` permission. The page SHALL display a line chart of monthly observation totals for the last 12 months, with clickable data points that drill into that month's detailed breakdown. By default, the breakdown SHALL show aggregated data across all 12 months. When a month is selected, the breakdown SHALL update to show data for that month only. Clicking the same month again returns to the all-months aggregate view. A reset button SHALL also allow returning to all-months view.

The monthly breakdown SHALL include:
- Summary cards: total observations, closed count with percentage, sites active, observers active
- A vertical stacked column chart showing observations per site (Open in light indigo, Closed in dark indigo)
- A vertical column chart of the top 5 observation categories by count
- A semi-circle gauge showing the closed observation percentage
- An ordered ranking of observer activity by observation count

#### Scenario: Analyst views trends page
- **WHEN** a user with `observations.view_all` permission navigates to `/analyst/trends`
- **THEN** the system displays the 12-month line chart and aggregated breakdown for all months by default

#### Scenario: Analyst clicks a month to drill down
- **WHEN** a user clicks a data point (dot) on the line chart
- **THEN** the system updates the breakdown cards and charts to show data for that specific month only

#### Scenario: Analyst returns to all-months view
- **WHEN** a user clicks the same month data point again or clicks the "All Months" reset button
- **THEN** the system returns the breakdown to show aggregated data across all 12 months

#### Scenario: Trends page shows site stacked column chart
- **WHEN** a user views the trends page with a breakdown active
- **THEN** the system SHALL display a vertical stacked column chart with one bar per site, showing Open (light indigo) and Closed (dark indigo) segments

#### Scenario: Trends page shows top 5 categories
- **WHEN** a user views the trends page with a breakdown active
- **THEN** the system SHALL display a vertical column chart showing the top 5 observation categories by count

#### Scenario: Trends page shows closed percentage gauge
- **WHEN** a user views the trends page with a breakdown active
- **THEN** the system SHALL display a semi-circle gauge showing the closed observation percentage

#### Scenario: Trends page shows observer ranking
- **WHEN** a user views the trends page with a breakdown active
- **THEN** the system SHALL display an ordered list of observers ranked by observation count (highest first)

### Requirement: Analyst current month page

The system SHALL provide a deep-dive page at `/analyst/current-month` accessible to users with `observations.view_all` permission. The page SHALL display three summary cards at the top: Today, This Week (starting Saturday), and Month to Date. Clicking a card SHALL update all downstream charts to show data for that period. The active card SHALL be visually highlighted.

The page SHALL display:
- A vertical stacked column chart of observations per site (Open in light indigo, Closed in dark indigo), with clickable bars — clicking a site bar reveals a category breakdown column chart for that site
- A vertical stacked column chart of observations per category (Open/Closed)
- A semi-circle gauge showing the overall closed observation percentage
- A pie chart showing risk severity distribution (Low, Medium, High) with counts and percentages
- An ordered ranking of observer activity by observation count

#### Scenario: Analyst views current month page
- **WHEN** a user with `observations.view_all` permission navigates to `/analyst/current-month`
- **THEN** the system displays summary cards for Today, This Week, and Month to Date, with Month to Date active by default and related charts rendered for that period

#### Scenario: Analyst switches period
- **WHEN** a user clicks a different period card (Today or This Week)
- **THEN** the system updates all charts to show data for the selected period and resets any site drill-down

#### Scenario: Current month shows site stacked column chart
- **WHEN** a user views the current month page
- **THEN** the system SHALL display a vertical stacked column chart with one bar per site showing Open (light indigo) and Closed (dark indigo) segments

#### Scenario: Current month shows category stacked column chart
- **WHEN** a user views the current month page
- **THEN** the system SHALL display a vertical stacked column chart with one bar per category showing Open (light indigo) and Closed (dark indigo) segments

#### Scenario: Current month shows closed percentage gauge
- **WHEN** a user views the current month page
- **THEN** the system SHALL display a semi-circle gauge showing the closed observation percentage

#### Scenario: Current month shows risk severity pie chart
- **WHEN** a user views the current month page
- **THEN** the system SHALL display a pie chart showing risk severity distribution (Low, Medium, High) with counts and percentages

#### Scenario: Current month shows observer ranking
- **WHEN** a user views the current month page
- **THEN** the system SHALL display an ordered list of observers ranked by observation count (highest first)

#### Scenario: Analyst clicks site bar to see category breakdown
- **WHEN** a user clicks a bar (either Open or Closed segment) in the sites stacked column chart
- **THEN** the system SHALL display a column chart below showing observation counts per category for that site, labeled with the site name

#### Scenario: Analyst clicks the same site bar again to dismiss
- **WHEN** a user clicks the same site bar again while its drill-down is already displayed
- **THEN** the system SHALL hide the category breakdown for that site

### Requirement: Analyst observation browser

The system SHALL provide a paginated, filterable list of observations at `/analyst/observations` accessible to users with `observations.view_all` permission. The list SHALL display 50 observations per page and support filtering by project, site, category, shift, risk_degree, status, date range, creator (observer), and text search across comments. Unlike the regular observation list at `/observations`, this browser SHALL show observations created by all users without requiring the `observations.view_all` gate on the index query itself.

#### Scenario: Analyst views observation list
- **WHEN** a user with `observations.view_all` permission navigates to `/analyst/observations`
- **THEN** the system displays a paginated table of all observations with 50 per page

#### Scenario: Analyst filters observations
- **WHEN** a user applies filters (project, site, category, shift, risk_degree, status, date range, creator_id, text search)
- **THEN** the system filters the observation list accordingly

#### Scenario: Analyst filters by observer
- **WHEN** a user selects a specific observer from the creator filter dropdown
- **THEN** the system filters the observation list to show only observations created by that user

#### Scenario: Analyst sees all observations
- **WHEN** a user with `observations.view_all` permission views the observation list
- **THEN** the system SHALL display observations created by all users

### Requirement: Backend analyst controller and routes

The system SHALL provide a dedicated `AnalystController` with `trends()`, `currentMonth()`, and `index()` methods. Routes SHALL be defined in `routes/analyst.php` under the `/analyst` prefix, gated by `permission:observations.view_all` middleware.

The `trends()` method SHALL return: monthly aggregated counts for the last 12 months (total, open, closed with percentages), per-month site breakdown with close rates, per-month top 5 categories, and per-month observer activity — all pre-computed for server-side rendering.

The `currentMonth()` method SHALL return: for each period (today, week starting Saturday, month to date): total counts, closed counts with percentages, site breakdown with close rates, category breakdown with close rates, risk distribution with percentages, observer activity, and per-site category breakdown for drill-down.

The `index()` method SHALL return paginated observations (50 per page) with filter support, including an observer filter that lists users with the `Observer` role.

#### Scenario: Analyst controller trends method
- **WHEN** a user with `observations.view_all` navigates to `/analyst/trends`
- **THEN** the `AnalystController@trends` method returns 12-month aggregated data with pre-computed percentages

#### Scenario: Analyst controller currentMonth method
- **WHEN** a user with `observations.view_all` navigates to `/analyst/current-month`
- **THEN** the `AnalystController@currentMonth` method returns period data (today, week, month) with distribution stats and pre-computed percentages

#### Scenario: Analyst controller index method
- **WHEN** a user with `observations.view_all` navigates to `/analyst/observations`
- **THEN** the `AnalystController@index` method returns paginated observations (50 per page) with applied filters

### Requirement: Analytics sidebar navigation

The system SHALL display an "Analytics" section in the sidebar navigation only for users with `observations.view_all` permission. The section SHALL contain three links: Trends (`/analyst/trends`), Current Month (`/analyst/current-month`), and All Observations (`/analyst/observations`).

#### Scenario: Analyst sees analytics navigation
- **WHEN** a user with `observations.view_all` permission views the sidebar
- **THEN** the system displays an "Analytics" group with links to "Trends", "Current Month", and "All Observations"

#### Scenario: Observer does not see analytics navigation
- **WHEN** a user without `observations.view_all` permission views the sidebar
- **THEN** the system does not display the "Analytics" navigation group

### Requirement: Database indexes

The system SHALL add database indexes on `observations.created_at` and `observations.creator_id` to optimize the aggregate queries used by the analyst dashboard.

#### Scenario: Index migration runs
- **WHEN** the database migration for analyst indexes runs
- **THEN** the migration SHALL add an index on `observations.created_at` and an index on `observations.creator_id`

### Requirement: Semi-circle gauge chart component

The system SHALL provide a reusable `SemiCircleGauge` chart component that renders a semi-circle gauge using a Recharts `PieChart`. The gauge SHALL display the value arc in a configurable color (default dark indigo `#6366f1`) and the background arc in a light tint (default `#e0e7ff`). The component SHALL accept `value`, `max`, `label`, `color`, and `bgColor` props.

#### Scenario: SemiCircleGauge renders percentage
- **WHEN** `SemiCircleGauge` is rendered with a `value` of 65
- **THEN** the gauge SHALL draw the value arc at 65% of the semi-circle circumference and display "65%" centered below the arc
