import { Badge } from "@/components/ui/badge"
import { formatBilingual, formatCurrency } from "@/lib/utils/format"
import { calculateSafetyScore, calculateTargetPrice, getSectorBilingual, calculateValuationMultiples, generateGrowthHistory } from "@/lib/analytics"
import { getCompanyProfile } from "@/lib/company_profiles"
import { FinancialAnalysis } from "./FinancialAnalysis"
import { StockHistoryChart } from "./charts/StockHistoryChart"
import { ValuationChart } from "./charts/ValuationChart"
import Link from "next/link"
import { Lock, Sparkles, TrendingUp, TrendingDown, Target, ShieldCheck, BrainCircuit, CheckCircle2, BarChart3, Building2, History, Briefcase, FileBarChart } from "lucide-react"
import { STOCK_REPORT_DATA } from "@/lib/data/report-content"

interface ReportAnalysisProps {
    portfolio: any[];
    isPremium: boolean;
    onUnlock: () => void;
}

export function ReportAnalysis({ portfolio, isPremium, onUnlock }: ReportAnalysisProps) {
    return (
        <div className="space-y-12">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                {formatBilingual("자산 상세 분석", "Asset Allocation & Analysis")}
                <div className="h-px bg-slate-200 flex-1"></div>
            </h3>

            {portfolio.map((stock, i) => {
                const isDividend = (stock.valuation_metrics?.div_yield_ttm || 0) > 1.0;
                const safetyScore = calculateSafetyScore(stock);
                const targetData = calculateTargetPrice(stock);

                // New Analytics Data
                const valuationResult = calculateValuationMultiples(stock);
                const historyData = generateGrowthHistory(stock);

                // Logic for "Reasoning" text (Target Price Rationale)
                let reason = "";
                if (STOCK_REPORT_DATA[stock.symbol]) {
                    reason = STOCK_REPORT_DATA[stock.symbol].reason;
                } else {
                    reason = `${formatBilingual("목표 주가 분석", "Target Price Analysis")}: ${stock.sector} 섹터의 성장 잠재력과 현재 주가 대비 **${targetData.upside}%의 상승 여력**을 기반으로, 펀더멘털 대비 **매력적인 밸류에이션** 구간으로 분석됩니다.`;
                }

                // Logic for "Stability" text based on Safety Score (Safety Score Rationale)
                const divYield = (stock.valuation_metrics?.div_yield_ttm || 0).toFixed(2);
                let stability = "";

                if (STOCK_REPORT_DATA[stock.symbol]) {
                    stability = STOCK_REPORT_DATA[stock.symbol].stability;
                } else {
                    stability = safetyScore >= 8.0
                        ? `${formatBilingual("안정성 점수 분석", "Safety Score Analysis")}: **${safetyScore.toFixed(1)}점의 높은 안정성 점수**는 강력한 재무 건전성과 주주 환원 정책을 반영하며, 장기 투자에 적합한 **초우량 등급**을 나타냅니다.`
                        : safetyScore >= 6.0
                            ? `${formatBilingual("안정성 점수 분석", "Safety Score Analysis")}: **${safetyScore.toFixed(1)}점의 안정성 점수**는 양호한 이익 체력과 재무 구조를 의미하며, 업종 평균 수준의 **견고한 펀더멘털**을 보유하고 있습니다.`
                            : `${formatBilingual("안정성 점수 분석", "Safety Score Analysis")}: **${safetyScore.toFixed(1)}점의 안정성 점수**는 부채 비율 관리나 이익 변동성 모니터링이 필요함을 시사하며, 향후 **재무 구조 개선** 여부가 중요합니다.`;
                }

                return (
                    <div key={i} className="break-inside-avoid pb-12 border-b border-slate-200 last:border-0">
                        {/* Top Section: Split Layout */}
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            {/* Stock Header Left (1/3) */}
                            <div className="w-full md:w-1/3 border-r border-slate-100 pr-4">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <Link href={`/stock/${stock.symbol}`} className="hover:text-primary hover:underline decoration-2 underline-offset-4 transition-all">
                                        <span className="text-3xl font-bold text-slate-900 hover:text-primary">{stock.symbol}</span>
                                    </Link>
                                    <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500">
                                        {getSectorBilingual(stock.sector)}
                                    </Badge>
                                </div>
                                <div className="text-sm text-slate-500 font-medium mb-4">{stock.name}</div>

                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="text-3xl font-light text-slate-800">${stock.price.toFixed(2)}</div>
                                    <div className={`text-sm font-medium mt-1 mb-2 flex items-center gap-1 ${stock.changes_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stock.changes_percentage >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {Math.abs(stock.changes_percentage).toFixed(2)}%
                                        <span className="text-slate-400 text-xs font-normal ml-1">(1D)</span>
                                    </div>
                                    {/* Stock History Chart */}
                                    <StockHistoryChart data={historyData} color={stock.changes_percentage >= 0 ? "#10B981" : "#EF4444"} />
                                    <p className="text-[10px] text-zinc-400 text-center mt-1">Simulated 10Y Trend</p>
                                </div>
                            </div>

                            {/* Analysis Right (2/3) */}
                            <div className="w-full md:w-2/3 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
                                    <div className="border-l-4 border-slate-800 pl-4 py-3 bg-slate-50/50 rounded-r-lg flex flex-col h-full justify-start">
                                        <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                                            <Target className="w-3 h-3" /> {formatBilingual("투자 포인트", "Investment Thesis")}
                                        </p>
                                        <p className="text-slate-700 text-sm leading-relaxed font-medium flex-1">{reason}</p>
                                    </div>
                                    <div className="border-l-4 border-emerald-400 pl-4 py-3 bg-emerald-50/30 rounded-r-lg flex flex-col h-full justify-start">
                                        <p className="text-[10px] font-bold text-emerald-600 mb-2 uppercase tracking-wider flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> {formatBilingual("리스크 및 안정성", "Risk & Stability")}
                                        </p>
                                        <p className="text-slate-700 text-sm leading-relaxed flex-1">{stability}</p>
                                    </div>
                                </div>

                                {/* Premium Analytics Area */}
                                {!isPremium ? (
                                    <div className="mt-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-6 flex justify-between items-center group cursor-pointer hover:bg-slate-100 transition-colors" onClick={onUnlock}>
                                        <div className="flex items-center gap-4 opacity-40 grayscale blur-[2px]">
                                            <div className="space-y-2">
                                                <div className="flex gap-4">
                                                    <div className="h-12 w-24 bg-slate-400 rounded-md"></div>
                                                    <div className="h-12 w-24 bg-slate-400 rounded-md"></div>
                                                </div>
                                                <div className="h-4 w-64 bg-slate-300 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="text-right z-10">
                                            <p className="text-sm font-bold text-purple-600 flex items-center gap-2 justify-end mb-1">
                                                <Lock className="w-4 h-4" />
                                                <span>PREMIUM ANALYTICS</span>
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {formatBilingual("심층 분석 잠금 해제", "Unlock Advanced Metrics")}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 bg-purple-50 border border-purple-100 rounded-lg p-5">
                                        <div className="flex justify-between items-center mb-4 border-b border-purple-100 pb-2">
                                            <span className="text-xs font-bold text-purple-700 tracking-wider flex items-center gap-2">
                                                <Sparkles className="w-3 h-3" />
                                                {formatBilingual("AI 가치평가 및 전망", "AI Valuation & Forecast")}
                                            </span>
                                            <Badge className="bg-purple-600 hover:bg-purple-700 text-[10px] gap-1 px-2 border-0">
                                                <CheckCircle2 className="w-3 h-3" /> VERIFIED
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 print:grid-cols-2 gap-5">
                                            {/* AI Valuation Charts */}
                                            <div className="space-y-4">
                                                <p className="text-[10px] text-purple-900/60 uppercase font-bold flex items-center gap-2 tracking-wider">
                                                    <BarChart3 className="w-3.5 h-3.5" />
                                                    {formatBilingual("멀티 모델 가치평가 분석", "Multi-Model Valuation Analysis")}
                                                </p>
                                                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm h-[260px]">
                                                    <ValuationChart
                                                        currentPrice={stock.price}
                                                        dcf={valuationResult.dcf}
                                                        pe={valuationResult.pe}
                                                        evebitda={valuationResult.evebitda}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="bg-white/60 rounded-lg p-2.5 border border-purple-100 shadow-sm text-center">
                                                        <p className="text-[9px] text-slate-400 mb-1 font-semibold uppercase">Cash Flow</p>
                                                        <p className="text-sm font-bold text-slate-700">${valuationResult.dcf.toFixed(0)}</p>
                                                    </div>
                                                    <div className="bg-white/60 rounded-lg p-2.5 border border-purple-100 shadow-sm text-center">
                                                        <p className="text-[9px] text-slate-400 mb-1 font-semibold uppercase">P/E Ratio</p>
                                                        <p className="text-sm font-bold text-slate-700">${valuationResult.pe.toFixed(0)}</p>
                                                    </div>
                                                    <div className="bg-white/60 rounded-lg p-2.5 border border-purple-100 shadow-sm text-center">
                                                        <p className="text-[9px] text-slate-400 mb-1 font-semibold uppercase">EV/EBITDA</p>
                                                        <p className="text-sm font-bold text-slate-700">${valuationResult.evebitda.toFixed(0)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Data & Opinion */}
                                            <div className="flex flex-col gap-4 h-full">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden">
                                                        <div className="flex justify-between items-start z-10 w-full">
                                                            <div className="flex flex-col leading-none gap-0.5">
                                                                <span className="text-[9px] text-slate-600 font-bold uppercase whitespace-nowrap">목표 주가 (1년)</span>
                                                                <span className="text-[7px] text-slate-400 font-bold tracking-wider uppercase">TARGET PRICE 1Y</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-lg md:text-xl font-bold text-emerald-600 tracking-tight z-10 text-right mt-auto">${targetData.price}</p>
                                                    </div>
                                                    <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden">
                                                        <div className="flex justify-between items-start z-10 w-full">
                                                            <div className="flex flex-col leading-none gap-0.5">
                                                                <span className="text-[9px] text-slate-600 font-bold uppercase whitespace-nowrap">안정성 점수</span>
                                                                <span className="text-[7px] text-slate-400 font-bold tracking-wider uppercase">SAFETY SCORE</span>
                                                            </div>
                                                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ml-1 ${safetyScore >= 8 ? 'bg-emerald-500' : safetyScore >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                                        </div>
                                                        <div className="flex items-baseline justify-end gap-1 z-10 mt-auto">
                                                            <p className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{safetyScore.toFixed(1)}</p>
                                                            <span className="text-[9px] font-medium text-slate-400">/ 10</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-white to-purple-50/50 p-5 rounded-xl border border-purple-100 shadow-sm flex-1 flex flex-col relative">
                                                    <Sparkles className="absolute top-4 right-4 w-4 h-4 text-purple-200" />
                                                    <p className="text-[10px] text-purple-900/60 uppercase font-bold mb-3 flex items-center gap-1.5">
                                                        <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />
                                                        {formatBilingual("AI 종합 의견", "AI Opinion")}
                                                    </p>
                                                    <div className="flex-1 flex items-center">
                                                        <p className="text-[13px] text-slate-700 leading-6 font-medium break-keep text-justify">
                                                            {safetyScore >= 8.0
                                                                ? `현재 주가는 강력한 매수 구간입니다. 안정성 점수가 ${safetyScore.toFixed(1)}점으로 매우 높은 이유는 압도적인 현금 흐름 창출 능력과 낮은 부채 비율 때문입니다. 가치평가 모델 상 상승 여력이 충분합니다.`
                                                                : safetyScore >= 6.0
                                                                    ? `안정성 점수가 ${safetyScore.toFixed(1)}점으로 양호합니다. 견고한 펀더멘털을 보유하고 있으나, 밸류에이션(P/E) 부담으로 인해 점수가 일부 조정되었습니다. 장기 보유 관점에서 긍정적입니다.`
                                                                    : `현재 안정성 점수는 ${safetyScore.toFixed(1)}점입니다. 성장 잠재력은 높으나 이익 변동성이 크고 재무 건전성 개선이 필요하여 점수가 다소 낮게 책정되었습니다. 분할 매수로 리스크를 관리하세요.`
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Full Width Company Overview Section (Premium Only) */}
                        {isPremium && (
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    {formatBilingual("기업 개요 및 재무 현황", "Company Overview & Financials")}
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* History Card */}
                                    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                                        <h5 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 rounded-md">
                                                <History className="w-4 h-4 text-slate-500" />
                                            </div>
                                            {formatBilingual("기업 연혁", "History")}
                                        </h5>
                                        <p className="text-[15px] text-slate-600 leading-7 text-justify break-keep tracking-tight">
                                            {getCompanyProfile(stock.symbol).history_ko}
                                        </p>
                                    </div>

                                    {/* Business Card */}
                                    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                                        <h5 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 rounded-md">
                                                <Briefcase className="w-4 h-4 text-slate-500" />
                                            </div>
                                            {formatBilingual("주요 사업 분야", "Business Overview")}
                                        </h5>
                                        <p className="text-[15px] text-slate-600 leading-7 text-justify break-keep tracking-tight">
                                            {getCompanyProfile(stock.symbol).business_ko}
                                        </p>
                                    </div>
                                </div>

                                {/* 5-Year Financial Chart - Full Width */}
                                <div className="mt-6 h-[400px]">
                                    <FinancialAnalysis stock={stock} />
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
