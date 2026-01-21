
import os
from dotenv import load_dotenv
from supabase import create_client

# Explicit path to ensure we pick up the right env
env_path = r'c:\Users\ysk144\.gemini\antigravity\playground\mblb-stock-database\credentials.env'
load_dotenv(env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print(f"Connecting to {url}...")
try:
    supabase = create_client(url, key)
    
    # Check Funds
    print("\n--- Hedge Funds ---")
    funds = supabase.table("hedge_funds").select("*").execute()
    for f in funds.data:
        print(f"[{f['id']}] {f['name']}")

    # Check Holdings (Summary)
    print("\n--- Holdings Sample (Latest) ---")
    holdings = supabase.table("fund_holdings").select("report_period, symbol, shares").limit(10).order("report_period", desc=True).execute()
    for h in holdings.data:
        print(h)
        
    # Check Historical Depth
    print("\n--- Historical Depth ---")
    dates = supabase.table("fund_holdings").select("report_period").execute()
    unique_dates = set(d['report_period'] for d in dates.data)
    print(f"Found report dates: {sorted(list(unique_dates))}")

except Exception as e:
    print(f"Error: {e}")
