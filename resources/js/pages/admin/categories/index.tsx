import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Category = {
    id: number;
    name: string;
    created_at: string;
    deleted_at: string | null;
};

type PaginatedCategories = {
    data: Category[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

export default function CategoryIndex({ categories }: { categories: PaginatedCategories }) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    const handleRestore = (id: number) => {
        router.patch(`/admin/categories/${id}/restore`);
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Categories" />

            <div className="mb-6 flex items-center justify-between">
                <Heading title="Categories" description="Manage observation categories" />
                <Link href="/admin/categories/create">
                    <Button>
                        <Plus className="size-4" />
                        Create Category
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
                        {categories.data.map((category) => (
                            <tr key={category.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                <td className="px-4 py-3">{category.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(category.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    {category.deleted_at ? (
                                        <Badge variant="secondary">Deleted</Badge>
                                    ) : (
                                        <Badge variant="default">Active</Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {category.deleted_at ? (
                                            <Button variant="ghost" size="sm" onClick={() => handleRestore(category.id)}>
                                                <RotateCcw className="size-4" />
                                            </Button>
                                        ) : (
                                            <>
                                                <Link href={`/admin/categories/${category.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                    No categories found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {categories.last_page > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {categories.links.map((link, i) => (
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

CategoryIndex.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Categories', href: '/admin/categories' },
    ],
};
