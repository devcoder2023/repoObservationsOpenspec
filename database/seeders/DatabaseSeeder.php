<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\UserStatus;
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

        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'status' => UserStatus::Active,
        ]);

        User::factory()->create([
            'name' => 'Analyst',
            'email' => 'analyst@example.com',
            'status' => UserStatus::Inactive,
        ]);

        User::factory()->create([
            'name' => 'Observer',
            'email' => 'observer@example.com',
            'status' => UserStatus::Inactive,
        ]);
    }
}
