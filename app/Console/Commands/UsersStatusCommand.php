<?php

namespace App\Console\Commands;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Console\Command;

class UsersStatusCommand extends Command
{
    protected $signature = 'users:status {email : The email of the user} {status : The new status (Active, Inactive, Suspended)}';

    protected $description = 'Change the status of a user';

    public function handle(): int
    {
        $email = $this->argument('email');
        $statusInput = ucfirst(strtolower($this->argument('status')));

        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("User with email '{$email}' not found.");
            return Command::FAILURE;
        }

        $status = match ($statusInput) {
            'Active' => UserStatus::Active,
            'Inactive' => UserStatus::Inactive,
            'Suspended' => UserStatus::Suspended,
            default => null,
        };

        if ($status === null) {
            $this->error("Invalid status '{$statusInput}'. Valid values: Active, Inactive, Suspended.");
            return Command::FAILURE;
        }

        $user->status = $status;
        $user->save();

        $this->info("User '{$email}' status changed to {$status->name}.");

        return Command::SUCCESS;
    }
}
