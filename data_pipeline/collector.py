import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv(dotenv_path='../credentials.env')

FMP_API_KEY = os.getenv('FMP_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not all([FMP_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    print("Error: Missing API Keys in credentials.env")
    exit(1)

# Initialize Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_sp500_symbols():
    """Fetch S&P 500 companies list from FMP"""
    url = f"https://financialmodelingprep.com/api/v3/sp500_constituent?apikey={FMP_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching S&P 500: {response.status_code}")
        return []

def fetch_company_profile(symbol):
    """Fetch company profile (price, mkt cap, sector)"""
    url = f"https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={FMP_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data[0] if data else None
    return None

def fetch_financial_ratios(symbol):
    """Fetch key financial ratios (TTM)"""
    url = f"https://financialmodelingprep.com/api/v3/ratios-ttm/{symbol}?apikey={FMP_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data[0] if data else {}
    return {}

def fetch_dcf(symbol):
    """Fetch Discounted Cash Flow value"""
    url = f"https://financialmodelingprep.com/api/v3/discounted-cash-flow/{symbol}?apikey={FMP_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data[0] if data else {}
    return {}

def fetch_insider_trading(symbol, limit=10):
    """Fetch recent insider trading activity"""
    url = f"https://financialmodelingprep.com/api/v4/insider-trading?symbol={symbol}&limit={limit}&apikey={FMP_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return []

def update_stock_data():
    """Main function to update Price, Financials, and Valuation"""
    print("Fetching S&P 500 list...")
    sp500_list = fetch_sp500_symbols()
    
    # For testing, limit to first 5
    # sp500_list = sp500_list[:5] 

    for item in sp500_list:
        symbol = item['symbol']
        print(f"Processing {symbol}...")
        
        try:
            profile = fetch_company_profile(symbol)
            if not profile:
                continue

            ratios = fetch_financial_ratios(symbol)
            dcf = fetch_dcf(symbol)
            
            # Construct Valuation Metrics JSON
            valuation_metrics = {
                'dcf': dcf.get('dcf'),
                'stock_price': dcf.get('Stock Price'),
                'pe_ratio_ttm': ratios.get('peRatioTTM'),
                'pb_ratio_ttm': ratios.get('priceToBookRatioTTM'),
                'div_yield_ttm': ratios.get('dividendYielTTM'),
                'ev_ebitda_ttm': ratios.get('enterpriseValueMultipleTTM')
            }
            
            # Construct Data Record
            data = {
                'symbol': symbol,
                'name': profile.get('companyName'),
                'sector': profile.get('sector'),
                'industry': profile.get('industry'),
                'market_cap': profile.get('mktCap'),
                'price': profile.get('price'),
                'changes_percentage': profile.get('changes'),
                'financials': {}, # Can expand later
                'valuation_metrics': valuation_metrics,
                'updated_at': datetime.utcnow().isoformat()
            }
            
            # Upsert to Supabase
            supabase.table('stock_data').upsert(data).execute()
            
            # Update Insider Trading (Separate Table)
            insiders = fetch_insider_trading(symbol)
            for trade in insiders:
                trade_record = {
                    'symbol': symbol,
                    'transaction_date': trade.get('transactionDate'),
                    'reporting_date': trade.get('reportingDate'),
                    'company': trade.get('company'),
                    'insider_name': trade.get('reportingName'),
                    'transaction_type': trade.get('transactionType'),
                    'securities_transacted': trade.get('securitiesTransacted'),
                    'price': trade.get('price'),
                    'securities_owned': trade.get('securitiesOwned'),
                    'filing_url': trade.get('link')
                }
                # We need a unique constraint or careful insertion to avoid dupes if not using ID.
                # For now, just insert. In production, check for existence or use a composite key.
                # Simplification: Only insert if new (requires logic), or wipe and reload (costly).
                # For an MVP, let's just insert and maybe clean up later or rely on ID uniqueness if generated by source?
                # FMP doesn't give a unique trade ID. 
                # Strategy: For now, we will skip insider trading upsert to avoid duplicates until we define a strategy.
                # Or we can just store the latest X trades via a delete-insert strategy for the symbol.
                pass 
                
        except Exception as e:
            print(f"Failed to process {symbol}: {e}")

if __name__ == "__main__":
    update_stock_data()
