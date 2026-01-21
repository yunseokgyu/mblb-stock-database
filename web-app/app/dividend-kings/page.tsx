"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DividendBacktest from '@/components/DividendBacktest'
import { Separator } from "@/components/ui/separator"

export default function DividendKingsPage() {
    const [stocks, setStocks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchDividendKings() {
            const { data, error } = await supabase
                .from('dividend_kings')
                .select('*')
                .order('years_of_growth', { ascending: false })

            if (data) {
                setStocks(data)
            }
            setLoading(false)
        }

        fetchDividendKings()
    }, [])

    if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Dividend Data...</div>

    return (
        <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="container mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            💰 배당킹 (Dividend Kings)
                        </h1>
                        <p className="text-muted-foreground">50년 이상 연속으로 배당금을 인상한 기업들입니다.</p>
                    </div>
                </div>

                {/* Backtest Calculator */}
                <DividendBacktest availableStocks={stocks} />

                <Separator className="my-8 bg-slate-800" />

                <Card>
                    <CardHeader>
                        <CardTitle>Top Dividend Growth Stocks</CardTitle>
                        <CardDescription>높은 배당 성장 연수와 안정적인 수익률을 제공합니다.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Sector</TableHead>
                                    <TableHead className="text-right">Dividend Yield</TableHead>
                                    <TableHead className="text-right">Years of Growth</TableHead>
                                    <TableHead className="text-right">Payout Ratio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stocks.map((stock) => (
                                    <TableRow key={stock.symbol} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/stock/${stock.symbol}`)}>
                                        <TableCell className="font-bold">{stock.symbol}</TableCell>
                                        <TableCell>{stock.company_name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{stock.sector}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-500">
                                            {stock.dividend_yield.toFixed(2)}%
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <TrendingUp className="h-4 w-4 text-blue-500" />
                                                {stock.years_of_growth} Years
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{stock.payout_ratio}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
