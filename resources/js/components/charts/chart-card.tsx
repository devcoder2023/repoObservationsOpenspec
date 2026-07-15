import type { ReactNode } from 'react';

export function ChartCard({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border ${className}`}>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">{title}</h3>
            {children}
        </div>
    );
}
