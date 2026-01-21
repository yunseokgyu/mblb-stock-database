import os

# Read credentials from parent env
env_path = "../credentials.env"
creds = {}

try:
    with open(env_path, "r") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                key, val = line.strip().split("=", 1)
                creds[key] = val
    
    url = creds.get('SUPABASE_URL')
    key = creds.get('SUPABASE_KEY')
    
    if not url or not key:
        print("Error: Missing credentials")
        exit(1)
        
    # Write to lib/supabase.ts
    ts_content = f"""import {{ createClient }} from '@supabase/supabase-js'

const supabaseUrl = '{url}'
const supabaseKey = '{key}'

export const supabase = createClient(supabaseUrl, supabaseKey)
"""
    with open("lib/supabase.ts", "w") as f:
        f.write(ts_content)
    
    print("Successfully hardcoded credentials in lib/supabase.ts")

except Exception as e:
    print(f"Error: {e}")
