import os
import requests
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client
from utils.retry_utils import retry

# Load environment variables
load_dotenv(dotenv_path='../credentials.env')

FMP_API_KEY = os.getenv('FMP_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not all([FMP_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    print("Error: Missing API Keys in credentials.env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@retry(max_retries=3, initial_delay=2, backoff_factor=2)
def fetch_insider_trading(page=0):
    """Fetch recent insider trading data (all companies)"""
    # FMP insider-trading endpoint returns latest trades. 
    # Can paginate or filtering by symbol. fetching general latest is good for a feed.
    url = f"https://financialmodelingprep.com/api/v4/insider-trading-rss-feed?page={page}&apikey={FMP_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    response.raise_for_status() # Trigger retry on non-200
    return []

@retry(max_retries=3, initial_delay=1, backoff_factor=2)
def process_trade(trade):
    """Process a single trade with retry logic for Supabase Ops"""
    # Data mapping
    record = {
        'symbol': trade.get('symbol'),
        'transaction_date': trade.get('transactionDate'),
        'reporting_date': trade.get('filingDate'), # Using filingDate as reporting date
        'company': trade.get('company') if trade.get('company') else trade.get('symbol'), # sometimes company name is missing
        'insider_name': trade.get('reportingName'),
        'transaction_type': trade.get('transactionType'),
        'securities_transacted': trade.get('securitiesTransacted'),
        'price': trade.get('price'),
        'securities_owned': trade.get('securitiesOwned'),
        'filing_url': trade.get('link')
    }

    # Check for existing record to avoid duplicates (Basic check)
    existing = supabase.table('insider_trading').select('id').match({
        'symbol': record['symbol'],
        'transaction_date': record['transaction_date'],
        'insider_name': record['insider_name'],
        'securities_transacted': record['securities_transacted']
    }).execute()

    if not existing.data:
        supabase.table('insider_trading').insert(record).execute()
        return True
    return False

def update_insider_trading():
    print("Fetching latest insider trading data...")
    try:
        # Fetch page 0 (latest 100 or so)
        trades = fetch_insider_trading(0)
        
        count = 0
        for trade in trades:
            # FMP 'insider-trading-rss-feed' or 'insider-trading' fields:
            # symbol, filingDate, transactionDate, reportingDate, transactionType, securitiesTransacted, price, securitiesOwned, company, reportingName, link
            
            try:
                if process_trade(trade):
                    count += 1
            except Exception as e:
                print(f"Error processing trade after retries for {trade.get('symbol')}: {e}")

        print(f"Successfully added {count} new insider trades.")
    except Exception as e:
        print(f"Critical error fetching trades: {e}")

if __name__ == "__main__":
    update_insider_trading()
