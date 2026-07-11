<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleAndPermissionSeeder::class);
        $this->call(ProjectAndSiteSeeder::class);

        $admin = User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'status' => UserStatus::Active,
        ]);
        $admin->assignRole(Role::SystemAdministrator->value);

        $analyst = User::factory()->create([
            'name' => 'Analyst',
            'email' => 'analyst@example.com',
            'status' => UserStatus::Inactive,
        ]);
        $analyst->assignRole(Role::Analyst->value);

        $observer = User::factory()->create([
            'name' => 'Observer',
            'email' => 'observer@example.com',
            'status' => UserStatus::Inactive,
        ]);
        $observer->assignRole(Role::Observer->value);
    }
}
