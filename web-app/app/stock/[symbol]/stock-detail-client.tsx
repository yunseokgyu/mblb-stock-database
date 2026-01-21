"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Activity, Users, Newspaper, ExternalLink, PlayCircle, Mic, Twitter, MessageCircle, Heart, Share2, Video } from 'lucide-react'

// Mock History
const generateMockHistory = (currentPrice: number) => {
    const data = []
    let price = currentPrice * 0.9
    for (let i = 90; i >= 0; i--) { // 3 months
        price = price * (1 + (Math.random() - 0.48) * 0.04)
        data.push({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: price
        })
    }
    data[data.length - 1].price = currentPrice
    return data
}

// Mock News Generator
const generateMockNews = (symbol: string, name: string) => {
    const commonNews = [
        { source: "Bloomberg", title: "Global markets react to recent fed decisions", ago: "2 hours ago" },
        { source: "Reuters", title: `${symbol} shows resilience amidst market volatility`, ago: "4 hours ago" },
        { source: "CNBC", title: "Tech sector rally continues: What to watch next", ago: "6 hours ago" },
        { source: "Wall Street Journal", title: "Institutional investors are accumulating these stocks", ago: "1 day ago" },
    ]

    const specificNews: Record<string, any[]> = {
        "AAPL": [
            { source: "TechCrunch", title: "Apple Intelligence features expected to drive supercycle", ago: "1 hour ago" },
            { source: "Bloomberg", title: "iPhone shipments exceed expectations in Q1", ago: "3 hours ago" },
            { source: "Reuters", title: "Apple faces new regulatory challenges in EU", ago: "5 hours ago" },
        ],
        "TSLA": [
            { source: "Electrek", title: "Tesla FSD v13 rollout begins with major improvements", ago: "30 mins ago" },
            { source: "CNBC", title: "Tesla production numbers beat wall street estimates", ago: "2 hours ago" },
            { source: "Bloomberg", title: "Musk comments on potential new gigafactory location", ago: "1 day ago" },
        ],
        "NVDA": [
            { source: "CNBC", title: "NVIDIA announces next-gen Rubin architecture chips", ago: "1 hour ago" },
            { source: "Reuters", title: "Data center demand continues to skyrocket for AI chips", ago: "4 hours ago" },
            { source: "MarketWatch", title: "Analysts raise price target for NVDA ahead of earnings", ago: "8 hours ago" },
        ],
        "MSFT": [
            { source: "The Verma", title: "Microsoft Copilot integration expands to more enterprise tools", ago: "2 hours ago" },
            { source: "GeekWire", title: "Azure cloud growth accelerates, beating AWS figures", ago: "4 hours ago" },
            { source: "Bloomberg", title: "Microsoft gaming division sees record quarterly revenue", ago: "1 day ago" },
        ]
    }

    return specificNews[symbol] || commonNews
}

// Mock Multimedia Data
const generateMockMedia = (symbol: string, name: string) => {
    return [
        { type: 'video', title: `${name} Q4 2025 Earnings Call Highlights`, duration: "15:20", date: "Jan 10, 2026", thumb: "bg-slate-800" },
        { type: 'video', title: `CEO Interview: Future Roadmap & AI Strategy`, duration: "45:12", date: "Dec 15, 2025", thumb: "bg-blue-900" },
        { type: 'podcast', title: `Deep Dive: ${symbol} Valuation Analysis`, duration: "28:00", date: "Jan 05, 2026", thumb: "bg-purple-900" },
        { type: 'video', title: `Annual Shareholder Meeting 2025 Replay`, duration: "1:20:00", date: "Nov 20, 2025", thumb: "bg-emerald-900" },
    ]
}

// Mock Social Data
const generateMockSocial = (symbol: string) => {
    return [
        { user: symbol, handle: `@${symbol}Official`, content: "We are thrilled to announce our latest breakthrough in AI technology. This will revolutionize how our customers interact with our products. #Innovation #AI", time: "2h ago", likes: "12K", comments: "842" },
        { user: "MarketWatch", handle: "@MarketWatch", content: `BREAKING: ${symbol} shares surge 5% following positive analyst upgrades. Target price raised to new highs.`, time: "5h ago", likes: "4.5K", comments: "312" },
        { user: "TechInsider", handle: "@TechInsider", content: `Rumors suggest ${symbol} is planning a major acquisition in the cloud sector. Stay tuned for updates.`, time: "1d ago", likes: "8.2K", comments: "1.1K" },
    ]
}

// Mock Ownership Data
const generateOwnershipData = (symbol: string) => {
    // Randomized slightly for "realism"
    const inst = 50 + Math.random() * 25 // 50-75%
    const insider = Math.random() * 10 // 0-10%
    const retail = 100 - inst - insider

    return [
        { name: 'Institutional', value: parseFloat(inst.toFixed(1)), fill: '#3b82f6' }, // Blue
        { name: 'Retail / Public', value: parseFloat(retail.toFixed(1)), fill: '#10b981' }, // Green
        { name: 'Inside / Corp', value: parseFloat(insider.toFixed(1)), fill: '#f59e0b' }, // Amber
    ]
}

