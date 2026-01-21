"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Sector } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
                {payload.asset}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#8884d8" fontSize={12}>{`Weight ${value}%`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={12}>
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

import { use } from 'react'

export default function ETFDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params)
    const [etfData, setEtfData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchEtfData() {
            const { data, error } = await supabase
                .from('etf_holdings')
                .select('*')
                .eq('symbol', symbol)
                .single()

            if (data) {
                setEtfData(data)
            }
            setLoading(false)
        }

        fetchEtfData()
    }, [symbol])

    if (loading) return <div className="p-10 text-center text-muted-foreground">Loading ETF Data...</div>
    if (!etfData) return <div className="p-10 text-center text-muted-foreground">ETF Not Found</div>

    const holdings = etfData.holdings || []
    const chartData = holdings.map((h: any) => ({ name: h.asset, value: h.weightPercentage, ...h }))

    return (
        <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="container mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{symbol} 분석</h1>
                        <p className="text-muted-foreground">ETF 구성 종목 및 비중 상세</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart Section */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>자산 배분 (Asset Allocation)</CardTitle>
                            <CardDescription>상위 구성 종목의 비중입니다.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"

                                        label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                                    >
                                        {chartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: any) => `${Number(value).toFixed(2)}%`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Holdings Table Section */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>보유 종목 리스트 (Holdings)</CardTitle>
                            <CardDescription>구성 종목 상세 정보</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>티커 (Symbol)</TableHead>
                                        <TableHead className="text-right">주식 수 (Shares)</TableHead>
                                        <TableHead className="text-right">비중 (Weight)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holdings.map((h: any, i: number) => (
                                        <TableRow key={i} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/stock/${h.asset}`)}>
                                            <TableCell className="font-bold flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                                {h.asset}
                                            </TableCell>
                                            <TableCell className="text-right">{h.shares.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {h.weightPercentage.toFixed(2)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
