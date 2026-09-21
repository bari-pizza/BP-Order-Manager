-- BAR-18: track when an employee last used the app (login / session).
-- Apply: npm run db:apply:dev -- supabase-functions/add-profile-last-active-at.sql

alter table public."Profile"
    add column if not exists last_active_at timestamptz null;

comment on column public."Profile".last_active_at is
    'Updated on successful sign-in / session restore. Null = never logged in since this column existed.';

revoke update (last_active_at) on table public."Profile" from authenticated;

create or replace function public.touch_last_active_at()
returns void
language sql
volatile
security definer
set search_path = public
as $$
    update public."Profile"
    set last_active_at = clock_timestamp()
    where id = auth.uid()
      and not is_deleted;
$$;

revoke all on function public.touch_last_active_at() from public, anon;
grant execute on function public.touch_last_active_at() to authenticated;

notify pgrst, 'reload schema';
