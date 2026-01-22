
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
            # Use YFinance via Utils
            metrics = market_data_utils.get_dcf_metrics(symbol)
            if not metrics:
                print(f"   ⚠️ No metrics found for {symbol}")
                continue
                
            p_ratio = metrics.get('pe_ratio', 0)
            div_yield_raw = metrics.get('dividend_yield', 0)
            
            # YF returns decimal (0.03), Convert to % (3.0)
            div_yield = round(div_yield_raw * 100, 2) if div_yield_raw else 0
            if p_ratio:
                p_ratio = round(p_ratio, 2)
                
            # DPS? YF info sometimes has 'dividendRate'
            # Let's rely on info dict inside utils? 
            # get_dcf_metrics returns specific dict. 
            # I might need to access Ticker directly or update utils if I need DPS.
            # But let's check what I really need.
            # UI needs: dividend_yield, pe_ratio. 
            # DPS is used for "Yield on Cost" calc in UI: ((current_dps / entryPrice) * 100)
            # YF 'dividendRate' is DPS. get_dcf_metrics doesn't return it.
            # Let's blindly fetch it here since I'm rewriting logic.
            
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            info = ticker.info
            dps = info.get('dividendRate', 0)
            
            sector = info.get('sector', 'Unknown')
            
            # AI Analysis Mock
            ai_text = f"**{symbol} Analysis**:\n- **Valuation**: Current PE is {p_ratio}x. {'Attractive' if p_ratio and p_ratio < 20 else 'Premium'}.\n- **Dividend**: Yielding {div_yield}%. {'Healthy payout.' if div_yield > 2 else 'Focus on growth.'}\n- **Sector**: {sector}.\n\n*Outlook*: Stable long-term hold with focus on compound growth."

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
