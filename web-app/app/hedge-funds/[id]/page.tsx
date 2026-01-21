
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from 'next/link'
import { ArrowLeft, PieChart, DollarSign, Briefcase } from "lucide-react"
import { MOCK_FUNDS } from "@/lib/mock-hedge-funds"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistoricalPortfolioViewer } from "@/components/HistoricalPortfolioViewer"

export const dynamic = 'force-dynamic'

export default async function HedgeFundDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    // 1. Fetch Fund Details from DB
    const { data: fund, error: fundError } = await supabase
        .from('hedge_funds')
        .select('*')
        .eq('id', id)
        .single()

    if (fundError || !fund) {
        return <div className="container mx-auto p-10 text-center">Fund not found.</div>
    }

    // 2. Fetch Latest Report Period to avoid duplicates across quarters
    const { data: periods } = await supabase
        .from('fund_holdings')
        .select('report_period')
        .eq('fund_id', id)
        .order('report_period', { ascending: false })
        .limit(1)

    const latestPeriod = periods?.[0]?.report_period

    // 3. Fetch Holdings from DB (Filtered by Latest Period)
    const { data: dbHoldings, error: holdingsError } = await supabase
        .from('fund_holdings')
        .select(`
            *,
            stock_data:symbol ( name, sector )
        `)
        .eq('fund_id', id)
        .eq('report_period', latestPeriod) // Critical Fix: Filter by latest period
        .order('value', { ascending: false })

    // Transform DB holdings to match UI expected format
    const holdings = dbHoldings?.map(h => ({
        symbol: h.symbol,
        name: h.stock_data?.name || h.symbol, // Fallback if stock_data missing
        sector: h.stock_data?.sector || 'Unknown',
        shares: h.shares,
        value: h.value,
        avg_buy_price: h.avg_buy_price,
        report_period: h.report_period,
        first_added: h.created_at, // Use created_at as proxy for first_added if column missing
        stock_data: {
            name: h.stock_data?.name,
            sector: h.stock_data?.sector
        }
    })) || []

    // Calculate Stats
    const totalValue = holdings.reduce((sum, h) => sum + (h.value || 0), 0)

    // Simple Sector Logic (replacing hardcoded)
    const sectors: Record<string, number> = {}
    holdings.forEach(h => {
        const s = h.sector || "Unknown"
        sectors[s] = (sectors[s] || 0) + h.value
    })
    const topSector = Object.entries(sectors).sort((a, b) => b[1] - a[1])[0]?.[0] || "Diversified"

    const holdingCount = holdings.length

    // Formatter
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    const formatBillions = (val: number) =>
        `$${(val / 1_000_000_000).toFixed(2)}B`

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-6xl">
            {/* Header */}
            <div className="space-y-4">
                <Link href="/hedge-funds" className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Funds (목록으로 돌아가기)
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900">{fund.name}</h1>
                            <Badge className="bg-slate-900 hover:bg-slate-800">{fund.strategy}</Badge>
                        </div>
                        <p className="text-slate-500 max-w-2xl">{fund.description}</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assets (총 운용 자산)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatBillions(totalValue)}</div>
                        <p className="text-xs text-muted-foreground">Based on reported holdings (보고된 보유 종목 기준)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Holdings (상위 종목)</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{holdingCount}</div>
                        <p className="text-xs text-muted-foreground">Unique stocks in portfolio (포트폴리오 내 종목 수)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Sector (대표 섹터)</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate">{topSector}</div>
                        <p className="text-xs text-muted-foreground">By allocation weight (투자 비중 기준)</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="holdings" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="holdings">Current Portfolio (현재 포트폴리오)</TabsTrigger>
                    <TabsTrigger value="history">Investment History & Report (투자 역사 및 리포트)</TabsTrigger>
                </TabsList>

                {/* Tab: Current Holdings */}
                <TabsContent value="holdings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Portfolio Holdings (포트폴리오 보유 종목)</CardTitle>
                            <CardDescription>
                                Latest 13F filing data. (최신 13F 공시 데이터)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Symbol (심볼)</TableHead>
                                        <TableHead>Shares (주식 수)</TableHead>
                                        <TableHead>Value (평가 가치)</TableHead>
                                        <TableHead>Portfolio % (비중)</TableHead>
                                        <TableHead className="text-right">Avg Price (평단가)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {holdings?.map((h) => {
                                        const allocation = totalValue > 0 ? ((h.value / totalValue) * 100).toFixed(2) : "0.00"
                                        return (
                                            <TableRow key={h.symbol}>
                                                <TableCell>
                                                    <div className="font-medium flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                                                            {h.symbol[0]}
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-900">{h.symbol}</div>
                                                            <div className="text-xs text-slate-500">{h.stock_data?.name || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{h.shares.toLocaleString()}</TableCell>
                                                <TableCell className="font-medium text-emerald-600">{formatBillions(h.value)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-12 text-right">{allocation}%</span>
                                                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-500 rounded-full"
                                                                style={{ width: `${Math.min(parseFloat(allocation), 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">{formatCurrency(h.avg_buy_price)}</TableCell>
                                            </TableRow>
                                        )
                                    })}

                                    {(!holdings || holdings.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-32 text-slate-400">
                                                No holdings data available. (데이터가 없습니다.)
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Investment History */}
                <TabsContent value="history">
                    <HistoricalPortfolioViewer
                        initialHoldings={holdings}
                        history={fund.history || []}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
