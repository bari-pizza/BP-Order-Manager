-- Lock / unlock a drawer for a business date.
-- Sets BusinessDayDrawer.is_locked and locks/unlocks that drawer's orders.
-- Returns { data: { successes: string[], failures: [{ id: message }] } }
-- Safe to re-run.

DROP FUNCTION IF EXISTS public.lock_drawer(uuid, date);
DROP FUNCTION IF EXISTS public.lock_drawer(uuid, text);
DROP FUNCTION IF EXISTS public.unlock_drawer(uuid, date);
DROP FUNCTION IF EXISTS public.unlock_drawer(uuid, text);

CREATE OR REPLACE FUNCTION public.lock_drawer(p_drawer_id uuid, p_business_date date)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public."Drawer" WHERE drawer_id = p_drawer_id) THEN
        RETURN jsonb_build_object('error', 'Drawer not found');
    END IF;

    INSERT INTO public."BusinessDayDrawer" (
        business_date,
        drawer_id,
        is_locked,
        bank_in_cents,
        hours,
        hours_in_cents,
        other_in_cents,
        special_note
    )
    VALUES (p_business_date, p_drawer_id, true, 0, 0, 0, 0, '')
    ON CONFLICT (drawer_id, business_date)
    DO UPDATE SET is_locked = true;

    UPDATE public."Order"
    SET is_locked = true
    WHERE drawer_id = p_drawer_id
      AND business_date = p_business_date;

    RETURN jsonb_build_object(
        'data', jsonb_build_object(
            'successes', jsonb_build_array(p_drawer_id::text),
            'failures', '[]'::jsonb
        )
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.unlock_drawer(p_drawer_id uuid, p_business_date date)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public."Drawer" WHERE drawer_id = p_drawer_id) THEN
        RETURN jsonb_build_object('error', 'Drawer not found');
    END IF;

    UPDATE public."BusinessDayDrawer"
    SET is_locked = false
    WHERE drawer_id = p_drawer_id
      AND business_date = p_business_date;

    UPDATE public."Order"
    SET is_locked = false
    WHERE drawer_id = p_drawer_id
      AND business_date = p_business_date;

    RETURN jsonb_build_object(
        'data', jsonb_build_object(
            'successes', jsonb_build_array(p_drawer_id::text),
            'failures', '[]'::jsonb
        )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.lock_drawer(uuid, date) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.unlock_drawer(uuid, date) TO authenticated, anon, service_role;

NOTIFY pgrst, 'reload schema';
