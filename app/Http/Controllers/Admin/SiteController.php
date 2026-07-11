<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSiteRequest;
use App\Http\Requests\Admin\UpdateSiteRequest;
use App\Models\Site;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    public function index(): Response
    {
        $sites = Site::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('admin/sites/index', [
            'sites' => $sites,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/sites/create');
    }

    public function store(StoreSiteRequest $request): RedirectResponse
    {
        Site::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Site created.')]);

        return to_route('admin.sites.index');
    }

    public function edit(Site $site): Response
    {
        return Inertia::render('admin/sites/edit', [
            'site' => $site,
        ]);
    }

    public function update(UpdateSiteRequest $request, Site $site): RedirectResponse
    {
        $site->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Site updated.')]);

        return to_route('admin.sites.index');
    }

    public function destroy(Site $site): RedirectResponse
    {
        $site->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Site deleted.')]);

        return to_route('admin.sites.index');
    }

    public function restore(Site $site): RedirectResponse
    {
        $site->restore();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Site restored.')]);

        return to_route('admin.sites.index');
    }
}
