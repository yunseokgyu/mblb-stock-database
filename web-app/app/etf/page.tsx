"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { ArrowLeft, PieChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function ETFListPage() {
    const [etfs, setEtfs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchEtfs() {
            const { data, error } = await supabase
                .from('etf_holdings')
                .select('symbol, last_updated')

            if (data) {
                setEtfs(data)
            }
            setLoading(false)
        }

        fetchEtfs()
    }, [])

    if (loading) return <div className="p-10 text-center text-muted-foreground">Loading ETF Data...</div>

    return (
        <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="container mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">ETF 분석 (ETF Analysis)</h1>
                        <p className="text-muted-foreground">주요 ETF의 구성 종목과 비중을 분석합니다.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {etfs.map((etf) => (
                        <Link href={`/etf/${etf.symbol}`} key={etf.symbol} className="block group">
                            <Card className="h-full hover:shadow-lg transition-shadow border-primary/20 hover:border-primary">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-2xl font-bold">{etf.symbol}</CardTitle>
                                    <PieChart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">ETF</Badge>
                                            <span>
                                                Updated: {new Date(etf.last_updated).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        상세 분석 보기 &rarr;
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}
