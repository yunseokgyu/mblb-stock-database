import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv(dotenv_path='../credentials.env')

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("Error: Missing Supabase Credentials")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    # Try to select from the table
    response = supabase.table('dividend_kings').select('*').limit(1).execute()
    print("Table 'dividend_kings' exists.")
    print(f"Row count: {len(response.data) if response.data else 0}")
except Exception as e:
    print(f"Error accessing 'dividend_kings': {e}")
