-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (User Info & Usage Limits)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  is_premium boolean default false,
  usage_count integer default 0,
  last_reset_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies for Profiles (Check if exists to avoid error, or just drop/create if simple)
-- Simpler approach for RLS policies: Drop if exists then create
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 2. Stock Data Table (S&P 500, Financials, Valuation)
create table if not exists public.stock_data (
  symbol text primary key,
  name text,
  sector text,
  industry text,
  market_cap bigint,
  price numeric,
  changes_percentage numeric,
  financials jsonb, -- Revenue, Net Income, etc.
  valuation_metrics jsonb, -- DCF, PE, PB, etc.
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Stock Data (Public Read)
alter table public.stock_data enable row level security;

drop policy if exists "Allow public read access" on public.stock_data;
create policy "Allow public read access" on public.stock_data
  for select using (true);

-- 3. Insider Trading Table
create table if not exists public.insider_trading (
  id uuid default uuid_generate_v4() primary key,
  symbol text references public.stock_data(symbol),
  transaction_date date,
  reporting_date date,
  company text,
  insider_name text,
  insider_role text default 'Corporate', -- 'Corporate' or 'Congress'
  transaction_type text, -- 'P-Purchase', 'S-Sale'
  securities_transacted numeric,
  price numeric,
  securities_owned numeric,
  filing_url text, -- SEC Form 4 link
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Insider Trading (Public Read)
alter table public.insider_trading enable row level security;

drop policy if exists "Allow public read access" on public.insider_trading;
create policy "Allow public read access" on public.insider_trading
  for select using (true);

-- 4. ETF Holdings Table
create table if not exists public.etf_holdings (
  symbol text primary key, -- e.g. 'SPY', 'QQQ'
  holdings jsonb, -- List of { symbol, weight, shares }
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for ETF Holdings (Public Read)
alter table public.etf_holdings enable row level security;

drop policy if exists "Allow public read access" on public.etf_holdings;
create policy "Allow public read access" on public.etf_holdings
  for select using (true);

-- Functions to reset usage count (Optional, runs via cron or logic)
create or replace function reset_daily_usage()
returns void as $$
begin
  update public.profiles
  set usage_count = 0, last_reset_date = current_date
  where last_reset_date < current_date;
end;
$$ language plpgsql;
