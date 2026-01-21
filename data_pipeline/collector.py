import os
import yfinance as yf
import json
from datetime import datetime
import time
from utils.retry_utils import retry

# Define JSON Output Path (Next.js Public Folder)
script_dir = os.path.dirname(os.path.abspath(__file__))
# Note: ../web-app/public is standard for Next.js static assets
JSON_OUTPUT_PATH = os.path.join(script_dir, '..', 'web-app', 'public', 'stock_data.json')
CHECKPOINT_FILE = os.path.join(script_dir, 'processed_symbols.json')

# Static List for MVP
TARGET_SYMBOLS = [
    "AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "META", "TSLA", # Tech
    "MMM", "KO", "JNJ", "PG", "O", "T", "MAIN", "SCHD", "JEPI", # Dividend
    "SPY", "QQQ", "VOO" # ETF
]

def load_checkpoint():
    if os.path.exists(CHECKPOINT_FILE):
        try:
            with open(CHECKPOINT_FILE, 'r') as f:
                return set(json.load(f))
        except:
            return set()
    return set()

def save_checkpoint(processed):
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(list(processed), f)

@retry(max_retries=3, initial_delay=2, backoff_factor=2)
def process_symbol(symbol):
    print(f"Processing {symbol}...")
    ticker = yf.Ticker(symbol)
    # Force fetch to trigger potential network errors enabling retry
    info = ticker.info
    
    # Map yfinance info to our schema
    price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose')
    if not price:
        print(f"Skipping {symbol}: No price data")
        return None

    market_cap = info.get('marketCap')
    sector = info.get('sector', 'ETF' if info.get('quoteType') == 'ETF' else 'Unknown')
    name = info.get('shortName') or info.get('longName')
    
    pe_ratio = info.get('trailingPE')
    pb_ratio = info.get('priceToBook')
    div_yield = info.get('dividendYield', 0)
    target_price = info.get('targetMeanPrice')
    
    valuation_metrics = {
        'dcf': target_price,
        'method': 'Analyst Target' if target_price else 'N/A',
        'stock_price': price,
        'pe_ratio_ttm': pe_ratio,
        'pb_ratio_ttm': pb_ratio,
        'div_yield_ttm': div_yield,
        'ev_ebitda_ttm': info.get('enterpriseToEbitda')
    }
    
    change_p = info.get('regularMarketChangePercent') or 0.0

    data = {
        'symbol': symbol,
        'name': name,
        'sector': sector,
        'industry': info.get('industry'),
        'market_cap': market_cap,
        'price': price,
        'changes_percentage': change_p, 
        'financials': {
            'revenue': info.get('totalRevenue'),
            'netIncome': info.get('netIncomeToCommon'),
            'grossProfits': info.get('grossProfits')
        }, 
        'valuation_metrics': valuation_metrics,
        'updated_at': datetime.utcnow().isoformat()
    }
    return data

def fetch_and_save_data():
    print(f"Starting data collection for {len(TARGET_SYMBOLS)} symbols via yfinance...")
    
    # Load existing data to append/update instead of overwrite if resuming
    all_stocks = []
    if os.path.exists(JSON_OUTPUT_PATH):
        try:
            with open(JSON_OUTPUT_PATH, 'r', encoding='utf-8') as f:
                all_stocks = json.load(f)
        except:
            all_stocks = []
            
    # Create a map for easy update
    stock_map = {item['symbol']: item for item in all_stocks}
    
    processed_symbols = load_checkpoint()
    
    # Check if we should reset checkpoint (e.g., if all done, or simple manual reset logic)
    # For this simple bot, we'll assume if len(processed) == len(TARGET), we reset.
    if len(processed_symbols) >= len(TARGET_SYMBOLS):
        print("All symbols previously processed. Resetting checkpoint for new run.")
        processed_symbols = set()
        save_checkpoint(processed_symbols)

    for symbol in TARGET_SYMBOLS:
        if symbol in processed_symbols:
            print(f"Skipping {symbol} (Already processed).")
            continue
            
        try:
            data = process_symbol(symbol)
            if data:
                stock_map[symbol] = data
                processed_symbols.add(symbol)
                save_checkpoint(processed_symbols)
                
                # Intermediate save to JSON (Safety)
                with open(JSON_OUTPUT_PATH, 'w', encoding='utf-8') as f:
                    json.dump(list(stock_map.values()), f, indent=2, ensure_ascii=False)
                    
        except Exception as e:
            print(f"Failed to process {symbol} after retries: {e}")
            # Do not add to processed_symbols so it tries again next run
            
    # Final Save
    final_list = list(stock_map.values())
    with open(JSON_OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Successfully saved {len(final_list)} stocks to {JSON_OUTPUT_PATH}")

if __name__ == "__main__":
    fetch_and_save_data()
