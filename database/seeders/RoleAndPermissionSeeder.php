<?php

namespace Database\Seeders;

use App\Enums\Permission as PermissionEnum;
use App\Enums\Role as RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $this->createPermissions();
        $this->createRoles();
    }

    private function createPermissions(): void
    {
        foreach (PermissionEnum::all() as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
    }

    private function createRoles(): void
    {
        foreach (RoleEnum::cases() as $roleEnum) {
            $role = Role::firstOrCreate(['name' => $roleEnum->value, 'guard_name' => 'web']);

            $permissionNames = array_map(
                fn (PermissionEnum $permission) => $permission->value,
                $roleEnum->permissions(),
            );

            if (! empty($permissionNames)) {
                $role->syncPermissions($permissionNames);
            }
        }
    }
}
