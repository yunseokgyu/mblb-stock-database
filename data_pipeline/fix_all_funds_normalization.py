
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def fix_normalization():
    print("🔧 Normalizing All Funds...")
    
    funds = supabase.table("hedge_funds").select("id, name").execute().data
    
    for fund in funds:
        fid = fund['id']
        name = fund['name']
        print(f"\nEvaluating {name}...")
        
        # Check latest total assets
        res = supabase.table("fund_holdings").select("report_period").eq("fund_id", fid).order("report_period", desc=False).limit(1).execute()
        if not res.data: continue
        latest = res.data[0]['report_period'] # Earliest? 
        # Wait, order desc=False is ASCENDING (oldest).
        # verify_all_funds used desc=False (Ascending) for earliest.
        # I want LATEST. desc=True.
        
        res_latest = supabase.table("fund_holdings").select("report_period").eq("fund_id", fid).order("report_period", desc=True).limit(1).execute()
        if not res_latest.data: continue
        latest = res_latest.data[0]['report_period']
        
        # Calculate Total for Latest
        # Batch fetch
        rows = []
        start = 0
        while True:
            r = supabase.table("fund_holdings").select("value").eq("fund_id", fid).eq("report_period", latest).range(start, start+999).execute()
            if not r.data: break
            rows.extend(r.data)
            if len(r.data) < 1000: break
            start += 1000
            
        total = sum([x['value'] for x in rows])
        print(f"   Latest Assets ({latest}): ${total:,.0f}")
        
        multiplier = 1
        
        # Heuristics
        if total > 1_000_000_000_000: # > 1 Trillion
            print(f"   🚨 Detected 1000x Inflation (Value > $1T). Normalizing...")
            multiplier = 0.001
            
        elif "Pershing Square" in name and total > 50_000_000_000:
            print(f"   🚨 Detected 10x Inflation (Pershing > $50B). Normalizing...")
            multiplier = 0.1
            
        if multiplier != 1:
            print(f"   Applying x{multiplier} to ALL holdings for {name}...")
            # We must update ALL history for this fund, not just latest.
            # Using Supabase UPDATE with filter.
            # UPDATE fund_holdings SET value = value * multiplier WHERE fund_id = fid
            # Client doesn't support bulk calculation update easily?
            # We might need to iterate or use raw SQL (if possible via RPC).
            # No RPC access?
            # Iterating is slow but safe.
            
            # Fetch ALL IDs and Values
            # Update in batches?
            # Just fetching IDs is enough? No, we need old value to multiply?
            # Actually, we can't do `value = value * 0.001` in API.
            # We must fetch, calculate, update.
            # This will take time for 4000 rows.
            
            # Optimization: 
            # Process in chunks of 1000.
            
            all_start = 0
            while True:
                # Fetch chunk with all necessary columns for safe upsert
                print(f"   Processing chunk {all_start}...")
                chunk = supabase.table("fund_holdings").select("id, fund_id, symbol, report_period, value").eq("fund_id", fid).range(all_start, all_start+999).execute()
                if not chunk.data: break
                
                updates = []
                for row in chunk.data:
                    updates.append({
                        "id": row['id'],
                        "fund_id": row['fund_id'],
                        "symbol": row['symbol'],
                        "report_period": row['report_period'],
                        "value": row['value'] * multiplier
                    })
                
                # Perform bulk upsert? Update needs ID.
                # upsert works with ID.
                if updates:
                    r = supabase.table("fund_holdings").upsert(updates).execute()
                    
                if len(chunk.data) < 1000: break
                all_start += 1000
                
            print(f"   ✅ Normalized {name}.")
        else:
            print("   ✅ Looks reasonable (or skipped).")

if __name__ == "__main__":
    fix_normalization()
