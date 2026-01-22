
import os
import time
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def clean_and_fix():
    print("🧹 Starting cleanup...")

    # 1. Delete Bad Symbols containing '=' (Futures/Forex)
    print("Deleting symbols with '='...")
    # There isn't a simple LIKE query in python client for Delete? 
    # We can select IDs and delete.
    res = supabase.table("fund_holdings").select("id, symbol").csv().execute()
    # CSV is raw text, let's use standard select
    # Fetching all symbols to filter locally might be safer/easier than complex match
    
    # Pagination
    all_rows = []
    start = 0
    batch = 5000
    while True:
        print(f"   Fetching metadata {start}...")
        r = supabase.table("fund_holdings").select("id, symbol, value").range(start, start+batch-1).execute()
        if not r.data: break
        all_rows.extend(r.data)
        if len(r.data) < batch: break
        start += batch
        
    print(f"Total rows: {len(all_rows)}")
    
    # Identify items to delete and update
    to_delete = []
    to_update = []
    
    bad_suffixes = ["=F", "=X", ".BA", ".SA", ".MX", ".T", "^"]
    
    for row in all_rows:
        sym = row['symbol']
        val = row['value']
        
        # Check bad symbol
        is_bad = False
        if "=" in sym: is_bad = True
        for s in bad_suffixes:
            if sym.endswith(s): is_bad = True
            
        if is_bad:
            to_delete.append(row['id'])
            continue
            
        # Check Value (Divide by 1000)
        # We assume ALL are 1000x inflated based on AAPL and PENEUR checks.
        # But we should be careful not to apply it twice if run again.
        # How to know? 
        # AAPL was 176,000,000,000. It should be 176,000,000.
        # Threshold: if value > 100 Billion for a single stock? 
        # AAPL market cap is 3T. Berkshire owns ~5%. 
        # So 150B is realistic. 
        # Wait, my previous calc:
        # DB: 176 Billion.
        # Real: 176 Million? 
        # WAIT. Berkshire owns 5% of Apple. Apple is 3 Trillion.
        # 5% of 3T = 150 Billion.
        # So 176 Billion IS CORRECT for Berkshire's Apple stake!
        
        # STOP.
        # Let's re-verify the math.
    
    print("⚠️  Logic check required. Pausing.")

if __name__ == "__main__":
    clean_and_fix()
