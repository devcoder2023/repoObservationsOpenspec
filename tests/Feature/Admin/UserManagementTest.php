<?php

use App\Enums\Role as RoleEnum;
use App\Enums\UserStatus;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('admin can list users', function () {
    $admin = User::factory()->create();
    $admin->assignRole(RoleEnum::SystemAdministrator->value);

    User::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/users/index'));
});

test('admin can view create user page', function () {
    $admin = User::factory()->create();
    $admin->assignRole(RoleEnum::SystemAdministrator->value);

    $response = $this->actingAs($admin)->get('/admin/users/create');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/users/create'));
});

test('admin can create a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole(RoleEnum::SystemAdministrator->value);

    $response = $this->actingAs($admin)->post('/admin/users', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'role' => RoleEnum::Observer->value,
        'status' => UserStatus::Active->value,
    ]);

    $response->assertRedirect('/admin/users');

    $this->assertDatabaseHas('users', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
    ]);
});

test('admin can view edit user page', function () {
    $admin = User::factory()->create();
    $admin->assignRole(RoleEnum::SystemAdministrator->value);

    $user = User::factory()->create();

    $response = $this->actingAs($admin)->get("/admin/users/{$user->id}/edit");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/users/edit'));
});

test('admin can update a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole(RoleEnum::SystemAdministrator->value);

    $user = User::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}", [
        'name' => 'Updated Name',
        'email' => $user->email,
    ]);

    $response->assertRedirect('/admin/users');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
    ]);
});

test('admin can delete a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole(RoleEnum::SystemAdministrator->value);

    $user = User::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/users/{$user->id}");

    $response->assertRedirect('/admin/users');

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('admin cannot delete own account', function () {
    $admin = User::factory()->create();
    $admin->assignRole(RoleEnum::SystemAdministrator->value);

    $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

    $response->assertRedirect();
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

test('non-admin cannot access user management routes', function () {
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::Observer->value);

    $this->actingAs($user)->get('/admin/users')->assertForbidden();
    $this->actingAs($user)->get('/admin/users/create')->assertForbidden();
});
