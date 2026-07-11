import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Site = {
    id: number;
    name: string;
    project: { id: number; name: string } | null;
    created_at: string;
    deleted_at: string | null;
};

type PaginatedSites = {
    data: Site[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

export default function SiteIndex({ sites }: { sites: PaginatedSites }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this site?')) {
            router.delete(`/admin/sites/${id}`);
        }
    };

    const handleRestore = (id: number) => {
        router.patch(`/admin/sites/${id}/restore`);
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Sites" />

            <div className="mb-6 flex items-center justify-between">
                <Heading title="Sites" description="Manage site list" />
                <Link href="/admin/sites/create">
                    <Button>
                        <Plus className="size-4" />
                        Create Site
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-sidebar-border/70 text-left dark:border-sidebar-border">
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Project</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sites.data.map((site) => (
                            <tr key={site.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                <td className="px-4 py-3">{site.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {site.project?.name ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(site.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    {site.deleted_at ? (
                                        <Badge variant="secondary">Deleted</Badge>
                                    ) : (
                                        <Badge variant="default">Active</Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {site.deleted_at ? (
                                            <Button variant="ghost" size="sm" onClick={() => handleRestore(site.id)}>
                                                <RotateCcw className="size-4" />
                                            </Button>
                                        ) : (
                                            <>
                                                <Link href={`/admin/sites/${site.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(site.id)}>
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {sites.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                    No sites found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {sites.last_page > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {sites.links.map((link, i) => (
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

SiteIndex.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Sites', href: '/admin/sites' },
    ],
};
