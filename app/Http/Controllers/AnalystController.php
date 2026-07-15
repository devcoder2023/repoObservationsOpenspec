<?php

namespace App\Http\Controllers;

use App\Enums\ObservationStatus;
use App\Models\Observation;
use App\Models\ObservationCategory;
use App\Models\Project;
use App\Models\Site;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalystController extends Controller
{
    public function trends(): Response
    {
        $now = Carbon::now();
        $twelveMonthsAgo = (clone $now)->subMonths(12)->startOfMonth();
        $openVal = ObservationStatus::Open->value;
        $closeVal = ObservationStatus::Close->value;

        $monthlyStats = DB::table('observations')
            ->where('created_at', '>=', $twelveMonthsAgo)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month")
            ->selectRaw('count(*) as total')
            ->selectRaw("sum(case when status = {$openVal} then 1 else 0 end) as open")
            ->selectRaw("sum(case when status = {$closeVal} then 1 else 0 end) as closed")
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%Y-%m')"))
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                $total = (int) $row->total;

                return [
                    'month' => $row->month,
                    'total' => $total,
                    'open' => (int) $row->open,
                    'closed' => (int) $row->closed,
                    'open_pct' => $total > 0 ? round(((int) $row->open / $total) * 100, 1) : 0,
                    'closed_pct' => $total > 0 ? round(((int) $row->closed / $total) * 100, 1) : 0,
                ];
            })->values();

        $cumulativeTotal = 0;
        $monthlyData = $monthlyStats->map(function ($row) use (&$cumulativeTotal) {
            $cumulativeTotal += $row['total'];

            return [...$row, 'cumulative' => $cumulativeTotal];
        });

        $months = $monthlyStats->pluck('month')->values();

        $siteBreakdown = [];
        $categoryTop5 = [];
        $observerActivity = [];

        foreach ($months as $month) {
            [$year, $monthNum] = explode('-', $month);
            $monthStart = "{$year}-{$monthNum}-01";
            $monthEnd = Carbon::parse($monthStart)->endOfMonth()->format('Y-m-d');

            $sites = DB::table('observations')
                ->whereBetween('observations.created_at', [$monthStart, "{$monthEnd} 23:59:59"])
                ->selectRaw('COALESCE(sites.name, observations.custom_site) as name')
                ->selectRaw('count(*) as total')
                ->selectRaw("sum(case when status = {$closeVal} then 1 else 0 end) as closed")
                ->leftJoin('sites', 'observations.site_id', '=', 'sites.id')
                ->whereNotNull(DB::raw('COALESCE(sites.name, observations.custom_site)'))
                ->groupBy(DB::raw('COALESCE(sites.name, observations.custom_site)'))
                ->orderByDesc('total')
                ->get()
                ->map(fn ($row) => [
                    'name' => $row->name,
                    'total' => (int) $row->total,
                    'closed' => (int) $row->closed,
                    'closed_pct' => $row->total > 0 ? round(((int) $row->closed / (int) $row->total) * 100, 1) : 0,
                ]);

            $siteBreakdown[$month] = $sites;

            $cats = DB::table('observations')
                ->whereBetween('observations.created_at', [$monthStart, "{$monthEnd} 23:59:59"])
                ->selectRaw('observation_categories.name')
                ->selectRaw('count(*) as total')
                ->leftJoin('observation_categories', 'observations.observation_category_id', '=', 'observation_categories.id')
                ->whereNotNull('observation_categories.name')
                ->groupBy('observation_categories.name')
                ->orderByDesc('total')
                ->limit(5)
                ->get()
                ->map(fn ($row) => ['name' => $row->name, 'total' => (int) $row->total]);

            $categoryTop5[$month] = $cats;

            $observers = DB::table('observations')
                ->whereBetween('observations.created_at', [$monthStart, "{$monthEnd} 23:59:59"])
                ->selectRaw('users.name')
                ->selectRaw('count(*) as total')
                ->join('users', 'observations.creator_id', '=', 'users.id')
                ->groupBy('users.name')
                ->orderByDesc('total')
                ->get()
                ->map(fn ($row) => ['name' => $row->name, 'total' => (int) $row->total]);

            $observerActivity[$month] = $observers;
        }

        $defaultMonth = $months->last();

        return Inertia::render('analyst/trends', [
            'monthlyData' => $monthlyData,
            'siteBreakdown' => $siteBreakdown,
            'categoryTop5' => $categoryTop5,
            'observerActivity' => $observerActivity,
            'defaultMonth' => $defaultMonth,
        ]);
    }

    public function currentMonth(): Response
    {
        $now = Carbon::now();

        $todayStart = (clone $now)->startOfDay();
        $weekStart = (clone $now)->startOfWeek(Carbon::SATURDAY);
        $monthStart = (clone $now)->startOfMonth();
        $monthEnd = (clone $now)->endOfMonth();

        $periods = [
            'today' => [$todayStart, $now],
            'week' => [$weekStart, $now],
            'month' => [$monthStart, $now],
        ];

        $closeVal = ObservationStatus::Close->value;

        $buildPeriod = function (Carbon $start, Carbon $end) use ($closeVal) {
            $query = DB::table('observations')
                ->where('observations.created_at', '>=', $start)
                ->where('observations.created_at', '<=', $end);

            $total = (clone $query)->count();
            $closed = (clone $query)->where('status', $closeVal)->count();
            $closedPct = $total > 0 ? round(($closed / $total) * 100, 1) : 0;

            $sites = (clone $query)
                ->selectRaw('COALESCE(sites.name, observations.custom_site) as name')
                ->selectRaw('count(*) as total')
                ->selectRaw("sum(case when status = {$closeVal} then 1 else 0 end) as closed")
                ->leftJoin('sites', 'observations.site_id', '=', 'sites.id')
                ->whereNotNull(DB::raw('COALESCE(sites.name, observations.custom_site)'))
                ->groupBy(DB::raw('COALESCE(sites.name, observations.custom_site)'))
                ->orderByDesc('total')
                ->get()
                ->map(fn ($row) => [
                    'name' => $row->name,
                    'total' => (int) $row->total,
                    'closed' => (int) $row->closed,
                    'closed_pct' => $row->total > 0 ? round(((int) $row->closed / (int) $row->total) * 100, 1) : 0,
                ]);

            $categories = (clone $query)
                ->selectRaw('observation_categories.name')
                ->selectRaw('count(*) as total')
                ->selectRaw("sum(case when status = {$closeVal} then 1 else 0 end) as closed")
                ->leftJoin('observation_categories', 'observations.observation_category_id', '=', 'observation_categories.id')
                ->whereNotNull('observation_categories.name')
                ->groupBy('observation_categories.name')
                ->orderByDesc('total')
                ->get()
                ->map(fn ($row) => [
                    'name' => $row->name,
                    'total' => (int) $row->total,
                    'closed' => (int) $row->closed,
                    'closed_pct' => $row->total > 0 ? round(((int) $row->closed / (int) $row->total) * 100, 1) : 0,
                ]);

            $riskDist = (clone $query)
                ->selectRaw('risk_degree, count(*) as count')
                ->groupBy('risk_degree')
                ->pluck('count', 'risk_degree');

            $observers = (clone $query)
                ->selectRaw('users.name')
                ->selectRaw('count(*) as total')
                ->join('users', 'observations.creator_id', '=', 'users.id')
                ->groupBy('users.name')
                ->orderByDesc('total')
                ->get()
                ->map(fn ($row) => ['name' => $row->name, 'total' => (int) $row->total]);

            $siteCategoryBreakdown = [];
            foreach ($sites as $site) {
                $catBreak = (clone $query)
                    ->selectRaw('observation_categories.name')
                    ->selectRaw('count(*) as total')
                    ->leftJoin('observation_categories', 'observations.observation_category_id', '=', 'observation_categories.id')
                    ->leftJoin('sites', 'observations.site_id', '=', 'sites.id')
                    ->whereNotNull('observation_categories.name')
                    ->whereRaw('COALESCE(sites.name, observations.custom_site) = ?', [$site['name']])
                    ->groupBy('observation_categories.name')
                    ->orderByDesc('total')
                    ->get()
                    ->map(fn ($row) => ['name' => $row->name, 'total' => (int) $row->total]);

                $siteCategoryBreakdown[$site['name']] = $catBreak;
            }

            return [
                'total' => $total,
                'closed' => $closed,
                'closed_pct' => $closedPct,
                'sites' => $sites,
                'categories' => $categories,
                'risk_distribution' => [
                    1 => ['count' => $riskDist->get(1, 0), 'pct' => $total > 0 ? round(($riskDist->get(1, 0) / $total) * 100, 1) : 0],
                    2 => ['count' => $riskDist->get(2, 0), 'pct' => $total > 0 ? round(($riskDist->get(2, 0) / $total) * 100, 1) : 0],
                    3 => ['count' => $riskDist->get(3, 0), 'pct' => $total > 0 ? round(($riskDist->get(3, 0) / $total) * 100, 1) : 0],
                ],
                'observers' => $observers,
                'siteCategoryBreakdown' => $siteCategoryBreakdown,
            ];
        };

        $result = [];
        foreach ($periods as $key => [$start, $end]) {
            $result[$key] = $buildPeriod($start, $end);
        }

        return Inertia::render('analyst/current-month', [
            'periods' => $result,
        ]);
    }

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
        if ($request->filled('creator_id')) {
            $query->where('creator_id', $request->creator_id);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('comment_before', 'like', "%{$search}%")
                    ->orWhere('comment_after', 'like', "%{$search}%")
                    ->orWhere('custom_site', 'like', "%{$search}%");
            });
        }

        $observations = $query->orderBy('created_at', 'desc')->paginate(50)->withQueryString();

        $observers = User::whereHas('roles', function ($q) {
            $q->where('name', 'Observer');
        })->orderBy('name')->get(['id', 'name']);

        return Inertia::render('analyst/observations/index', [
            'observations' => $observations,
            'filters' => $request->only([
                'project_id', 'site_id', 'observation_category_id',
                'shift', 'risk_degree', 'status', 'date_from', 'date_to',
                'creator_id', 'search',
            ]),
            'projects' => Project::orderBy('name')->get(),
            'sites' => Site::orderBy('name')->get(),
            'categories' => ObservationCategory::orderBy('name')->get(),
            'observers' => $observers,
        ]);
    }
}
