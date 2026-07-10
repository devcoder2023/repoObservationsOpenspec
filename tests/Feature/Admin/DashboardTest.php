<?php

use App\Enums\Role as RoleEnum;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('system administrator can access admin dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::SystemAdministrator->value);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/dashboard'));
});

test('non-admin user cannot access admin dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::Observer->value);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertForbidden();
});

test('guest is redirected to login when accessing admin dashboard', function () {
    $response = $this->get('/admin');

    $response->assertRedirect('/login');
});

test('admin dashboard shows summary counts', function () {
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::SystemAdministrator->value);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('stats', fn ($stats) => $stats
            ->where('users', 1)
            ->where('projects', 0)
            ->where('locations', 0)
            ->where('categories', 0)
        )
    );
});
