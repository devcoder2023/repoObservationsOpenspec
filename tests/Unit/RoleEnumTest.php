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

    expect($permissions)->toHaveCount(21);
});

test('general manager has observations.view and view_all', function () {
    $permissions = Role::GeneralManager->permissions();

    expect($permissions)->toHaveCount(2);
    $values = array_map(fn ($p) => $p->value, $permissions);
    expect($values)->toBe(['observations.view', 'observations.view_all']);
});

test('project manager has observations.view and view_all', function () {
    $permissions = Role::ProjectManager->permissions();

    expect($permissions)->toHaveCount(2);
    $values = array_map(fn ($p) => $p->value, $permissions);
    expect($values)->toBe(['observations.view', 'observations.view_all']);
});

test('analyst has observations.view and view_all', function () {
    $permissions = Role::Analyst->permissions();

    expect($permissions)->toHaveCount(2);
    $values = array_map(fn ($p) => $p->value, $permissions);
    expect($values)->toBe(['observations.view', 'observations.view_all']);
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
