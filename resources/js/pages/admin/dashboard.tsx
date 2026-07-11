import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, Users, FolderKanban, MapPin, Tags } from 'lucide-react';
import Heading from '@/components/heading';

type StatCard = {
    label: string;
    count: number;
    href: string;
    icon: typeof LayoutGrid;
};

export default function AdminDashboard({ stats }: { stats: { users: number; projects: number; sites: number; categories: number } }) {
    const cards: StatCard[] = [
        { label: 'Users', count: stats.users, href: '/admin/users', icon: Users },
        { label: 'Projects', count: stats.projects, href: '/admin/projects', icon: FolderKanban },
        { label: 'Sites', count: stats.sites, href: '/admin/sites', icon: MapPin },
        { label: 'Categories', count: stats.categories, href: '/admin/categories', icon: Tags },
    ];

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Admin Dashboard" />

            <Heading title="Admin Dashboard" description="Manage users, projects, sites, and categories" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-6 transition-colors hover:bg-accent/50 dark:border-sidebar-border"
                    >
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                            <card.icon className="size-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{card.count}</p>
                            <p className="text-sm text-muted-foreground">{card.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin',
        },
    ],
};
