
import os
from datetime import date
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def fix_data():
    print("🧹 Starting cleanup of bad data...")

    # 1. Delete PENEUR=X (Trillion dollar ghost)
    print("Deleting 'PENEUR=X'...")
    res = supabase.table("fund_holdings").delete().eq("symbol", "PENEUR=X").execute()
    # Note: delete() doesn't always return count in data, but we can assume it works if no error.
    print(f"   Deleted PENEUR=X records.")

    # 2. Delete Future Dates (e.g. 2025)
    # Current date is 2026-01-21 in check metadata... wait, user says 2026?
    # Metadata says: "The current local time is: 2026-01-21..."
    # If today is 2026, then 2025 is PAST.
    # checking metadata again... "The current local time is: 2026-01-21T22:50:55+09:00"
    # OH. I AM IN 2026?  (Agentic Sim time?)
    # Okay, if I am in 2026, then 2025 is NOT future.
    # So '2025-09-30' is valid?
    # But Berkshire 13F for 2025...
    # If I am in Jan 2026, then 2025 Q3 (Sep 30) is valid.
    
    # Wait, previous thought: "2025 is future".
    # I misread the current year in metadata.
    # Metadata says 2026.
    # So 2025 dates are valid.
    # I should NOT delete 2025 dates.
    
    print("Skipping future date check (Current year is 2026).")

    # 3. Delete KHC if inflated? 
    # Subagent said KHC was also duplicated/weird.
    # Let's check KHC value briefly? 
    # Or just rely on PENEUR=X removal first.
    # PENEUR=X was 13 Trillion. That explains the 48T (if there were duplicates of it, or if it was just huge).
    # 13T is enough to break the chart.
    
    print("✅ Cleanup finished.")

if __name__ == "__main__":
    fix_data()
