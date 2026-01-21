-- Add CIK (Central Index Key) to hedge_funds table to link with SEC data
ALTER TABLE public.hedge_funds 
ADD COLUMN IF NOT EXISTS cik VARCHAR(20);

-- Add unique constraint on CIK to prevent duplicates
ALTER TABLE public.hedge_funds 
ADD CONSTRAINT hedge_funds_cik_key UNIQUE (cik);

-- Add historical tracking columns to fund_holdings
-- estimated_entry_price: The estimated avg buy price for the quarter
-- first_added: When this stock first appeared in the fund's 13F
ALTER TABLE public.fund_holdings
ADD COLUMN IF NOT EXISTS estimated_entry_price NUMERIC(15, 4),
ADD COLUMN IF NOT EXISTS first_added DATE;

-- Comment on columns
COMMENT ON COLUMN public.hedge_funds.cik IS 'SEC Central Index Key for 13F filings';
COMMENT ON COLUMN public.fund_holdings.estimated_entry_price IS 'Estimated average buy price based on quarterly high/low or 13F value';
