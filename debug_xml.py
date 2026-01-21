import requests
import xml.etree.ElementTree as ET

url = "https://www.sec.gov/Archives/edgar/data/1040273/000104027325000003/xslForm13F_X02/infotable.xml"
headers = {"User-Agent": "MBLB Stock Analysis <ysk144@example.com>"}

print(f"Fetching {url}...")
response = requests.get(url, headers=headers)
print(f"Status Code: {response.status_code}")
content = response.text
print(f"Content Preview (first 500 chars):\n{content[:500]}")

try:
    root = ET.fromstring(content)
    print("✅ Parsing Successful via ElementTree")
except Exception as e:
    print(f"❌ ElementTree Failed: {e}")

try:
    from lxml import etree
    root = etree.fromstring(content.encode('utf-8'))
    print("✅ Parsing Successful via lxml")
except ImportError:
    print("⚠️ lxml not installed")
except Exception as e:
    print(f"❌ lxml Failed: {e}")
