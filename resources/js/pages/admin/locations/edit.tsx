import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditLocation({ location }: { location: { id: number; name: string } }) {
    const { data, setData, patch, processing, errors } = useForm({ name: location.name });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/locations/${location.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this location?')) {
            router.delete(`/admin/locations/${location.id}`);
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Edit Location" />

            <div className="mb-6">
                <Link href="/admin/locations" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to Locations
                </Link>
                <Heading title="Edit Location" description={`Editing ${location.name}`} />
            </div>

            <form onSubmit={submit} className="max-w-lg space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    <InputError message={errors.name} />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>Update Location</Button>
                    <Button type="button" variant="destructive" onClick={handleDelete}>Delete Location</Button>
                    <Link href="/admin/locations">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

EditLocation.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Locations', href: '/admin/locations' },
        { title: 'Edit', href: '/admin/locations/0/edit' },
    ],
};
