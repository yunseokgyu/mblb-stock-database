"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, ShieldCheck, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'

interface ValueAnalysisPanelProps {
    holding: any
}

export function ValueAnalysisPanel({ holding }: ValueAnalysisPanelProps) {
    if (!holding) return null

    // Safe accessors for potential missing data in older history items
    const entryPrice = holding.avg_buy_price || holding.entry_price || 0
    const currentPrice = holding.exit_price || (entryPrice * (1 + (holding.return_pct || 0) / 100)) || 0 // Mock calculation if no current price

    // Calculate multiples
    const bagger = entryPrice > 0 ? (currentPrice / entryPrice).toFixed(1) : "0"

    // Formatters
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val)

    // Data for Charts
    const priceData = [
        { name: 'Entry', value: entryPrice, label: 'Entry (진입)', color: '#64748b' }, // slate-500
        { name: 'Current', value: currentPrice, label: 'Current (현재)', color: '#10b981' } // emerald-500
    ]

    const valuationData = [
        { name: 'Entry', value: holding.entry_pe || 0, label: 'Entry (진입)', color: '#64748b' },
        { name: 'Current', value: holding.current_pe || 0, label: 'Current (현재)', color: '#ec4899' } // pink-500
    ]

    const CustomTooltip = ({ active, payload, label, prefix = "", suffix = "" }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs">
                    <p className="text-slate-300">{payload[0].payload.label}</p>
                    <p className="font-bold text-white">{prefix}{payload[0].value.toLocaleString()}{suffix}</p>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="bg-slate-900 text-slate-50 border-slate-700 shadow-2xl animate-in slide-in-from-top-4 duration-500">
            <CardHeader className="pb-2 border-b border-slate-800">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className="mb-2 text-blue-400 border-blue-400">Value Investing Analysis (가치 투자 분석)</Badge>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            {holding.symbol} <span className="text-slate-500 font-normal text-lg">Analysis (분석)</span>
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            The power of long-term compounding visualized. (장기 복리의 힘 시각화)
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-400">{bagger}x</div>
                        <div className="text-xs text-slate-400">Bagger (수익 배수)</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* 1. Price Comparison */}
                    <div className="flex flex-col gap-4">
                        <h4 className="flex items-center gap-2 font-semibold text-blue-300 h-10">
                            <TrendingUp className="w-4 h-4" /> Price Evolution (가격 변동)
                        </h4>
                        <div className="flex flex-col gap-3 flex-1 h-full">
                            <div className="h-[140px] w-full bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={priceData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                        <XAxis dataKey="name" hide />
                                        <Tooltip content={<CustomTooltip prefix="$" />} cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                            {priceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                            <LabelList dataKey="value" position="top" fill="#94a3b8" fontSize={10} formatter={(val: any) => `$${val}`} />
                                            <LabelList dataKey="name" position="bottom" fill="#94a3b8" fontSize={10} dy={10} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                    <div className="text-slate-500 mb-0.5">Entry</div>
                                    <div className="text-slate-300 font-mono">{formatCurrency(entryPrice)}</div>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                    <div className="text-emerald-500/70 mb-0.5">Current</div>
                                    <div className="text-emerald-400 font-mono font-bold">{formatCurrency(currentPrice)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Valuation Comparison */}
                    <div className="flex flex-col gap-4">
                        <h4 className="flex items-center gap-2 font-semibold text-pink-300 h-10">
                            <BarChart3 className="w-4 h-4" /> Valuation (가치 평가)
                        </h4>
                        <div className="flex flex-col gap-3 flex-1 h-full">
                            <div className="h-[140px] w-full bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
                                {holding.entry_pe || holding.current_pe ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={valuationData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                            <XAxis dataKey="name" hide />
                                            <Tooltip content={<CustomTooltip suffix="x" />} cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                                {valuationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                                <LabelList dataKey="value" position="top" fill="#94a3b8" fontSize={10} formatter={(val: any) => `${val}x`} />
                                                <LabelList dataKey="name" position="bottom" fill="#94a3b8" fontSize={10} dy={10} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
                                        No Data
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                    <div className="text-slate-500 mb-0.5">Entry P/E</div>
                                    <div className="text-slate-300 font-mono">{holding.entry_pe ? `${holding.entry_pe}x` : 'N/A'}</div>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                    <div className="text-pink-500/70 mb-0.5">Current</div>
                                    <div className="text-pink-400 font-mono font-bold">{holding.current_pe ? `${holding.current_pe}x` : 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Dividend Compounding */}
                    <div className="flex flex-col gap-4">
                        <h4 className="flex items-center gap-2 font-semibold text-purple-300 h-10">
                            <DollarSign className="w-4 h-4" /> Dividend Machine (배당)
                        </h4>
                        <div className="flex flex-col gap-3 flex-1 h-full">
                            <div className="flex flex-col gap-3 flex-1 h-full">
                                <div className="h-[140px] w-full bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
                                    {holding.current_dps && entryPrice ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'On Cost', value: parseFloat(((holding.current_dps / entryPrice) * 100).toFixed(1)), label: 'Yield on Cost', color: '#a855f7' },
                                                { name: 'Current', value: holding.current_dividend_yield, label: 'Current Yield', color: '#cbd5e1' }
                                            ]} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                                <XAxis dataKey="name" hide />
                                                <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ fill: 'transparent' }} />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                                    <Cell fill="#a855f7" />
                                                    <Cell fill="#cbd5e1" />
                                                    <LabelList dataKey="value" position="top" fill="#94a3b8" fontSize={10} formatter={(val: any) => `${val}%`} />
                                                    <LabelList dataKey="name" position="bottom" fill="#94a3b8" fontSize={10} dy={10} />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
                                            Yield Data Unavailable
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50 relative group">
                                        <div className="text-slate-500 mb-0.5 flex items-center gap-1 cursor-help">
                                            Yield on Cost
                                            <div className="hidden group-hover:block absolute bottom-full left-0 w-32 bg-slate-800 border border-slate-600 p-2 rounded shadow-xl text-[10px] text-slate-300 z-10 mb-2">
                                                Return on initial investment
                                            </div>
                                        </div>
                                        <div className="text-purple-400 font-mono font-bold">
                                            {holding.current_dps && entryPrice ? ((holding.current_dps / entryPrice) * 100).toFixed(1) : 'N/A'}%
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                                        <div className="text-slate-500 mb-0.5">Current Yield</div>
                                        <div className="text-slate-200 font-mono">{holding.current_dividend_yield}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Dividend Growth (Replaces Moat) */}
                    <div className="flex flex-col gap-4">
                        <h4 className="flex items-center gap-2 font-medium text-sm text-amber-300 h-10 whitespace-nowrap">
                            <TrendingUp className="w-4 h-4 flex-shrink-0" /> Dividend Growth (배당 성장)
                        </h4>
                        <div className="flex flex-col gap-3 flex-1 h-full">
                            <div className="h-[100px] w-full bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
                                {holding.entry_dps && holding.current_dps ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: 'Entry', value: holding.entry_dps, label: 'Entry DPS', color: '#64748b' },
                                            { name: 'Current', value: holding.current_dps, label: 'Current DPS', color: '#f59e0b' }
                                        ]} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                            <XAxis dataKey="name" hide />
                                            <Tooltip content={<CustomTooltip prefix="$" />} cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                                <Cell fill="#64748b" />
                                                <Cell fill="#f59e0b" />
                                                <LabelList dataKey="value" position="top" fill="#94a3b8" fontSize={10} formatter={(val: any) => `$${val}`} />
                                                <LabelList dataKey="name" position="bottom" fill="#94a3b8" fontSize={10} dy={10} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
                                        DPS Data Added for KO Only
                                    </div>
                                )}
                            </div>

                            {/* Calculation Explanation */}
                            {/* Calculation Explanation - Enhanced Visibility */}
                            <div className="bg-slate-800/90 p-3 rounded-xl border border-amber-500/50 shadow-lg mt-1">
                                <div className="text-xs text-amber-200/80 mb-2 text-center font-medium">Why {holding.current_dps && entryPrice ? ((holding.current_dps / entryPrice) * 100).toFixed(0) : 0}% Yield? (왜 고배당인가?)</div>
                                <div className="flex items-center justify-center gap-2 text-sm font-mono font-bold">
                                    <div className="flex flex-col items-center">
                                        <span className="text-amber-400 text-lg">${holding.current_dps}</span>
                                        <span className="text-[9px] text-slate-400 font-normal">Current DPS</span>
                                    </div>
                                    <span className="text-slate-500 text-lg">÷</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-slate-300 text-lg">${formatCurrency(entryPrice).replace('$', '')}</span>
                                        <span className="text-[9px] text-slate-400 font-normal">Entry Price</span>
                                    </div>
                                    <span className="text-slate-500 text-lg">=</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-purple-400 text-lg">{((holding.current_dps / entryPrice) * 100).toFixed(1)}%</span>
                                        <span className="text-[9px] text-slate-400 font-normal">Yield on Cost</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Expert Analysis Section */}
                <div className="mt-6 animate-in fade-in duration-700 delay-300">
                    <div className="bg-slate-800/80 rounded-xl p-6 border border-slate-700 shadow-inner">
                        <h4 className="flex items-center gap-2 font-bold text-lg text-indigo-300 mb-4">
                            <span className="bg-indigo-500/20 p-1.5 rounded-lg">🤖</span> AI Investment Analysis (AI 투자 분석)
                        </h4>
                        <div className="text-slate-300 leading-relaxed text-sm md:text-base border-l-4 border-indigo-500 pl-4 whitespace-pre-line">
                            {holding.ai_analysis || (
                                <span className="italic text-slate-500">
                                    Analysis data not available for this asset yet. (이 자산에 대한 AI 분석 데이터가 아직 없습니다.)
                                </span>
                            )}
                        </div>
                        <div className="flex gap-4 mt-4 text-xs text-slate-500 font-mono">
                            <span className="flex items-center gap-1">✨ Valuation Check</span>
                            <span className="flex items-center gap-1">✨ Dividend Trend</span>
                            <span className="flex items-center gap-1">✨ Shareholder Policy</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
