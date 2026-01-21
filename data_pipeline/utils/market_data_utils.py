import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
import requests
from typing import Optional, Dict

def get_current_price(symbol: str) -> float:
    """Get the latest market price for a symbol."""
    try:
        if not symbol:
            return 0.0
        ticker = yf.Ticker(symbol)
        # fast_info is suitable for latest metadata
        price = ticker.fast_info.last_price
        return float(price) if price else 0.0
    except Exception as e:
        print(f"⚠️ Error fetching current price for {symbol}: {e}")
        return 0.0

def get_quarter_average_price(symbol: str, quarter_end_date: str) -> float:
    """
    Calculate average price for the quarter ending on the given date.
    quarter_end_date format: YYYY-MM-DD
    """
    try:
        if not symbol:
            return 0.0
            
        end_date = datetime.strptime(quarter_end_date, "%Y-%m-%d")
        start_date = end_date - timedelta(days=90)
        
        # Add buffer for yfinance to ensure we cover the range
        start_str = start_date.strftime("%Y-%m-%d")
        # end date in yfinance is exclusive, so +1 day
        end_str = (end_date + timedelta(days=1)).strftime("%Y-%m-%d")
        
        # Suppress progress bar
        df = yf.download(symbol, start=start_str, end=end_str, progress=False, actions=False)
        
        if df.empty:
            return 0.0
            
        # Use Adj Close if available, else Close
        col = 'Adj Close' if 'Adj Close' in df.columns else 'Close'
        avg_price = df[col].mean()
        
        return float(avg_price)
        
    except Exception as e:
        print(f"⚠️ Error fetching historical price for {symbol}: {e}")
        return 0.0

def get_dcf_metrics(symbol: str) -> Dict:
    """
    Fetch basic metrics needed for a quick DCF or valuation check.
    """
    try:
        if not symbol:
            return {}
            
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        return {
            'symbol': symbol,
            'current_price': info.get('currentPrice'),
            'market_cap': info.get('marketCap'),
            'pe_ratio': info.get('trailingPE'),
            'forward_pe': info.get('forwardPE'),
            'beta': info.get('beta'),
            'dividend_yield': info.get('dividendYield'),
            'fcf': info.get('freeCashflow'), 
            'revenue_growth': info.get('revenueGrowth'),
            'target_est': info.get('targetMeanPrice')
        }
    except Exception as e:
        return {}

def search_symbol_yahoo(query: str) -> Optional[str]:
    """
    Search for a stock symbol using Yahoo Finance Auto-Complete API.
    Useful for resolving 'Apple Inc' -> 'AAPL'.
    """
    try:
        url = "https://query2.finance.yahoo.com/v1/finance/search"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        params = {
            'q': query,
            'quotesCount': 1,
            'newsCount': 0,
            'enableFuzzyQuery': 'true',
            'quotesQueryId': 'tss_match_phrase_query'
        }
        
        resp = requests.get(url, params=params, headers=headers, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if 'quotes' in data and len(data['quotes']) > 0:
                quote = data['quotes'][0]
                symbol = quote['symbol']
                # Preference for US listings (avoiding .DE, .L, etc if possible, unless query suggests it)
                # But for now, take the top hit.
                return symbol
    except Exception as e:
        print(f"⚠️ Yahoo Search Error for {query}: {e}")
    
    return None
