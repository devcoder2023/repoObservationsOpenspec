import { Head } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChartCard } from '@/components/charts/pie-chart-card';
import { SemiCircleGauge } from '@/components/charts/semi-circle-gauge';
import { Eye } from 'lucide-react';

type PeriodData = {
    total: number;
    closed: number;
    closed_pct: number;
    sites: { name: string; total: number; closed: number; closed_pct: number }[];
    categories: { name: string; total: number; closed: number; closed_pct: number }[];
    risk_distribution: Record<number, { count: number; pct: number }>;
    observers: { name: string; total: number }[];
    siteCategoryBreakdown: Record<string, { name: string; total: number }[]>;
};

export default function CurrentMonth({ periods }: { periods: Record<string, PeriodData> }) {
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('month');
    const [selectedSite, setSelectedSite] = useState<string | null>(null);

    const data = periods[selectedPeriod];

    const cards = [
        { key: 'today' as const, label: 'Today', count: periods.today.total, icon: Eye },
        { key: 'week' as const, label: 'This Week', count: periods.week.total, icon: Eye },
        { key: 'month' as const, label: 'Month to Date', count: periods.month.total, icon: Eye },
    ];

    const handleSiteClick = useCallback((siteName: string) => {
        setSelectedSite((prev) => (prev === siteName ? null : siteName));
    }, []);

    const siteCatData = selectedSite ? (data.siteCategoryBreakdown[selectedSite] ?? []) : [];

    const stackedSites = data.sites.map((s) => ({
        name: s.name,
        Closed: s.closed,
        Open: s.total - s.closed,
    }));

    const stackedCats = data.categories.map((c) => ({
        name: c.name,
        Closed: c.closed,
        Open: c.total - c.closed,
    }));

    const riskPieData = [
        { name: 'Low', count: data.risk_distribution[1]?.count ?? 0, pct: data.risk_distribution[1]?.pct ?? 0 },
        { name: 'Medium', count: data.risk_distribution[2]?.count ?? 0, pct: data.risk_distribution[2]?.pct ?? 0 },
        { name: 'High', count: data.risk_distribution[3]?.count ?? 0, pct: data.risk_distribution[3]?.pct ?? 0 },
    ];

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Current Month" />

            <div className="mb-6">
                <Heading title="Current Month" description="Deep-dive statistics — click a card to filter by period" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {cards.map((card) => {
                    const Icon = card.icon;
                    const isActive = selectedPeriod === card.key;
                    return (
                        <button
                            key={card.key}
                            type="button"
                            onClick={() => {
                                setSelectedPeriod(card.key);
                                setSelectedSite(null);
                            }}
                            className={`rounded-xl border p-4 text-left transition-colors ${
                                isActive
                                    ? 'border-primary bg-primary/5 dark:border-primary dark:bg-primary/10'
                                    : 'border-sidebar-border/70 dark:border-sidebar-border hover:border-primary/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                                <Icon className="size-4 text-muted-foreground" />
                            </div>
                            <div className="mt-2 text-2xl font-bold">{card.count}</div>
                        </button>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Observations per Site</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stackedSites} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-sidebar-border/30" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Closed" name="Closed" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]}
                                    cursor="pointer"
                                    onClick={(data: unknown) => {
                                        const d = data as { name?: string };
                                        if (d?.name) handleSiteClick(d.name);
                                    }}
                                />
                                <Bar dataKey="Open" name="Open" fill="#e0e7ff" stackId="a" radius={[0, 0, 0, 0]}
                                    cursor="pointer"
                                    onClick={(data: unknown) => {
                                        const d = data as { name?: string };
                                        if (d?.name) handleSiteClick(d.name);
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Observations per Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stackedCats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-sidebar-border/30" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Closed" name="Closed" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="Open" name="Open" fill="#e0e7ff" stackId="a" radius={[0, 0, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Closed Observations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SemiCircleGauge value={data.closed_pct} color="#6366f1" label="closure rate" />
                    </CardContent>
                </Card>

                <PieChartCard title="Risk Severity" data={riskPieData} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Observer Activity — Ranked</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {data.observers.map((obs, i) => (
                            <div key={obs.name} className="flex items-center justify-between border-b border-sidebar-border/30 py-1.5 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm">{obs.name}</span>
                                </div>
                                <span className="text-sm font-semibold">{obs.total}</span>
                            </div>
                        ))}
                        {data.observers.length === 0 && (
                            <p className="text-sm text-muted-foreground">No activity in this period</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {selectedSite && siteCatData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Categories at <span className="font-semibold text-foreground">{selectedSite}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={siteCatData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-sidebar-border/30" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                                <Tooltip />
                                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

CurrentMonth.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Current Month', href: '/analyst/current-month' },
    ],
};
