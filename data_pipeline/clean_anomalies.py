
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def clean_anomalies():
    print("🧹 Starting anomaly cleanup...")

    # 1. Delete Bad Symbols
    # Fetch all checking for bad patterns
    print("Scanning for bad symbols...")
    start = 0
    batch = 5000
    ids_to_back = []
    
    # Suffixes to remove
    # Common Yahoo noise: =F, =X, .BA (Buenos Aires), .SA (Sao Paolo), .T (Tokyo), .L (London), .MX (Mexico)
    bad_suffixes = ["=F", "=X", ".BA", ".SA", ".MX", ".T", ".L", ".HK", ".KS", ".TWO"] 
    # Also anything with usually long extensions? 
    # Just stick to observed ones + generic =.
    
    while True:
        res = supabase.table("fund_holdings").select("id, symbol, value").range(start, start+batch-1).execute()
        if not res.data: break
        
        for row in res.data:
            sym = row['symbol']
            val = row['value']
            
            # Check symbol
            is_bad = False
            if "=" in sym: is_bad = True
            for s in bad_suffixes:
                if sym.endswith(s): is_bad = True
            
            if is_bad:
                print(f"   Deleting Bad Symbol: {sym}")
                supabase.table("fund_holdings").delete().eq("id", row['id']).execute()
            
            # Check Value > 500 Billion (500 * 10^9 = 500,000,000,000)
            # 500 Billion.
            elif val > 500_000_000_000:
                print(f"   Fixing Inflated Value: {sym} (${val:,.0f})")
                new_val = val / 1000
                supabase.table("fund_holdings").update({"value": new_val}).eq("id", row['id']).execute()

        if len(res.data) < batch: break
        start += batch
        print(f"   Scanned up to {start}...")

    print("✅ Cleanup finished.")

if __name__ == "__main__":
    clean_anomalies()
