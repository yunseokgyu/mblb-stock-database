"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InsiderTradingPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchInsiderData() {
            const { data, error } = await supabase
                .from('insider_trading')
                .select('*')
                .order('transaction_date', { ascending: false })
                .limit(100) // Increase limit to get mixed data

            if (data) {
                setTransactions(data)
            }
            setLoading(false)
        }

        fetchInsiderData()
    }, [])

    if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Insider Data...</div>

    const corporateTrades = transactions.filter(t => !t.insider_name?.startsWith('[Congress]'))
    const congressTrades = transactions.filter(t => t.insider_name?.startsWith('[Congress]'))

    const renderTable = (data: any[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>날짜 (Date)</TableHead>
                    <TableHead>종목 (Symbol)</TableHead>
                    <TableHead>내부자 (Insider)</TableHead>
                    <TableHead>유형 (Type)</TableHead>
                    <TableHead className="text-right">거래 금액 (Value)</TableHead>
                    <TableHead className="text-right">가격 (Price)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((t) => {
                    const isBuy = t.transaction_type?.includes('Purchase') || t.transaction_type?.includes('Buy')
                    const displayName = t.insider_name.replace('[Congress] ', '')

                    return (
                        <TableRow key={t.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => router.push(`/stock/${t.symbol}`)}>
                            <TableCell>{new Date(t.transaction_date).toLocaleDateString()}</TableCell>
                            <TableCell className="font-bold">{t.symbol}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{displayName}</span>
                                    <span className="text-xs text-muted-foreground">{t.company}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge className={isBuy ? "bg-green-500 hover:bg-green-600 border-transparent" : "bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground"}>
                                    {isBuy ? "매수 (Buy)" : "매도 (Sell)"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                ${(t.securities_transacted * t.price).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                ${t.price?.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )

    return (
        <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="container mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">내부자 거래 현황 (Insider Trading)</h1>
                        <p className="text-muted-foreground">경영진 및 의회(Congress)의 최근 주식 거래 내역입니다.</p>
                    </div>
                </div>

                <Tabs defaultValue="corporate" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="corporate">기업 내부자 (Corporate)</TabsTrigger>
                        <TabsTrigger value="congress">정치인 (Congress)</TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="corporate">
                            <Card>
                                <CardHeader>
                                    <CardTitle>기업 임원 거래 (Corporate Insiders)</CardTitle>
                                    <CardDescription>SEC Form 4 데이터</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderTable(corporateTrades)}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="congress">
                            <Card>
                                <CardHeader>
                                    <CardTitle>미 의회 거래 (Congress Trading)</CardTitle>
                                    <CardDescription>STOCK Act 공개 데이터</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {congressTrades.length > 0 ? renderTable(congressTrades) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            데이터가 없습니다. (No Data)
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </main>
    )
}
