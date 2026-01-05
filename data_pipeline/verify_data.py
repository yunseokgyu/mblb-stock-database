import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv(dotenv_path='../credentials.env')

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("Error: Missing credentials")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    response = supabase.table('stock_data').select('*', count='exact').execute()
    print(f"Stock Data Count: {len(response.data)}")
    if len(response.data) > 0:
        print("Sample Data:", response.data[0])
    
    response_etf = supabase.table('etf_holdings').select('*', count='exact').execute()
    print(f"ETF Data Count: {len(response_etf.data)}")

    response_insider = supabase.table('insider_trading').select('*', count='exact').execute()
    print(f"Insider Trading Data Count: {len(response_insider.data)}")
    
except Exception as e:
    print(f"Error fetching data: {e}")
