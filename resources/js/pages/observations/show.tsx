import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    updated_at: string;
};

export default function ShowObservation({ observation }: { observation: Observation }) {
    const imageUrl = (path: string | null) => path ? `/storage/${path}` : null;
    const shiftLabel: Record<number, string> = { 1: 'Morning', 2: 'Evening', 3: 'Night' };
    const riskLabel: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High' };
    const statusLabel: Record<number, string> = { 1: 'Open', 2: 'Close' };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title={`Observation #${observation.id}`} />

            <div className="mb-6">
                <Link href="/observations" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-4" />
                    Back to Observations
                </Link>
                <Heading title={`Observation #${observation.id}`} description="Full observation details" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h3 className="mb-3 text-sm font-medium">Before Image</h3>
                    {imageUrl(observation.image_before) ? (
                        <a href={imageUrl(observation.image_before)!} target="_blank" rel="noopener noreferrer">
                            <img
                                src={imageUrl(observation.image_before)!}
                                alt="Before"
                                className="w-full rounded object-contain max-h-96"
                            />
                        </a>
                    ) : (
                        <p className="text-sm text-muted-foreground">No image</p>
                    )}
                    {observation.comment_before && (
                        <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-1">Comment:</p>
                            <p className="text-sm">{observation.comment_before}</p>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h3 className="mb-3 text-sm font-medium">After Image</h3>
                    {imageUrl(observation.image_after) ? (
                        <a href={imageUrl(observation.image_after)!} target="_blank" rel="noopener noreferrer">
                            <img
                                src={imageUrl(observation.image_after)!}
                                alt="After"
                                className="w-full rounded object-contain max-h-96"
                            />
                        </a>
                    ) : (
                        <p className="text-sm text-muted-foreground">No after image yet</p>
                    )}
                    {observation.comment_after && (
                        <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-1">Comment:</p>
                            <p className="text-sm">{observation.comment_after}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                <h3 className="mb-3 text-sm font-medium">Details</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-muted-foreground">Project</dt>
                        <dd>{observation.project?.name ?? '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Site</dt>
                        <dd>{observation.site?.name ?? observation.custom_site ?? '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Shift</dt>
                        <dd>{shiftLabel[observation.shift] ?? '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Category</dt>
                        <dd>{observation.category?.name ?? '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Risk Degree</dt>
                        <dd>
                            <Badge variant={observation.risk_degree === 3 ? 'destructive' : observation.risk_degree === 2 ? 'secondary' : 'default'}>
                                {riskLabel[observation.risk_degree] ?? '-'}
                            </Badge>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Status</dt>
                        <dd>
                            <Badge variant={observation.status === 1 ? 'outline' : 'default'}>
                                {statusLabel[observation.status] ?? '-'}
                            </Badge>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Created by</dt>
                        <dd>{observation.creator?.name ?? '-'}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Created at</dt>
                        <dd>{new Date(observation.created_at).toLocaleString()}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

ShowObservation.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Observations', href: '/observations' },
        { title: 'Detail', href: '/observations/{id}' },
    ],
};
