import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function SemiCircleGauge({ value, max = 100, label, color = '#6366f1', bgColor = '#e0e7ff' }: {
    value: number;
    max?: number;
    label?: string;
    color?: string;
    bgColor?: string;
}) {
    const pct = Math.min(value, max);
    const remaining = max - pct;
    const data = [{ name: 'Value', value: pct }, { name: 'Remaining', value: remaining }];

    return (
        <div className="relative flex justify-center">
            <div className="relative">
                <ResponsiveContainer width={200} height={150}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={95}
                            dataKey="value"
                            cornerRadius={0}
                        >
                            <Cell fill={color} />
                            <Cell fill={bgColor} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-x-0 bottom-2 text-center">
                    <span className="text-2xl font-bold" style={{ color }}>{pct}%</span>
                    {label && <p className="text-xs text-muted-foreground">{label}</p>}
                </div>
            </div>
        </div>
    );
}
