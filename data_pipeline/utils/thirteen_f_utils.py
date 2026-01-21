import requests
import xml.etree.ElementTree as ET
from typing import List, Dict, Optional
from sec_edgar_api import EdgarClient
import re

# Initialize EdgarClient with compliant User-Agent
client = EdgarClient(user_agent="MBLB Stock Analysis <ysk144@example.com>")

# Use the EXACT same UA for reliable requests, but 'Host' differs for archives
SEC_HEADERS = {
    'User-Agent': 'MBLB Stock Analysis <ysk144@example.com>',
    'Accept-Encoding': 'gzip, deflate',
    'Host': 'www.sec.gov' # Archives are on www.sec.gov, not data.sec.gov
}

import time

def request_with_retry(url, retries=5, backoff=2):
    """Fetch URL with retry logic for 429 rate limits."""
    for i in range(retries):
        try:
            resp = requests.get(url, headers=get_sec_headers(), timeout=15)
            if resp.status_code == 429:
                sleep_time = backoff * (i + 1)
                print(f"   ⏳ 429 Rate Limit. Sleeping {sleep_time}s...")
                time.sleep(sleep_time)
                continue
            return resp
        except Exception as e:
            print(f"   ⚠️ Request Error: {e}")
            if i < retries - 1:
                time.sleep(backoff)
    return None

def get_sec_headers() -> Dict[str, str]:
    return SEC_HEADERS


def get_company_filings(cik: str) -> dict:
    """Fetch recent submissions for a company/fund using sec-edgar-api."""
    try:
        submissions = client.get_submissions(cik=cik)
        return submissions
    except Exception as e:
        print(f"❌ Library Error for CIK {cik}: {e}")
        return {}

def get_latest_13f_xml_url(cik: str) -> Optional[str]:
    """Find the URL of the INFORMATION TABLE XML for the latest 13F-HR filing."""
    data = get_company_filings(cik)
    if not data or 'filings' not in data:
        return None
    
    recent = data['filings']['recent']
    
    form_types = recent.get('form', [])
    accession_numbers = recent.get('accessionNumber', [])
    primary_docs = recent.get('primaryDocument', [])
    
    for i, form_type in enumerate(form_types):
        if form_type == '13F-HR':
            accession_number = accession_numbers[i]
            primary_doc = primary_docs[i]
            
            accession_no_dash = accession_number.replace('-', '')
            cik_int = int(cik)
            
            # Base URL for the filing directory (Archives)
            base_url = f"https://www.sec.gov/Archives/edgar/data/{cik_int}/{accession_no_dash}"
            
            print(f"🔎 Found 13F-HR: {accession_number} (Primary: {primary_doc})")
            
            # Strategy:
            # 1. Try to list files via index.html (Archives)
            # 2. Heuristics
            
            index_url = f"{base_url}/{accession_number}-index.html"
            print(f"   Checking Index: {index_url}")
            
            try:
                resp = request_with_retry(index_url)
                if resp and resp.status_code == 200:

                    content = resp.text
                    xml_files = re.findall(r'href=["\']([^"\']+\.xml)["\']', content, re.IGNORECASE)
                    print(f"   📄 XMLs found: {xml_files}")
                    
                    for xml_file in xml_files:
                        # Fix URL construction: xml_file usually starts with /Archives
                        full_xml_url = f"https://www.sec.gov{xml_file}" if xml_file.startswith('/') else f"{base_url}/{xml_file}"
                        
                        # Skip XSL/HTML styled views
                        if 'xsl' in xml_file.lower() or 'html' in xml_file.lower():
                            continue

                        if 'table' in xml_file.lower() or 'info' in xml_file.lower():
                            return full_xml_url
                    
                    # Fallback: Pick the XML that is potentially the distinct data table
                    # Usually if we have [primary_doc.xml, random_numbers.xml], the random one is the table.
                    for xml_file in xml_files:
                        if 'primary_doc' not in xml_file.lower() and 'xsl' not in xml_file.lower():
                             full_xml_url = f"https://www.sec.gov{xml_file}" if xml_file.startswith('/') else f"{base_url}/{xml_file}"
                             print(f"   ⚠️ Heuristic Fallback: {full_xml_url}")
                             return full_xml_url

                    # Last resort: just try the last one?
                    if xml_files: 
                        last = xml_files[-1]
                        return f"https://www.sec.gov{last}" if last.startswith('/') else f"{base_url}/{last}"
                else:
                    print(f"   ❌ Index Fetch Failed: {resp.status_code}")
                    
            except Exception as e:
                print(f"   ⚠️ Index Error: {e}")

            # Fallback 1: Primary Doc if it looks like the table (rare)
            if primary_doc.endswith('.xml') and ('table' in primary_doc.lower()):
                 return f"{base_url}/{primary_doc}"
            
            # Fallback 2: 'infotable.xml' (Standard)
            return f"{base_url}/infotable.xml"
            
    print(f"⚠️ No 13F-HR found for CIK {cik}")
    return None

