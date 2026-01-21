"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PortfolioGrowthChartProps {
    data: { year: number, balance: number, invested: number }[]
}

export function PortfolioGrowthChart({ data }: PortfolioGrowthChartProps) {
    return (
        <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
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
                        tickFormatter={(value) => `${(value / 100000000).toFixed(0)}억`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`₩${Number(value).toLocaleString()}`, 'Balance']}
                    />
                    <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#0F172A"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#0F172A', strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="invested"
                        stroke="#94A3B8"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-900 rounded-full"></div> Note Proj. (복리)
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div> Principal (원금)
                </div>
            </div>
        </div>
    )
}
