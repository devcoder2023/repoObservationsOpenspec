import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type User = {
    id: number;
    name: string;
    email: string;
    status: number;
    created_at: string;
    roles: { id: number; name: string }[];
};

type PaginatedUsers = {
    data: User[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};

const statusLabels: Record<number, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    1: { label: 'Active', variant: 'default' },
    2: { label: 'Inactive', variant: 'secondary' },
    3: { label: 'Suspended', variant: 'destructive' },
};

export default function UserIndex({ users }: { users: PaginatedUsers }) {
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Users" />

            <div className="mb-6 flex items-center justify-between">
                <Heading title="Users" description="Manage user accounts" />
                <Link href="/admin/users/create">
                    <Button>
                        <Plus className="size-4" />
                        Create User
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <Input
                    name="search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Button type="submit" variant="outline">
                    <Search className="size-4" />
                    Search
                </Button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-sidebar-border/70 text-left dark:border-sidebar-border">
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Registered</th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <tr key={user.id} className="border-b border-sidebar-border/70 last:border-0 dark:border-sidebar-border">
                                <td className="px-4 py-3">{user.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                <td className="px-4 py-3">
                                    {user.roles.map((role) => (
                                        <Badge key={role.id} variant="secondary" className="mr-1">
                                            {role.name}
                                        </Badge>
                                    ))}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={statusLabels[user.status]?.variant ?? 'secondary'}>
                                        {statusLabels[user.status]?.label ?? 'Unknown'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <Link href={`/admin/users/${user.id}/edit`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit className="size-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {users.last_page > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {users.links.map((link, i) => (
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

UserIndex.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Users', href: '/admin/users' },
    ],
};
