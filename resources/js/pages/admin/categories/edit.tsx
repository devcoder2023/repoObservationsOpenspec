import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditCategory({ category }: { category: { id: number; name: string } }) {
    const { data, setData, patch, processing, errors } = useForm({ name: category.name });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/categories/${category.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Edit Category" />

            <div className="mb-6">
                <Link href="/admin/categories" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to Categories
                </Link>
                <Heading title="Edit Category" description={`Editing ${category.name}`} />
            </div>

            <form onSubmit={submit} className="max-w-lg space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    <InputError message={errors.name} />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>Update Category</Button>
                    <Button type="button" variant="destructive" onClick={handleDelete}>Delete Category</Button>
                    <Link href="/admin/categories">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

EditCategory.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Categories', href: '/admin/categories' },
        { title: 'Edit', href: '/admin/categories/0/edit' },
    ],
};
