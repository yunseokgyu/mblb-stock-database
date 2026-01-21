"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DividendGrowthChartProps {
    data: { year: number, dividend: number }[]
}

export function DividendGrowthChart({ data }: DividendGrowthChartProps) {
    return (
        <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#64748B' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#64748B' }}
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`}
                    />
                    <Tooltip
                        cursor={{ fill: '#F1F5F9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`₩${Number(value).toLocaleString()}`, 'Dividend']}
                    />
                    <Bar
                        dataKey="dividend"
                        fill="#22C55E"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                    />
                </BarChart>
            </ResponsiveContainer>
            <div className="text-center text-xs text-slate-400 mt-2">
                Projected Annual Dividend Income (배당 소득)
            </div>
        </div>
    )
}
