create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('aluno', 'professor')),
  hidden_student_views text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null,
  priority text not null default 'info' check (priority in ('info', 'success', 'warning', 'danger')),
  read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_mock_exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  exam_date date not null,
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null check (total_questions > 0 and correct_answers <= total_questions),
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_revisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  topic text not null,
  scheduled_for date not null,
  status text not null default 'pending' check (status in ('pending', 'done')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_student_notifications_user_created_at on public.student_notifications (user_id, created_at desc);
create index if not exists idx_student_mock_exams_user_exam_date on public.student_mock_exams (user_id, exam_date desc);
create index if not exists idx_student_revisions_user_scheduled_for on public.student_revisions (user_id, scheduled_for asc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    user_id,
    email,
    full_name,
    role,
    hidden_student_views
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, ''), '@', 1), 'Usuario Sinapse'),
    case
      when lower(coalesce(new.raw_user_meta_data ->> 'role', 'aluno')) = 'professor' then 'professor'
      else 'aluno'
    end,
    coalesce(
      (
        select array_agg(value)
        from jsonb_array_elements_text(
          case
            when jsonb_typeof(new.raw_user_meta_data -> 'hidden_student_views') = 'array'
              then new.raw_user_meta_data -> 'hidden_student_views'
            else '[]'::jsonb
          end
        ) as value
      ),
      '{}'::text[]
    )
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    hidden_student_views = excluded.hidden_student_views,
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists student_mock_exams_set_updated_at on public.student_mock_exams;
create trigger student_mock_exams_set_updated_at
before update on public.student_mock_exams
for each row
execute function public.set_updated_at();

drop trigger if exists student_revisions_set_updated_at on public.student_revisions;
create trigger student_revisions_set_updated_at
before update on public.student_revisions
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.student_notifications enable row level security;
alter table public.student_mock_exams enable row level security;
alter table public.student_revisions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "notifications_select_own" on public.student_notifications;
create policy "notifications_select_own"
on public.student_notifications
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "notifications_insert_own" on public.student_notifications;
create policy "notifications_insert_own"
on public.student_notifications
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.student_notifications;
create policy "notifications_update_own"
on public.student_notifications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "notifications_delete_own" on public.student_notifications;
create policy "notifications_delete_own"
on public.student_notifications
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "mock_exams_select_own" on public.student_mock_exams;
create policy "mock_exams_select_own"
on public.student_mock_exams
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "mock_exams_insert_own" on public.student_mock_exams;
create policy "mock_exams_insert_own"
on public.student_mock_exams
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "mock_exams_update_own" on public.student_mock_exams;
create policy "mock_exams_update_own"
on public.student_mock_exams
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "mock_exams_delete_own" on public.student_mock_exams;
create policy "mock_exams_delete_own"
on public.student_mock_exams
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "revisions_select_own" on public.student_revisions;
create policy "revisions_select_own"
on public.student_revisions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "revisions_insert_own" on public.student_revisions;
create policy "revisions_insert_own"
on public.student_revisions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "revisions_update_own" on public.student_revisions;
create policy "revisions_update_own"
on public.student_revisions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "revisions_delete_own" on public.student_revisions;
create policy "revisions_delete_own"
on public.student_revisions
for delete
to authenticated
using (auth.uid() = user_id);
