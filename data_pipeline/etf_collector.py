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

# Initialize Supabase Client
if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Warning: Supabase credentials not found. Data will not be saved.")
    supabase = None

def fetch_etf_holdings(symbol):
    """Fetch ETF holdings from FMP"""
    # Note: FMP endpoint for ETF holders might vary. Using a standard one.
    url = f"https://financialmodelingprep.com/api/v3/etf-holder/{symbol}?apikey={FMP_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching ETF {symbol}: {response.status_code}")
        return []

def update_etf_data():
    target_etfs = ['SPY', 'QQQ', 'DIA', 'SCHD'] # Example List
    
    if not FMP_API_KEY:
        print("Error: FMP_API_KEY is missing.")
        return

    for symbol in target_etfs:
        print(f"Fetching holdings for {symbol}...")
        holdings = fetch_etf_holdings(symbol)
        
        if holdings:
            data = {
                'symbol': symbol,
                'holdings': holdings, # JSON list of { asset, shares, weightPercentage }
                'last_updated': datetime.utcnow().isoformat()
            }
            
            if supabase:
                try:
                    supabase.table('etf_holdings').upsert(data).execute()
                    print(f"Updated {symbol} in Supabase.")
                except Exception as e:
                    print(f"Failed to upsert {symbol}: {e}")
            else:
                print(f"Data for {symbol} fetched (Size: {len(holdings)}), but Supabase not configured.")

if __name__ == "__main__":
    update_etf_data()
