"use client"

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Plus, X } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ScrollArea } from "@/components/ui/scroll-area"

interface Stock {
    symbol: string
    company_name: string
    sector: string
    dividend_yield: number
    years_of_growth: number
    payout_ratio: number
}

interface DividendBacktestProps {
    availableStocks: Stock[]
}

export default function DividendBacktest({ availableStocks = [] }: DividendBacktestProps) {
    // Inputs
    const [initialAmount, setInitialAmount] = useState<number>(10000000)
    const [startYear, setStartYear] = useState<number>(2015)
    const [reinvest, setReinvest] = useState<boolean>(true)
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])

    // Initialize with top 5 stocks when data loads
    useEffect(() => {
        if (availableStocks.length > 0 && selectedSymbols.length === 0) {
            setSelectedSymbols(availableStocks.slice(0, 5).map(s => s.symbol))
        }
    }, [availableStocks])

    const currentYear = new Date().getFullYear()

    // Toggle Selection Logic
    const toggleStock = (symbol: string) => {
        if (selectedSymbols.includes(symbol)) {
            setSelectedSymbols(prev => prev.filter(s => s !== symbol))
        } else {
            if (selectedSymbols.length >= 10) return // Max 10
            setSelectedSymbols(prev => [...prev, symbol])
        }
    }

    // Calculated Simulation Params based on Selection
    const simulationParams = useMemo(() => {
        const selected = availableStocks.filter(s => selectedSymbols.includes(s.symbol))
        if (selected.length === 0) return { avgYield: 0, avgGrowth: 0 }

        const avgYield = selected.reduce((sum, s) => sum + s.dividend_yield, 0) / selected.length / 100
        // Assume price growth roughly correlates with (10% - yield) or reasonable market assumption
        // High yield usually means lower growth. Let's model: Total Return ~ 9% roughly?
        // Growth = 0.09 - avgYield
        const avgGrowth = Math.max(0.02, 0.09 - avgYield)

        return { avgYield, avgGrowth }
    }, [selectedSymbols, availableStocks])

    // Mock Simulation Logic
    const simulationData = useMemo(() => {
        const data = []
        let currentCapital = initialAmount
        let totalDividends = 0
        let cumulativeDividends = 0

        const { avgYield, avgGrowth } = simulationParams

        // Dynamic Dividend Growth Rate (Assumed based on sector or history? Keep simple 5% for now)
        const DIV_GROWTH_RATE = 0.05

        // Current Yield increases effectively on cost if dividend grows per share
        // But here we model simple compounding

        let currentYieldOnCost = avgYield

        for (let year = startYear; year <= currentYear; year++) {
            // 1. Calculate Dividend
            const yearlyDividend = currentCapital * currentYieldOnCost

            // 2. Accumulate
            cumulativeDividends += yearlyDividend

            // 3. Price Appreciation
            const appreciation = currentCapital * avgGrowth

            // 4. Update Capital
            if (reinvest) {
                currentCapital += appreciation + yearlyDividend
            } else {
                currentCapital += appreciation
            }

            // Dividend Payout grows (companies raise dividends)
            currentYieldOnCost = currentYieldOnCost * (1 + DIV_GROWTH_RATE)

            data.push({
                year: year.toString(),
                principal: initialAmount,
                gains: Math.round(currentCapital - initialAmount - (reinvest ? cumulativeDividends : 0)),
                dividends: Math.round(cumulativeDividends),
                totalValue: Math.round(currentCapital + (reinvest ? 0 : cumulativeDividends)),
                yearlyDividend: Math.round(yearlyDividend)
            })
        }
        return data
    }, [initialAmount, startYear, reinvest, currentYear, simulationParams])

    const finalResult = simulationData[simulationData.length - 1]

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, '')
        if (!isNaN(Number(value))) {
            setInitialAmount(Number(value))
        }
    }

    return (
        <Card className="w-full bg-slate-900 border-slate-800">
            {/* Header same as before */}
            {/* ... */}
            <CardContent>
                {/* Structure: 
                    Left Col: Inputs & Stock Selection 
                    Right Col: Chart & Table 
                */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Controls Panel */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>투자 원금 (KRW)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    value={initialAmount.toLocaleString()}
                                    onChange={handleAmountChange}
                                    className="text-right font-mono text-lg"
                                />
                                <span className="whitespace-nowrap font-bold">원</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setInitialAmount(1000000)}>100만</Button>
                                <Button variant="outline" size="sm" onClick={() => setInitialAmount(10000000)}>1000만</Button>
                                <Button variant="outline" size="sm" onClick={() => setInitialAmount(100000000)}>1억</Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>시작 연도 (1980 ~ {currentYear - 1})</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={1980}
                                    max={currentYear - 1}
                                    value={startYear}
                                    onChange={(e) => {
                                        const val = Number(e.target.value)
                                        setStartYear(val)
                                    }}
                                    className="font-mono text-lg"
                                />
                                <span className="font-bold">년</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-900 rounded border border-slate-800">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="reinvest-mode" className="cursor-pointer text-base">배당금 재투자</Label>
                                <span className="text-xs text-muted-foreground">복리 효과로 자산 증대</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${reinvest ? "text-emerald-400" : "text-slate-500"}`}>
                                    {reinvest ? "재투자 ON" : "미사용 OFF"}
                                </span>
                                <Switch
                                    id="reinvest-mode"
                                    checked={reinvest}
                                    onCheckedChange={setReinvest}
                                />
                            </div>
                        </div>

                        {/* Stock Selection Area */}
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                            <div className="flex justify-between items-center">
                                <Label>포트폴리오 구성 ({selectedSymbols.length}/10)</Label>
                                <span className="text-xs text-muted-foreground">최대 10개 선택</span>
                            </div>
                            <ScrollArea className="h-[400px] border border-slate-800 rounded-md p-2">
                                <div className="grid grid-cols-2 gap-2">
                                    {availableStocks.map(stock => {
                                        const isSelected = selectedSymbols.includes(stock.symbol)
                                        return (
                                            <div
                                                key={stock.symbol}
                                                onClick={() => toggleStock(stock.symbol)}
                                                className={`flex flex-col gap-1 p-3 rounded-md cursor-pointer border transition-all ${isSelected
                                                    ? 'bg-blue-950/40 border-blue-500/50 hover:bg-blue-900/40'
                                                    : 'bg-slate-900/50 border-transparent hover:bg-slate-800'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                                                            }`}>
                                                            {isSelected && <Check className="h-3 w-3 text-white" />}
                                                        </div>
                                                        <span className="font-bold text-slate-100">{stock.symbol}</span>
                                                    </div>
                                                    <span className="font-mono text-emerald-400 text-xs font-bold bg-emerald-950/30 px-1.5 py-0.5 rounded">
                                                        {stock.dividend_yield.toFixed(2)}%
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500 truncate pl-6">
                                                    {stock.company_name}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                            {/* Selected Average Check */}
                            <div className="text-xs text-right text-muted-foreground">
                                평균 배당률: {(simulationParams.avgYield * 100).toFixed(2)}%
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="pt-4 border-t border-slate-800">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">총 배당금</p>
                                    <p className="text-xl font-bold text-blue-400">
                                        {finalResult?.dividends.toLocaleString()} 원
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">최종 자산 가치</p>
                                    <p className="text-xl font-bold text-emerald-400">
                                        {reinvest
                                            ? finalResult?.totalValue.toLocaleString()
                                            : (finalResult?.totalValue - finalResult?.dividends).toLocaleString()} 원
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-muted-foreground">총 수익률</p>
                                <p className="text-2xl font-black text-white">
                                    {(((finalResult?.totalValue - initialAmount) / initialAmount) * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chart & Table */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Chart Component */}
                        <div className="h-[500px] bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={simulationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorDividends" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorGains" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="year" stroke="#94a3b8" />
                                    <YAxis
                                        tickFormatter={(value) => `${(value / 10000).toLocaleString()}만`}
                                        stroke="#94a3b8"
                                        width={80}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <Tooltip
                                        formatter={(value: any) => value.toLocaleString() + " 원"}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="principal" stackId="1" stroke="#64748b" fill="url(#colorPrincipal)" name="원금" />
                                    <Area type="monotone" dataKey="dividends" stackId="1" stroke="#3b82f6" fill="url(#colorDividends)" name="누적 배당금" />
                                    <Area type="monotone" dataKey="gains" stackId="1" stroke="#10b981" fill="url(#colorGains)" name="자본 수익" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Table Component */}
                        <div className="rounded-md border border-slate-800 overflow-hidden">
                            <ScrollArea className="h-[300px]">
                                <table className="w-full text-sm text-left text-slate-300">
                                    <thead className="bg-slate-950 text-slate-400 uppercase sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 bg-slate-950">연도</th>
                                            <th className="px-6 py-3 text-right bg-slate-950">투자 원금</th>
                                            <th className="px-6 py-3 text-right bg-slate-950">해당 연도 배당금</th>
                                            <th className="px-6 py-3 text-right bg-slate-950">누적 배당금</th>
                                            <th className="px-6 py-3 text-right bg-slate-950">총 자산 가치</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 bg-slate-900">
                                        {simulationData.map((row) => (
                                            <tr key={row.year} className="hover:bg-slate-800/50">
                                                <td className="px-6 py-4 font-medium">{row.year}년</td>
                                                <td className="px-6 py-4 text-right text-slate-400">{row.principal.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right text-blue-400">+{row.yearlyDividend.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right text-blue-300">{row.dividends.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right font-bold text-emerald-400">{row.totalValue.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
