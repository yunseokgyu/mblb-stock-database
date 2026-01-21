"use client"

import { useState, useEffect, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PaymentModal } from "@/components/retirement/PaymentModal"
import { ReportHeader } from "@/components/retirement/ReportHeader"
import { ReportSummary } from "@/components/retirement/ReportSummary"
import { ReportAnalysis } from "@/components/retirement/ReportAnalysis"
import Link from "next/link"
import { Crown, Shield, TrendingUp, Scale, Sparkles, FileText, Lock, Printer, Search, ArrowRight, Wand2, Download } from "lucide-react"

export default function RetirementPage() {
    const [stocks, setStocks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Inputs
    const [targetAmount, setTargetAmount] = useState("1,000,000,000") // 10억
    const [currentAssets, setCurrentAssets] = useState("50,000,000")  // 5천만
    const [monthlyContribution, setMonthlyContribution] = useState("2,000,000") // 200만/월 추가 납입
    const [strategy, setStrategy] = useState("stable")
    const [aiPrompt, setAiPrompt] = useState("")

    // Result
    const [portfolio, setPortfolio] = useState<any[]>([])
    const [isGenerated, setIsGenerated] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const [expectedReturn, setExpectedReturn] = useState(8.0)
    const [yearsToRetire, setYearsToRetire] = useState(12.4)

    // Refs for printing
    const contentRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `Retirement_Kingdom_Report_${new Date().toISOString().slice(0, 10)}`,
    })

    useEffect(() => {
        // Load data for curation
        fetch('/stock_data.json')
            .then(res => res.json())
            .then(data => {
                setStocks(data || [])
                setLoading(false)
            })
            .catch(err => console.error(err))
    }, [])

    const handleCurate = () => {
        setIsGenerated(false)
        calculateMetrics(strategy); // Calculate before generating
        let matchedStocks = []

        if (aiPrompt.trim().length > 0) {
            // "AI" Simulation: Keyword matching
            const prompt = aiPrompt.toLowerCase()

            if (prompt.includes("growth") || prompt.includes("fast") || prompt.includes("tech")) {
                matchedStocks = stocks.filter(s => s.sector === "Technology" || s.sector === "Consumer Cyclical")
                    .sort((a, b) => b.changes_percentage - a.changes_percentage)
            } else if (prompt.includes("safe") || prompt.includes("dividend") || prompt.includes("income")) {
                matchedStocks = stocks.filter(s => (s.valuation_metrics.div_yield_ttm || 0) > 2.0)
                    .sort((a, b) => (b.valuation_metrics.div_yield_ttm || 0) - (a.valuation_metrics.div_yield_ttm || 0))
            } else {
                // Default mixed
                matchedStocks = stocks.slice(0, 5)
            }
        } else {
            // Manual Strategy Selection logic
            if (strategy === "stable") {
                // Focus on Dividend Kings/Aristocrats & ETFs
                matchedStocks = stocks.filter(s =>
                    ["MMM", "KO", "JNJ", "PG", "O", "T", "MAIN", "SCHD", "JEPI", "VOO"].includes(s.symbol)
                )
            } else if (strategy === "growth") {
                // Focus on Tech & Growth
                matchedStocks = stocks.filter(s =>
                    ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", "QQQ"].includes(s.symbol)
                )
            } else {
                // Balanced
                matchedStocks = stocks.filter(s =>
                    ["AAPL", "MSFT", "O", "SCHD", "VOO"].includes(s.symbol)
                )
            }
        }

        // Pick top 5 matching
        setPortfolio(matchedStocks.slice(0, 5))
        setIsGenerated(true)
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Data...</div>

    // Helper to add commas
    const formatNumber = (num: string) => {
        return num.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    const calculateMetrics = (selectedStrategy: string) => {
        // 1. Determine Return Rate
        let rate = 0.08; // Balanced default
        if (selectedStrategy === "stable") rate = 0.06;
        if (selectedStrategy === "growth") rate = 0.12;

        setExpectedReturn(parseFloat((rate * 100).toFixed(1)));

        // 2. Parse Inputs
        const sv = parseInt(currentAssets.replace(/,/g, "")) || 0; // Starting Value
        const fv = parseInt(targetAmount.replace(/,/g, "")) || 0;  // Future Value
        const monthly = parseInt(monthlyContribution.replace(/,/g, "")) || 0;
        const annualContribution = monthly * 12;

        // 3. Calculate Years to Target (NPER Formula)
        // FV = PV * (1+r)^n + PMT * (((1+r)^n - 1) / r)
        // Solving for n: n = ln((FV * r + PMT) / (PV * r + PMT)) / ln(1 + r)

        if (sv >= fv) {
            setYearsToRetire(0);
            return;
        }

        const numerator = Math.log((fv * rate + annualContribution) / (sv * rate + annualContribution));
        const denominator = Math.log(1 + rate);
        const years = numerator / denominator;

        setYearsToRetire(parseFloat(years.toFixed(1)));
    }

    const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetAmount(formatNumber(e.target.value))
    }

    const handleAssetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentAssets(formatNumber(e.target.value))
    }

    const handleContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonthlyContribution(formatNumber(e.target.value))
    }

    const handleCurateClick = () => {
        handleCurate()
    }

    const handleViewReportClick = () => {
        setIsModalOpen(true)
    }

    return (
        <div className="container mx-auto p-6 space-y-8 relative max-w-6xl">
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPaymentSuccess={() => {
                    setIsPremium(true)
                    handleCurate()
                }}
            />

            <div className="text-center space-y-2 py-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="w-8 h-8 text-primary" strokeWidth={1.5} />
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Retirement Kingdom</h1>
                </div>
                <p className="text-slate-500 font-light">당신의 평안한 노후를 위한 맞춤형 포트폴리오를 설계해 드립니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left: Inputs */}
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="w-5 h-5 text-slate-500" />
                            나의 정보 입력
                        </CardTitle>
                        <CardDescription>목표 금액과 투자 성향을 알려주세요.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="targetAmount" className="text-xs uppercase text-slate-500 font-bold">은퇴 목표 자산 (원)</Label>
                                <Input
                                    id="targetAmount"
                                    type="text"
                                    placeholder="예: 1,000,000,000"
                                    value={targetAmount}
                                    onChange={handleTargetChange}
                                    className="h-12 text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currentAssets" className="text-xs uppercase text-slate-500 font-bold">현재 보유 자산 (원)</Label>
                                <Input
                                    id="currentAssets"
                                    type="text"
                                    placeholder="예: 50,000,000"
                                    value={currentAssets}
                                    onChange={handleAssetsChange}
                                    className="h-12 text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="monthlyContribution" className="text-xs uppercase text-slate-500 font-bold text-emerald-600">월 추가 적립금 (원)</Label>
                                <Input
                                    id="monthlyContribution"
                                    type="text"
                                    placeholder="예: 2,000,000"
                                    value={monthlyContribution}
                                    onChange={handleContributionChange}
                                    className="h-12 text-lg font-medium border-emerald-100 focus-visible:ring-emerald-500"
                                />
                                <p className="text-[10px] text-slate-400">매월 꾸준히 투자할 수 있는 금액을 입력하세요.</p>
                            </div>
                        </div>

                        <Tabs defaultValue="select" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 h-10 bg-slate-100">
                                <TabsTrigger value="select" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">성향 선택</TabsTrigger>
                                <TabsTrigger value="ai" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI 프롬프트</TabsTrigger>
                            </TabsList>

                            <TabsContent value="select" className="space-y-4 pt-4">
                                <RadioGroup value={strategy} onValueChange={setStrategy} className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setStrategy("stable")}>
                                        <RadioGroupItem value="stable" id="r1" />
                                        <div className="flex-1 cursor-pointer">
                                            <Label htmlFor="r1" className="cursor-pointer font-medium flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-emerald-500" />
                                                안정형 (Stable)
                                            </Label>
                                            <p className="text-xs text-slate-500 mt-0.5">배당 귀족주 및 ETF 위주</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setStrategy("growth")}>
                                        <RadioGroupItem value="growth" id="r2" />
                                        <div className="flex-1 cursor-pointer">
                                            <Label htmlFor="r2" className="cursor-pointer font-medium flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                                성장형 (Growth)
                                            </Label>
                                            <p className="text-xs text-slate-500 mt-0.5">기술주 및 고성장주 위주</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setStrategy("balanced")}>
                                        <RadioGroupItem value="balanced" id="r3" />
                                        <div className="flex-1 cursor-pointer">
                                            <Label htmlFor="r3" className="cursor-pointer font-medium flex items-center gap-2">
                                                <Scale className="w-4 h-4 text-purple-500" />
                                                균형형 (Balanced)
                                            </Label>
                                            <p className="text-xs text-slate-500 mt-0.5">성장과 배당의 조화</p>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </TabsContent>

                            <TabsContent value="ai" className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Wand2 className="w-4 h-4 text-primary" />
                                        원하는 투자 스타일
                                    </Label>
                                    <Textarea
                                        placeholder="예: 나는 30대이고 공격적인 투자를 원해. 하지만 배당금도 조금 나오면 좋겠어."
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        className="h-32 resize-none"
                                    />
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> AI가 텍스트를 분석하여 종목을 추천합니다.
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <Button className="w-full text-lg h-12 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" size="lg" onClick={handleCurateClick}>
                            <Sparkles className="w-5 h-5" />
                            포트폴리오 생성하기
                        </Button>
                    </CardContent>
                </Card>

                {/* Right: Results - Simple Summary */}
                <div className={`transition-all duration-500 ${isGenerated ? 'opacity-100 translate-y-0' : 'opacity-100'}`}>
                    <Card className={`border-2 ${isGenerated ? 'border-primary/20' : 'border-slate-100'} h-full shadow-sm`}>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Search className="w-5 h-5 text-slate-500" />
                                포트폴리오 요약
                            </CardTitle>
                            <CardDescription>
                                {isGenerated ? (
                                    <span>{aiPrompt ? "AI 분석 결과" : (strategy === "stable" ? "안정성 중심 포트폴리오" : "성장성 중심 포트폴리오")}</span>
                                ) : (
                                    "정보 입력 후 생성 버튼을 눌러주세요."
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!isGenerated ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-slate-300 gap-4">
                                    <Sparkles className="w-16 h-16 opacity-20" />
                                    <p className="text-sm font-light">결과가 여기에 표시됩니다.</p>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                                    <div className="p-6 bg-slate-50 rounded-xl text-center border border-slate-100">
                                        <p className="font-semibold text-xs uppercase text-slate-500 mb-2">예상 재정적 자유 달성 기간</p>
                                        <p className="text-4xl font-bold text-slate-900 my-1 font-serif">{yearsToRetire}<span className="text-lg font-sans text-slate-500 ml-1">Years</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-xs uppercase text-slate-500 mb-2 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            구성 종목 (TOP 5)
                                        </h3>
                                        <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                                            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                                                {portfolio.map((stock, i) => (
                                                    <Link href={`/stock/${stock.symbol}`} key={i} className="block transition-all hover:bg-slate-50">
                                                        <div className="flex justify-between items-center p-3 border-b last:border-0 border-slate-100">
                                                            <div className="flex items-center gap-3">
                                                                <Badge variant="outline" className="h-6 w-6 flex justify-center items-center p-0 rounded-full border-slate-200 bg-slate-50 text-slate-500 text-xs">{i + 1}</Badge>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 flex items-center gap-1">
                                                                        {stock.symbol}
                                                                        <ArrowRight className="w-3 h-3 text-slate-300 -rotate-45" />
                                                                    </div>
                                                                    <div className="text-[10px] text-slate-400">{stock.name}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className={`font-bold text-sm ${stock.changes_percentage >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                                    {stock.changes_percentage >= 0 ? '+' : ''}{stock.changes_percentage.toFixed(2)}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 text-center">
                                        <p className="text-xs text-slate-400 flex items-center justify-center gap-1 animate-bounce">
                                            <ArrowRight className="w-3 h-3 rotate-90" />
                                            아래로 스크롤하여 상세 보고서를 확인하세요
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom: Expert Report (Gatekept) */}
            {
                isGenerated && (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 pt-10 pb-20">
                        {!isPremium ? (
                            /* Gated View Button */
                            <Card className="border-2 border-dashed border-slate-200 max-w-4xl mx-auto bg-slate-50/50">
                                <CardContent className="flex flex-col items-center justify-center py-24 space-y-8">
                                    <div className="bg-white p-8 rounded-full shadow-xl shadow-slate-200 ring-1 ring-slate-100">
                                        <FileText className="w-16 h-16 text-slate-800" strokeWidth={1} />
                                    </div>
                                    <div className="text-center space-y-3">
                                        <h2 className="text-2xl font-bold text-slate-900">전문가 상세 분석 리포트</h2>
                                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                                            종목 선정 이유, 재무 안정성 분석, 그리고 AI 기반의 적정 주가 평가를 포함한
                                            프리미엄 리포트를 확인하세요.
                                        </p>
                                    </div>
                                    <Button size="lg" className="px-10 py-6 text-lg shadow-xl shadow-primary/20 gap-2 hover:scale-105 transition-transform" onClick={handleViewReportClick}>
                                        <Lock className="w-5 h-5" />
                                        전문가 리포트 확인하기 (Premium)
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            /* Full Report View (Existing Code) */
                            <div className="max-w-4xl mx-auto space-y-6">
                                {/* Actions Bar */}
                                <div className="flex justify-end gap-3 print:hidden">
                                    <Button variant="outline" className="gap-2" onClick={() => handlePrint()}>
                                        <Printer className="w-4 h-4" />
                                        인쇄 (Print)
                                    </Button>
                                    <Button variant="outline" className="gap-2" onClick={() => handlePrint()}>
                                        <Download className="w-4 h-4" />
                                        PDF 저장
                                    </Button>
                                </div>

                                {/* Printable Report Area */}
                                <Card className="border-0 shadow-2xl bg-white overflow-hidden print:shadow-none min-h-[1100px]" ref={contentRef}>
                                    {/* Report Header (Paper Style) */}
                                    <ReportHeader
                                        isPremium={isPremium}
                                        date={new Date().toLocaleDateString()}
                                    />

                                    <CardContent className="p-10 lg:p-14 min-h-[1000px]">
                                        {/* Executive Summary */}
                                        <ReportSummary
                                            targetAmount={targetAmount}
                                            yearsToRetire={yearsToRetire}
                                            expectedReturn={expectedReturn}
                                        />

                                        {/* Detailed Analysis */}
                                        <ReportAnalysis
                                            portfolio={portfolio}
                                            isPremium={isPremium}
                                            onUnlock={() => setIsModalOpen(true)}
                                        />

                                        <div className="mt-20 pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 break-before-avoid">
                                            <div className="flex items-center gap-1">
                                                <Crown className="w-3 h-3 text-slate-300" />
                                                <span>Retirement Kingdom © 2026</span>
                                            </div>
                                            <div className="font-serif italic font-light">"Compound interest is the eighth wonder of the world."</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )
            }
        </div >
    )
}
