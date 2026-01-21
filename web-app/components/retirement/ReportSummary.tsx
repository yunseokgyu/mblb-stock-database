import { formatBilingual, formatCurrency } from "@/lib/utils/format"
import { generateProjectedGrowth, generateDividendGrowth } from "@/lib/analytics"
import { PortfolioGrowthChart } from "./charts/PortfolioGrowthChart"
import { DividendGrowthChart } from "./charts/DividendGrowthChart"
import { Scale, Timer, Percent, Wallet, TrendingUp, BarChart3, Quote } from "lucide-react"

interface ReportSummaryProps {
    targetAmount: string;
    yearsToRetire: number;
    expectedReturn: number;
}

export function ReportSummary({ targetAmount, yearsToRetire, expectedReturn }: ReportSummaryProps) {
    // Parse target amount safely
    const targetVal = parseInt(targetAmount.replace(/,/g, '')) || 0;

    // Generate Chart Data
    const growthData = generateProjectedGrowth(50000000, Math.ceil(yearsToRetire), expectedReturn);
    const dividendData = generateDividendGrowth(1500000, Math.ceil(yearsToRetire), 5.0); // Assume 1.5M KRW initial div, 5% growth

    return (
        <div className="mb-12 border-b-2 border-slate-100 pb-8 break-after-avoid">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {formatBilingual("요약", "Executive Summary")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-8 mb-8">
                <div className="p-6 bg-slate-50 rounded-lg border border-slate-100 shadow-sm flex flex-col justify-between">
                    <p className="text-slate-500 text-xs uppercase mb-2 font-semibold tracking-wider flex items-center gap-2">
                        <Timer className="w-4 h-4 text-slate-400" />
                        {formatBilingual("목표 달성 기간", "Time to Goal")}
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                        {yearsToRetire.toFixed(1)} <span className="text-lg font-normal text-slate-500">Years</span>
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-lg border border-slate-100 shadow-sm flex flex-col justify-between">
                    <p className="text-slate-500 text-xs uppercase mb-2 font-semibold tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        {formatBilingual("기대 수익률", "Exp. Annual Return")}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                        {expectedReturn}%
                    </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-lg border border-slate-100 shadow-sm flex flex-col justify-between">
                    <p className="text-slate-500 text-xs uppercase mb-2 font-semibold tracking-wider flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-slate-400" />
                        {formatBilingual("예상 최종 자산", "Projected Total")}
                    </p>
                    <p className="text-2xl font-bold text-slate-800 break-all">
                        {formatCurrency(targetVal)}
                    </p>
                </div>
            </div>

            {/* Comprehensive Charts Section */}
            <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-700 mb-4 border-l-4 border-primary pl-3 flex items-center gap-2">
                    {formatBilingual("자산 성장 & 배당 전망", "Comprehensive Market Outlook")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <h5 className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            {formatBilingual("포트폴리오 성장 시뮬레이션", "Portfolio Growth Simulation")}
                        </h5>
                        <PortfolioGrowthChart data={growthData} />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <h5 className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
                            <Wallet className="w-3 h-3" />
                            {formatBilingual("배당 소득 전망", "Dividend Income Projection")}
                        </h5>
                        <DividendGrowthChart data={dividendData} />
                    </div>
                </div>
            </div>

            {/* Expert Opinion Text Section */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden">
                <Quote className="absolute top-4 right-4 text-slate-200 w-16 h-16 opacity-20 rotate-180" />
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 relative z-10">
                    <Scale className="w-5 h-5 text-slate-600" />
                    {formatBilingual("전문가 종합 의견", "Expert Comprehensive Opinion")}
                </h4>
                <div className="text-sm text-slate-600 leading-relaxed text-justify space-y-4 font-medium relative z-10">
                    <p>
                        <span className="font-bold text-slate-800">1. 거시 경제 및 시장 전망 (Macro & Market Outlook):</span><br />
                        현재 글로벌 금융 시장은 인공지능(AI)과 디지털 전환이 주도하는 '제4차 산업혁명'의 가속화 구간에 진입해 있습니다. 고금리 기조가 완화될 조짐을 보이면서, 기술주(Technology) 중심의 성장 섹터는 다시 한번 밸류에이션 재평가(Re-rating) 국면을 맞이하고 있습니다. 동시에, 인구 고령화와 경제 불확실성에 대비한 현금 흐름의 중요성이 부각되면서 고배당주(Target Income)에 대한 수급 또한 견조하게 유지될 것으로 전망됩니다. 본 포트폴리오가 제시하는 자산 배분 전략은 이러한 '성장'과 '안정'의 균형점(Equilibrium)을 찾는 데 최적화되어 있습니다.
                    </p>
                    <p>
                        <span className="font-bold text-slate-800">2. 포트폴리오 전략 분석 (Portfolio Strategy):</span><br />
                        귀하의 포트폴리오는 시장 지배력이 입증된 'Mega-Cap' 성장주와 경기 방어적인 성격의 'Dividend Aristocrats(배당 귀족주)'를 6:4 비율로 혼합하여 설계되었습니다. 상단 그래프에서 확인할 수 있듯이, 초반 5년은 성장주의 주가 상승이 전체 자산 증식을 견인(Main Drive)하고, 은퇴 시점이 가까워질수록 배당금 재투자를 통한 복리 효과(Compound Interest Effect)가 자산 곡선을 기하급수적으로 끌어올리는 구조입니다. 이는 변동성 장세에서도 심리적 안정감을 제공하며, 장기적으로 시장 평균(S&P 500)을 상회하는 알파 수익률(Alpha Returns)을 추구합니다.
                    </p>
                    <p>
                        <span className="font-bold text-slate-800">3. 리스크 관리 및 제언 (Risk Management & Advice):</span><br />
                        비록 본 포트폴리오가 '안정성 점수(Safety Score)' 8.0 이상의 우량주 위주로 구성되었으나, 개별 기업 이슈나 지정학적 리스크로 인한 단기 변동성은 피할 수 없습니다. 따라서 '적립식 분할 매수(Dollar Cost Averaging)' 원칙을 준수하여 매입 단가를 평준화하는 것이 중요합니다. 또한, 연 1회 리밸런싱을 통해 목표 비중을 재조정하고, 기업의 펀더멘털 변화를 지속적으로 모니터링해야 합니다.
                    </p>
                    <p className="pt-4 border-t border-slate-200 text-slate-500 italic text-xs flex items-center gap-2">
                        <span className="font-bold">{formatBilingual("투자 설계 책임자", "Chief Investment Architect")}, Retirement Kingdom</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
