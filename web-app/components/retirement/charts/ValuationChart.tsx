"use client"

import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ValuationChartProps {
    currentPrice: number;
    dcf: number;
    pe: number;
    evebitda: number;
}

export function ValuationChart({ currentPrice, dcf, pe, evebitda }: ValuationChartProps) {
    const data = [
        { name: '주가 (Price)', value: currentPrice, type: 'Current' },
        { name: '현금흐름 (DCF)', value: dcf, type: 'Fair Value' },
        { name: 'PER (P/E)', value: pe, type: 'Fair Value' },
        { name: 'EV/EBITDA', value: evebitda, type: 'Fair Value' },
    ];

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        interval={0}
                        tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                        width={110}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }}
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Value']}
                    />
                    <Bar dataKey="value" barSize={18} radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.type === 'Current' ? '#0F172A' : '#94A3B8'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
