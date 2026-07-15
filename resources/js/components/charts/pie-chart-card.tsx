import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#6366f1'];

export function PieChartCard({ title, data, dataKey = 'count', nameKey = 'name' }: { title: string; data: { name: string; count: number; pct?: number }[]; dataKey?: string; nameKey?: string }) {
    const renderLabel = (props: PieLabelRenderProps) => {
        const { name, payload } = props;
        const pct = (payload as Record<string, unknown>)?.pct;
        return `${name} ${pct ?? ''}%`;
    };

    const formatter = (value: unknown) => [`${value}`, 'Count'];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} label={renderLabel}>
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={formatter} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
