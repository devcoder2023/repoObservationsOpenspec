<?php

namespace App\Enums;

enum Permission: string
{
    // Users
    case UsersView = 'users.view';
    case UsersCreate = 'users.create';
    case UsersUpdate = 'users.update';
    case UsersDelete = 'users.delete';

    // Projects
    case ProjectsView = 'projects.view';
    case ProjectsCreate = 'projects.create';
    case ProjectsUpdate = 'projects.update';
    case ProjectsDelete = 'projects.delete';

    // Sites
    case SitesView = 'sites.view';
    case SitesCreate = 'sites.create';
    case SitesUpdate = 'sites.update';
    case SitesDelete = 'sites.delete';

    // Categories
    case CategoriesView = 'categories.view';
    case CategoriesCreate = 'categories.create';
    case CategoriesUpdate = 'categories.update';
    case CategoriesDelete = 'categories.delete';

    // Observations
    case ObservationsView = 'observations.view';
    case ObservationsViewAll = 'observations.view_all';
    case ObservationsCreate = 'observations.create';
    case ObservationsUpdate = 'observations.update';
    case ObservationsDelete = 'observations.delete';

    public static function all(): array
    {
        return self::cases();
    }

    public static function allValues(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}
