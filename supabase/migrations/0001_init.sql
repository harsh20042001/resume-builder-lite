-- supabase/migrations/0001_init.sql
-- Resume Builder Lite — initial schema.
-- Run via: supabase db push   (or paste into the Supabase SQL editor)

-- ──────────────────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ──────────────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────────────────
-- USERS  (extends Supabase auth.users with app-specific fields)
-- ──────────────────────────────────────────────────────────────────────────
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  is_premium  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Auto-create a public.users row whenever someone signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ──────────────────────────────────────────────────────────────────────────
-- TEMPLATES  (visual skins — independent of resume format)
-- ──────────────────────────────────────────────────────────────────────────
create table public.templates (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  is_premium         boolean not null default false,
  preview_image_url  text,
  config             jsonb not null default '{}'::jsonb,
  sort_order         int not null default 0
);

insert into public.templates (name, is_premium, sort_order) values
  ('Classic',     false, 1),
  ('Minimal',     false, 2),
  ('Modern',      true,  3),
  ('Executive',   true,  4),
  ('Compact',     true,  5),
  ('Academic',    true,  6);

-- ──────────────────────────────────────────────────────────────────────────
-- RESUMES
-- ──────────────────────────────────────────────────────────────────────────
create table public.resumes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  title        text not null default 'Untitled Resume',
  format_id    text not null check (format_id in ('ats','us','europe','india','fresher')),
  template_id  uuid references public.templates(id),
  content      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index resumes_user_id_idx on public.resumes(user_id);

-- keep updated_at fresh
create function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger resumes_touch_updated_at
  before update on public.resumes
  for each row execute procedure public.touch_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- PURCHASES  (one-time payments only — no subscriptions table needed)
-- ──────────────────────────────────────────────────────────────────────────
create table public.purchases (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.users(id) on delete cascade,
  amount               integer not null,            -- in paise (₹999 => 99900)
  currency             text not null default 'INR',
  razorpay_order_id    text,
  razorpay_payment_id  text unique,
  status               text not null default 'pending' check (status in ('pending','success','failed')),
  created_at           timestamptz not null default now()
);

create index purchases_user_id_idx on public.purchases(user_id);

-- ──────────────────────────────────────────────────────────────────────────
-- COVER LETTERS
-- ──────────────────────────────────────────────────────────────────────────
create table public.cover_letters (
  id          uuid primary key default gen_random_uuid(),
  resume_id   uuid not null references public.resumes(id) on delete cascade,
  content     text not null default '',
  created_at  timestamptz not null default now()
);

create index cover_letters_resume_id_idx on public.cover_letters(resume_id);

-- ──────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────────────────
alter table public.users         enable row level security;
alter table public.resumes       enable row level security;
alter table public.purchases     enable row level security;
alter table public.cover_letters enable row level security;
alter table public.templates     enable row level security;

-- users: a person can read/update only their own row
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- templates: readable by everyone (it's just catalog data)
create policy "templates_select_all" on public.templates
  for select using (true);

-- resumes: full CRUD restricted to the owning user
create policy "resumes_select_own" on public.resumes
  for select using (auth.uid() = user_id);
create policy "resumes_insert_own" on public.resumes
  for insert with check (auth.uid() = user_id);
create policy "resumes_update_own" on public.resumes
  for update using (auth.uid() = user_id);
create policy "resumes_delete_own" on public.resumes
  for delete using (auth.uid() = user_id);

-- purchases: a user can read their own purchase history; writes happen
-- server-side only via the service-role key (webhook), so no insert/update
-- policy is granted to the anon/authenticated role.
create policy "purchases_select_own" on public.purchases
  for select using (auth.uid() = user_id);

-- cover_letters: scoped through the parent resume's ownership
create policy "cover_letters_select_own" on public.cover_letters
  for select using (
    exists (
      select 1 from public.resumes
      where resumes.id = cover_letters.resume_id
      and resumes.user_id = auth.uid()
    )
  );
create policy "cover_letters_insert_own" on public.cover_letters
  for insert with check (
    exists (
      select 1 from public.resumes
      where resumes.id = cover_letters.resume_id
      and resumes.user_id = auth.uid()
    )
  );
