import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Auth } from '@/types';

type Observation = {
    id: number;
    image_before: string;
    image_after: string | null;
    comment_before: string | null;
    comment_after: string | null;
    project: { id: number; name: string } | null;
    site: { id: number; name: string } | null;
    custom_site: string | null;
    shift: number;
    category: { id: number; name: string } | null;
    risk_degree: number;
    status: number;
    creator: { id: number; name: string } | null;
    created_at: string;
};

type PaginatedObservations = {
    data: Observation[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

type FilterItem = { id: number; name: string };

export default function ObservationIndex({
    observations,
    filters,
    projects,
    sites,
    categories,
}: {
    observations: PaginatedObservations;
    filters: Record<string, string | undefined>;
    projects: FilterItem[];
    sites: FilterItem[];
    categories: FilterItem[];
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const canCreate = auth.permissions.includes('observations.create');
    const canUpdate = auth.permissions.includes('observations.update');
    const canDelete = auth.permissions.includes('observations.delete');
    const [localFilters, setLocalFilters] = useState(filters);

    const applyFilters = () => {
        router.get('/observations', localFilters, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this observation?')) {
            router.delete(`/observations/${id}`);
        }
    };

    const isWithinTwoDays = (createdAt: string) => {
        const created = new Date(createdAt).getTime();
        const now = Date.now();
        return now - created < 48 * 60 * 60 * 1000;
    };

    const imageUrl = (path: string | null) => path ? `/storage/${path}` : null;

    const shiftLabel: Record<number, string> = { 1: 'Morning', 2: 'Evening', 3: 'Night' };
    const riskLabel: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High' };
    const statusLabel: Record<number, string> = { 1: 'Open', 2: 'Close' };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Observations" />

            <div className="mb-6 flex items-center justify-between">
                <Heading title="Observations" description="Review and manage safety observations" />
                {canCreate && (
                    <Link href="/observations/create">
                        <Button>
                            <Plus className="size-4" />
                            Create Observation
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <select
                    className="rounded border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm"
                    value={localFilters.project_id || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, project_id: e.target.value })}
                >
                    <option value="">All Projects</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <select
                    className="rounded border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm"
                    value={localFilters.site_id || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, site_id: e.target.value })}
                >
                    <option value="">All Sites</option>
                    {sites.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                <select
                    className="rounded border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm"
                    value={localFilters.observation_category_id || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, observation_category_id: e.target.value })}
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <select
                    className="rounded border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm"
                    value={localFilters.shift || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, shift: e.target.value })}
                >
                    <option value="">All Shifts</option>
                    <option value="1">Morning</option>
                    <option value="2">Evening</option>
                    <option value="3">Night</option>
                </select>
                <select
                    className="rounded border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm"
                    value={localFilters.risk_degree || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, risk_degree: e.target.value })}
                >
                    <option value="">All Risk Levels</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                </select>
                <select
                    className="rounded border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm"
                    value={localFilters.status || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                >
                    <option value="">All Status</option>
                    <option value="1">Open</option>
                    <option value="2">Close</option>
                </select>
                <input
                    type="date"
                    className="rounded border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm"
                    value={localFilters.date_from || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, date_from: e.target.value })}
                    placeholder="From"
                />
                <input
                    type="date"
                    className="rounded border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm"
                    value={localFilters.date_to || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, date_to: e.target.value })}
                    placeholder="To"
                />
                <Button size="sm" onClick={applyFilters}>Filter</Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-sidebar-border/70 text-left dark:border-sidebar-border">
                            <th className="px-4 py-3 font-medium">Image</th>
                            <th className="px-4 py-3 font-medium">Project</th>
                            <th className="px-4 py-3 font-medium">Site</th>
                            <th className="px-4 py-3 font-medium">Shift</th>
                            <th className="px-4 py-3 font-medium">Category</th>
                            <th className="px-4 py-3 font-medium">Risk</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Creator</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {observations.data.map((obs) => (
                            <tr key={obs.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                <td className="px-4 py-3">
                                    {imageUrl(obs.image_before) && (
                                        <img
                                            src={imageUrl(obs.image_before)!}
                                            alt="Before"
                                            className="size-10 rounded object-cover"
                                        />
                                    )}
                                </td>
                                <td className="px-4 py-3">{obs.project?.name ?? '-'}</td>
                                <td className="px-4 py-3">{obs.site?.name ?? obs.custom_site ?? '-'}</td>
                                <td className="px-4 py-3">{shiftLabel[obs.shift] ?? '-'}</td>
                                <td className="px-4 py-3">{obs.category?.name ?? '-'}</td>
                                <td className="px-4 py-3">
                                    <Badge variant={obs.risk_degree === 3 ? 'destructive' : obs.risk_degree === 2 ? 'secondary' : 'default'}>
                                        {riskLabel[obs.risk_degree] ?? '-'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={obs.status === 1 ? 'outline' : 'default'}>
                                        {statusLabel[obs.status] ?? '-'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3">{obs.creator?.name ?? '-'}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(obs.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <Link href={`/observations/${obs.id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="size-4" />
                                            </Button>
                                        </Link>
                                        {canUpdate && isWithinTwoDays(obs.created_at) && (
                                            <Link href={`/observations/${obs.id}/edit`}>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="size-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {canDelete && isWithinTwoDays(obs.created_at) && (
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(obs.id)}>
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {observations.data.length === 0 && (
                            <tr>
                                <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                                    No observations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {observations.last_page > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {observations.links.map((link, i) => (
                        <Button
                            key={i}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

ObservationIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Observations', href: '/observations' },
    ],
};
