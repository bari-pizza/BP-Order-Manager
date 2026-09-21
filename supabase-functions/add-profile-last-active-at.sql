-- BAR-18: track when an employee last used the app (login / session).
-- Apply: npm run db:apply:dev -- supabase-functions/add-profile-last-active-at.sql

alter table public."Profile"
    add column if not exists last_active_at timestamptz null;

comment on column public."Profile".last_active_at is
    'Updated on successful sign-in / session restore. Null = never logged in since this column existed.';

-- Own-row update already allowed via profile_update_own; grant the new column.
grant update (last_active_at) on table public."Profile" to authenticated;
