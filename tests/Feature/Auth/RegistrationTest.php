<?php

use App\Enums\UserStatus;
use App\Models\User;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users register as inactive and are redirected to login', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertGuest();
    $response->assertRedirect(route('login'));

    $user = User::where('email', 'test@example.com')->first();
    expect($user->status)->toBe(UserStatus::Inactive);

    $response->assertSessionHas('status', 'Account created. An administrator must activate your account before you can log in.');
});
