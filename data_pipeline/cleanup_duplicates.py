
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

def cleanup_duplicates():
    print("Fetching all fund_holdings to check for metadata duplicates...")
    
    # Fetch relevant columns (all rows)
    # Uses pagination
    all_rows = []
    start = 0
    batch_size = 1000
    
    while True:
        print(f"Fetching rows {start}...")
        res = supabase.table("fund_holdings").select("id, fund_id, symbol, report_period, created_at").range(start, start + batch_size - 1).execute()
        data = res.data
        if not data:
            break
        all_rows.extend(data)
        if len(data) < batch_size:
            break
        start += batch_size

    print(f"Total rows fetched: {len(all_rows)}")

    # Group by (fund_id, symbol, report_period)
    groups = {}
    for row in all_rows:
        key = (row['fund_id'], row['symbol'], row['report_period'])
        if key not in groups:
            groups[key] = []
        groups[key].append(row)

    # Identify duplicates
    ids_to_delete = []
    duplicate_groups = 0
    
    for key, rows in groups.items():
        if len(rows) > 1:
            duplicate_groups += 1
            # Sort by created_at desc (keep latest) or asc (keep first). 
            # Let's keep the one created LATEST? Or FIRST? 
            # Ideally keep the first one to avoid "new" IDs if referenced elsewhere?
            # Actually, let's keep the one with the LATEST created_at (most recent update?)
            # Or usually FIRST is safer for strict continuity. Let's keep the FIRST one (oldest).
            rows.sort(key=lambda x: x['created_at'])
            
            # Keep rows[0], delete rest
            for r in rows[1:]:
                ids_to_delete.append(r['id'])

    print(f"Found {duplicate_groups} groups with duplicates.")
    print(f"Total records to delete: {len(ids_to_delete)}")

    if not ids_to_delete:
        print("No duplicates found to delete.")
        return

    # Delete in batches
    print("Deleting duplicates...")
    batch_size = 100
    for i in range(0, len(ids_to_delete), batch_size):
        batch = ids_to_delete[i:i+batch_size]
        print(f"Deleting batch {i//batch_size + 1}/{len(ids_to_delete)//batch_size + 1} ({len(batch)} items)")
        supabase.table("fund_holdings").delete().in_("id", batch).execute()

    print("✅ Cleanup complete.")

if __name__ == "__main__":
    cleanup_duplicates()
