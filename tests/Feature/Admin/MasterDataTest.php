<?php

use App\Enums\Role as RoleEnum;
use App\Models\ObservationCategory;
use App\Models\Site;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;

beforeEach(function () {
    $this->seed(RoleAndPermissionSeeder::class);
});

function admin(): User
{
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::SystemAdministrator->value);

    return $user;
}

// Projects

test('admin can list projects', function () {
    $response = $this->actingAs(admin())->get('/admin/projects');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/projects/index'));
});

test('admin can create a project', function () {
    $response = $this->actingAs(admin())->post('/admin/projects', [
        'name' => 'Test Project',
    ]);

    $response->assertRedirect('/admin/projects');
    $this->assertDatabaseHas('projects', ['name' => 'Test Project']);
});

test('admin can edit a project', function () {
    $project = Project::create(['name' => 'Original']);

    $response = $this->actingAs(admin())->patch("/admin/projects/{$project->id}", [
        'name' => 'Updated',
    ]);

    $response->assertRedirect('/admin/projects');
    $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Updated']);
});

test('admin can soft-delete a project', function () {
    $project = Project::create(['name' => 'To Delete']);

    $response = $this->actingAs(admin())->delete("/admin/projects/{$project->id}");

    $response->assertRedirect('/admin/projects');
    $this->assertSoftDeleted($project);
});

test('admin can restore a project', function () {
    $project = Project::create(['name' => 'To Restore']);
    $project->delete();

    $response = $this->actingAs(admin())->patch("/admin/projects/{$project->id}/restore");

    $response->assertRedirect('/admin/projects');
    $this->assertNotSoftDeleted($project);
});

// Sites

test('admin can list sites', function () {
    $response = $this->actingAs(admin())->get('/admin/sites');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/sites/index'));
});

test('admin can create a site', function () {
    $response = $this->actingAs(admin())->post('/admin/sites', [
        'name' => 'Test Site',
    ]);

    $response->assertRedirect('/admin/sites');
    $this->assertDatabaseHas('sites', ['name' => 'Test Site']);
});

test('admin can edit a site', function () {
    $site = Site::create(['name' => 'Original']);

    $response = $this->actingAs(admin())->patch("/admin/sites/{$site->id}", [
        'name' => 'Updated',
    ]);

    $response->assertRedirect('/admin/sites');
    $this->assertDatabaseHas('sites', ['id' => $site->id, 'name' => 'Updated']);
});

test('admin can soft-delete a site', function () {
    $site = Site::create(['name' => 'To Delete']);

    $response = $this->actingAs(admin())->delete("/admin/sites/{$site->id}");

    $response->assertRedirect('/admin/sites');
    $this->assertSoftDeleted($site);
});

test('admin can restore a site', function () {
    $site = Site::create(['name' => 'To Restore']);
    $site->delete();

    $response = $this->actingAs(admin())->patch("/admin/sites/{$site->id}/restore");

    $response->assertRedirect('/admin/sites');
    $this->assertNotSoftDeleted($site);
});

// Observation Categories

test('admin can list categories', function () {
    $response = $this->actingAs(admin())->get('/admin/categories');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/categories/index'));
});

test('admin can create a category', function () {
    $response = $this->actingAs(admin())->post('/admin/categories', [
        'name' => 'Test Category',
    ]);

    $response->assertRedirect('/admin/categories');
    $this->assertDatabaseHas('observation_categories', ['name' => 'Test Category']);
});

test('admin can edit a category', function () {
    $category = ObservationCategory::create(['name' => 'Original']);

    $response = $this->actingAs(admin())->patch("/admin/categories/{$category->id}", [
        'name' => 'Updated',
    ]);

    $response->assertRedirect('/admin/categories');
    $this->assertDatabaseHas('observation_categories', ['id' => $category->id, 'name' => 'Updated']);
});

test('admin can soft-delete a category', function () {
    $category = ObservationCategory::create(['name' => 'To Delete']);

    $response = $this->actingAs(admin())->delete("/admin/categories/{$category->id}");

    $response->assertRedirect('/admin/categories');
    $this->assertSoftDeleted($category);
});

test('admin can restore a category', function () {
    $category = ObservationCategory::create(['name' => 'To Restore']);
    $category->delete();

    $response = $this->actingAs(admin())->patch("/admin/categories/{$category->id}/restore");

    $response->assertRedirect('/admin/categories');
    $this->assertNotSoftDeleted($category);
});

test('non-admin cannot access master data routes', function () {
    $user = User::factory()->create();
    $user->assignRole(RoleEnum::Observer->value);

    $this->actingAs($user)->get('/admin/projects')->assertForbidden();
    $this->actingAs($user)->get('/admin/sites')->assertForbidden();
    $this->actingAs($user)->get('/admin/categories')->assertForbidden();
});
