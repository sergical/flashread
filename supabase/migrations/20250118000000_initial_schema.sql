-- FlashRead Initial Schema
-- This migration creates the core tables for FlashRead Pro

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  subscription_status text default 'free' check (subscription_status in ('free', 'pro', 'lifetime')),
  subscription_expires_at timestamptz,
  stripe_customer_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User settings (synced across devices for Pro users)
create table public.user_settings (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  wpm integer default 300 check (wpm >= 100 and wpm <= 1200),
  font_size integer default 48 check (font_size >= 24 and font_size <= 96),
  font_family text default 'sans' check (font_family in ('serif', 'sans', 'mono')),
  theme text default 'dark' check (theme in ('dark', 'light')),
  pause_on_punctuation boolean default true,
  pause_on_long_words boolean default true,
  show_progress boolean default true,
  show_time_remaining boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reading sessions (history of what users have read)
create table public.reading_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  title text,
  words_read integer default 0,
  total_words integer default 0,
  average_wpm integer,
  duration_ms integer default 0,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Reading progress (for resuming articles)
create table public.reading_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  url text not null,
  current_index integer default 0,
  total_words integer default 0,
  title text,
  updated_at timestamptz default now(),
  primary key (user_id, url)
);

-- Reading list (save for later)
create table public.reading_list (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  title text,
  excerpt text,
  estimated_words integer,
  added_at timestamptz default now(),
  unique (user_id, url)
);

-- Indexes for performance
create index reading_sessions_user_id_idx on public.reading_sessions(user_id);
create index reading_sessions_created_at_idx on public.reading_sessions(created_at desc);
create index reading_list_user_id_idx on public.reading_list(user_id);
create index reading_list_added_at_idx on public.reading_list(added_at desc);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.reading_sessions enable row level security;
alter table public.reading_progress enable row level security;
alter table public.reading_list enable row level security;

-- RLS Policies: Users can only access their own data

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- User settings policies
create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- Reading sessions policies
create policy "Users can view own sessions"
  on public.reading_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.reading_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.reading_sessions for update
  using (auth.uid() = user_id);

-- Reading progress policies
create policy "Users can view own progress"
  on public.reading_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.reading_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.reading_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own progress"
  on public.reading_progress for delete
  using (auth.uid() = user_id);

-- Reading list policies
create policy "Users can view own reading list"
  on public.reading_list for select
  using (auth.uid() = user_id);

create policy "Users can insert to own reading list"
  on public.reading_list for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from own reading list"
  on public.reading_list for delete
  using (auth.uid() = user_id);

-- Function to create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute procedure public.handle_updated_at();

create trigger reading_progress_updated_at
  before update on public.reading_progress
  for each row execute procedure public.handle_updated_at();
