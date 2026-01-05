import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='../credentials.env')

SUPABASE_DB_HOST = os.getenv('SUPABASE_DB_HOST') # e.g. aws-0-us-east-1.pooler.supabase.com
SUPABASE_DB_NAME = os.getenv('SUPABASE_DB_NAME') # postgres
SUPABASE_DB_USER = os.getenv('SUPABASE_DB_USER') # postgres.projectref
SUPABASE_DB_PASSWORD = os.getenv('SUPABASE_DB_PASSWORD')
SUPABASE_DB_PORT = os.getenv('SUPABASE_DB_PORT', '5432')

if not all([SUPABASE_DB_HOST, SUPABASE_DB_NAME, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD]):
    print("Error: Missing Database Credentials in credentials.env")
    # Try parsing SUPABASE_URL if specific DB creds are missing (fallback)
    # But usually credentials.env has them if I set it up correctly.
    # Let's hope credentials.env has everything.
    exit(1)

def run_migration(sql_file_path):
    try:
        conn = psycopg2.connect(
            host=SUPABASE_DB_HOST,
            database=SUPABASE_DB_NAME,
            user=SUPABASE_DB_USER,
            password=SUPABASE_DB_PASSWORD,
            port=SUPABASE_DB_PORT
        )
        cur = conn.cursor()
        
        with open(sql_file_path, 'r') as f:
            sql_commands = f.read()
            
        cur.execute(sql_commands)
        conn.commit()
        
        cur.close()
        conn.close()
        print(f"Successfully executed {sql_file_path}")
        
    except Exception as e:
        print(f"Migration Failed: {e}")
        exit(1)

if __name__ == "__main__":
    run_migration('../database/dividend_kings.sql')
