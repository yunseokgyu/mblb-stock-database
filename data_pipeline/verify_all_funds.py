
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def verify_all():
    print("📋 Verifying ALL Funds Data...\n")
    
    # 1. Fetch all funds
    funds = supabase.table("hedge_funds").select("id, name").execute().data
    
    print(f"{'Fund Name':<30} | {'Rows':<6} | {'Range':<22} | {'Latest Assets':<15} | {'Issues'}")
    print("-" * 110)
    
    for fund in funds:
        fid = fund['id']
        name = fund['name'][:28]
        
        # A. Basic Stats (Rows, Date Range)
        # We can't use aggregations easily in standard REST, so we fetch 'report_period' only.
        # Ensure we fetch enough to get min/max.
        # For efficiency, we just order desc and limit to check latest, and count.
        
        # Count
        res_count = supabase.table("fund_holdings").select("id", count="exact", head=True).eq("fund_id", fid).execute()
        count = res_count.count
        
        # Latest Date
        res_latest = supabase.table("fund_holdings").select("report_period").eq("fund_id", fid).order("report_period", desc=True).limit(1).execute()
        latest_date = res_latest.data[0]['report_period'] if res_latest.data else "N/A"
        
        # Earliest Date
        res_earliest = supabase.table("fund_holdings").select("report_period").eq("fund_id", fid).order("report_period", desc=False).limit(1).execute()
        earliest_date = res_earliest.data[0]['report_period'] if res_earliest.data else "N/A"
        
        date_range = f"{earliest_date} ~ {latest_date}"
        
        # B. Asset Check (Latest Quarter Inflation)
        latest_assets = 0
        issues = []
        if latest_date != "N/A":
            # Fetch sums manually (no SUM aggregation in client)
            # Batch fetch rows for latest period
            rows = []
            start = 0
            while True:
                r = supabase.table("fund_holdings").select("value, symbol").eq("fund_id", fid).eq("report_period", latest_date).range(start, start+999).execute()
                if not r.data: break
                rows.extend(r.data)
                if len(r.data) < 1000: break
                start += 1000
                
            latest_assets = sum([x['value'] for x in rows])
            
            # Check for Bad Symbols or Huge Values in this batch
            bad_syms = [x['symbol'] for x in rows if '=' in x['symbol'] or '.BA' in x['symbol']]
            if bad_syms:
                issues.append(f"{len(bad_syms)} Bad Syms")
                
            # Check for individual huge assets (> $200B) - except known
            # If Fund is NOT Berkshire, chances of >$200B position are low?
            # Citadel/Bridgewater have huge AUM but diversified.
            huge_pos = [x for x in rows if x['value'] > 200_000_000_000]
            if huge_pos:
                # Filter out likely valid ones? NO, assuming user wants anomalous check.
                # Just report count
                issues.append(f"{len(huge_pos)} >$200B")
        
        # C. Duplicates Check (Sample)
        # Hard to check without fetching all.
        # But if 'count' is massive compared to reasonable (e.g. > 10,000 for one fund?), might be dups.
        # Typical 13F: 100-2000 holdings * 40 quarters = 80,000 max.
        # If count > 100,000, suspicious?
        if count > 50000:
            issues.append("High Row Count")

        issue_str = ", ".join(issues) if issues else "OK"
        asset_str = f"${latest_assets:,.0f}"
        
        print(f"{name:<30} | {count:<6} | {date_range:<22} | {asset_str:<15} | {issue_str}")

if __name__ == "__main__":
    verify_all()
