-- Allow public write access for MVP Data Pipeline
-- Run this in Supabase SQL Editor

-- 1. Stock Data Policies
drop policy if exists "Allow public insert" on public.stock_data;
create policy "Allow public insert" on public.stock_data for insert with check (true);

drop policy if exists "Allow public update" on public.stock_data;
create policy "Allow public update" on public.stock_data for update using (true);

-- 2. Insider Trading Policies
drop policy if exists "Allow public insert" on public.insider_trading;
create policy "Allow public insert" on public.insider_trading for insert with check (true);

drop policy if exists "Allow public update" on public.insider_trading;
create policy "Allow public update" on public.insider_trading for update using (true);

-- 3. ETF Holdings Policies
drop policy if exists "Allow public insert" on public.etf_holdings;
create policy "Allow public insert" on public.etf_holdings for insert with check (true);

drop policy if exists "Allow public update" on public.etf_holdings;
create policy "Allow public update" on public.etf_holdings for update using (true);
