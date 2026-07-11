<?php

use App\Http\Requests\Admin\StoreObservationCategoryRequest;
use App\Http\Requests\Admin\StoreSiteRequest;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\StoreUserRequest;

it('has proper validation rules for store user request', function () {
    $request = new StoreUserRequest;
    $rules = $request->rules();

    expect($rules['name'])->toContain('required', 'string', 'max:255');
    expect($rules['email'])->toContain('required', 'email', 'unique:users');
    expect($rules['password'])->toContain('required');
    expect($rules['role'])->toContain('nullable');
    expect($rules['status'])->toContain('nullable', 'integer');
});

it('has proper validation rules for store project request', function () {
    $request = new StoreProjectRequest;
    $rules = $request->rules();

    expect($rules['name'])->toContain('required', 'string', 'max:255', 'unique:projects,name');
});

it('has proper validation rules for store site request', function () {
    $request = new StoreSiteRequest;
    $rules = $request->rules();

    expect($rules['name'])->toContain('required', 'string', 'max:255', 'unique:sites,name');
});

it('has proper validation rules for store category request', function () {
    $request = new StoreObservationCategoryRequest;
    $rules = $request->rules();

    expect($rules['name'])->toContain('required', 'string', 'max:255', 'unique:observation_categories,name');
});
