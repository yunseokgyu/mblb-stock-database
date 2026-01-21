"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, Search } from "lucide-react"

interface Stock {
    symbol: string
    name: string
    price: number
    changes_percentage: number
    market_cap: number
    sector: string
    valuation_metrics?: {
        dcf: number
        method: string
        div_yield_ttm?: number
    }
}

export default function StockRankingTable({ fixedFilter }: { fixedFilter?: string }) {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/stock_data.json')
                const data = await res.json()
                if (data) {
                    const sorted = data.sort((a: Stock, b: Stock) => (b.market_cap || 0) - (a.market_cap || 0))
                    setStocks(sorted)
                    setFilteredStocks(sorted)
                }
            } catch (e) {
                console.error("Failed to load stocks", e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const lower = search.toLowerCase()
        let filtered = stocks.filter(s =>
            s.symbol.toLowerCase().includes(lower) ||
            s.name.toLowerCase().includes(lower)
        )

        const currentFilter = fixedFilter || "all"

        if (currentFilter === "dividend") {
            filtered = filtered.filter(s => (s.valuation_metrics?.div_yield_ttm || 0) > 0)
        } else if (currentFilter === "etf") {
            filtered = filtered.filter(s => s.sector === "ETF" || ["SPY", "QQQ", "VOO", "SCHD", "JEPI"].includes(s.symbol))
        }

        setFilteredStocks(filtered)
    }, [search, stocks, fixedFilter])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
    }

    const formatCompactNumber = (number: number) => {
        return new Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
        }).format(number)
    }

    if (loading) return <div className="text-center p-10">Loading Rankings...</div>

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Today's Market Prices</h2>

                <div className="flex items-center gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search stocks..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">24h %</TableHead>
                            <TableHead className="text-right">Market Cap</TableHead>
                            <TableHead className="text-right">Fair Value (Analyst)</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStocks.map((stock, index) => {
                            const isPositive = stock.changes_percentage >= 0
                            const upside = stock.valuation_metrics?.dcf
                                ? ((stock.valuation_metrics.dcf - stock.price) / stock.price) * 100
                                : 0

                            return (
                                <TableRow key={stock.symbol} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/stock/${stock.symbol}`)}>
                                    <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{stock.name}</span>
                                            <span className="text-xs text-muted-foreground">{stock.symbol}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(stock.price)}</TableCell>
                                    <TableCell className={`text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                        {isPositive ? '▲' : '▼'} {Math.abs(stock.changes_percentage).toFixed(2)}%
                                    </TableCell>
                                    <TableCell className="text-right">{formatCompactNumber(stock.market_cap)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end">
                                            <span>{stock.valuation_metrics?.dcf ? formatCurrency(stock.valuation_metrics.dcf) : 'N/A'}</span>
                                            <span className={`text-xs ${upside > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {upside !== 0 ? `${upside.toFixed(1)}% Upside` : ''}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={(e) => {
                                            e.stopPropagation()
                                            router.push(`/stock/${stock.symbol}`)
                                        }}>Detail</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
