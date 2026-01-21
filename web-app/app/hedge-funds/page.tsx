
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Building2, Wallet } from "lucide-react"
import { MOCK_FUNDS } from "@/lib/mock-hedge-funds"

export const dynamic = 'force-dynamic'

export default async function HedgeFundsPage() {
    const supabase = await createClient()

    // Fetch Hedge Funds from Real DB
    const { data: funds, error } = await supabase
        .from('hedge_funds')
        .select('*')
        .order('name')


    if (error) {
        console.error("Error fetching funds:", error)
        return <div className="p-10 text-center text-red-500">Failed to load hedge funds. (Check Database Connection)</div>
    }

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-6xl">
            <div className="text-center space-y-4 py-10">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    Wall Street Legends
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Track the portfolios of the world's most successful investors.
                    See what Warren Buffett, Ray Dalio, and others are buying.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {funds?.map((fund) => (
                    <Link href={`/hedge-funds/${fund.id}`} key={fund.id} className="group">
                        <Card className="h-full border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <Badge variant="outline" className="bg-slate-50 font-medium">
                                        {fund.strategy || "General"}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                    {fund.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <CardDescription className="text-sm line-clamp-3 leading-relaxed">
                                    {fund.description || "No description available."}
                                </CardDescription>

                                <div className="pt-4 flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                                    View Portfolio <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {!funds || funds.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No Funds Found</h3>
                    <p className="text-slate-500 text-sm mt-1">Run the seed script to populate data.</p>
                </div>
            ) : null}
        </div>
    )
}
