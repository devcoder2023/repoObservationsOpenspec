<?php

use App\Enums\Permission as PermissionEnum;
use App\Enums\Role as RoleEnum;
use Database\Seeders\RoleAndPermissionSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('seeds all 20 permissions', function () {
    expect(Permission::count())->toBe(20);

    foreach (PermissionEnum::allValues() as $permission) {
        expect(Permission::where('name', $permission)->exists())->toBeTrue();
    }
});

test('seeds all 5 roles', function () {
    expect(Role::count())->toBe(5);

    foreach (RoleEnum::cases() as $role) {
        expect(Role::where('name', $role->value)->exists())->toBeTrue();
    }
});

test('seeder is idempotent', function () {
    $this->seed(RoleAndPermissionSeeder::class);

    expect(Permission::count())->toBe(20);
    expect(Role::count())->toBe(5);
});

test('system administrator has all permissions', function () {
    $role = Role::where('name', RoleEnum::SystemAdministrator->value)->first();

    expect($role->permissions->count())->toBe(20);
});

test('general manager has only observations.view permission', function () {
    $role = Role::where('name', RoleEnum::GeneralManager->value)->first();

    expect($role->permissions->pluck('name')->toArray())->toBe(['observations.view']);
});

test('project manager has only observations.view permission', function () {
    $role = Role::where('name', RoleEnum::ProjectManager->value)->first();

    expect($role->permissions->pluck('name')->toArray())->toBe(['observations.view']);
});

test('analyst has only observations.view permission', function () {
    $role = Role::where('name', RoleEnum::Analyst->value)->first();

    expect($role->permissions->pluck('name')->toArray())->toBe(['observations.view']);
});

test('observer has all observation permissions', function () {
    $role = Role::where('name', RoleEnum::Observer->value)->first();

    expect($role->permissions->pluck('name')->toArray())->toBe([
        'observations.view',
        'observations.create',
        'observations.update',
        'observations.delete',
    ]);
});
