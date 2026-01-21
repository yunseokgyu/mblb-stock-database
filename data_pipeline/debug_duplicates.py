
import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv('../credentials.env')

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("❌ Error: Missing API Keys")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 1. Count Total Rows
print("Fetching total count...")
res = supabase.table("fund_holdings").select("id", count="exact", head=True).execute()
print(f"Total Rows: {res.count}")

# 2. Check for Duplicates (Group by fund_id, symbol, report_period)
# Since we can't do GROUP BY easily via API, we'll fetch a sample
target_fund_id = "e5c0779e-996c-4094-9cb4-60e8f69df161" # Berkshire Hathaway
print(f"\nChecking duplicates for Fund ID: {target_fund_id}")

# Fetch all holdings for this fund
all_holdings = []
start = 0
step = 1000
while True:
    print(f"Fetching {start}..{start+step}")
    res = supabase.table("fund_holdings").select("symbol, report_period").eq("fund_id", target_fund_id).range(start, start+step-1).execute()
    data = res.data
    all_holdings.extend(data)
    if len(data) < step:
        break
    start += step

print(f"Fetched {len(all_holdings)} rows for fund.")

# Analyze for dups
seen = {}
duplicates = 0
for h in all_holdings:
    key = f"{h['symbol']}_{h['report_period']}"
    if key in seen:
        duplicates += 1
    seen[key] = seen.get(key, 0) + 1

print(f"Found {duplicates} duplicates out of {len(all_holdings)} rows.")
if duplicates > 0:
    print("Sample Duplicates:")
    count = 0
    for k, v in seen.items():
        if v > 1:
            print(f"  {k}: {v} times")
            count += 1
            if count > 5: break
