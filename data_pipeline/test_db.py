import psycopg2
import sys

# Hardcoded credentials from user input + .env
HOST = "2406:da18:243:741b:278c:dafa:610f:1a9"
USER = "postgres"
PASS = "mblbstock2026!@"
DB = "postgres"
PORT = 5432

print(f"Connecting to {HOST}:{PORT} as {USER}...")

try:
    conn = psycopg2.connect(
        host=HOST,
        database=DB,
        user=USER,
        password=PASS,
        port=PORT
    )
    print("Connection Successful!")
    conn.close()
except Exception as e:
    print(f"Connection Failed: {e}")
    sys.exit(1)
