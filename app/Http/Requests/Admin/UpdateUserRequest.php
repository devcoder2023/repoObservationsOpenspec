<?php

namespace App\Http\Requests\Admin;

use App\Enums\Role;
use App\Enums\UserStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function rules(): array
    {
        $roles = implode(',', array_map(fn (Role $r) => $r->value, Role::cases()));
        $statuses = implode(',', array_map(fn (UserStatus $s) => $s->value, UserStatus::cases()));

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($this->route('user'))],
            'password' => ['nullable', Password::defaults()],
            'role' => ['nullable', 'string', "in:{$roles}"],
            'status' => ['nullable', 'integer', "in:{$statuses}"],
        ];
    }
}
