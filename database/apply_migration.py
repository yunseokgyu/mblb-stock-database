import psycopg2
import os
from dotenv import load_dotenv

# Load credentials
load_dotenv(dotenv_path='../credentials.env')

SUPABASE_DB_HOST = os.getenv('SUPABASE_DB_HOST')
SUPABASE_DB_NAME = os.getenv('SUPABASE_DB_NAME')
SUPABASE_DB_USER = os.getenv('SUPABASE_DB_USER')
SUPABASE_DB_PASSWORD = os.getenv('SUPABASE_DB_PASSWORD')
SUPABASE_DB_PORT = os.getenv('SUPABASE_DB_PORT')

def run_migration():
    if not all([SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD]):
        print("❌ Missing database credentials")
        return


    conn = None
    cur = None
    try:
        conn = psycopg2.connect(
            host=SUPABASE_DB_HOST,
            database=SUPABASE_DB_NAME,
            user=SUPABASE_DB_USER,
            password=SUPABASE_DB_PASSWORD,
            port=SUPABASE_DB_PORT
        )
        cur = conn.cursor()

        migration_file = 'migrations/20260121_13f_schema.sql'
        with open(migration_file, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        print(f"Running migration: {migration_file}")
        cur.execute(sql)
        conn.commit()
        print("✅ Migration applied successfully!")

    except Exception as e:
        print(f"❌ Error applying migration: {e}")
        if conn:
            conn.rollback()
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    run_migration()