export default function StockDetailClient({ symbol }: { symbol: string }) {
    const router = useRouter()

    const [stock, setStock] = useState<any>(null)
    const [history, setHistory] = useState<any[]>([])
    const [news, setNews] = useState<any[]>([])
    const [ownership, setOwnership] = useState<any[]>([])
    const [media, setMedia] = useState<any[]>([])
    const [social, setSocial] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!symbol) return
        async function fetchStock() {
            try {
                const res = await fetch('/stock_data.json');
                const allStocks = await res.json();
                const data = allStocks.find((s: any) => s.symbol === symbol);

                if (data) {
                    setStock(data)
                    setHistory(generateMockHistory(data.price))
                    setNews(generateMockNews(symbol, data.name))
                    setOwnership(generateOwnershipData(symbol))
                    setMedia(generateMockMedia(symbol, data.name))
                    setSocial(generateMockSocial(symbol))
                }
            } catch (e) {
                console.error("Failed to load stock detail", e);
            }
            setLoading(false)
        }
        fetchStock()
    }, [symbol])

    if (loading) return <div className="p-10 flex justify-center text-muted-foreground">Loading Analysis...</div>
    if (!stock) return <div className="p-10 flex justify-center text-destructive">Stock not found</div>

    const isPositive = stock.changes_percentage >= 0
    const dcfValue = stock.valuation_metrics?.dcf || 0
    const upsidePotential = ((dcfValue - stock.price) / stock.price) * 100
    const isUndervalued = dcfValue > stock.price

    // Valuation Bar Chart Data
    const valuationData = [
        { name: 'Current Price', value: stock.price, fill: '#64748b' },
        { name: 'Fair Value (DCF)', value: dcfValue, fill: isUndervalued ? '#22c55e' : '#ef4444' }
    ]

    return (
        <main className="min-h-screen bg-slate-50 text-foreground p-4 md:p-8">
            <div className="container mx-auto space-y-8 max-w-6xl">

                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-slate-100">
                            <ArrowLeft className="h-5 w-5 text-slate-500" />
                        </Button>
                        <div>
                            <div className="flex items-baseline gap-3">
                                <h1 className="text-4xl font-black tracking-tight text-slate-900">{stock.symbol}</h1>
                                <span className="text-xl text-slate-500 font-medium">{stock.name}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-3xl font-bold font-serif text-slate-800">${stock.price.toFixed(2)}</span>
                                <Badge variant={isPositive ? "default" : "destructive"} className={`text-sm px-2 py-1 ${isPositive ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'} border-0`}>
                                    {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                    {Math.abs(stock.changes_percentage).toFixed(2)}%
                                </Badge>
                                <span className="text-sm text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded-md">{stock.sector}</span>
                            </div>
                        </div>
                    </div>
                    {/* Key Valuation Score Badge */}
                    <div className="flex items-center gap-5 px-6 py-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-right">
                            <div className="text-xs uppercase font-bold text-slate-400 mb-1">Analyst Verdict</div>
                            <div className={`text-lg font-black tracking-tight ${isUndervalued ? 'text-emerald-600' : 'text-red-500'}`}>
                                {isUndervalued ? 'STRONG BUY' : 'SELL / HOLD'}
                            </div>
                        </div>
                        <div className={`p-3 rounded-full ${isUndervalued ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* 2. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Charts & Essentials) - Spans 2 */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Price Chart */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="border-b border-slate-100 bg-white pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="w-5 h-5 text-slate-400" />
                                    주가 변동 (Price History)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[400px] p-0 bg-white relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={history} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} minTickGap={40} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} dx={-10} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price'] as [string, string]}
                                            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke={isPositive ? "#10b981" : "#ef4444"}
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                            fill="url(#colorPrice)"
                                        />
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.1} />
                                                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Financial Essentials */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-white border-slate-200">
                                <CardHeader className="p-4 pb-1 text-slate-400 text-xs font-bold uppercase tracking-wider">Market Cap</CardHeader>
                                <CardContent className="p-4 pt-1 text-xl font-bold text-slate-800">
                                    {(stock.market_cap / 1e9).toFixed(2)}B
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-slate-200">
                                <CardHeader className="p-4 pb-1 text-slate-400 text-xs font-bold uppercase tracking-wider">P/E Ratio</CardHeader>
                                <CardContent className="p-4 pt-1 text-xl font-bold text-slate-800">
                                    {stock.valuation_metrics?.pe_ratio_ttm?.toFixed(2)}
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-slate-200">
                                <CardHeader className="p-4 pb-1 text-slate-400 text-xs font-bold uppercase tracking-wider">Revenue</CardHeader>
                                <CardContent className="p-4 pt-1 text-xl font-bold text-slate-800">
                                    {(stock.financials?.revenue / 1e9).toFixed(2)}B
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-slate-200">
                                <CardHeader className="p-4 pb-1 text-slate-400 text-xs font-bold uppercase tracking-wider">Net Income</CardHeader>
                                <CardContent className="p-4 pt-1 text-xl font-bold text-slate-800">
                                    {(stock.financials?.netIncome / 1e9).toFixed(2)}B
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column (Valuation & Ownership) - Spans 1 */}
                    <div className="space-y-8">
                        {/* Valuation Model Section */}
                        <Card className="border-2 border-primary/10 shadow-lg shadow-primary/5 overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base text-primary font-bold">
                                    <DollarSign className="h-4 w-4" />
                                    적정 주가 분석 (Fair Value)
                                </CardTitle>
                                <CardDescription className="text-xs">DCF Model 기준</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {/* Big Number Comparison */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Current</span>
                                        <span className="text-base font-bold text-slate-600">${stock.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Intrinsic (DCF)</span>
                                        <span className="text-2xl font-black text-primary">${dcfValue.toFixed(2)}</span>
                                    </div>
                                    <div className="relative pt-1">
                                        <Progress value={Math.min((stock.price / dcfValue) * 100, 100)} className="h-2 bg-slate-100" />
                                    </div>
                                    <div className="text-right text-xs font-bold pt-1">
                                        Potential: <span className={isUndervalued ? "text-emerald-600" : "text-red-500"}>
                                            {upsidePotential > 0 ? '+' : ''}{upsidePotential.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                {/* Mini Bar Chart */}
                                <div className="h-[120px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={valuationData} margin={{ top: 10, bottom: 0 }}>
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                                {valuationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ fontSize: '12px' }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ownership Structure (New) */}
                        <Card className="border-slate-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                                    <Users className="h-4 w-4 text-slate-500" />
                                    지분 구조 (Ownership)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[220px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={ownership}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {ownership.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: any) => `${Number(value)}%`}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                                            />
                                            <Legend
                                                layout='horizontal'
                                                verticalAlign='bottom'
                                                iconSize={8}
                                                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center Text Overly */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6">
                                        <span className="text-xs font-bold text-slate-400">DIST</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Full Width Bottom Section: News & Social */}
                    <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* News Feed (Left 2/3) */}
                        <div className="lg:col-span-2">
                            <Card className="border-slate-200 bg-white h-full">
                                <CardHeader className="border-b border-slate-100 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Newspaper className="h-5 w-5 text-slate-500" />
                                        관련 뉴스 (Related News)
                                    </CardTitle>
                                    <CardDescription>해당 종목과 관련된 최신 주요 뉴스를 확인하세요.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {news.map((item, i) => (
                                            <div key={i} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        <span className="text-primary">{item.source}</span>
                                                        <span>•</span>
                                                        <span>{item.ago}</span>
                                                    </div>
                                                    <h4 className="text-base font-semibold text-slate-800 group-hover:text-primary transition-colors leading-snug">
                                                        {item.title}
                                                    </h4>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-slate-400 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Read <ExternalLink className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 text-center border-t border-slate-100">
                                        <Button variant="link" className="text-slate-500 text-xs">View All News</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Social Feed (Right 1/3) */}
                        <div className="lg:col-span-1">
                            <Card className="border-slate-200 bg-white h-full">
                                <CardHeader className="border-b border-slate-100 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <MessageCircle className="h-5 w-5 text-blue-500" />
                                        소셜 업데이트
                                    </CardTitle>
                                    <CardDescription>실시간 소셜여론</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {social.map((post, i) => (
                                            <div key={i} className="p-5 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                            {post.user[0]}
                                                        </div>
                                                        <div className="leading-none">
                                                            <div className="text-xs font-bold text-slate-900">{post.user}</div>
                                                            <div className="text-[10px] text-slate-400">{post.handle}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">{post.time}</div>
                                                </div>
                                                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                                                    {post.content}
                                                </p>
                                                <div className="flex items-center gap-4 text-slate-400">
                                                    <div className="flex items-center gap-1 text-[10px]">
                                                        <Heart className="w-3 h-3" /> {post.likes}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px]">
                                                        <Share2 className="w-3 h-3" /> {post.comments}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Multimedia Hub (Full Width) */}
                    <div className="lg:col-span-3">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Video className="w-6 h-6 text-red-500" />
                            미디어 & IR 센터 (Multimedia Hub)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {media.map((item, i) => (
                                <Card key={i} className="group cursor-pointer overflow-hidden border-slate-200 hover:shadow-md transition-all hover:-translate-y-1">
                                    <div className={`h-32 w-full ${item.thumb} relative flex items-center justify-center`}>
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {item.type === 'video' ? <PlayCircle className="w-6 h-6 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                                        </div>
                                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-white font-medium">
                                            {item.duration}
                                        </div>
                                        <Badge className="absolute top-2 left-2 bg-black/40 text-white border-0 hover:bg-black/60 text-[10px]">
                                            {item.type === 'video' ? 'Video' : 'Podcast'}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Published: {item.date}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
