import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import PaymentButton from "@/components/PaymentButton"
import { createClient } from "@/utils/supabase/server"

export default async function PricingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if user is already premium
    let isPremium = false
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single()
        isPremium = profile?.is_premium || false
    }

    return (
        <div className="min-h-screen bg-background py-20 px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
                    심플한 가격 정책
                </h1>
                <p className="text-lg text-muted-foreground">
                    복잡한 구독 없이, 합리적인 가격으로 데이터를 무제한 이용하세요.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Free Plan */}
                <div className="relative rounded-2xl border bg-card p-8 shadow-sm flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold">Free</h3>
                        <p className="text-sm text-muted-foreground mt-2">주식 데이터 찍먹하기</p>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-bold">₩0</span>
                            <span className="text-muted-foreground ml-1">/ forever</span>
                        </div>
                    </div>
                    <ul className="mb-8 space-y-4 flex-1">
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>일일 3종목 상세 조회</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-green-500" />
                            <span>S&P 500 마켓맵 조회</span>
                        </li>
                        <li className="flex items-center gap-3 text-muted-foreground">
                            <X className="h-5 w-5" />
                            <span>무제한 조회</span>
                        </li>
                        <li className="flex items-center gap-3 text-muted-foreground">
                            <X className="h-5 w-5" />
                            <span>헤지펀드 포트폴리오</span>
                        </li>
                    </ul>
                    <Button disabled variant="outline" className="w-full">
                        현재 이용 중
                    </Button>
                </div>

                {/* Premium Plan */}
                <div className="relative rounded-2xl border border-blue-500 bg-slate-900/50 p-8 shadow-xl flex flex-col">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                    </div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-blue-400">Premium</h3>
                        <p className="text-sm text-muted-foreground mt-2">성장하는 투자자</p>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-bold">₩9,900</span>
                            <span className="text-muted-foreground ml-1 text-sm">(1회)</span>
                        </div>
                    </div>
                    <ul className="mb-8 space-y-4 flex-1">
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-blue-500" />
                            <span>무제한 종목 조회</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-blue-500" />
                            <span>배당킹 & 성장주 분석</span>
                        </li>
                        <li className="flex items-center gap-3 text-muted-foreground">
                            <X className="h-5 w-5" />
                            <span>헤지펀드 포트폴리오</span>
                        </li>
                    </ul>

                    {isPremium ? (
                        <Button disabled className="w-full bg-green-600 text-white">이용 중</Button>
                    ) : (
                        <PaymentButton
                            userEmail={user?.email}
                            userId={user?.id}
                            amount={9900}
                            planName="Premium"
                            targetTier="premium"
                        />
                    )}
                </div>

                {/* Super Premium Plan */}
                <div className="relative rounded-2xl border border-purple-500 bg-gradient-to-b from-slate-900 to-purple-900/20 p-8 shadow-2xl flex flex-col scale-105 z-10">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        Ultimate
                    </div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-purple-400">Super Premium</h3>
                        <p className="text-sm text-muted-foreground mt-2">전문가 수준의 데이터</p>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-bold">₩165,000</span>
                            <span className="text-muted-foreground ml-1 text-sm">(평생)</span>
                        </div>
                    </div>
                    <ul className="mb-8 space-y-4 flex-1">
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-purple-500" />
                            <span><strong className="text-white">Premium 모든 기능</strong></span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-purple-500" />
                            <span><strong className="text-white">헤지펀드 투자 내역</strong> (오픈 예정)</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-purple-500" />
                            <span>VIP 전용 리포트</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-purple-500" />
                            <span>평생 이용권</span>
                        </li>
                    </ul>

                    <PaymentButton
                        userEmail={user?.email}
                        userId={user?.id}
                        amount={165000}
                        planName="Super Premium"
                        targetTier="super_premium"
                    />
                </div>
            </div>
        </div>
    )
}
