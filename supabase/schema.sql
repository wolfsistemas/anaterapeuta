-- Ana | Terapia e Mentoria
-- Rode no SQL Editor do Supabase. Multitenant por tenant_id (pronto para escala).

create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  meet_url text,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id),
  email text not null,
  name text not null,
  role text not null default 'client' check (role in ('client', 'superadmin')),
  plan_id uuid,
  status text not null default 'active' check (status in ('active', 'blocked')),
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  slug text not null,
  name text not null,
  price_cents int not null default 0,
  interval text not null default 'month',
  sessions_month int not null default 0,
  has_courses boolean not null default false,
  has_mentorship boolean not null default false,
  sort int not null default 0,
  unique (tenant_id, slug)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  title text not null,
  description text,
  level text,
  lessons int default 0,
  cover_path text,
  plan_min text not null default 'cursos'
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  youtube_id text,
  minutes int default 0,
  sort int default 0
);

create table if not exists public.free_content (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  title text not null,
  kind text not null,
  minutes int default 0,
  youtube_id text,
  cover_path text,
  excerpt text
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  title text not null,
  body text not null,
  audience text not null default 'all',
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  from_role text not null,
  from_user_id uuid,
  to_user_id uuid,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.session_balances (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  user_id uuid not null references public.profiles(id),
  used int default 0,
  remaining int default 0,
  meet_url text,
  notes text
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  user_id uuid references public.profiles(id),
  plan_id uuid references public.plans(id),
  amount_cents int not null,
  status text not null,
  method text,
  mp_id text,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  actor text,
  action text not null,
  detail text,
  created_at timestamptz default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id),
  user_id uuid references public.profiles(id),
  endpoint text not null,
  keys jsonb not null,
  created_at timestamptz default now()
);

alter table public.profiles
  add constraint profiles_plan_fk foreign key (plan_id) references public.plans(id);

create index if not exists idx_profiles_tenant on public.profiles(tenant_id);
create index if not exists idx_payments_tenant on public.payments(tenant_id);
create index if not exists idx_logs_tenant on public.audit_logs(tenant_id);

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.free_content enable row level security;
alter table public.notices enable row level security;
alter table public.messages enable row level security;
alter table public.session_balances enable row level security;
alter table public.payments enable row level security;
alter table public.audit_logs enable row level security;
alter table public.push_subscriptions enable row level security;

create or replace function public.current_tenant_id()
returns uuid language sql stable as $$
  select tenant_id from public.profiles where id = auth.uid()
$$;

create or replace function public.is_superadmin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin'
  )
$$;

create policy "public read tenants" on public.tenants for select using (true);
create policy "admin write tenants" on public.tenants for all using (public.is_superadmin());

create policy "own profile" on public.profiles
  for select using (id = auth.uid() or public.is_superadmin());
create policy "admin update profiles" on public.profiles
  for update using (public.is_superadmin());

create policy "read plans" on public.plans for select using (true);
create policy "admin plans" on public.plans for all using (public.is_superadmin());

create policy "read free" on public.free_content for select using (true);
create policy "admin free" on public.free_content for all using (public.is_superadmin());

create policy "read courses if paid or admin" on public.courses
  for select using (true);
create policy "admin courses" on public.courses for all using (public.is_superadmin());

create policy "read lessons" on public.lessons for select using (auth.uid() is not null);
create policy "admin lessons" on public.lessons for all using (public.is_superadmin());

create policy "read notices" on public.notices
  for select using (tenant_id = public.current_tenant_id() or public.is_superadmin());
create policy "admin notices" on public.notices for all using (public.is_superadmin());

create policy "own messages" on public.messages
  for select using (to_user_id = auth.uid() or from_user_id = auth.uid() or public.is_superadmin());
create policy "insert messages" on public.messages
  for insert with check (from_user_id = auth.uid() or public.is_superadmin());

create policy "own sessions" on public.session_balances
  for select using (user_id = auth.uid() or public.is_superadmin());
create policy "admin sessions" on public.session_balances for all using (public.is_superadmin());

create policy "own payments" on public.payments
  for select using (user_id = auth.uid() or public.is_superadmin());
create policy "admin payments" on public.payments for all using (public.is_superadmin());

create policy "admin logs" on public.audit_logs
  for select using (public.is_superadmin());
create policy "insert logs" on public.audit_logs
  for insert with check (true);

create policy "own push" on public.push_subscriptions
  for all using (user_id = auth.uid() or public.is_superadmin());

insert into public.tenants (slug, name, meet_url)
values ('ana', 'Ana | Terapia e Mentoria', 'https://meet.google.com/ana-sessao-demo')
on conflict (slug) do nothing;
