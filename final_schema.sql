-- 5. Hedge Funds Table
create table if not exists public.hedge_funds (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,      -- e.g. "Berkshire Hathaway"
  cik text,                       -- SEC CIK (optional)
  strategy text,                  -- e.g. "Value", "Macro"
  description text,
  website text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Hedge Funds
alter table public.hedge_funds enable row level security;
drop policy if exists "Allow public read access" on public.hedge_funds;
create policy "Allow public read access" on public.hedge_funds for select using (true);


-- 6. Fund Holdings Table (13F Data)
create table if not exists public.fund_holdings (
  id uuid default uuid_generate_v4() primary key,
  fund_id uuid references public.hedge_funds(id) on delete cascade,
  symbol text references public.stock_data(symbol), -- Link to stock info
  report_period date not null,    -- Quarter end date (e.g. 2024-12-31)
  shares numeric,                 -- Number of shares held
  value numeric,                  -- Market value at report date (USD)
  change_from_prev numeric,       -- Change % from previous quarter (optional)
  avg_buy_price numeric,          -- Estimated avg buy price (calculated)
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(fund_id, symbol, report_period) -- Prevent duplicate entries for same quarter
);

-- RLS for Fund Holdings
alter table public.fund_holdings enable row level security;
drop policy if exists "Allow public read access" on public.fund_holdings;
create policy "Allow public read access" on public.fund_holdings for select using (true);


-- 7. Historical Financials Table (For Entry Valuation)
-- Stores snapshot of financials at a specific date (e.g. 2020-12-31)
create table if not exists public.historical_financials (
  id uuid default uuid_generate_v4() primary key,
  symbol text references public.stock_data(symbol),
  date date not null,             -- Fiscal period end date
  revenue numeric,
  net_income numeric,
  eps numeric,
  book_value numeric,
  pe_ratio numeric,               -- P/E at that time (if available)
  pb_ratio numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(symbol, date)
);

-- RLS for Historical Financials
alter table public.historical_financials enable row level security;
drop policy if exists "Allow public read access" on public.historical_financials;
create policy "Allow public read access" on public.historical_financials for select using (true);
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
