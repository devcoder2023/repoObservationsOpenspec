import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Location = {
    id: number;
    name: string;
    created_at: string;
    deleted_at: string | null;
};

type PaginatedLocations = {
    data: Location[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

export default function LocationIndex({ locations }: { locations: PaginatedLocations }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this location?')) {
            router.delete(`/admin/locations/${id}`);
        }
    };

    const handleRestore = (id: number) => {
        router.patch(`/admin/locations/${id}/restore`);
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Locations" />

            <div className="mb-6 flex items-center justify-between">
                <Heading title="Locations" description="Manage location list" />
                <Link href="/admin/locations/create">
                    <Button>
                        <Plus className="size-4" />
                        Create Location
                    </Button>
                </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-sidebar-border/70 text-left dark:border-sidebar-border">
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Created</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.data.map((location) => (
                            <tr key={location.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                <td className="px-4 py-3">{location.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(location.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    {location.deleted_at ? (
                                        <Badge variant="secondary">Deleted</Badge>
                                    ) : (
                                        <Badge variant="default">Active</Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {location.deleted_at ? (
                                            <Button variant="ghost" size="sm" onClick={() => handleRestore(location.id)}>
                                                <RotateCcw className="size-4" />
                                            </Button>
                                        ) : (
                                            <>
                                                <Link href={`/admin/locations/${location.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(location.id)}>
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {locations.data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                    No locations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {locations.last_page > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {locations.links.map((link, i) => (
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

LocationIndex.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Locations', href: '/admin/locations' },
    ],
};
