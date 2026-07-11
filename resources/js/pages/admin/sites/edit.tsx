import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditSite({ site, projects }: { site: { id: number; name: string; project: { id: number; name: string } | null }; projects: { id: number; name: string }[] }) {
    const { data, setData, patch, processing, errors } = useForm({ name: site.name, project_id: String(site.project?.id ?? '') });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/sites/${site.id}`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this site?')) {
            router.delete(`/admin/sites/${site.id}`);
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Edit Site" />

            <div className="mb-6">
                <Link href="/admin/sites" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to Sites
                </Link>
                <Heading title="Edit Site" description={`Editing ${site.name}`} />
            </div>

            <form onSubmit={submit} className="max-w-lg space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="project_id">Project</Label>
                    <Select value={data.project_id} onValueChange={(value) => setData('project_id', value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map((project) => (
                                <SelectItem key={project.id} value={String(project.id)}>{project.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.project_id} />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>Update Site</Button>
                    <Button type="button" variant="destructive" onClick={handleDelete}>Delete Site</Button>
                    <Link href="/admin/sites">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

EditSite.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Sites', href: '/admin/sites' },
        { title: 'Edit', href: '/admin/sites/0/edit' },
    ],
};
