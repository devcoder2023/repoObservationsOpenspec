<?php

use App\Enums\Role;

test('role enum has 5 cases', function () {
    expect(count(Role::cases()))->toBe(5);
});

test('roles have correct names', function () {
    expect(Role::SystemAdministrator->value)->toBe('System Administrator');
    expect(Role::GeneralManager->value)->toBe('General Manager');
    expect(Role::ProjectManager->value)->toBe('Project Manager');
    expect(Role::Analyst->value)->toBe('Analyst');
    expect(Role::Observer->value)->toBe('Observer');
});

test('system administrator has all permissions', function () {
    $permissions = Role::SystemAdministrator->permissions();

    expect($permissions)->toHaveCount(20);
});

test('general manager has only observations.view', function () {
    $permissions = Role::GeneralManager->permissions();

    expect($permissions)->toHaveCount(1);
    expect($permissions[0]->value)->toBe('observations.view');
});

test('project manager has only observations.view', function () {
    $permissions = Role::ProjectManager->permissions();

    expect($permissions)->toHaveCount(1);
    expect($permissions[0]->value)->toBe('observations.view');
});

test('analyst has only observations.view', function () {
    $permissions = Role::Analyst->permissions();

    expect($permissions)->toHaveCount(1);
    expect($permissions[0]->value)->toBe('observations.view');
});

test('observer has all observation permissions', function () {
    $permissions = Role::Observer->permissions();

    expect($permissions)->toHaveCount(4);

    $values = array_map(fn ($p) => $p->value, $permissions);
    expect($values)->toBe([
        'observations.view',
        'observations.create',
        'observations.update',
        'observations.delete',
    ]);
});
