<?php

namespace App\Http\Controllers;

use App\Enums\ObservationStatus;
use App\Http\Requests\Observation\StoreObservationRequest;
use App\Http\Requests\Observation\UpdateObservationRequest;
use App\Models\Observation;
use App\Models\ObservationCategory;
use App\Models\Project;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ObservationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Observation::with(['project', 'site', 'category', 'creator']);

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('site_id')) {
            $query->where('site_id', $request->site_id);
        }
        if ($request->filled('observation_category_id')) {
            $query->where('observation_category_id', $request->observation_category_id);
        }
        if ($request->filled('shift')) {
            $query->where('shift', (int) $request->shift);
        }
        if ($request->filled('risk_degree')) {
            $query->where('risk_degree', (int) $request->risk_degree);
        }
        if ($request->filled('status')) {
            $query->where('status', (int) $request->status);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $observations = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return Inertia::render('observations/index', [
            'observations' => $observations,
            'filters' => $request->only([
                'project_id', 'site_id', 'observation_category_id',
                'shift', 'risk_degree', 'status', 'date_from', 'date_to',
            ]),
            'projects' => Project::orderBy('name')->get(),
            'sites' => Site::orderBy('name')->get(),
            'categories' => ObservationCategory::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('observations/create', [
            'projects' => Project::orderBy('name')->get(),
            'sites' => Site::orderBy('name')->get(),
            'categories' => ObservationCategory::orderBy('name')->get(),
        ]);
    }

    public function store(StoreObservationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['image_before'] = $request->file('image_before')->store('observations/'.now()->format('Y/m'), 'public');
        $data['creator_id'] = $request->user()->id;

        if ($request->hasFile('image_after')) {
            $data['image_after'] = $request->file('image_after')->store('observations/'.now()->format('Y/m'), 'public');
            $data['status'] = ObservationStatus::Close;
        } else {
            unset($data['image_after']);
            $data['status'] = ObservationStatus::Open;
        }

        Observation::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Observation created.')]);

        return to_route('observations.index');
    }

    public function show(Observation $observation): Response
    {
        $observation->load(['project', 'site', 'category', 'creator']);

        return Inertia::render('observations/show', [
            'observation' => $observation,
        ]);
    }

    public function edit(Observation $observation): Response
    {
        if ($observation->created_at->lt(Carbon::now()->subHours(48))) {
            abort(403, 'Observation can only be edited within 2 days of creation.');
        }

        return Inertia::render('observations/edit', [
            'observation' => $observation->load(['project', 'site', 'category', 'creator']),
            'projects' => Project::orderBy('name')->get(),
            'sites' => Site::orderBy('name')->get(),
            'categories' => ObservationCategory::orderBy('name')->get(),
        ]);
    }

    public function update(UpdateObservationRequest $request, Observation $observation): RedirectResponse
    {
        $request->ensureWithinTimeWindow();

        $data = $request->validated();

        if ($request->hasFile('image_before')) {
            Storage::disk('public')->delete($observation->image_before);
            $data['image_before'] = $request->file('image_before')->store('observations/'.now()->format('Y/m'), 'public');
        } else {
            unset($data['image_before']);
        }

        if ($request->hasFile('image_after')) {
            if ($observation->image_after) {
                Storage::disk('public')->delete($observation->image_after);
            }
            $data['image_after'] = $request->file('image_after')->store('observations/'.now()->format('Y/m'), 'public');
            $data['status'] = ObservationStatus::Close;
        } else {
            unset($data['image_after']);
        }

        $observation->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Observation updated.')]);

        return to_route('observations.index');
    }

    public function destroy(Observation $observation): RedirectResponse
    {
        if ($observation->created_at->lt(Carbon::now()->subHours(48))) {
            abort(403, 'Observation can only be deleted within 2 days of creation.');
        }

        if ($observation->image_before) {
            Storage::disk('public')->delete($observation->image_before);
        }
        if ($observation->image_after) {
            Storage::disk('public')->delete($observation->image_after);
        }

        $observation->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Observation deleted.')]);

        return to_route('observations.index');
    }

    public function dashboard(): Response
    {
        $now = Carbon::now();

        $today = clone $now;
        $weekStart = (clone $now)->startOfWeek();
        $monthStart = (clone $now)->startOfMonth();
        $prevMonthStart = (clone $now)->subMonth()->startOfMonth();
        $prevMonthEnd = (clone $now)->subMonth()->endOfMonth();

        $stats = [
            'today' => $this->periodStats(clone $today->startOfDay(), clone $today->copy()->endOfDay()),
            'week' => $this->periodStats(clone $weekStart, clone $now),
            'month' => $this->periodStats(clone $monthStart, clone $now),
            'previous_month' => $this->periodStats(clone $prevMonthStart, clone $prevMonthEnd),
        ];

        return Inertia::render('observations/dashboard', [
            'stats' => $stats,
        ]);
    }

    public function sitesByProject(Request $request): JsonResponse
    {
        $sites = Site::where('project_id', $request->project_id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($sites);
    }

    /** @return array{total: int, open: int, closed: int, risk_distribution: array{1: int, 2: int, 3: int}} */
    private function periodStats(Carbon $start, Carbon $end): array
    {
        $query = Observation::whereBetween('created_at', [$start, $end]);

        $total = (clone $query)->count();
        $open = (clone $query)->where('status', ObservationStatus::Open)->count();
        $closed = (clone $query)->where('status', ObservationStatus::Close)->count();

        $riskDistribution = (clone $query)
            ->selectRaw('risk_degree, count(*) as count')
            ->groupBy('risk_degree')
            ->pluck('count', 'risk_degree');

        return [
            'total' => $total,
            'open' => $open,
            'closed' => $closed,
            'risk_distribution' => [
                1 => $riskDistribution->get(1, 0),
                2 => $riskDistribution->get(2, 0),
                3 => $riskDistribution->get(3, 0),
            ],
        ];
    }
}
