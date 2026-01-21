
import os
import yfinance as yf
from supabase import create_client
from dotenv import load_dotenv

script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '..', 'credentials.env')
load_dotenv(dotenv_path=env_path)

print("--- Testing YFinance ---")
try:
    ticker = yf.Ticker("AAPL")
    info = ticker.info
    print(f"YFinance Success: AAPL Price = {info.get('currentPrice')}")
except Exception as e:
    print(f"YFinance Failed: {e}")

print("\n--- Testing Supabase ---")
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
print(f"URL: {url}")
if not url or not key:
    print("Missing Supabase credentials")
else:
    try:
        supabase = create_client(url, key)
        # Try a simple select. If table is empty, it returns empty list but no error.
        data = supabase.from_('stock_data').select("*").limit(1).execute()
        print(f"Supabase Connect Success: {data}")
    except Exception as e:
        print(f"Supabase Failed: {e}")
