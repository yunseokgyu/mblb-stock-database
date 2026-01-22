
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

target_fund = "e5c0779e-996c-4094-9cb4-60e8f69df161"
target_symbol = "AXP"

print(f"Fetching rows for {target_fund} / {target_symbol}")
res = supabase.table("fund_holdings").select("id, fund_id, symbol, report_period, created_at, shares, value").eq("fund_id", target_fund).eq("symbol", target_symbol).execute()

data = res.data
print(f"Fetched {len(data)} rows.")

groups = {}
print("\n--- Recent AXP Rows ---")
for row in data:
    key = (row['fund_id'], row['symbol'], row['report_period'])
    val = row.get('value', 0)
    shares = row.get('shares', 0)
    
    if '2024' in str(row['report_period']) or '2025' in str(row['report_period']):
        print(f"Row: {row['report_period']} | Shares: {shares} | Value: {val:,.0f}")
    
    if key not in groups:
        groups[key] = []
    groups[key].append(row)

print("\nGroups found:")
for k, v in groups.items():
    print(f"Key: {k} | Count: {len(v)}")
