<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ObservationCategory;
use App\Models\Site;
use App\Models\Project;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'users' => User::count(),
                'projects' => Project::count(),
                'sites' => Site::count(),
                'categories' => ObservationCategory::count(),
            ],
        ]);
    }
}
