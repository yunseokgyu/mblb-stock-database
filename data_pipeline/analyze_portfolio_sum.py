
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def analyze_sum():
    target_fund = "e5c0779e-996c-4094-9cb4-60e8f69df161"
    
    # 1. Get Latest Period
    print("Fetching latest period...")
    res = supabase.table("fund_holdings").select("report_period").eq("fund_id", target_fund).order("report_period", desc=True).limit(1).execute()
    if not res.data:
        print("No data.")
        return
        
    latest = res.data[0]['report_period']
    print(f"Latest Period: {latest}")
    
    # 2. Fetch all holdings for this period
    rows = []
    start = 0
    batch = 1000
    while True:
        r = supabase.table("fund_holdings").select("symbol, value").eq("fund_id", target_fund).eq("report_period", latest).range(start, start+batch-1).execute()
        if not r.data: break
        rows.extend(r.data)
        if len(r.data) < batch: break
        start += batch
        
    print(f"Fetched {len(rows)} holdings.")
    
    # 3. Sum and Sort
    total = sum(r['value'] for r in rows)
    print(f"Total Assets: ${total:,.0f}")
    
    rows.sort(key=lambda x: x['value'], reverse=True)
    
    print("\n--- Top 20 Entries ---")
    for i, r in enumerate(rows[:20]):
        print(f"{i+1}. {r['symbol']}: ${r['value']:,.0f}")

if __name__ == "__main__":
    analyze_sum()
