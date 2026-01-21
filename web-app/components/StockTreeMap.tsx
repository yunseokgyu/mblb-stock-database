"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { useRouter } from 'next/navigation'

// Customized Content for Treemap Node
const CustomizedContent = (props: any) => {
    const { depth, x, y, width, height, index, payload, colors, rank, name } = props;

    // Safety check
    if (!payload || typeof payload.priceChange === 'undefined') {
        // It might be a category node or root
        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill: '#334155', // Slate-700 for groups
                        stroke: '#fff',
                        strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                    }}
                />
                {
                    width > 50 && height > 50 && name ? (
                        <text
                            x={x + width / 2}
                            y={y + height / 2}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize={14}
                            fontWeight="bold"
                        >
                            {name}
                        </text>
                    ) : null
                }
            </g>
        )
    }

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: payload.priceChange >= 0 ? '#22c55e' : '#ef4444', // Green or Red
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                    cursor: 'pointer'
                }}
            />
            {
                width > 50 && height > 50 ? (
                    <text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={14}
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }} // Ensure text doesn't block click
                    >
                        {name}
                    </text>
                ) : null
            }
            {
                width > 50 && height > 50 ? (
                    <text
                        x={x + width / 2}
                        y={y + height / 2 + 18}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                        style={{ pointerEvents: 'none' }}
                    >
                        {payload.priceChange.toFixed(2)}%
                    </text>
                ) : null
            }
        </g>
    );
};

export default function StockTreeMap() {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const handleNodeClick = (node: any) => {
        if (node && node.name && (!node.children || node.children.length === 0)) {
            // It's a stock
            router.push(`/stock/${node.name}`)
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/stock_data.json');
                const stocks = await res.json();

                if (!stocks) {
                    setLoading(false)
                    return
                }

                // Group by Sector for Treemap hierarchy
                const sectorMap: any = {}

                stocks.forEach((stock: any) => {
                    const sector = stock.sector || 'Unknown';
                    if (!sectorMap[sector]) {
                        sectorMap[sector] = { name: sector, children: [] }
                    }
                    sectorMap[sector].children.push({
                        name: stock.symbol,
                        size: stock.market_cap || 1000000,
                        priceChange: stock.changes_percentage || 0
                    })
                })

                const treeData = Object.values(sectorMap)
                setData(treeData)
            } catch (e) {
                console.error("Failed to fetch stock data", e);
            }
            setLoading(false)
        }

        fetchData()
    }, [])

    if (loading) return <div className="p-10 text-center">Loading Map...</div>

    return (
        <Card className="w-full h-[600px]">
            <CardHeader>
                <CardTitle>S&P 500 Market Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={data}
                        dataKey="size"
                        stroke="#fff"
                        fill="#8884d8"
                        content={<CustomizedContent />}
                        onClick={handleNodeClick}
                    >
                        <Tooltip />
                    </Treemap>
                </ResponsiveContainer>
            </CardContent>
        </Card >
    )
}
