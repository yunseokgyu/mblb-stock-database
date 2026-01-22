
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def check_status():
    print("📋 Checking Historical Data Collection Status...\n")
    
    # 1. Get Funds
    funds = supabase.table("hedge_funds").select("id, name").execute().data
    
    for fund in funds:
        fid = fund['id']
        name = fund['name']
        
        # 2. Get Holdings Stats
        # We can't do complex agg in one REST call easily without views/RPC.
        # We'll fetch 'report_period' distinct or just count.
        # Best proxy: fetch all unique report_periods
        res = supabase.table("fund_holdings") \
            .select("report_period") \
            .eq("fund_id", fid) \
            .execute()
            
        periods = [r['report_period'] for r in res.data]
        unique_periods = sorted(list(set(periods)))
        
        if not unique_periods:
            print(f"🔹 {name}: No data collected yet.")
            continue
            
        count = len(unique_periods)
        oldest = unique_periods[0]
        newest = unique_periods[-1]
        
        print(f"🔹 {name}:")
        print(f"   - Collected Quarters: {count}")
        print(f"   - Range: {oldest} ~ {newest}")
        
        # Estimate completeness (approx 4 quarters per year)
        # If we expect back to 2000...
        # Just reporting facts is enough.
        
if __name__ == "__main__":
    check_status()
