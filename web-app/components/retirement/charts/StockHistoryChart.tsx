"use client"

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StockHistoryChartProps {
    data: { year: number, price: number }[];
    color?: string;
}

export function StockHistoryChart({ data, color = "#0F172A" }: StockHistoryChartProps) {
    return (
        <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id={`grad${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        contentStyle={{ borderRadius: '4px', border: 'none', fontSize: '12px' }}
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        fillOpacity={1}
                        fill={`url(#grad${color})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
