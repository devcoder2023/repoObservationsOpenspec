import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SelectItem = { id: number; name: string };
type Observation = {
    id: number;
    image_before: string;
    image_after: string | null;
    comment_before: string | null;
    comment_after: string | null;
    project_id: number;
    site_id: number | null;
    custom_site: string | null;
    shift: number;
    observation_category_id: number | null;
    risk_degree: number;
    status: number;
};

export default function EditObservation({
    observation,
    projects,
    sites,
    categories,
}: {
    observation: Observation;
    projects: SelectItem[];
    sites: (SelectItem & { project_id: number })[];
    categories: SelectItem[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        image_before: null as File | null,
        comment_before: observation.comment_before || '',
        image_after: null as File | null,
        comment_after: observation.comment_after || '',
        project_id: String(observation.project_id),
        site_id: String(observation.site_id || ''),
        custom_site: observation.custom_site || '',
        shift: String(observation.shift),
        observation_category_id: String(observation.observation_category_id || ''),
        risk_degree: String(observation.risk_degree),
    });

    const [beforePreview, setBeforePreview] = useState<string | null>(null);
    const [afterPreview, setAfterPreview] = useState<string | null>(null);

    const handleImageBefore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image_before', file);
        if (file) {
            setBeforePreview(URL.createObjectURL(file));
        }
    };

    const handleImageAfter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image_after', file);
        if (file) {
            setAfterPreview(URL.createObjectURL(file));
        }
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const projectId = e.target.value;
        setData('project_id', projectId);
        setData('site_id', '');
    };

    const filteredSites = data.project_id
        ? sites.filter((s) => s.project_id === Number(data.project_id))
        : sites;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/observations/${observation.id}`);
    };

    const imageUrl = (path: string | null) => path ? `/storage/${path}` : null;

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Edit Observation" />

            <div className="mb-6">
                <Link href="/observations" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to Observations
                </Link>
                <Heading title="Edit Observation" description="Update safety observation details" />
            </div>

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="image_before">Image Before</Label>
                    <Input id="image_before" type="file" accept="image/*" onChange={handleImageBefore} />
                    <InputError message={errors.image_before} />
                    {beforePreview ? (
                        <img src={beforePreview} alt="Preview" className="mt-2 max-h-48 rounded object-contain" />
                    ) : imageUrl(observation.image_before) && (
                        <img src={imageUrl(observation.image_before)!} alt="Current" className="mt-2 max-h-48 rounded object-contain" />
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="comment_before">Comment Before</Label>
                    <textarea
                        id="comment_before"
                        className="rounded border border-input bg-background px-3 py-2 text-sm"
                        rows={3}
                        value={data.comment_before}
                        onChange={(e) => setData('comment_before', e.target.value)}
                    />
                    <InputError message={errors.comment_before} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="image_after">Image After</Label>
                    <Input id="image_after" type="file" accept="image/*" onChange={handleImageAfter} />
                    <InputError message={errors.image_after} />
                    <p className="text-xs text-muted-foreground">Uploading an after image will close this observation.</p>
                    {afterPreview ? (
                        <img src={afterPreview} alt="Preview" className="mt-2 max-h-48 rounded object-contain" />
                    ) : imageUrl(observation.image_after) && (
                        <img src={imageUrl(observation.image_after)!} alt="Current" className="mt-2 max-h-48 rounded object-contain" />
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="comment_after">Comment After</Label>
                    <textarea
                        id="comment_after"
                        className="rounded border border-input bg-background px-3 py-2 text-sm"
                        rows={3}
                        value={data.comment_after}
                        onChange={(e) => setData('comment_after', e.target.value)}
                    />
                    <InputError message={errors.comment_after} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="project_id">Project *</Label>
                    <select
                        id="project_id"
                        className="rounded border border-input bg-background px-3 py-2 text-sm"
                        value={data.project_id}
                        onChange={handleProjectChange}
                        required
                    >
                        <option value="">Select a project</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <InputError message={errors.project_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="site_id">Site</Label>
                    <select
                        id="site_id"
                        className="rounded border border-input bg-background px-3 py-2 text-sm"
                        value={data.site_id}
                        onChange={(e) => setData('site_id', e.target.value)}
                    >
                        <option value="">Select a site</option>
                        {filteredSites.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <InputError message={errors.site_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="custom_site">Custom Site</Label>
                    <Input
                        id="custom_site"
                        value={data.custom_site}
                        onChange={(e) => setData('custom_site', e.target.value)}
                    />
                    <InputError message={errors.custom_site} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="shift">Shift *</Label>
                    <select
                        id="shift"
                        className="rounded border border-input bg-background px-3 py-2 text-sm"
                        value={data.shift}
                        onChange={(e) => setData('shift', e.target.value)}
                        required
                    >
                        <option value="">Select shift</option>
                        <option value="1">Morning</option>
                        <option value="2">Evening</option>
                        <option value="3">Night</option>
                    </select>
                    <InputError message={errors.shift} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="observation_category_id">Category *</Label>
                    <select
                        id="observation_category_id"
                        className="rounded border border-input bg-background px-3 py-2 text-sm"
                        value={data.observation_category_id}
                        onChange={(e) => setData('observation_category_id', e.target.value)}
                        required
                    >
                        <option value="">Select category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <InputError message={errors.observation_category_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="risk_degree">Risk Degree *</Label>
                    <select
                        id="risk_degree"
                        className="rounded border border-input bg-background px-3 py-2 text-sm"
                        value={data.risk_degree}
                        onChange={(e) => setData('risk_degree', e.target.value)}
                        required
                    >
                        <option value="">Select risk degree</option>
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select>
                    <InputError message={errors.risk_degree} />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>Update Observation</Button>
                    <Link href="/observations">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

EditObservation.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Observations', href: '/observations' },
        { title: 'Edit', href: '/observations/{id}/edit' },
    ],
};
