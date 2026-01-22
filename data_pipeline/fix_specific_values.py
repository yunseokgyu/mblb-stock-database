
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def fix_specifics():
    target_fund = "e5c0779e-996c-4094-9cb4-60e8f69df161"
    
    # 1. Fix AXP (Reduce to ~$38B)
    print("Fixing AXP...")
    # Update latest period AXP
    # Fetch ID first
    res = supabase.table("fund_holdings").select("id, value").eq("symbol", "AXP").eq("fund_id", target_fund).gt("value", 100_000_000_000).execute()
    for row in res.data:
        print(f"   Adjusting AXP row {row['id']} (Old: ${row['value']:,.0f})")
        # Set to approx $35B (or divide by 10?)
        # $381B / 10 = $38.1B. This matches market reality.
        new_val = row['value'] / 10
        supabase.table("fund_holdings").update({"value": new_val}).eq("id", row['id']).execute()

    # 2. Fix VRSN (Reduce from $272B to ~$2.7B -> Divide by 100)
    print("Fixing VRSN...")
    res = supabase.table("fund_holdings").select("id, value").eq("symbol", "VRSN").eq("fund_id", target_fund).gt("value", 50_000_000_000).execute()
    for row in res.data:
        print(f"   Adjusting VRSN row {row['id']} (Old: ${row['value']:,.0f})")
        new_val = row['value'] / 100
        supabase.table("fund_holdings").update({"value": new_val}).eq("id", row['id']).execute()

    # 3. Delete Giant Anomalies (> $50B) if NOT in safe list
    print("Deleting other anomalies > $50B...")
    safe_list = ['AAPL', 'BAC', 'KO', 'CVX', 'KHC', 'MCO', 'OXY', 'C', 'AXP', 'VRSN'] # Included AXP/VRSN to verify they are safe now (or if script re-runs)
    
    # Fetch huge values
    res = supabase.table("fund_holdings").select("id, symbol, value").eq("fund_id", target_fund).gt("value", 50_000_000_000).execute()
    for row in res.data:
        sym = row['symbol']
        if sym not in safe_list:
            print(f"   Deleting {sym}: ${row['value']:,.0f}")
            supabase.table("fund_holdings").delete().eq("id", row['id']).execute()
            
    print("✅ Specific fixes applied.")

if __name__ == "__main__":
    fix_specifics()
