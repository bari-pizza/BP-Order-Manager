-- Admin "save employee" from the Employees tab: updates the Profile and creates or retires
-- the matching Driver/Drawer pair. Safe to re-run.
--
-- Recovered from the prod database on 2026-09-17 -- it had no source in this repo, which is
-- why dev never got it and admin employee editing is broken there. See BAR-15 / BAR-7.
--
-- CHANGED from what prod currently runs, deliberately:
--
-- 1. Added an admin check. The prod version has NO authorization of any kind, and it writes
--    is_admin / is_manager / is_cashier. Any caller who could reach PostgREST could set
--    is_admin on any profile, including their own.
--
-- 2. SECURITY DEFINER with a pinned search_path. The prod version is INVOKER. Once RLS lands,
--    authenticated loses column-level UPDATE on the role flags (see table-policies.sql), so
--    this has to run as the owner to do its job -- which is only safe because of (1).
--
-- 3. Dropped the blanket `EXCEPTION WHEN OTHERS THEN RETURN jsonb_build_object('error', ...)`.
--    It returned failures as a 200 with an {error} body, and supabaseQueries.updateEmployee
--    only inspects supabase-js's `error`, so every failure was reported to the user as
--    success. Errors now propagate and surface as real errors.

create or replace function public.handle_employee_update(p_profile public."Profile", p_is_driver boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
declare
    v_drawer_id uuid;
    result_profile jsonb;
    result_driver jsonb;
begin
    if not exists (
        select 1 from public."Profile"
        where id = auth.uid() and is_admin and not is_deleted
    ) then
        raise exception 'Only admins can update employees'
            using errcode = '42501';
    end if;

    update public."Profile"
    set
        first_name = p_profile.first_name,
        last_name = p_profile.last_name,
        avatar_src = p_profile.avatar_src,
        phone = p_profile.phone,
        is_admin = p_profile.is_admin,
        is_manager = p_profile.is_manager,
        is_cashier = p_profile.is_cashier
    where id = p_profile.id
    returning to_jsonb(public."Profile".*) into result_profile;

    if result_profile is null then
        raise exception 'No profile found for %', p_profile.id
            using errcode = 'no_data_found';
    end if;

    if p_is_driver then
        if not exists (select 1 from public."Driver" where driver_id = p_profile.id) then
            -- The drawer deliberately reuses the profile's uuid as its drawer_id, which is why
            -- driver drawer_id and profile id line up for drivers created here.
            insert into public."Drawer" (name, drawer_type, drawer_id)
            values (p_profile.first_name || ' ' || p_profile.last_name, 'driver', p_profile.id)
            returning drawer_id into v_drawer_id;

            insert into public."Driver" (drawer_id, driver_id)
            values (v_drawer_id, p_profile.id)
            returning to_jsonb(public."Driver".*) into result_driver;
        else
            update public."Driver"
            set is_deleted = false
            where driver_id = p_profile.id
            returning to_jsonb(public."Driver".*) into result_driver;
        end if;
    else
        update public."Driver"
        set is_deleted = true
        where driver_id = p_profile.id
        returning to_jsonb(public."Driver".*) into result_driver;
    end if;

    return jsonb_build_object(
        'profile', result_profile,
        'driver', coalesce(result_driver, 'null'::jsonb)
    );
end;
$function$;

revoke all on function public.handle_employee_update(public."Profile", boolean) from public, anon;
grant execute on function public.handle_employee_update(public."Profile", boolean) to authenticated;
