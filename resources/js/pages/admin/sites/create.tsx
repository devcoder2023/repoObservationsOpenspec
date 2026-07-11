import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateSite({ projects }: { projects: { id: number; name: string }[] }) {
    const { data, setData, post, processing, errors } = useForm({ name: '', project_id: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/sites');
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Create Site" />

            <div className="mb-6">
                <Link href="/admin/sites" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to Sites
                </Link>
                <Heading title="Create Site" description="Add a new site" />
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
                    <Button type="submit" disabled={processing}>Create Site</Button>
                    <Link href="/admin/sites">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

CreateSite.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin' },
        { title: 'Sites', href: '/admin/sites' },
        { title: 'Create', href: '/admin/sites/create' },
    ],
};
