-- Add insider_role column to insider_trading table
ALTER TABLE public.insider_trading 
ADD COLUMN IF NOT EXISTS insider_role text DEFAULT 'Corporate';

-- Check if column exists (optional verification)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'insider_trading' AND column_name = 'insider_role';
