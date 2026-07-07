<?php

use App\Enums\Role as RoleEnum;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

test('user can have permissions through role', function () {
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::Observer->value);

    expect($user->can('observations.view'))->toBeTrue();
    expect($user->can('observations.create'))->toBeTrue();
    expect($user->can('observations.update'))->toBeTrue();
    expect($user->can('observations.delete'))->toBeTrue();
    expect($user->can('users.view'))->toBeFalse();
});

test('system administrator has all permissions', function () {
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::SystemAdministrator->value);

    expect($user->can('users.view'))->toBeTrue();
    expect($user->can('users.create'))->toBeTrue();
    expect($user->can('observations.delete'))->toBeTrue();
    expect($user->can('categories.update'))->toBeTrue();
});

test('analyst has read-only observation access', function () {
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::Analyst->value);

    expect($user->can('observations.view'))->toBeTrue();
    expect($user->can('observations.create'))->toBeFalse();
    expect($user->can('observations.update'))->toBeFalse();
    expect($user->can('observations.delete'))->toBeFalse();
    expect($user->can('users.view'))->toBeFalse();
});
