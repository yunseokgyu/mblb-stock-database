
import psycopg2
import os
import uuid
import random

# Connect to the database
conn = psycopg2.connect(
    host="db.gnmgdgrmczckeurncses.supabase.co",
    database="postgres",
    user="postgres",
    password="mblbstock2026!@",
    port="5432"
)
cur = conn.cursor()

def get_or_create_fund(name, strategy, description, cik=None):
    cur.execute("SELECT id FROM public.hedge_funds WHERE name = %s", (name,))
    exist = cur.fetchone()
    
    if exist:
        print(f"Found Fund: {name}")
        # Update CIK if missing
        if cik:
             cur.execute("UPDATE public.hedge_funds SET cik = %s WHERE id = %s", (cik, exist[0]))
        return exist[0]
    else:
        cur.execute("""
            INSERT INTO public.hedge_funds (name, strategy, description, cik)
            VALUES (%s, %s, %s, %s) RETURNING id
        """, (name, strategy, description, cik))
        new_id = cur.fetchone()[0]
        print(f"Created Fund: {name}")
        return new_id

def seed_holdings(fund_id, holdings, report_date="2024-12-31"):
    for symbol, shares, value in holdings:
        # Calculate random avg_buy_price based on value for variety
        # This is just a mock approximation
        avg_price = (value / shares) * random.uniform(0.8, 1.2)
        
        cur.execute("""
            INSERT INTO public.fund_holdings (fund_id, symbol, report_period, shares, value, avg_buy_price)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (fund_id, symbol, report_period) DO UPDATE 
            SET shares = EXCLUDED.shares, value = EXCLUDED.value
        """, (fund_id, symbol, report_date, shares, value, avg_price))

try:
    print("Starting Hedge Fund Seeding...")
    
    # 1. Berkshire Hathaway (CIK: 0001067983)
    berkshire_id = get_or_create_fund(
        "Berkshire Hathaway", 
        "Value / Conglomerate", 
        "Warren Buffett's holding company, focusing on long-term value investing in high-quality companies with moats.",
        "0001067983"
    )
    berkshire_holdings = [
        ("AAPL", 915560382, 174300000000), 
        ("BAC", 1032852006, 34700000000),
        ("AXP", 151610700, 28400000000),
        ("KO", 400000000, 23500000000),
        ("CVX", 126093326, 18600000000),
        ("O", 3000000, 150000000), # Mock add
        ("KR", 50000000, 2300000000)
    ]
    seed_holdings(berkshire_id, berkshire_holdings)

    # 2. Bridgewater Associates (CIK: 0001350694)
    bridgewater_id = get_or_create_fund(
        "Bridgewater Associates", 
        "Global Macro", 
        "Ray Dalio's firm, focusing on economic trends (inflation, currency exchange rates, GDP) to guide investment.",
        "0001350694"
    )
    bridgewater_holdings = [
        ("IVV", 1000000, 450000000), # S&P 500 ETF (Mock)
        ("IEMG", 2500000, 120000000), # Emerging Markets
        ("GOOGL", 500000, 70000000),
        ("META", 400000, 120000000),
        ("PEP", 800000, 135000000),
        ("MCD", 300000, 85000000)
    ]
    seed_holdings(bridgewater_id, bridgewater_holdings)

    # 3. Renaissance Technologies (CIK: 0001037389)
    rentec_id = get_or_create_fund(
        "Renaissance Technologies", 
        "Quantitative / HFT", 
        "Founded by Jim Simons, known for mathematical models and Medallion Fund's high returns.",
        "0001037389"
    )
    rentec_holdings = [
        ("NVO", 1500000, 180000000), 
        ("META", 1200000, 350000000),
        ("VRTX", 400000, 160000000),
        ("PLTR", 5000000, 85000000),
        ("AMZN", 1000000, 150000000),
        ("GILD", 2000000, 140000000)
    ]
    seed_holdings(rentec_id, rentec_holdings)

    # 4. Pershing Square (CIK: 0001336528)
    pershing_id = get_or_create_fund(
        "Pershing Square Capital", 
        "Activist Value", 
        "Bill Ackman's activist hedge fund, taking concentrated positions in undervalued companies to push for change.",
        "0001336528"
    )
    pershing_holdings = [
        ("CMG", 800000, 1800000000), # Chipotle
        ("QSR", 23000000, 1700000000), # Restaurant Brands Intl
        ("GOOG", 10000000, 1400000000),
        ("HLT", 9000000, 1600000000), # Hilton
        ("HHC", 1500000, 100000000)   # Howard Hughes (Mock)
    ]
    seed_holdings(pershing_id, pershing_holdings)

    conn.commit()
    print("✅ Seeding Complete!")

except Exception as e:
    print(f"❌ Error seeding data: {e}")
    conn.rollback()

finally:
    cur.close()
    conn.close()
