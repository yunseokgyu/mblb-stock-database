
import os
import requests
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))
FMP_API_KEY = os.getenv('FMP_API_KEY')

from utils import market_data_utils

def enrich_analysis_data():
    print("🚀 Enriching Stock Analysis Data (PE, Div, AI) via YFinance...")
    
    # 1. Identify Top Holdings to Enrich (focus on major ones first)
    targets = ['AAPL', 'BAC', 'AXP', 'KO', 'CVX', 'OXY', 'MCO', 'KHC', 'C', 'V', 'MA']
    
    for symbol in targets:
        print(f"\nProcessing {symbol}...")
        
        try:
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # 1. Fetch Metrics
            p_ratio = info.get('trailingPE')
            if not p_ratio: p_ratio = info.get('forwardPE', 0)
            
            # YFinance 'dividendYield' seems to be percentage (e.g. 0.42 for 0.42%, 2.83 for 2.83%)
            # BUT sometimes it's decimal (0.0042). 
            # Let's Cross-Check with DividendRate / currentPrice
            current_price = info.get('currentPrice') or info.get('previousClose')
            div_rate = info.get('dividendRate', 0)
            
            div_yield = 0
            if div_rate and current_price:
                # Calculate manually to be sure: (Rate / Price) * 100
                div_yield = round((div_rate / current_price) * 100, 2)
            else:
                # Fallback to info yield
                d_y = info.get('dividendYield', 0)
                # Heuristic: if d_y < 0.1 (e.g. 0.05), it's likely decimal -> convert to %
                # If d_y > 0.1 (e.g. 0.42 or 2.83), it might be percent?
                # Actually AAPL 0.42 is ambiguous. 0.42% vs 42%.
                # Given Manual Calc is safest, we rely on div_rate/price.
                # If manual fails, assume YF standard (usually decimal in recent versions, but check failed).
                # My previous test showed 0.42 for AAPL.
                div_yield = round(d_y * 100, 2) if d_y < 0.2 else d_y 
                # Wait, if AAPL was 0.42 (percent), then 0.42 < 0.2 is FALSE.
                # So we keep 0.42. 
                # If KO was 2.83, we keep 2.83.
                # If decimal 0.0042, it is < 0.2 -> 0.42.
                # This heuristic handles both provided AAPL 0.42 wasn't 0.0042.
            
            beta = info.get('beta', 1)
            peg = info.get('pegRatio', 0)
            rev_growth = info.get('revenueGrowth', 0) # decimal
            dps = div_rate
            sector = info.get('sector', 'Unknown')
            industry = info.get('industry', 'Unknown')
            
            # 2. Generate Intelligent Analysis (Rule-Based)
            analysis_parts = []
            
            # A. Valuation
            val_text = f"Current PE is {round(p_ratio, 2)}x" if p_ratio else "PE not available"
            val_verdict = ""
            if p_ratio:
                if p_ratio < 15: val_verdict = "Attractive Value"
                elif p_ratio < 30: val_verdict = "Fair/Premium"
                else: val_verdict = "High Growth Premium"
            
            if peg and peg > 0:
                val_text += f", PEG {peg}"
                if peg < 1: val_verdict += " (Undervalued Growth)"
            
            analysis_parts.append(f"- **Valuation**: {val_text}. {val_verdict}.")
            
            # B. Dividend & Income
            div_text = f"Yields {div_yield}%"
            div_verdict = ""
            if div_yield > 4: div_verdict = "High Income generator"
            elif div_yield > 1.5: div_verdict = "Consistent payer"
            elif div_yield > 0: div_verdict = "Modest yield, focus on growth"
            else: div_verdict = "No dividend, pure growth focus"
             
            # Growth Check
             # revenueGrowth is decimal. 0.10 = 10%
            if rev_growth:
                 div_verdict += f". Revenue growing at {round(rev_growth*100, 1)}%."
            
            analysis_parts.append(f"- **Income & Growth**: {div_text}. {div_verdict}.")
            
            # C. Characteristics (Beta, Sector)
            char_text = f"Beta {round(beta, 2)}"
            char_verdict = "Low Volatility" if beta < 0.8 else "High Volatility" if beta > 1.3 else "Market Correlated"
            analysis_parts.append(f"- **Characteristics**: {char_text} ({char_verdict}). Leader in {industry} ({sector}).")
            
            # Outlook Summary
            outlook = "Outlook Positive."
            if p_ratio and p_ratio > 40 and rev_growth < 0.1:
                outlook = "Caution: High valuation with slowing growth."
            elif beta < 0.8 and div_yield > 2:
                outlook = "Defensive play suitable for stability."
            elif rev_growth > 0.15:
                outlook = "Aggressive growth trajectory."
            
            ai_text = f"**{symbol} Intelligent Analysis**:\n" + "\n".join(analysis_parts) + f"\n\n*Strategic View*: {outlook}"


            # Update DB - Store in valuation_metrics JSONB column
            # Note: Supabase update merges specific columns. 
            # If valuation_metrics is NULL, we overwrite. If exists, we might overwrite whole JSON or need to fetch-merge?
            # Ideally overwrite is fine for now as we are the source of truth for these metrics.
            
            update_data = {
                "valuation_metrics": {
                    "pe_ratio": p_ratio,
                    "dividend_yield": div_yield,
                    "dps": dps,
                    "ai_analysis": ai_text
                },
                "sector": sector
            }
            
            print(f"   Updating {symbol}: PE={p_ratio}x, Div={div_yield}%, DPS=${dps}")
            
            supabase.table("stock_data").update(update_data).eq("symbol", symbol).execute()
            
        except Exception as e:
            print(f"   ❌ Error fetching {symbol}: {e}")

if __name__ == "__main__":
    enrich_analysis_data()
