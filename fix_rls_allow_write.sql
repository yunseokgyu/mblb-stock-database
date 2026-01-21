-- Allow public write access to hedge_funds and fund_holdings
-- WARNING: This allows anyone with the anon key to write to these tables.
-- For a local script without service_role key, this is the easiest workaround.

DROP POLICY IF EXISTS "Allow public read access" ON public.hedge_funds;
CREATE POLICY "Allow public all access" ON public.hedge_funds FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access" ON public.fund_holdings;
CREATE POLICY "Allow public all access" ON public.fund_holdings FOR ALL USING (true) WITH CHECK (true);

-- Ensure historical_financials is also writable
DROP POLICY IF EXISTS "Allow public read access" ON public.historical_financials;
CREATE POLICY "Allow public all access" ON public.historical_financials FOR ALL USING (true) WITH CHECK (true);
