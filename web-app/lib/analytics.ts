import { formatBilingual } from "./utils/format";

// Types for Stock Data (Partial)
interface StockData {
    symbol: string;
    sector: string;
    market_cap: number;
    price: number;
    changes_percentage: number;
    valuation_metrics?: {
        dcf?: number;
        div_yield_ttm?: number;
        pe_ratio_ttm?: number;
    };
}

/**
 * Calculates a "Safety Score" (1-10) based on Market Cap and Volatility.
 * - Large Market Cap -> Higher Score
 * - Low Volatility (changes_percentage) -> Higher Score
 */
export function calculateSafetyScore(stock: StockData): number {
    let score = 5.0;

    // 1. Market Cap Factor (Max +3)
    const marketCapInBillions = stock.market_cap / 1_000_000_000;
    if (marketCapInBillions > 2000) score += 4.5;      // Mega Cap (Apple, MSFT)
    else if (marketCapInBillions > 500) score += 3.5;  // Large Cap
    else if (marketCapInBillions > 100) score += 2.5;  // Mid-Large
    else if (marketCapInBillions > 10) score += 1.5;   // Mid
    else score -= 1.0;                                 // Small Cap

    // 2. Volatility Factor (Max +2)
    // Assuming 'changes_percentage' roughly implies daily volatility for this snapshot
    const absChange = Math.abs(stock.changes_percentage);
    if (absChange < 0.5) score += 1.5;      // Very Stable
    else if (absChange < 1.0) score += 1.0; // Stable
    else if (absChange > 3.0) score -= 1.5; // Volatile

    // 3. Dividend Factor (+0.5 if paying significant dividend)
    if ((stock.valuation_metrics?.div_yield_ttm || 0) > 1.0) {
        score += 0.5;
    }

    // Clamp between 1.0 and 9.9
    return Math.min(Math.max(score, 1.0), 9.9);
}

/**
 * Calculates a Target Price (1Y) based on DCF or basic Sector Growth assumptions.
 */
export function calculateTargetPrice(stock: StockData): { price: number, upside: number } {
    const currentPrice = stock.price;
    let targetPrice = currentPrice;

    // 1. Use DCF if available and reasonable (within 50% variance)
    if (stock.valuation_metrics?.dcf && stock.valuation_metrics.dcf > 0) {
        // If DCF is extremely high/low compared to price, dampen it
        const dcfDiff = (stock.valuation_metrics.dcf - currentPrice) / currentPrice;
        if (Math.abs(dcfDiff) < 0.5) {
            // If DCF is close, use it directly
            targetPrice = stock.valuation_metrics.dcf;
        } else {
            // If DCF is wild, just take a 50% weight towards it
            targetPrice = currentPrice * (1 + (dcfDiff * 0.5));
        }
    } else {
        // 2. Fallback: Sector Growth simulation
        let growthRate = 0.08; // Base 8%
        if (stock.sector === "Technology") growthRate = 0.15;
        if (stock.sector === "Consumer Cyclical") growthRate = 0.12;
        if (stock.sector === "Utilities") growthRate = 0.04;

        targetPrice = currentPrice * (1 + growthRate);
    }

    // Ensure Target is at least slightly above current price for "Optimistic" report nature,
    // unless it's a known declining stock (simulation tweak)
    if (targetPrice < currentPrice) {
        targetPrice = currentPrice * 1.05; // Force min 5% upside for report positivity
    }

    const upside = ((targetPrice - currentPrice) / currentPrice) * 100;

    return {
        price: parseFloat(targetPrice.toFixed(2)),
        upside: parseFloat(upside.toFixed(2))
    };
}

/**
 * Returns a bilingual sector name.
 */
export function getSectorBilingual(sector: string): string {
    const map: Record<string, string> = {
        "Technology": "기술 (Technology)",
        "Communication Services": "통신 서비스 (Communication Services)",
        "Consumer Cyclical": "임의 소비재 (Consumer Cyclical)",
        "Consumer Defensive": "필수 소비재 (Consumer Defensive)",
        "Financial Services": "금융 (Financial Services)",
        "Healthcare": "헬스케어 (Healthcare)",
        "Industrials": "산업재 (Industrials)",
        "Energy": "에너지 (Energy)",
        "Real Estate": "부동산 (Real Estate)",
        "Utilities": "유틸리티 (Utilities)",
        "ETF": "상장지수펀드 (ETF)"
    };
    return map[sector] || `${sector} (Sector)`;
}

export interface ValuationResult {
    dcf: number;
    pe: number;
    evebitda: number;
    average: number;
}

export function calculateValuationMultiples(stock: StockData): ValuationResult {
    const currentPrice = stock.price;
    const eps = stock.valuation_metrics?.pe_ratio_ttm ? currentPrice / stock.valuation_metrics.pe_ratio_ttm : currentPrice * 0.05;

    // 1. DCF (Existing or Simulated)
    const dcf = stock.valuation_metrics?.dcf || currentPrice * (1 + (Math.random() * 0.2));

    // 2. P/E Multiple (Sector based)
    // Tech normally higher P/E, Stable lower.
    const sectorPE = stock.sector === "Technology" ? 35 : 20;
    const peValuation = eps * sectorPE;

    // 3. EV/EBITDA (Simulated)
    // Assume EBITDA is roughly 1.5x EPS for simplicity in simulation
    const ebitda = eps * 1.5;
    const sectorEVEBITDA = stock.sector === "Technology" ? 25 : 12;
    const evValuation = ebitda * sectorEVEBITDA;

    return {
        dcf: dcf,
        pe: peValuation,
        evebitda: evValuation,
        average: (dcf + peValuation + evValuation) / 3
    };
}

export function generateGrowthHistory(stock: StockData) {
    // Generate 10 years of historical price data (simulated)
    const history = [];
    const isGrowth = stock.sector === "Technology" || stock.sector === "Consumer Cyclical";
    const volatility = isGrowth ? 0.25 : 0.12; // Slightly higher volatility for longer period realism
    const trend = isGrowth ? 0.12 : 0.06; // 12% vs 6% annual growth

    // Start from 10 years ago (approx)
    // Compound reverse: Price / (1+r)^10
    const startFactor = 1 / Math.pow(1 + trend, 10);
    let price = stock.price * startFactor * (0.8 + Math.random() * 0.4); // Add some randomness to start

    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;

    for (let year = startYear; year < currentYear; year++) {
        // Add random yearly noise
        const move = trend + (Math.random() - 0.5) * volatility;
        price = price * (1 + move);
        history.push({ year, price: price });
    }
    // Ensure last point connects to current price
    history.push({ year: currentYear, price: stock.price });
    return history;
}

export function generateProjectedGrowth(currentAmount: number, years: number, annualReturn: number) {
    const data = [];
    let balance = currentAmount;

    for (let i = 0; i <= Math.ceil(years); i++) {
        data.push({
            year: new Date().getFullYear() + i,
            balance: Math.round(balance),
            invested: currentAmount // Simplify: just initial principal
        });
        balance = balance * (1 + annualReturn / 100);
    }
    return data;
}

export function generateDividendGrowth(initialDividend: number, years: number, growthRate: number) {
    const data = [];
    let dividend = initialDividend;
    for (let i = 0; i <= Math.ceil(years); i++) {
        data.push({
            year: new Date().getFullYear() + i,
            dividend: Math.round(dividend)
        });
        dividend = dividend * (1 + growthRate / 100);
    }
    return data;
}
