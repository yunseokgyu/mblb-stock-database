-- 5. Dividend Kings Table
-- Stores companies with 50+ years of consecutive dividend growth
create table if not exists public.dividend_kings (
  symbol text primary key,
  company_name text not null,
  sector text,
  years_of_growth int not null,
  dividend_yield float, -- percentage (e.g., 3.5)
  payout_ratio float, -- percentage (e.g., 60.0)
  last_updated timestamp with time zone default timezone('utc'::text, now())
);

-- RLS (Public Read)
alter table public.dividend_kings enable row level security;

drop policy if exists "Allow public read access" on public.dividend_kings;
create policy "Allow public read access" on public.dividend_kings
  for select using (true);

drop policy if exists "Allow public insert/update access" on public.dividend_kings;
create policy "Allow public insert/update access" on public.dividend_kings
  for all using (true) with check (true);
