import { Head } from '@inertiajs/react';
import { BarChart3, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Heading from '@/components/heading';

type PeriodStats = {
    total: number;
    open: number;
    closed: number;
    risk_distribution: Record<number, number>;
};

export default function ObservationDashboard({ stats }: { stats: Record<string, PeriodStats> }) {
    const periods = [
        { key: 'today', label: 'Today' },
        { key: 'week', label: 'This Week' },
        { key: 'month', label: 'This Month' },
        { key: 'previous_month', label: 'Previous Month' },
    ];

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Observations Dashboard" />

            <div className="mb-6">
                <Heading title="Observations Dashboard" description="Analysis and statistics of safety observations" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {periods.map(({ key, label }) => {
                    const period = stats[key];
                    return (
                        <div key={key} className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="mb-3 text-sm font-medium text-muted-foreground">{label}</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-sm">
                                        <BarChart3 className="size-4" /> Total
                                    </span>
                                    <span className="text-lg font-bold">{period.total}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-sm">
                                        <Eye className="size-4 text-green-600" /> Open
                                    </span>
                                    <span className="text-lg font-bold text-green-600">{period.open}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-sm">
                                        <EyeOff className="size-4 text-gray-500" /> Closed
                                    </span>
                                    <span className="text-lg font-bold text-gray-500">{period.closed}</span>
                                </div>
                                <div className="pt-2 border-t border-sidebar-border/50">
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                        <AlertTriangle className="size-3" /> Risk Distribution
                                    </span>
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-yellow-600">Low</span>
                                            <span>{period.risk_distribution[1] ?? 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-orange-600">Medium</span>
                                            <span>{period.risk_distribution[2] ?? 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-red-600">High</span>
                                            <span>{period.risk_distribution[3] ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

ObservationDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Observations Dashboard', href: '/observations/dashboard' },
    ],
};
