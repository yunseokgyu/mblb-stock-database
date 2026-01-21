import os
import requests
import json
import time
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client, Client
from utils import thirteen_f_utils, market_data_utils

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'credentials.env')
load_dotenv(dotenv_path=dotenv_path)

FMP_API_KEY = os.getenv('FMP_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not all([FMP_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
    print("❌ Error: Missing API Keys in credentials.env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class ThirteenFCollector:
    def __init__(self):
        self.base_url = "https://financialmodelingprep.com/api/v3"

    def resolve_ticker(self, name, cusip):
        """Resolve Company Name/CUSIP to Ticker Symbol."""
        if not name:
            return None
            
        try:
            # Clean name for better search (e.g. "APPLE INC" -> "APPLE")
            clean_name = name.replace(" INC", "").replace(" CORP", "").replace(" LTD", "").strip()
            
            # Try Yahoo Search via utils
            symbol = market_data_utils.search_symbol_yahoo(clean_name)
            if symbol:
                return symbol
            
            # Fallback: Try raw name
            if clean_name != name:
                symbol = market_data_utils.search_symbol_yahoo(name)
                if symbol:
                    return symbol
                    
        except Exception as e:
            print(f"⚠️ Error resolving ticker for {name}: {e}")
            pass
            
        print(f"⚠️ Could not resolve ticker for {name} ({cusip})")
        return None

    def upsert_holding(self, fund_id, symbol, shares, value, price, date):
        if not symbol:
            return

        # 0. Ensure Stock Exists in stock_data (Fix FK Error)
        try:
             stock_record = {
                "symbol": symbol,
                "name": symbol,        # Basic name (will be enriched later hopefully)
                "sector": "Unknown"    # Placeholder
            }
             supabase.table("stock_data").upsert(stock_record, on_conflict="symbol").execute()
        except Exception as e:
            pass

        data = {
            "fund_id": fund_id,
            "symbol": symbol,
            "shares": shares,
            "value": value,
            "report_period": date,
            "avg_buy_price": float(price) if price else 0
        }
        
        try:
            # Using upsert to handle potential duplicates for same quarter
            supabase.table("fund_holdings").upsert(data, on_conflict="fund_id, symbol, report_period").execute()
            print(f"✅ Saved {symbol}: {shares:,.0f} shares")
        except Exception as e:
            print(f"❌ DB Save Error ({symbol}): {e}")

    def run_for_cik(self, fund_id, cik, fund_name, historical=False):
        print(f"\n🚀 Processing {fund_name} (CIK: {cik})... Mode: {'Historical' if historical else 'Latest Only'}")
        
        # 1. Get List of Filings to Process
        tasks = [] # List of (date, xml_url)
        if historical:
            tasks = thirteen_f_utils.get_all_13f_xml_urls(cik)
        else:
            url = thirteen_f_utils.get_latest_13f_xml_url(cik)
            if url:
                # We need the date for the latest one. get_latest_13f_xml_url doesn't return date.
                # Use a default or fetch it? 
                # For consistency, let's just use the historical finder but valid for 1 if not historical
                # OR just fetch the latest date. 
                # Let's trust the historical finder's first result is the latest.
                all_urls = thirteen_f_utils.get_all_13f_xml_urls(cik)
                if all_urls:
                    tasks = [all_urls[0]]

        if not tasks:
            print("❌ No 13F filings found to process.")
            return

        print(f"   📅 Found {len(tasks)} filings to process.")

        for report_date, xml_url in tasks:
            print(f"   Start: {report_date}")

            # 2. Check for Resumption (Skip if already in DB)
            try:
                # Check if we have holdings for this fund and date
                res = supabase.table("fund_holdings") \
                    .select("id", count="exact", head=True) \
                    .eq("fund_id", fund_id) \
                    .eq("report_period", report_date) \
                    .execute()
                
                # If we have a significant number of records (e.g. > 5), assume complete.
                # Adjust threshold as needed. 
                if res.count and res.count > 5:
                    print(f"   ⏭️  Skipping {report_date} (Found {res.count} records in DB)")
                    continue
            except Exception as e:
                print(f"   ⚠️ Checkpoint check failed: {e}")

            
            holdings = thirteen_f_utils.parse_13f_infotable(xml_url)
            if not holdings:
                print(f"   ❌ No holdings parsed for {report_date}")
                continue

            # Process top 50 by value to save time/space if needed, 
            # OR process ALL for full history? 
            # User said "all data", let's do top 100 to be safe but not crazy slow
            holdings.sort(key=lambda x: x.get('value', 0), reverse=True)
            top_holdings = holdings[:100]
            
            print(f"   Processing {len(top_holdings)} holdings for {report_date}...")
            
            for h in top_holdings:
                name = h.get('name')
                cusip = h.get('cusip')
                shares = h.get('shares')
                value = h.get('value')
                
                # Resolve Ticker
                symbol = self.resolve_ticker(name, cusip)
                if not symbol:
                    continue
                
                # Get Price (Quarter Average) - Optimization: Cache?
                # market_data_utils.get_quarter_average_price might be slow if called 100 * 50 times.
                # For now, rely on its internal caching/yfinance cache.
                est_price = market_data_utils.get_quarter_average_price(symbol, report_date)
                if est_price == 0:
                    est_price = market_data_utils.get_current_price(symbol) # Fallback
                
                self.upsert_holding(fund_id, symbol, shares, value, est_price, report_date)
            
            # Be polite to SEC to avoid 429s even with retry logic
            time.sleep(2)


if __name__ == "__main__":
    from dotenv import load_dotenv
    import os
    from supabase import create_client
    
    # Load credentials
    # Use absolute path to ensure we find the file
    env_path = 'c:/Users/ysk144/.gemini/antigravity/playground/mblb-stock-database/credentials.env'
    load_dotenv(env_path)
    
    # ... [Previous imports]
    import httpx
    from supabase import create_client, Client, ClientOptions
    
    # Custom Transport to bypass local DNS issues
    # We manually resolve the hostname using a hardcoded valid IP or Google DNS logic if needed.
    # Since we know the IP from the manual check (172.64.149.246), we can map it.
    
    # Better approach: Configure httpx to access via IP but correct Host header?
    # Actually, Supabase Python client accepts 'options' with a custom http_client.
    
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    
    if not SUPABASE_URL:
        # ... error handling
        print("❌ Missing SUPABASE_URL")
        exit(1)

    print(f"🔌 Connecting to Supabase: {SUPABASE_URL}")
    
    try:
        # Standard connect
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Test connection
        response = supabase.table("hedge_funds").select("id").limit(1).execute()
        print("   ✅ Connection Successful!")
        
    except Exception as e:
        print(f"❌ DB Connection Error: {e}")
        print("   👉 If this is a DNS error, please ensure your DNS is set to 8.8.8.8")
        exit(1)

    # 1. Fetch Berkshire Hathaway ID from DB
    # Target Funds List
    FUNDS = [
        {"name": "Berkshire Hathaway", "cik": "0001067983", "strategy": "Value Investing", "description": "Warren Buffett's holding company"},
        {"name": "Bridgewater Associates", "cik": "0001350694", "strategy": "Global Macro", "description": "Ray Dalio's firm, one of the world's largest hedge funds"},
        {"name": "Renaissance Technologies", "cik": "0001037389", "strategy": "Quantitative", "description": "Jim Simons' quantitative trading firm"},
        {"name": "Bill & Melinda Gates Foundation", "cik": "0001166559", "strategy": "Endowment", "description": "One of the largest charitable foundations"},
        {"name": "Pershing Square Capital", "cik": "0001336528", "strategy": "Activist", "description": "Bill Ackman's activist hedge fund"},
        {"name": "Third Point", "cik": "0001040273", "strategy": "Event Driven", "description": "Daniel Loeb's event-driven firm"},
        {"name": "Citadel Advisors", "cik": "0001423053", "strategy": "Multi-Strategy", "description": "Ken Griffin's multi-strategy hedge fund"}
    ]

    print(f"📋 Starting Collection for {len(FUNDS)} Funds...")

    for fund_info in FUNDS:
        print(f"\n🔹 Processing: {fund_info['name']}")
        
        # 1. Check/Create Fund in DB
        try:
             # Check existence by CIK
            res = supabase.table("hedge_funds").select("id, name, cik").eq("cik", fund_info['cik']).execute()
            
            fund_id = None
            if res.data:
                fund_id = res.data[0]['id']
                print(f"   ✅ Found in DB (ID: {fund_id})")
            else:
                print(f"   ⚠️ Missing in DB. Creating...")
                create_res = supabase.table("hedge_funds").insert(fund_info).execute()
                if create_res.data:
                    fund_id = create_res.data[0]['id']
                    print(f"   ✅ Created (ID: {fund_id})")
                else:
                    print(f"   ❌ Failed to create {fund_info['name']}")
                    continue
            
            # 2. Run Collector
            if fund_id:
                collector = ThirteenFCollector()
                # User requested FULL history backfill
                collector.run_for_cik(fund_id, fund_info['cik'], fund_info['name'], historical=True)
                
        except Exception as e:
            print(f"   ❌ Error processing {fund_info['name']}: {e}")
            continue

    # ... end of block

