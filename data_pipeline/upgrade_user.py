import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv(dotenv_path='../credentials.env')

FMP_API_KEY = os.getenv('FMP_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Initialize Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

EMAIL = "felizamigokr@gmail.com"

print(f"Upgrading user {EMAIL} to Premium...")

# 1. Fetch User Profile by Email
# Note: 'profiles' table has 'email' column based on schema.sql
response = supabase.table('profiles').select("*").eq('email', EMAIL).execute()

if not response.data:
    print(f"Error: User with email {EMAIL} not found in 'profiles' table.")
    print("If the user just signed up, they might not have a profile row yet if the trigger failed or isn't set up.")
    # Fallback: Try to update directly if row exists? No, we need ID usually.
    # Actually, we can update based on email filter if RLS allows or if using Service Key.
    # If using ANON key, we can typically only update OWN profile.
    # WAIT: SUPABASE_KEY in credentials.env might be the Anon key.
    # If it is Anon key, we CANNOT update another user's profile.
    # We need to check if the script works. If not, we might need a workaround.
    exit(1)

user_id = response.data[0]['id']
print(f"Found User ID: {user_id}")

# 2. Update to Premium
update_response = supabase.table('profiles').update({'is_premium': True}).eq('id', user_id).execute()

if update_response.data:
    print("Success! User is now Premium.")
else:
    print("Update failed. Check permissions.")
    print(update_response)
