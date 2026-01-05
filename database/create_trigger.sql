-- 1. Create Function to handle new user insertion
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, is_premium, usage_count)
  values (new.id, new.email, false, 0);
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create Trigger (Drop first if exists to avoid error)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Backfill existing users (Run this once to sync current users)
insert into public.profiles (id, email, is_premium, usage_count)
select id, email, false, 0
from auth.users
where id not in (select id from public.profiles);

-- 4. Verify
select count(*) as profile_count from public.profiles;
