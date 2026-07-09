## Purpose

Define the authentication system, including registration, login, password reset, email verification, logout, and user account status management (active, inactive, suspended). Users must have an active status to access authenticated routes; new users register as inactive until approved by an administrator.

## Requirements

### Requirement: User registration
The system SHALL allow new users to register with name, email, and password, creating the account with `status = UserStatus::Inactive` and redirecting to login.

#### Scenario: Registration screen renders
- **WHEN** a guest visits `/register`
- **THEN** the registration form is displayed with fields for name, email, password, and password confirmation

#### Scenario: Successful registration
- **WHEN** a user submits valid registration data
- **THEN** the user is created with `status = UserStatus::Inactive`
- **AND** redirected to the login page with a flash message

#### Scenario: Duplicate email rejected
- **WHEN** a user submits a registration with an email already in use
- **THEN** the registration is rejected with a duplicate email error

#### Scenario: Weak password rejected
- **WHEN** a user submits a password that does not meet the rules
- **THEN** the registration is rejected with a validation error

### Requirement: User login
The system SHALL authenticate users with email and password.

#### Scenario: Successful login
- **WHEN** an active user submits valid credentials
- **THEN** the user is authenticated and redirected to `/dashboard`

#### Scenario: Invalid credentials
- **WHEN** a user submits invalid credentials
- **THEN** a validation error is shown and the user remains unauthenticated

#### Scenario: Login rate limiting
- **WHEN** a user exceeds 5 failed login attempts per minute
- **THEN** further login attempts are throttled

### Requirement: Password reset
The system SHALL allow users to reset their password via email.

#### Scenario: Reset link requested
- **WHEN** a user submits their email on the forgot password page
- **THEN** a password reset link is emailed to that address

#### Scenario: Password reset with valid token
- **WHEN** a user visits the reset link with a valid token and submits a new password
- **THEN** the password is updated and the user is redirected to login

#### Scenario: Password reset with invalid token
- **WHEN** a user submits a reset with an invalid or expired token
- **THEN** the reset is rejected

### Requirement: Email verification
The system SHALL require email verification for sensitive operations.

#### Scenario: Verification email sent
- **WHEN** a user registers
- **THEN** a verification email is sent to their address

#### Scenario: Email verified
- **WHEN** a user clicks the verification link with a valid hash
- **THEN** the email is marked as verified

#### Scenario: Verified-only routes blocked
- **WHEN** an unverified user tries to access `/dashboard`
- **THEN** they are redirected to the email verification notice page

### Requirement: User logout
The system SHALL allow authenticated users to log out.

#### Scenario: User logs out
- **WHEN** an authenticated user submits a logout request
- **THEN** the session is destroyed and the user is redirected to the home page

### Requirement: Access control by user status
The system SHALL prevent users with `status` other than `UserStatus::Active` from accessing authenticated routes.

#### Scenario: Inactive user blocked
- **WHEN** an inactive user navigates to `/dashboard`
- **THEN** the user is logged out and redirected to login with a message

#### Scenario: Suspended user blocked
- **WHEN** a suspended user navigates to `/dashboard`
- **THEN** the user is logged out and redirected to login with a message

#### Scenario: Non-active user logged out mid-session
- **WHEN** a non-active user with an active session makes any authenticated request
- **THEN** the user is logged out and redirected to login with a message

### Requirement: Admin status management
The system SHALL provide a CLI command for administrators to change a user's status.

#### Scenario: Admin changes user status
- **WHEN** an admin runs `php artisan users:status {email} {status}`
- **THEN** the user's `status` is updated and a confirmation message is displayed

#### Scenario: Invalid status value
- **WHEN** an admin provides an invalid status value
- **THEN** the command fails with an error

#### Scenario: Nonexistent user
- **WHEN** an admin provides an email that does not exist
- **THEN** the command fails with an error

### Requirement: Migration preserves existing users
The system SHALL set all existing users to `UserStatus::Active` when the status column is added.

#### Scenario: Migration runs
- **WHEN** the `add_status_to_users` migration runs
- **THEN** all existing users have `status` set to `UserStatus::Active`
