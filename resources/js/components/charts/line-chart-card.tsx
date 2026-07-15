import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LineChartCard({ title, data, dataKey = 'count', xKey = 'date', color = '#6366f1' }: { title: string; data: { date: string; count: number }[]; dataKey?: string; xKey?: string; color?: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-sidebar-border/30" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <Tooltip />
                        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
