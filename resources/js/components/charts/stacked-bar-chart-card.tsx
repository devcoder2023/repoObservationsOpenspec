import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StackedBarChartCard({ title, data, xKey = 'name', bars }: {
    title: string;
    data: Record<string, unknown>[];
    xKey?: string;
    bars: { key: string; name: string; color: string }[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-sidebar-border/30" />
                        <XAxis type="number" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <YAxis type="category" dataKey={xKey} tick={{ fontSize: 12 }} className="text-muted-foreground" width={120} />
                        <Tooltip />
                        <Legend />
                        {bars.map((bar) => (
                            <Bar key={bar.key} dataKey={bar.key} name={bar.name} fill={bar.color} stackId="a" radius={[0, 0, 0, 0]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
