-- Soft-delete or restore an employee, cascading to their Driver row and driver Drawer.
-- Called from the Employees tab delete/restore actions. Safe to re-run.
--
-- Recovered from the prod database on 2026-09-17 -- it had no source in this repo. See BAR-15.
--
-- CHANGED from what prod currently runs:
--
-- Added an admin check. The prod version is SECURITY DEFINER with NO authorization, so any
-- caller who could reach PostgREST could delete or restore any employee. Being DEFINER, it
-- bypasses RLS, which means the policies in table-policies.sql would NOT have closed this --
-- the check has to live inside the function body.
--
-- SECURITY DEFINER is kept (it is required: cascading to Driver and Drawer writes tables that
-- authenticated has no direct write policy on), now with a pinned search_path.

create or replace function public.update_employee(p_id uuid, p_is_deleted boolean default true)
returns void
language plpgsql
security definer
set search_path = public
as $function$
begin
    if not exists (
        select 1 from public."Profile"
        where id = auth.uid() and is_admin and not is_deleted
    ) then
        raise exception 'Only admins can delete or restore employees'
            using errcode = '42501';
    end if;

    -- Capture the drawers before flagging Driver, so the set is unambiguous either way.
    update public."Drawer"
    set is_deleted = p_is_deleted
    where drawer_id in (
        select drawer_id
        from public."Driver"
        where driver_id = p_id
    );

    update public."Driver"
    set is_deleted = p_is_deleted
    where driver_id = p_id;

    update public."Profile"
    set is_deleted = p_is_deleted
    where id = p_id;
end;
$function$;

revoke all on function public.update_employee(uuid, boolean) from public, anon;
grant execute on function public.update_employee(uuid, boolean) to authenticated;
