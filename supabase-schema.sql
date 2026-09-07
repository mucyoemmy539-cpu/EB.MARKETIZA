-- E&B MARKETIZA database foundation (for later Supabase setup)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('buyer','seller')),
  created_at timestamptz default now()
);