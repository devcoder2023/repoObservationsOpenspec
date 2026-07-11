<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Site;
use Illuminate\Database\Seeder;

class ProjectAndSiteSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            ['name' => 'Main Office Building'],
            ['name' => 'Warehouse Facility A'],
            ['name' => 'Construction Site Delta'],
        ];

        foreach ($projects as $data) {
            $project = Project::create($data);

            Site::create(['name' => "{$project->name} - North Wing", 'project_id' => $project->id]);
            Site::create(['name' => "{$project->name} - South Wing", 'project_id' => $project->id]);
        }
    }
}
