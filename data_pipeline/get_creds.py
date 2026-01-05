from dotenv import load_dotenv
import os
load_dotenv('../credentials.env')
print(f"HOST={os.getenv('SUPABASE_DB_HOST')}")
print(f"USER={os.getenv('SUPABASE_DB_USER')}")
print(f"NAME={os.getenv('SUPABASE_DB_NAME')}")
print(f"PASS={os.getenv('SUPABASE_DB_PASSWORD')}")
