<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLocationRequest;
use App\Http\Requests\Admin\UpdateLocationRequest;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        $locations = Location::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('admin/locations/index', [
            'locations' => $locations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/locations/create');
    }

    public function store(StoreLocationRequest $request): RedirectResponse
    {
        Location::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Location created.')]);

        return to_route('admin.locations.index');
    }

    public function edit(Location $location): Response
    {
        return Inertia::render('admin/locations/edit', [
            'location' => $location,
        ]);
    }

    public function update(UpdateLocationRequest $request, Location $location): RedirectResponse
    {
        $location->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Location updated.')]);

        return to_route('admin.locations.index');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Location deleted.')]);

        return to_route('admin.locations.index');
    }

    public function restore(Location $location): RedirectResponse
    {
        $location->restore();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Location restored.')]);

        return to_route('admin.locations.index');
    }
}
