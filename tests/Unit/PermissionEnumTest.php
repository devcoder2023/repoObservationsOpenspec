<?php

use App\Enums\Permission;

test('permission enum has 20 cases', function () {
    expect(count(Permission::cases()))->toBe(20);
});

test('permission values follow resource.action convention', function () {
    foreach (Permission::cases() as $case) {
        expect($case->value)->toBeString();
        expect(str_contains($case->value, '.'))->toBeTrue();
    }
});

test('permission allValues returns all 20 string values', function () {
    $values = Permission::allValues();

    expect($values)->toHaveCount(20);
    expect($values)->toContain('users.view');
    expect($values)->toContain('observations.delete');
});

test('permission all returns all enum cases', function () {
    expect(Permission::all())->toHaveCount(20);
});
