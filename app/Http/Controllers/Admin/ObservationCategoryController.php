<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreObservationCategoryRequest;
use App\Http\Requests\Admin\UpdateObservationCategoryRequest;
use App\Models\ObservationCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ObservationCategoryController extends Controller
{
    public function index(): Response
    {
        $categories = ObservationCategory::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/categories/create');
    }

    public function store(StoreObservationCategoryRequest $request): RedirectResponse
    {
        ObservationCategory::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category created.')]);

        return to_route('admin.categories.index');
    }

    public function edit(ObservationCategory $observationCategory): Response
    {
        return Inertia::render('admin/categories/edit', [
            'category' => $observationCategory,
        ]);
    }

    public function update(UpdateObservationCategoryRequest $request, ObservationCategory $observationCategory): RedirectResponse
    {
        $observationCategory->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category updated.')]);

        return to_route('admin.categories.index');
    }

    public function destroy(ObservationCategory $observationCategory): RedirectResponse
    {
        $observationCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category deleted.')]);

        return to_route('admin.categories.index');
    }

    public function restore(ObservationCategory $observationCategory): RedirectResponse
    {
        $observationCategory->restore();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category restored.')]);

        return to_route('admin.categories.index');
    }
}
