<?php

namespace App\Http\Requests\Admin;

use App\Enums\Role;
use App\Enums\UserStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        $roles = implode(',', array_map(fn (Role $r) => $r->value, Role::cases()));
        $statuses = implode(',', array_map(fn (UserStatus $s) => $s->value, UserStatus::cases()));

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults()],
            'role' => ['nullable', 'string', "in:{$roles}"],
            'status' => ['nullable', 'integer', "in:{$statuses}"],
        ];
    }
}
