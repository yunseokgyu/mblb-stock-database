
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('../credentials.env')
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

def list_columns():
    # Use a trick: select * limit 1, check keys
    res = supabase.table("stock_data").select("*").limit(1).execute()
    if res.data:
        print("Columns:", res.data[0].keys())
    else:
        # If empty, insert a dummy and check? No, checking logic.
        # Try to insert a dummy with all imagined columns and see error?
        print("Table empty. Suggests columns based on error msg or previous knowledge.")
        
if __name__ == "__main__":
    list_columns()
