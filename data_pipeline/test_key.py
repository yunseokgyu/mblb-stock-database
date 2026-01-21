
import os
import requests
from dotenv import load_dotenv

script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, '..', 'credentials.env')
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("FMP_API_KEY")

print(f"Testing API Key: {api_key[:5]}...")

# Test 1: Simple Profile (Usually free)
url = f"https://financialmodelingprep.com/api/v3/profile/AAPL?apikey={api_key}"
res = requests.get(url)
print(f"Profile Status: {res.status_code}")
if res.status_code == 200:
    print("Profile Data Success")
else:
    print(res.text)

# Test 2: S&P 500 (Often paid)
url2 = f"https://financialmodelingprep.com/api/v3/sp500_constituent?apikey={api_key}"
res2 = requests.get(url2)
print(f"S&P 500 Status: {res2.status_code}")
