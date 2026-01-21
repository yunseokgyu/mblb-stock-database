
export const MOCK_FUNDS = [
    {
        id: "berkshire-hathaway",
        name: "Berkshire Hathaway",
        strategy: "Value / Conglomerate",
        description: "Warren Buffett's holding company, focusing on long-term value investing in high-quality companies with moats.",
        holdings: [
            {
                symbol: "AAPL", name: "Apple Inc.", shares: 915560382, value: 174300000000, avg_buy_price: 35.40, sector: "Technology", changes_percentage: 1.2, first_added: "2016-01-01",
                moat: "Wide", dividend_yield_on_cost: 2.8, current_dividend_yield: 0.5, intrinsic_value: 210.00,
                entry_pe: 10.5, current_pe: 28.5,
                entry_dps: 0.52, current_dps: 1.00, // Split adjusted
                ai_analysis: `1. 가격 변동 (Price Evolution):
2016년 진입 당시 $35.40 수준이었던 주가는 현재 $190.50으로 약 5.4배 상승했습니다. 이는 단순한 하드웨어 판매를 넘어 서비스 매출 비중 확대와 강력한 생태계(Ecosystem) 구축이 만들어낸 결과입니다.

2. 가치 평가 (Valuation):
진입 당시 PER 10.5배라는 믿기 힘든 저평가 상태에서 현재 28.5배로 재평가(Re-rating)되었습니다. 시장이 애플을 단순 제조업체가 아닌 필수 소비재이자 럭셔리 브랜드로 인식하게 되었습니다.

3. 주주 환원 (Shareholder Yield):
애플의 진정한 강점은 배당보다는 자사주 매입(Buyback)에 있습니다. 매년 천문학적인 규모의 자사주 소각을 통해 주당 가치를 강제로 높이고 있으며, 배당금 또한 꾸준히 증액하고 있습니다.`
            },
            {
                symbol: "BAC", name: "Bank of America", shares: 1032852006, value: 34700000000, avg_buy_price: 28.50, sector: "Financial Services", changes_percentage: -0.5, first_added: "2011-08-01",
                moat: "Narrow", dividend_yield_on_cost: 3.5, current_dividend_yield: 2.9, intrinsic_value: 42.00,
                entry_pe: 9.8, current_pe: 11.5,
                entry_dps: 0.04, current_dps: 0.96,
                ai_analysis: `1. 턴어라운드 (Turnaround):
금융위기 이후 최악의 시기에 진입하여, 경영 정상화와 금리 상승기의 수헤를 모두 누렸습니다. 진입가는 다소 높게 책정되었으나(우선주 전환 고려시 실제 평단은 더 낮음), 안정적인 이익 창출 능력을 회복했습니다.

2. 저평가 매력 (Valuation):
PER 11.5배 수준으로 여전히 시장 대비 저평가되어 있습니다. 이는 금융주 특유의 디스카운트가 적용된 것이나, 안정적인 현금 창출원으로서의 매력은 여전합니다.

3. 배당 정상화 (Dividend Growth):
가장 눈에 띄는 변화는 배당의 부활입니다. 진입 당시 주당 $0.04에 불과했던 배당금은 현재 $0.96으로 24배 증가했습니다. 위기를 극복하고 주주 환원을 정상화시킨 대표적인 사례입니다.`
            },
            {
                symbol: "AXP", name: "American Express", shares: 151610700, value: 28400000000, avg_buy_price: 8.49, sector: "Financial Services", changes_percentage: 0.8, first_added: "1991-01-01",
                moat: "Wide", dividend_yield_on_cost: 25.4, current_dividend_yield: 1.2, intrinsic_value: 230.00,
                entry_pe: 12.0, current_pe: 18.5,
                entry_dps: 0.20, current_dps: 2.80,
                ai_analysis: `1. 초장기 투자 (Long-term Hold):
1991년 진입 이후 30년 넘게 보유 중인 대표적인 장기 투자 종목입니다. 진입가 $8.49 대비 현재가는 $230을 상회하며, 브랜드 자체가 해자(Moat)가 되는 비즈니스 모델을 증명했습니다.

2. 네트워크 효과 (Network Effect):
고소득층 위주의 고객 기반과 폐쇄형 네트워크는 불황에도 강한 방어력을 보여줍니다. PER 18.5배는 핀테크 경쟁 심화에도 불구하고 굳건한 시장 지배력을 반영합니다.

3. 현금 흐름 (Cash Flow):
현재 주당 배당금은 $2.80으로, 진입 가격($8.49) 대비 배당만으로 매년 33%의 수익을 올리고 있습니다. 투자 원금은 이미 배당으로 수십 번 회수되었으며, 복리 효과의 교과서 같은 사례입니다.`
            },
            {
                symbol: "KO", name: "Coca-Cola", shares: 400000000, value: 23500000000, avg_buy_price: 3.25, sector: "Consumer Defensive", changes_percentage: 0.2, first_added: "1988-01-01",
                moat: "Wide", dividend_yield_on_cost: 54.0, current_dividend_yield: 3.1, intrinsic_value: 65.00,
                entry_pe: 15.5, current_pe: 24.2,
                entry_dps: 0.07, current_dps: 1.94, // Adjusted for splits, illustrative
                ai_analysis: `1. 가격 변동 (Price Evolution): 
1988년 진입 당시 $3.25에 불과했던 주가는 현재 $74.50으로 상승하여 약 22.9배(Bagger)의 경이로운 수익률을 기록했습니다. 이는 단순한 주가 상승을 넘어, 위기 속에서도 꾸준히 우상향하는 필수 소비재의 강력한 가격 결정력(Pricing Power)을 입증합니다.

2. 가치 평가 (Valuation):
진입 시점의 PER 15.5배는 합리적인 저평가 구간이었으나, 현재 PER 24.2배로 밸류에이션이 확장(Re-rating)되었습니다. 이는 코카콜라의 브랜드 해자(Moat)와 이익의 질이 시장에서 더 높은 프리미엄으로 재평가받았음을 의미합니다.

3. 배당 성장 (Dividend Growth):
가장 놀라운 점은 배당의 복리 효과입니다. 진입 당시 1주당 배당금(Entry DPS)은 $0.07에 불과했으나, 현재는 $1.94로 약 27배 성장했습니다. 특히 진입 가격이 $3.25에 불과했기 때문에, 현재 받는 배당금($1.94)만으로도 투자 원금 대비 배당률(Yield on Cost)은 59.7%에 달합니다. 이는 매년 원금의 절반 이상을 배당으로만 회수하는 '황금알을 낳는 거위'가 되었음을 의미합니다.`
            },
            {
                symbol: "CVX", name: "Chevron", shares: 126093326, value: 18600000000, avg_buy_price: 140.20, sector: "Energy", changes_percentage: -1.2, first_added: "2020-10-01",
                moat: "Narrow", dividend_yield_on_cost: 4.5, current_dividend_yield: 4.1, intrinsic_value: 160.00,
                entry_pe: 14.2, current_pe: 12.8,
                entry_dps: 5.16, current_dps: 6.04,
                ai_analysis: `1. 에너지 헷지 (Energy Hedge):
비교적 최근인 2020년에 진입한 종목으로, 인플레이션과 유가 상승에 대한 헷지 수단으로 작용합니다. 진입가 $140.20 대비 큰 시세 차익보다는 안정성을 중시한 베팅입니다.

2. 낮은 밸류에이션 (Low Valuation):
PER 12.8배는 시장 평균 대비 낮지만, 이는 에너지 섹터의 변동성을 반영한 것입니다. 하지만 현금 창출 능력만큼은 탁월합니다.

3. 고배당 매력 (High Yield):
초기부터 높은 배당 수익률을 보고 진입했습니다. Entry DPS $5.16에서 현재 $6.04로 견조하게 성장 중이며, 현재 배당률 4%대는 채권 이상의 매력을 제공합니다.`
            },
            {
                symbol: "O", name: "Realty Income", shares: 3000000, value: 150000000, avg_buy_price: 52.10, sector: "Real Estate", changes_percentage: 0.5, first_added: "2023-11-01",
                moat: "None", dividend_yield_on_cost: 6.2, current_dividend_yield: 5.8, intrinsic_value: 58.00,
                entry_pe: 40.5, current_pe: 38.2, // REITs use P/FFO usually, but using PE field for simplicity or mock P/FFO
                entry_dps: 3.00, current_dps: 3.15,
                ai_analysis: `1. 월배당 (Monthly Dividend):
'The Monthly Dividend Company'라는 별명답게 매월 안정적인 현금?름을 창출합니다. 최근 진입(2023)하여 아직 극적인 배당 성장은 없으나, 예측 가능한 수익원이 됩니다.

2. 부동산 방어주 (Defensive):
리테일 부동산 위주의 포트폴리오는 경기 침체기에도 공실률이 낮아 안정적입니다. 진입 시점 대비 주가 변동은 크지 않으나, 5% 후반대의 배당률이 하방을 지지합니다.

3. 배당 지속성:
꾸준한 임대료 인상(Rent Escalation)을 통해 배당금을 늘려가고 있습니다. 성장은 느리지만 확실한 '거북이' 전략입니다.`
            },
            {
                symbol: "KR", name: "Kroger", shares: 50000000, value: 2300000000, avg_buy_price: 42.80, sector: "Consumer Defensive", changes_percentage: 0.1, first_added: "2019-10-01",
                moat: "Narrow", dividend_yield_on_cost: 2.5, current_dividend_yield: 2.1, intrinsic_value: 55.00,
                entry_pe: 13.5, current_pe: 16.2,
                entry_dps: 0.64, current_dps: 1.15,
                ai_analysis: `1. 필수 소비재 (Staples):
미국 최대 슈퍼마켓 체인으로, 경기와 무관하게 매출이 발생하는 전형적인 방어주입니다. 팬데믹 기간 동안 그 가치가 증명되었습니다.

2. 합리적 가격 (Fair Value):
진입 당시 PER 13.5배의 합리적인 가격에 매수했습니다. 식료품 유통업은 마진이 박하지만, 규모의 경제를 통해 경쟁 우위를 확보하고 있습니다.

3. 숨겨진 배당 성장:
화려하진 않지만 지난 5년간 배당금을 $0.64에서 $1.15로 2배 가까이 늘렸습니다. 조용히 주주 환원을 늘려가는 알짜 기업입니다.`
            }
        ],
        history: [
            {
                year: 1988,
                symbol: "KO",
                name: "Coca-Cola",
                entry_date: "1988-01-01",
                entry_price: 3.25, // Adjusted for splits
                entry_valuation: 1300000000, // $1.3 Billion investment
                exit_date: null,
                exit_price: 74.50,
                exit_valuation: 23500000000,
                return_pct: 1700,
                profit_usd: 22200000000,
                status: "Held",
                moat: "Wide",
                entry_pe: 15.5,
                current_pe: 24.2
            },
            {
                year: 1973,
                symbol: "WPO",
                name: "The Washington Post",
                entry_date: "1973-01-01",
                entry_price: 6.15,
                entry_valuation: 11000000,
                exit_date: "2014-01-01",
                exit_price: 0,
                exit_valuation: 1200000000, // Exited via asset swap
                return_pct: 9000,
                profit_usd: 1100000000,
                status: "Exited",
                moat: "Wide"
            },
            {
                year: 2016,
                symbol: "AAPL",
                name: "Apple Inc.",
                entry_date: "2016-01-01",
                entry_price: 29.00, // Split adjusted
                entry_valuation: 1000000000,
                exit_date: null,
                exit_price: 190.50,
                exit_valuation: 174300000000,
                return_pct: 550,
                profit_usd: 150000000000,
                status: "Held",
                moat: "Wide"
            },
            {
                year: 2020,
                symbol: "DAL",
                name: "Delta Air Lines",
                entry_date: "2016-01-01",
                entry_price: 45.00,
                entry_valuation: 300000000,
                exit_date: "2020-04-01",
                exit_price: 22.00,
                exit_valuation: 150000000,
                return_pct: -50,
                profit_usd: -150000000,
                status: "Exited",
                moat: "None"
            },
            {
                year: 2008,
                symbol: "GS",
                name: "Goldman Sachs (Preferred)",
                entry_date: "2008-09-23",
                entry_price: 115.00,
                entry_valuation: 5000000000,
                exit_date: "2013-03-01",
                exit_price: 150.00,
                exit_valuation: 7500000000, // + Warrants profit
                return_pct: 50,
                profit_usd: 2500000000,
                status: "Exited",
                moat: "Narrow"
            }
        ]
    },
    {
        id: "bridgewater",
        name: "Bridgewater Associates",
        strategy: "Global Macro",
        description: "Ray Dalio's firm, focusing on economic trends (inflation, currency exchange rates, GDP) to guide investment.",
        holdings: [
            {
                symbol: "IVV", name: "iShares Core S&P 500 ETF", shares: 1000000, value: 450000000, avg_buy_price: 410.00, sector: "ETF", changes_percentage: 0.9, first_added: "2018-01-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 1.5, intrinsic_value: 0,
                entry_pe: 0, current_pe: 0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. 미국 경제 베팅 (US Economy):
S&P 500 ETF는 브리지워터의 'All Weather' 전략의 핵심 축입니다. 개별 종목 리스크를 제거하고 미국 경제 전반의 우상향에 베팅합니다.

2. 분산 투자 (Diversification):
기술, 금융, 헬스케어 등 전 섹터에 고루 분산되어 있어, 특정 섹터의 부진을 다른 섹터가 상쇄합니다. 가장 안전하고 확실한 주식 자산입니다.

3. 헷지 수단:
인플레이션이나 금리 변동에 따라 포트폴리오 비중을 조절하는 용도로 활용됩니다. 레이 달리오의 거시 경제 뷰가 반영된 포지션입니다.`
            },
            {
                symbol: "IEMG", name: "iShares Core MSCI Emerging Markets ETF", shares: 2500000, value: 120000000, avg_buy_price: 48.50, sector: "ETF", changes_percentage: -0.3, first_added: "2019-06-01",
                moat: "None", dividend_yield_on_cost: 0, current_dividend_yield: 2.8, intrinsic_value: 0,
                entry_pe: 0, current_pe: 0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. 신흥국 성장 (Emerging Markets):
미국 외 성장에 대한 노출을 제공합니다. 달러 약세 사이클에서 신흥국 자산의 아웃퍼폼을 예상한 매크로 베팅입니다.

2. 밸류에이션 매력:
미국 증시 대비 역사적 저점에 있는 신흥국 밸류에이션에 주목했습니다. 장기적으로 평균 회귀(Mean Reversion)를 기대하는 전략입니다.`
            },
            {
                symbol: "GOOGL", name: "Alphabet Inc.", shares: 500000, value: 70000000, avg_buy_price: 135.20, sector: "Technology", changes_percentage: 1.5, first_added: "2021-01-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 0, intrinsic_value: 175.00,
                entry_pe: 25.0, current_pe: 24.0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. 기술주 퀄리티 (Quality Tech):
금리 상승기에도 견고한 현금 흐름을 창출하는 '퀄리티 주식'으로 분류됩니다. 단순한 기술주가 아니라, 필수 소비재와 같은 안정성을 제공하는 포트폴리오의 닻(Anchor)입니다.`
            },
            {
                symbol: "PEP", name: "PepsiCo", shares: 800000, value: 135000000, avg_buy_price: 165.30, sector: "Consumer Defensive", changes_percentage: 0.4, first_added: "2022-01-01",
                moat: "Wide", dividend_yield_on_cost: 2.8, current_dividend_yield: 3.0, intrinsic_value: 180.00,
                entry_pe: 22.0, current_pe: 25.0,
                entry_dps: 4.30, current_dps: 5.06,
                ai_analysis: `1. 인플레이션 방어 (Inflation Hedge):
강력한 브랜드 파워로 원가 상승을 가격 전가로 방어합니다. 소비 둔화 시기에도 꾸준한 매출을 기록하는 대표적인 경기 방어주입니다.

2. 배당 귀족 (Dividend Aristocrat):
50년 이상 배당을 늘려온 신뢰성은 불확실한 거시경제 환경에서 채권을 대체하는 안전 자산 역할을 수행합니다.`
            },
            {
                symbol: "MCD", name: "McDonald's", shares: 300000, value: 85000000, avg_buy_price: 275.10, sector: "Consumer Cyclical", changes_percentage: 0.6, first_added: "2022-05-01",
                moat: "Wide", dividend_yield_on_cost: 2.1, current_dividend_yield: 2.3, intrinsic_value: 300.00,
                entry_pe: 24.0, current_pe: 26.0,
                entry_dps: 5.52, current_dps: 6.68,
                ai_analysis: `1. 불황에 강한 소비 (Recession Resistant):
경기 침체 시 오히려 소비자가 몰리는 '저가 소비'의 수혜주입니다. 부동산 자산을 기반으로 한 안정적인 프랜차이즈 수입 모델이 강점입니다.`
            }
        ],
        history: []
    },
    {
        id: "renaissance",
        name: "Renaissance Technologies",
        strategy: "Quantitative / HFT",
        description: "Founded by Jim Simons, known for mathematical models and Medallion Fund's high returns.",
        holdings: [
            {
                symbol: "NVO", name: "Novo Nordisk", shares: 1500000, value: 180000000, avg_buy_price: 115.20, sector: "Healthcare", changes_percentage: 1.8, first_added: "2020-01-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 1.1, intrinsic_value: 140.00,
                entry_pe: 25.0, current_pe: 40.0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. 비만 치료제 혁명 (GLP-1):
'위고비'와 '오젬픽'으로 대변되는 비만/당뇨 치료제 시장의 절대 이자입니다. 르네상스의 퀀트 모델이 이 폭발적인 성장 모멘텀을 초기에 포착했습니다.

2. 퀀트 시그널 (Quant Signal):
지속적인 이익 전망치 상향(Dual Momentum)과 기관 수급 유입이 강력한 매수 신호로 작용했습니다. 펀더멘털과 수급이 모두 완벽한 구간입니다.

3. 높은 진입 장벽:
생산 설비(CAPEX) 구축에 막대한 비용과 시간이 소요되어, 경쟁사가 쉽게 따라올 수 없는 '공급자 우위' 시장을 형성하고 있습니다.`
            },
            {
                symbol: "META", name: "Meta Platforms", shares: 1200000, value: 350000000, avg_buy_price: 250.50, sector: "Technology", changes_percentage: 2.1, first_added: "2019-01-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 0, intrinsic_value: 500.00,
                entry_pe: 20.0, current_pe: 28.0,
                entry_dps: 0, current_dps: 0.50,
                ai_analysis: `1. 효율성의 해 (Year of Efficiency):
비용 절감과 AI 투자 확대가 동시에 이루어지며 이익률이 급증했습니다. 퀀트 모델이 선호하는 '이익 모멘텀'과 '잉여현금흐름 개선' 조건에 완벽히 부합합니다.

2. AI 광고 최적화:
AI를 활용한 타겟팅 정교화로 광고 수익 효율이 극대화되고 있습니다. 기술적 해자가 숫자로 증명되는 구간입니다.`
            },
            {
                symbol: "VRTX", name: "Vertex Pharmaceuticals", shares: 400000, value: 160000000, avg_buy_price: 380.00, sector: "Healthcare", changes_percentage: 0.7, first_added: "2021-06-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 0, intrinsic_value: 450.00,
                entry_pe: 25.0, current_pe: 28.0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. 독점적 바이오 (Monopoly Model):
낭포성 섬유증 치료제 시장을 사실상 독점하고 있습니다. 예측 가능한 현금 흐름과 높은 진입 장벽은 퀀트 알고리즘이 선호하는 '저변동성 우량주'의 특징입니다.`
            },
            {
                symbol: "PLTR", name: "Palantir Technologies", shares: 5000000, value: 85000000, avg_buy_price: 16.50, sector: "Technology", changes_percentage: 3.5, first_added: "2023-01-01",
                moat: "Narrow", dividend_yield_on_cost: 0, current_dividend_yield: 0, intrinsic_value: 25.00,
                entry_pe: 0, current_pe: 60.0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. AI 모멘텀 (Momentum Play):
AIP(인공지능 플랫폼) 출시 이후 수주가 급증하며 강력한 성장 모멘텀을 보이고 있습니다. 거래량 급증과 변동성 확대는 단기 트레이딩 알고리즘의 주요 타겟입니다.`
            },
            {
                symbol: "AMZN", name: "Amazon.com", shares: 1000000, value: 150000000, avg_buy_price: 145.00, sector: "Consumer Cyclical", changes_percentage: 1.1, first_added: "2015-01-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 0, intrinsic_value: 200.00,
                entry_pe: 60.0, current_pe: 42.0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. AWS 클라우드 (Cash Cow):
클라우드 부문의 이익 성장이 전체 밸류에이션을 지탱합니다. AI 인프라 수요 증가는 장기적인 주가 상승 촉매제(Catalyst)입니다.`
            },
            {
                symbol: "GILD", name: "Gilead Sciences", shares: 2000000, value: 140000000, avg_buy_price: 75.20, sector: "Healthcare", changes_percentage: -0.2, first_added: "2018-01-01",
                moat: "Narrow", dividend_yield_on_cost: 3.8, current_dividend_yield: 4.2, intrinsic_value: 85.00,
                entry_pe: 10.0, current_pe: 12.0,
                entry_dps: 2.80, current_dps: 3.08,
                ai_analysis: `1. 저평가 배당주 (Deep Value):
항바이러스제 시장의 강자로, 매우 낮은 PER과 높은 배당 수익률을 제공합니다. 성장성보다는 현금 흐름과 안정성을 중시하는 가치 팩터에 의해 포트폴리오에 편입되었습니다.`
            }
        ],
        history: []
    },
    {
        id: "pershing-square",
        name: "Pershing Square Capital",
        strategy: "Activist Value",
        description: "Bill Ackman's activist hedge fund, taking concentrated positions in undervalued companies to push for change.",
        holdings: [
            {
                symbol: "CMG", name: "Chipotle Mexican Grill", shares: 800000, value: 1800000000, avg_buy_price: 420.00, sector: "Consumer Cyclical", changes_percentage: 0.9, first_added: "2016-08-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 0, intrinsic_value: 3200.00,
                entry_pe: 45.0, current_pe: 55.0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. 운영 효율성 (Operational Efficiency):
식품 안전 이슈로 주가가 폭락했을 때 진입했습니다. 경영진 교체와 디지털 주문 시스템 도입을 통해 마진율을 획기적으로 개선했으며, 단순한 외식업이 아닌 '푸드 테크' 기업으로 변모했습니다.

2. 가격 결정력 (Pricing Power):
인플레이션 상황에서도 메뉴 가격을 인상할 수 있는 강력한 브랜드 충성도를 보유하고 있습니다. 이는 원가 상승 압박을 소비자에게 전가할 수 있는 드문 능력을 의미합니다.

3. 성장 여력 (Runway):
아직 북미 내 매장 침투율이 포화 상태에 이르지 않았으며, 해외 시장 확장은 이제 시작 단계입니다. 긴 호흡으로 가져갈 수 있는 최고의 성장주입니다.`
            },
            {
                symbol: "QSR", name: "Restaurant Brands International", shares: 23000000, value: 1700000000, avg_buy_price: 35.50, sector: "Consumer Cyclical", changes_percentage: 0.4, first_added: "2014-12-01",
                moat: "Wide", dividend_yield_on_cost: 6.2, current_dividend_yield: 3.1, intrinsic_value: 95.00,
                entry_pe: 18.0, current_pe: 21.0,
                entry_dps: 0.80, current_dps: 2.20,
                ai_analysis: `1. 프랜차이즈 모델 (Capital Light):
버거킹, 팀홀튼, 파파이스를 보유한 지주사로, 직접 매장을 운영하기보다 로열티를 받는 구조입니다. 자본 투자가 적게 들고 현금 흐름이 우수한 고수익 비즈니스 모델입니다.

2. 글로벌 확장 (Global Growth):
북미 시장은 성숙기지만, 아시아와 유럽 등 해외 시장에서의 점포 확장이 공격적으로 이루어지고 있습니다. 마스터 프랜차이즈 계약을 통해 리스크를 최소화하며 성장하고 있습니다.

3. 주주 환원:
풍부한 잉여현금흐름(FCF)을 바탕으로 배당을 꾸준히 늘리고 있습니다. 진입 대비 배당 수익률(Yield on Cost)은 6%를 넘어섰으며, 안정적인 채권형 주식의 성격을 띱니다.`
            },
            {
                symbol: "GOOG", name: "Alphabet Inc. Class C", shares: 10000000, value: 1400000000, avg_buy_price: 95.00, sector: "Technology", changes_percentage: 1.4, first_added: "2023-01-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 0, intrinsic_value: 180.00,
                entry_pe: 18.5, current_pe: 24.0,
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. AI 해자 (AI Moat):
생성형 AI 경쟁 우려로 주가가 하락했을 때 진입했습니다. 구글의 데이터 우위와 압도적인 검색 시장 점유율은 AI 시대에도 변함없는 경쟁력이 될 것입니다.

2. 딥 밸류 (Deep Value):
빅테크 기업 중 가장 저평가된 상태에서 매수했습니다. 클라우드 부문의 성장과 유튜브의 수익화 모델은 여전히 강력한 상승 동력(Upside)을 제공합니다.

3. 자본 배분:
막대한 현금을 바탕으로 한 자사주 매입은 주가 하단을 지지합니다. 독점금지법 리스크가 존재하지만, 이를 감안해도 현재 가격은 매력적인 구간입니다.`
            },
            {
                symbol: "HLT", name: "Hilton Worldwide", shares: 9000000, value: 1600000000, avg_buy_price: 70.00, sector: "Consumer Cyclical", changes_percentage: 1.2, first_added: "2018-10-01",
                moat: "Wide", dividend_yield_on_cost: 0.8, current_dividend_yield: 0.3, intrinsic_value: 200.00,
                entry_pe: 22.0, current_pe: 35.0,
                entry_dps: 0.15, current_dps: 0.60,
                ai_analysis: `1. 자산 경량화 (Asset Light):
호텔을 직접 소유하지 않고 브랜드와 운영 시스템만 빌려주는 모델로 전환했습니다. 이로 인해 경기 변동에 대한 내성이 강하고 ROE(자기자본이익률)가 매우 높습니다.

2. 여행의 부활:
팬데믹 이후 보복 여행 수요의 최대 수혜주입니다. 비즈니스 미팅과 레저 여행이 모두 회복되면서 객실 점유율과 가격(ADR)이 동시에 상승하고 있습니다.

3. 훌륭한 경영진:
크리스토퍼 나세타 CEO의 리더십 하에 업계 최고의 마진율을 기록하고 있습니다. 단순한 호텔이 아닌 최고의 현금 창출 머신입니다.`
            },
            {
                symbol: "HHC", name: "Howard Hughes Holdings", shares: 1500000, value: 100000000, avg_buy_price: 50.00, sector: "Real Estate", changes_percentage: -0.8, first_added: "2010-01-01",
                moat: "Wide", dividend_yield_on_cost: 0, current_dividend_yield: 0, intrinsic_value: 120.00,
                entry_pe: 0, current_pe: 0, // Book value focus
                entry_dps: 0, current_dps: 0,
                ai_analysis: `1. 독점적 지위:
마스터 플랜 커뮤니티(MPC)를 개발하는 회사로, 토지 공급을 독점적으로 조절할 수 있는 권한을 가집니다. 경쟁자가 없는 자신만의 왕국을 건설하는 것과 같습니다.

2. 숨겨진 가치:
재무제표상의 가치보다 실제 보유한 부동산의 가치가 훨씬 큽니다. 장기적으로 개발이 진행됨에 따라 토지 가치는 기하급수적으로 상승할 것입니다.

3. 장기 복리 기계:
당장의 수익보다는 10년, 20년 뒤의 자산 가치 증대를 목표로 합니다. 빌 애크먼이 영구 보유를 천명할 만큼 확신을 가진 자산입니다.`
            }
        ],
        history: []
    }
]
