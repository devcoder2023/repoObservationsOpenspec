import { Head } from '@inertiajs/react';
import { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SemiCircleGauge } from '@/components/charts/semi-circle-gauge';
import { TrendingUp, EyeOff, Medal, MapPin, RotateCcw } from 'lucide-react';

type MonthlyRow = {
    month: string;
    total: number;
    open: number;
    closed: number;
    open_pct: number;
    closed_pct: number;
    cumulative: number;
};

type DistItem = { name: string; total: number; closed?: number; closed_pct?: number };

function CustomDot({ cx, cy, payload, onClick, selectedMonth }: {
    cx?: number;
    cy?: number;
    payload?: { month?: string };
    onClick: (month: string) => void;
    selectedMonth: string | null;
}) {
    if (!cx || !cy || !payload?.month) return null;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            fill={payload.month === selectedMonth ? '#6366f1' : '#94a3b8'}
            stroke="#fff"
            strokeWidth={2}
            cursor="pointer"
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onClick(payload.month!);
            }}
        />
    );
}

export default function Trends({ monthlyData, siteBreakdown, categoryTop5, observerActivity, defaultMonth }: {
    monthlyData: MonthlyRow[];
    siteBreakdown: Record<string, DistItem[]>;
    categoryTop5: Record<string, DistItem[]>;
    observerActivity: Record<string, { name: string; total: number }[]>;
    defaultMonth: string | null;
}) {
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    const aggregateSites = useMemo(() => {
        const map = new Map<string, { total: number; closed: number }>();
        Object.values(siteBreakdown).forEach((sites) => {
            sites.forEach((s) => {
                const entry = map.get(s.name) ?? { total: 0, closed: 0 };
                entry.total += s.total;
                entry.closed += s.closed ?? 0;
                map.set(s.name, entry);
            });
        });
        return Array.from(map.entries())
            .map(([name, data]) => ({
                name,
                total: data.total,
                closed: data.closed,
                closed_pct: data.total > 0 ? Math.round((data.closed / data.total) * 1000) / 10 : 0,
            }))
            .sort((a, b) => b.total - a.total);
    }, [siteBreakdown]);

    const aggregateCats = useMemo(() => {
        const map = new Map<string, number>();
        Object.values(categoryTop5).forEach((cats) => {
            cats.forEach((c) => {
                map.set(c.name, (map.get(c.name) ?? 0) + c.total);
            });
        });
        return Array.from(map.entries())
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [categoryTop5]);

    const aggregateObservers = useMemo(() => {
        const map = new Map<string, number>();
        Object.values(observerActivity).forEach((obs) => {
            obs.forEach((o) => {
                map.set(o.name, (map.get(o.name) ?? 0) + o.total);
            });
        });
        return Array.from(map.entries())
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total);
    }, [observerActivity]);

    const aggregateTotal = useMemo(() => monthlyData.reduce((sum, m) => sum + m.total, 0), [monthlyData]);
    const aggregateClosed = useMemo(() => monthlyData.reduce((sum, m) => sum + m.closed, 0), [monthlyData]);
    const aggregateClosedPct = aggregateTotal > 0 ? Math.round((aggregateClosed / aggregateTotal) * 1000) / 10 : 0;

    const isAllMonths = selectedMonth === null;
    const activeLabel = isAllMonths ? 'All 12 Months' : selectedMonth;

    const sites = isAllMonths ? aggregateSites : (selectedMonth ? siteBreakdown[selectedMonth] ?? [] : []);
    const cats = isAllMonths ? aggregateCats : (selectedMonth ? categoryTop5[selectedMonth] ?? [] : []);
    const observers = isAllMonths ? aggregateObservers : (selectedMonth ? observerActivity[selectedMonth] ?? [] : []);
    const monthInfo = isAllMonths
        ? { total: aggregateTotal, closed: aggregateClosed, closed_pct: aggregateClosedPct }
        : (monthlyData.find((m) => m.month === selectedMonth) ?? null);

    const handleMonthClick = useCallback((month: string) => {
        setSelectedMonth((prev) => (prev === month ? null : month));
    }, []);

    const handleReset = useCallback(() => setSelectedMonth(null), []);

    const stackedSites = sites.map((s) => ({
        name: s.name,
        Closed: s.closed ?? 0,
        Open: s.total - (s.closed ?? 0),
    }));

    const catChartData = cats.slice(0, 5).map((c) => ({ name: c.name, count: c.total }));

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Analyst Trends" />

            <div className="mb-6 flex items-center justify-between">
                <Heading title="Trends" description="12-month observation trends — click a month to drill down" />
                {!isAllMonths && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 rounded-lg border border-sidebar-border/70 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                    >
                        <RotateCcw className="size-3.5" />
                        All Months
                    </button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Observations (Last 12 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-sidebar-border/30" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#6366f1"
                                strokeWidth={2}
                                dot={(dotProps: Record<string, unknown>) => {
                                    const props = dotProps as { cx?: number; cy?: number; payload?: { month?: string } };
                                    return (
                                        <CustomDot {...props} onClick={handleMonthClick} selectedMonth={selectedMonth} />
                                    );
                                }}
                                activeDot={{ r: 7 }}
                                onClick={(data: unknown) => {
                                    const row = data as { month?: string };
                                    if (row?.month) handleMonthClick(row.month);
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <p className="mt-2 text-xs text-muted-foreground">Click a data point to explore that month, or click again to return to all months</p>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{activeLabel}</CardTitle>
                        <TrendingUp className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthInfo?.total ?? 0}</div>
                        <p className="text-xs text-muted-foreground">total observations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Closed</CardTitle>
                        <EyeOff className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthInfo?.closed ?? 0}</div>
                        <p className="text-xs text-muted-foreground">{monthInfo?.closed_pct ?? 0}% closure rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sites Active</CardTitle>
                        <MapPin className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sites.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Observers Active</CardTitle>
                        <Medal className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{observers.length}</div>
                    </CardContent>
                </Card>
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
                                <Bar dataKey="Closed" name="Closed" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="Open" name="Open" fill="#e0e7ff" stackId="a" radius={[0, 0, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Top 5 Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={catChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-sidebar-border/30" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
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
                        <SemiCircleGauge value={monthInfo?.closed_pct ?? 0} color="#6366f1" label="closure rate" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Observer Activity — Ranked</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {observers.map((obs, i) => (
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
                            {observers.length === 0 && (
                                <p className="text-sm text-muted-foreground">No observers active this month</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Trends.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Trends', href: '/analyst/trends' },
    ],
};
