
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

# 1. Count Total Stocks
print("Fetching total stock count...")
res = supabase.table("stock_data").select("symbol", count="exact", head=True).execute()
print(f"Total Stocks: {res.count}")

# 2. Check for Duplicates in batches
print("\nChecking for duplicates in stock_data...")
start = 0
step = 1000
seen_symbols = {}
duplicates = 0
sample_dupes = []

while True:
    print(f"Scanning {start}..{start+step} (Total so far: {len(seen_symbols)})")
    res = supabase.table("stock_data").select("symbol").range(start, start+step-1).execute()
    data = res.data
    
    if not data:
        break
        
    for row in data:
        sym = row['symbol']
        if sym in seen_symbols:
            duplicates += 1
            if len(sample_dupes) < 10:
                sample_dupes.append(sym)
        seen_symbols[sym] = seen_symbols.get(sym, 0) + 1
        
    if len(data) < step:
        break
    start += step

print(f"\nAnalysis Complete.")
print(f"Unique Symbols: {len(seen_symbols)}")
print(f"Duplicate Entries: {duplicates}")

if duplicates > 0:
    print(f"Sample Duplicates: {sample_dupes}")
    print("Example counts:")
    for d in sample_dupes[:5]:
        print(f"  {d}: {seen_symbols[d]}")
