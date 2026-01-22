
import yfinance as yf

def test_yf(symbol):
    t = yf.Ticker(symbol)
    info = t.info
    print(f"--- {symbol} ---")
    print(f"dividendYield: {info.get('dividendYield')}")
    print(f"dividendRate: {info.get('dividendRate')}")
    print(f"trailingPE: {info.get('trailingPE')}")
    print(f"forwardPE: {info.get('forwardPE')}")
    print(f"pegRatio: {info.get('pegRatio')}")
    print(f"priceToBook: {info.get('priceToBook')}")
    print(f"beta: {info.get('beta')}")
    print(f"revenueGrowth: {info.get('revenueGrowth')}")
    print(f"returnOnEquity: {info.get('returnOnEquity')}")
    print(f"sector: {info.get('sector')}")
    print(f"industry: {info.get('industry')}")

if __name__ == "__main__":
    test_yf('AAPL')
    test_yf('KO')
    test_yf('MCO')
