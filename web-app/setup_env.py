import os

# Read credentials.env from parent
env_path = "../credentials.env"
target_path = ".env.local"

try:
    with open(env_path, "r") as f:
        lines = f.readlines()
        
    env_vars = {}
    for line in lines:
        if "=" in line and not line.startswith("#"):
            key, val = line.strip().split("=", 1)
            env_vars[key] = val
            
    # Map to Next.js format
    supabase_url = env_vars.get("SUPABASE_URL", "")
    supabase_key = env_vars.get("SUPABASE_KEY", "")
    
    content = f"""NEXT_PUBLIC_SUPABASE_URL={supabase_url}
NEXT_PUBLIC_SUPABASE_ANON_KEY={supabase_key}
"""

    with open(target_path, "w") as f:
        f.write(content)
        
    print(f"Successfully created {target_path}")
    print(f"URL: {supabase_url[:10]}...") 

except Exception as e:
    print(f"Error: {e}")