def _find_xml_url(cik: str, accession_number: str, primary_doc: str) -> Optional[str]:
    """Helper to find the INFOTABLE XML URL for a specific filing."""
    accession_no_dash = accession_number.replace('-', '')
    cik_int = int(cik)
    base_url = f"https://www.sec.gov/Archives/edgar/data/{cik_int}/{accession_no_dash}"
    
    # 1. Try index.html
    index_url = f"{base_url}/{accession_number}-index.html"
    try:
        resp = request_with_retry(index_url)
        if resp and resp.status_code == 200:

            xml_files = re.findall(r'href=["\']([^"\']+\.xml)["\']', resp.text, re.IGNORECASE)
            
            for xml_file in xml_files:
                full_xml_url = f"https://www.sec.gov{xml_file}" if xml_file.startswith('/') else f"{base_url}/{xml_file}"
                
                # Exclude XSL/HTML
                if 'xsl' in xml_file.lower() or 'html' in xml_file.lower():
                    continue

                if 'table' in xml_file.lower() or 'info' in xml_file.lower():
                    return full_xml_url
            
            # Fallback
            for xml_file in xml_files:
                if 'primary_doc' not in xml_file.lower() and 'xsl' not in xml_file.lower():
                     return f"https://www.sec.gov{xml_file}" if xml_file.startswith('/') else f"{base_url}/{xml_file}"
    except:
        pass

    # 2. Fallbacks
    if primary_doc.endswith('.xml') and ('table' in primary_doc.lower()):
         return f"{base_url}/{primary_doc}"
    return f"{base_url}/infotable.xml"

def get_all_13f_xml_urls(cik: str) -> List[tuple]:
    """Find ALL 13F-HR XML URLs for historical backfill. Returns list of (report_date, xml_url)."""
    data = get_company_filings(cik)
    if not data or 'filings' not in data:
        return []
    
    recent = data['filings']['recent']
    results = []
    
    # Iterate all filings
    for i, form_type in enumerate(recent.get('form', [])):
        if form_type == '13F-HR':
            accession = recent['accessionNumber'][i]
            primary_doc = recent['primaryDocument'][i]
            report_date = recent['reportDate'][i] # YYYY-MM-DD
            if not report_date:
                report_date = recent['filingDate'][i] # Fallback
            
            print(f"   PLEASE WAIT... Analyzing history: {report_date}")
            xml_url = _find_xml_url(cik, accession, primary_doc)
            if xml_url:
                results.append((report_date, xml_url))
                
    return results

def parse_13f_infotable(xml_url: str) -> List[Dict]:
    """Parse the 13F Information Table XML."""
    print(f"📥 Fetching XML from: {xml_url}")
    
    try:
        response = request_with_retry(xml_url)
        
        if response.status_code != 200:
            print(f"❌ Error fetching XML: {response.status_code}")
            return []
            
        root = ET.fromstring(response.content)
        
        def strip_ns(tag):
             if '}' in tag: return tag.split('}', 1)[1]
             return tag
            
        holdings = []
        count = 0
        
        # Determine if we have <informationTable> root or if it's the 13F-HR main form
        # The Info Table XML usually has root like <informationTable ...>
        # Check root tag
        
        items_to_iter = root
        # If root is 'edgarSubmission', we are in the wrong file (main form).
        # If root is 'informationTable', we iterate children.
        
        # But wait, sometimes we get <xml>...<informationTable>...</xml>?
        # No, usually standard XML.
        
        for info in items_to_iter:
            tag_name = strip_ns(info.tag)
            # We look for 'infoTable' nodes
            if 'infoTable' not in tag_name and 'InfoTable' not in tag_name:
                 continue
                 
            holding = {}
            for child in info:
                tag = strip_ns(child.tag)
                text = child.text if child.text else ""
                
                if tag == 'nameOfIssuer': holding['name'] = text
                elif tag == 'cusip': holding['cusip'] = text
                elif tag == 'value':
                    try: holding['value'] = float(text) * 1000 
                    except: holding['value'] = 0
                elif tag == 'shrsOrPrnAmt':
                    for sub in child:
                         if strip_ns(sub.tag) == 'sshPrnamt':
                            try: holding['shares'] = float(sub.text)
                            except: holding['shares'] = 0

            if 'name' in holding:
                holding['symbol'] = None
                holdings.append(holding)
                count += 1
                
        print(f"✅ Parsed {count} holdings from XML.")
        return holdings
        
    except Exception as e:
        print(f"❌ Error parsing XML: {e}")
        return []
