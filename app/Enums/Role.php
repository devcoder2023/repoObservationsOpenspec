<?php

namespace App\Enums;

enum Role: string
{
    case SystemAdministrator = 'System Administrator';
    case GeneralManager = 'General Manager';
    case ProjectManager = 'Project Manager';
    case Analyst = 'Analyst';
    case Observer = 'Observer';

    public function permissions(): array
    {
        return match ($this) {
            self::SystemAdministrator => Permission::all(),
            self::GeneralManager => [
                Permission::ObservationsView,
                Permission::ObservationsViewAll,
            ],
            self::ProjectManager => [
                Permission::ObservationsView,
                Permission::ObservationsViewAll,
            ],
            self::Analyst => [
                Permission::ObservationsView,
                Permission::ObservationsViewAll,
            ],
            self::Observer => [
                Permission::ObservationsView,
                Permission::ObservationsCreate,
                Permission::ObservationsUpdate,
                Permission::ObservationsDelete,
            ],
        };
    }
}
