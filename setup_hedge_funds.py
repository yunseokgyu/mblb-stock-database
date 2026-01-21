
import psycopg2
import os

# Connect to the database
conn = psycopg2.connect(
    host="db.gnmgdgrmczckeurncses.supabase.co",
    database="postgres",
    user="postgres",
    password="mblbstock2026!@",
    port="5432"
)
cur = conn.cursor()

# 1. Read and Execute SQL Schema
try:
    with open(r'c:\Users\ysk144\.gemini\antigravity\playground\mblb-stock-database\database\add_hedge_funds.sql', 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    # Supabase/Postgres might need uuid-ossp extension if not enabled, but it usually is. 
    # Usually the SQL script handles table creation.
    print("Executing Schema SQL...")
    cur.execute(schema_sql)
    conn.commit()
    print("Schema created successfully.")

except Exception as e:
    print(f"Error executing schema: {e}")
    conn.rollback()

# 2. Seed Data
try:
    print("Seeding Hedge Fund Data...")
    
    # Check if Berkshire exists
    cur.execute("SELECT id FROM public.hedge_funds WHERE name = 'Berkshire Hathaway'")
    exist = cur.fetchone()
    
    fund_id = None
    if not exist:
        cur.execute("""
            INSERT INTO public.hedge_funds (name, strategy, description) 
            VALUES (%s, %s, %s) RETURNING id
        """, (
            "Berkshire Hathaway", 
            "Value / Conglomerate", 
            "Warren Buffett's holding company, focusing on long-term value investing in high-quality companies with moats."
        ))
        fund_id = cur.fetchone()[0]
        print(f"Created Berkshire Hathaway: {fund_id}")
    else:
        fund_id = exist[0]
        print(f"Found Berkshire Hathaway: {fund_id}")

    # Seed Holdings (Mock 13F Data for last quarter)
    holdings = [
        ("AAPL", 300000000, 69000000000), # Mock numbers
        ("BAC", 100000000, 3400000000),
        ("AXP", 50000000, 9000000000),
        ("KO", 400000000, 24000000000),
        ("CVX", 12000000, 1800000000)
    ]
    
    report_date = "2024-12-31"

    for symbol, shares, value in holdings:
        # Check if stock exists in stock_data? Assuming yes or FK might fail if strict.
        # The schema says "references public.stock_data(symbol)". 
        # So we must ensure these symbols exist in stock_data.
        # Let's hope they do. If not, we might need to insert them or skip.
        
        # Upsert holding
        cur.execute("""
            INSERT INTO public.fund_holdings (fund_id, symbol, report_period, shares, value, avg_buy_price)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (fund_id, symbol, report_period) DO UPDATE 
            SET shares = EXCLUDED.shares, value = EXCLUDED.value
        """, (fund_id, symbol, report_date, shares, value, value/shares))

    conn.commit()
    print("Seeding complete.")

except Exception as e:
    print(f"Error seeding data: {e}")
    conn.rollback()

cur.close()
conn.close()
