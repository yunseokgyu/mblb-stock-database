import os
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path='../credentials.env')
FMP_API_KEY = os.getenv('FMP_API_KEY')

def test_free_endpoint():
    # AAPL Quote is usually free or basic
    url = f"https://financialmodelingprep.com/api/v3/quote/AAPL?apikey={FMP_API_KEY}"
    print(f"Testing URL: {url.replace(FMP_API_KEY, 'HIDDEN_KEY')}")
    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data:
            print("Success! Data received:")
            print(f"Symbol: {data[0].get('symbol')}")
            print(f"Price: {data[0].get('price')}")
        else:
            print("Success (200 OK) but empty list returned.")
    else:
        print(f"Failed. Status Code: {response.status_code}")
        print(f"Response: {response.text}")

if __name__ == "__main__":
    test_free_endpoint()
