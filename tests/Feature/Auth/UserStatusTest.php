<?php

use App\Enums\UserStatus;
use App\Models\User;

test('inactive user is redirected from dashboard to login', function () {
    $user = User::factory()->inactive()->create();

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
    $response->assertSessionHas('error', 'Your account is inactive. Please contact an administrator.');
});

test('suspended user is redirected from dashboard to login', function () {
    $user = User::factory()->suspended()->create();

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
    $response->assertSessionHas('error', 'Your account has been suspended. Please contact an administrator.');
});

test('non-active user is logged out on authenticated request', function () {
    $user = User::factory()->inactive()->create();

    $this->actingAs($user);

    $this->get(route('dashboard'));

    $this->assertGuest();
});

test('active user can visit dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('users:status command changes user status', function () {
    $user = User::factory()->create(['status' => UserStatus::Inactive]);

    $this->artisan('users:status', ['email' => $user->email, 'status' => 'Active'])
        ->expectsOutput("User '{$user->email}' status changed to Active.")
        ->assertSuccessful();

    expect($user->fresh()->status)->toBe(UserStatus::Active);
});

test('users:status command fails for invalid status', function () {
    $user = User::factory()->create();

    $this->artisan('users:status', ['email' => $user->email, 'status' => 'Invalid'])
        ->expectsOutput("Invalid status 'Invalid'. Valid values: Active, Inactive, Suspended.")
        ->assertExitCode(1);
});

test('users:status command fails for nonexistent user', function () {
    $this->artisan('users:status', ['email' => 'nonexistent@example.com', 'status' => 'Active'])
        ->expectsOutput("User with email 'nonexistent@example.com' not found.")
        ->assertExitCode(1);
});
