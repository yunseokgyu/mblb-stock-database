import os
from dotenv import load_dotenv

# Load env
load_dotenv(dotenv_path='../credentials.env')

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
fmp = os.getenv('FMP_API_KEY')

print(f"FMP_API_KEY Linked: {'Yes' if fmp and 'your_' not in fmp else 'No (Placeholder or Missing)'}")

if url:
    print(f"SUPABASE_URL Length: {len(url)}")
    print(f"SUPABASE_URL Starts with https://: {url.startswith('https://')}")
    print(f"SUPABASE_URL Contains 'your_supabase': {'your_supabase' in url}")
    # Print first 5 chars to verify protocol
    print(f"SUPABASE_URL Head: {url[:8]}...") 
else:
    print("SUPABASE_URL is None")

if key:
    print(f"SUPABASE_KEY Linked: {'Yes' if len(key) > 20 and 'your_' not in key else 'No (Placeholder or Weak)'}")
else:
    print("SUPABASE_KEY is None")
