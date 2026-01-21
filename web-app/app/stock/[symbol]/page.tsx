import { checkUsageLimit } from '@/utils/usage'
import StockDetailClient from './stock-detail-client'
import PremiumBlocker from '@/components/PremiumBlocker'

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol: rawSymbol } = await params
    const symbol = rawSymbol.toUpperCase()
    const { allowed } = await checkUsageLimit()

    if (!allowed) {
        return (
            <div className="relative min-h-screen">
                {/* 
                  We show the client component BUT overlaid with Blocker.
                  Actually, showing the real data underneath consumes bandwidth/db for no reason if we want to block strictly.
                  Better pattern: Show a blurred preview or dummy data, or just the blocker.
                  For best Security/Performance, we do NOT fetch real data if blocked.
                */}
                <PremiumBlocker />

                {/* Optional: Show a blurred background of a "fake" dashboard to entice user */}
                <div className="filter blur-xl opacity-20 pointer-events-none" aria-hidden="true">
                    <StockDetailClient symbol={symbol} />
                </div>
            </div>
        )
    }

    return <StockDetailClient symbol={symbol} />
}
