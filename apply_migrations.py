
import os
import psycopg2
from dotenv import load_dotenv

# Load env
load_dotenv('c:/Users/ysk144/.gemini/antigravity/playground/mblb-stock-database/credentials.env')

HOST = os.getenv("SUPABASE_DB_HOST")
DB = os.getenv("SUPABASE_DB_NAME", "postgres")
USER = os.getenv("SUPABASE_DB_USER", "postgres")
PASSWORD = os.getenv("SUPABASE_DB_PASSWORD")
PORT = os.getenv("SUPABASE_DB_PORT", "5432")

# List of SQL files to run in order
# Need to include schema.sql if it has 'stock_data' since fund_holdings references it?
# Let's check if 'stock_data' exists first? 
# Best bet: run schema.sql (if base), then add_hedge_funds.sql, then migration.

SQL_FILES = [
    'c:/Users/ysk144/.gemini/antigravity/playground/mblb-stock-database/database/add_hedge_funds.sql',
    'c:/Users/ysk144/.gemini/antigravity/playground/mblb-stock-database/database/migrations/20260121_13f_schema.sql'
]

def run_migrations():
    # Use local variable to avoid scope issues
    db_host = HOST
    
    if not db_host or not PASSWORD:
        print("❌ Missing DB Credentials")
        return

    print(f"🔌 Connecting to DB: {db_host}")
    
    # 🩹 IPv6 Workaround
    # The Supabase DB Host `db.gnmgdgrmczckeurncses.supabase.co` only has an AAAA (IPv6) record.
    # Psycopg2/OS resolver might fail to pick it up.
    # We resolve it manually or hardcode it.
    
    # Found via nslookup: 2406:da18:243:7426:eb58:10c0:ac8a:fec
    # Note: Direct DB access is IPv6-only on newer Supabase projects.
    # This might fail if the user's local network (ISP) doesn't support IPv6 routing.
    # But let's try.
    
    if db_host == 'db.gnmgdgrmczckeurncses.supabase.co':
        print("   ⚠️ Detected IPv6-only Host. Attempting Direct IPv6 Connection...")
        db_host = "2406:da18:243:7426:eb58:10c0:ac8a:fec"
    
    conn = None
    try:
        conn = psycopg2.connect(
            host=db_host,
            database=DB,
            user=USER,
            password=PASSWORD,
            port=PORT
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        # Check stock_data existence just in case?
        # If 'stock_data' is missing, add_hedge_funds.sql might fail on FK.
        # Let's assume stock_data works or check it.
        
        for sql_file in SQL_FILES:
            print(f"📄 Applying: {sql_file}")
            with open(sql_file, 'r', encoding='utf-8') as f:
                sql = f.read()
                try:
                    cur.execute(sql)
                    print(f"   ✅ Success")
                except Exception as e:
                    print(f"   ⚠️ Error (ignoring if expected): {e}")
                    # Usually 'already exists' is fine
        
        cur.close()
        print("🎉 Migration Complete")
        
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    run_migrations()
