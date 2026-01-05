-- Add tier column to profiles table
-- default 'free' for new users.
-- Existing 'is_premium' users should be migrated to 'premium' tier theoretically, but for now we set default free.
-- We will rely on 'is_premium' flag for access control mainly, and 'tier' for specific features.

alter table public.profiles 
add column if not exists tier text default 'free';

-- Optional: Update existing premium users to 'premium' tier
update public.profiles
set tier = 'premium'
where is_premium = true;
