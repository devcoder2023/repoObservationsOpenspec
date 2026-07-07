<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class SyncPermissions extends Command
{
    protected $signature = 'permissions:sync';

    protected $description = 'Sync roles and permissions from enums to database';

    public function handle(): int
    {
        $this->info('Syncing roles and permissions...');

        Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\RoleAndPermissionSeeder']);

        Artisan::call('permission:cache-reset');

        $this->info('Roles and permissions synced successfully.');

        return Command::SUCCESS;
    }
}
