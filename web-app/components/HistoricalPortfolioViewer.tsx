"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, History, MousePointerClick } from "lucide-react"
import { ValueAnalysisPanel } from "./ValueAnalysisPanel"

interface HistoricalPortfolioViewerProps {
    initialHoldings: any[]
    history: any[]
}

export function HistoricalPortfolioViewer({ initialHoldings, history }: HistoricalPortfolioViewerProps) {
    const currentYear = new Date().getFullYear()

    // Calculate Min Year from all data points
    const minYear = useMemo(() => {
        const historyYears = history?.map(h => h.year) || []
        const holdingYears = initialHoldings.map(h => new Date(h.first_added || new Date()).getFullYear())
        const allYears = [...historyYears, ...holdingYears, 2000] // Default to 2000 if empty
        return Math.min(...allYears)
    }, [initialHoldings, history])

    const [selectedYear, setSelectedYear] = useState<number>(currentYear)
    const [selectedHolding, setSelectedHolding] = useState<any>(null)

    // Filter Holdings Logic
    const snapshotHoldings = useMemo(() => {
        // 1. Process CURRENT holdings: Check if they were held in the selected year
        const currentHeldInYear = initialHoldings.filter(h => {
            // Fallback: Use report_period or created_at if first_added is missing
            const dateStr = h.first_added || h.report_period || new Date().toISOString()
            const entryYear = new Date(dateStr).getFullYear()
            // If date invalid, default to current year
            const safeEntryYear = isNaN(entryYear) ? currentYear : entryYear

            return safeEntryYear <= selectedYear
        }).map(h => ({
            symbol: h.symbol,
            name: h.name || h.stock_data?.name,
            entry_year: new Date(h.first_added || h.report_period || new Date()).getFullYear(),
            status: "Held (Current) / 보유 중(현재)",
            shares: h.shares, // Simplified: Assume shares constant for mock
            value: h.value
        }))

        // 2. Process PAST history: Check if they were held in the selected year
        // We need items where: Entry <= SelectedYear AND (Exit is NULL or Exit > SelectedYear)
        // Note: The 'history' array in mock data are specific *events* (Entry or Exit), so we need to infer ranges.
        // For simplicity in this mock, we treat 'history' items as "Investments started in year X"
        // and check if they were exited.
        const historyHeldInYear = (history || []).filter(h => {
            const entryYear = h.year
            const exitYear = h.exit_date ? new Date(h.exit_date).getFullYear() : 9999
            return entryYear <= selectedYear && selectedYear < exitYear
        }).map(h => ({
            symbol: h.symbol,
            name: h.name,
            entry_year: h.year,
            status: "Held (Historical) / 보유 중(과거)",
            shares: 0, // Mock history doesn't have reliable shares count often
            value: h.entry_valuation // Use entry valuation as proxy
        }))

        // Deduplicate (prefer Current Holding data if overlap)
        const combined = [...currentHeldInYear]
        historyHeldInYear.forEach(h => {
            if (!combined.find(c => c.symbol === h.symbol)) {
                combined.push(h)
            }
        })

        return combined
    }, [selectedYear, initialHoldings, history])

    // Calculate Total Value for the selected year to compute allocations
    const totalSnapshotValue = useMemo(() => {
        return snapshotHoldings.reduce((sum, h) => sum + h.value, 0)
    }, [snapshotHoldings])

    // Sort by Value descending
    const sortedSnapshotHoldings = useMemo(() => {
        return [...snapshotHoldings].sort((a, b) => b.value - a.value)
    }, [snapshotHoldings])

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    const formatBillions = (val: number) =>
        `$${(val / 1_000_000_000).toFixed(2)}B`

    return (
        <div className="space-y-6">
            {/* Year Slider Control */}
            <Card className="bg-slate-50 border-slate-200">
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <History className="w-5 h-5 text-blue-600" />
                                <span className="font-bold text-lg text-slate-700">Time Machine: {selectedYear} (타임 머신)</span>
                            </div>
                            <Badge variant="outline" className="text-base px-3 py-1 bg-white">
                                {sortedSnapshotHoldings.length} Assets &bull; Est. Value(추정 가치): {formatBillions(totalSnapshotValue)}
                            </Badge>
                        </div>

                        <div className="px-2">
                            <Slider
                                defaultValue={[currentYear]}
                                min={minYear}
                                max={currentYear}
                                step={1}
                                value={[selectedYear]}
                                onValueChange={(vals) => setSelectedYear(vals[0])}
                                className="cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                                <span>{minYear}</span>
                                <span>{Math.floor((minYear + currentYear) / 2)}</span>
                                <span>{currentYear}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Analysis Panel (Conditional) */}
            {selectedHolding && (
                <ValueAnalysisPanel holding={selectedHolding} />
            )}

            {/* Snapshot Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Snapshot: {selectedYear} (포트폴리오 스냅샷)</CardTitle>
                    <CardDescription>
                        Click on any stock to see value analysis. (주식을 클릭하여 가치 분석을 확인하세요.)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Symbol (심볼)</TableHead>
                                <TableHead>Shares (주식 수)</TableHead>
                                <TableHead>Est. Value (추정 가치)</TableHead>
                                <TableHead>Portfolio % (비중)</TableHead>
                                <TableHead className="text-right">Status (상태)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedSnapshotHoldings.map((h, idx) => {
                                const allocation = totalSnapshotValue > 0 ? ((h.value / totalSnapshotValue) * 100).toFixed(2) : "0.00"
                                const isSelected = selectedHolding?.symbol === h.symbol
                                return (
                                    <TableRow
                                        key={`${h.symbol}-${idx}`}
                                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'}`}
                                        onClick={() => setSelectedHolding(h.symbol === selectedHolding?.symbol ? null : {
                                            ...h,
                                            // Merge generic symbol data with specific holding data that might be in initialHoldings
                                            ...initialHoldings.find(init => init.symbol === h.symbol),
                                            ...history.find(hist => hist.symbol === h.symbol)
                                        })}
                                    >
                                        <TableCell>
                                            <div className="font-medium flex items-center gap-2">
                                                {isSelected && <MousePointerClick className="w-4 h-4 text-blue-500 animate-bounce" />}
                                                <div>
                                                    <div>{h.symbol}</div>
                                                    <div className="text-xs text-slate-500">{h.name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {h.shares > 0 ? h.shares.toLocaleString() : "-"}
                                        </TableCell>
                                        <TableCell className="font-medium text-emerald-600">
                                            {h.value > 0 ? formatBillions(h.value) : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="w-12 text-right text-sm">{allocation}%</span>
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full"
                                                        style={{ width: `${Math.min(parseFloat(allocation), 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge variant={h.status.includes("Held (Current)") ? "default" : "secondary"}>
                                                    {h.status}
                                                </Badge>
                                                <span className="text-[10px] text-slate-400">Since {h.entry_year}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}

                            {sortedSnapshotHoldings.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-48 text-slate-400">
                                        No holdings found for {selectedYear}. (해당 연도에 보유 종목이 없습니다.)
                                        <div className="text-xs mt-2">Try moving the slider to a different year. (연도를 변경해 보세요.)</div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
