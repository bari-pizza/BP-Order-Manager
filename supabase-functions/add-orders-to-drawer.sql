-- Assign / unassign tickets. The app calls these RPCs from the orders header.
-- Returns { data: { successes: string[], failures: [{ order_id: message }] } }
-- Safe to re-run.

DROP FUNCTION IF EXISTS public.add_orders_to_drawer(uuid, jsonb);
DROP FUNCTION IF EXISTS public.remove_orders_from_drawer(uuid, jsonb);

CREATE OR REPLACE FUNCTION public.add_orders_to_drawer(p_drawer_id uuid, p_order_ids jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    v_id text;
    v_order_id uuid;
    v_successes jsonb := '[]'::jsonb;
    v_failures jsonb := '[]'::jsonb;
    v_locked boolean;
    v_day_locked boolean;
    v_business_date date;
    v_drawer_type text;
    v_order_type text;
    v_is_third_party boolean;
    v_allowed boolean;
BEGIN
    IF p_order_ids IS NULL OR jsonb_typeof(p_order_ids) <> 'array' THEN
        RETURN jsonb_build_object('error', 'p_order_ids must be a JSON array');
    END IF;

    SELECT drawer_type::text INTO v_drawer_type
    FROM public."Drawer"
    WHERE drawer_id = p_drawer_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Drawer not found');
    END IF;

    FOR v_id IN SELECT jsonb_array_elements_text(p_order_ids)
    LOOP
        BEGIN
            v_order_id := v_id::uuid;
        EXCEPTION WHEN invalid_text_representation THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Invalid order id'));
            CONTINUE;
        END;

        SELECT o.is_locked, o.business_date, o.order_type::text, COALESCE(orig.is_third_party, false)
        INTO v_locked, v_business_date, v_order_type, v_is_third_party
        FROM public."Order" AS o
        LEFT JOIN public."OrderOrigin" AS orig ON orig.origin_id = o.origin_id
        WHERE o.order_id = v_order_id;

        IF NOT FOUND THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Order not found'));
            CONTINUE;
        END IF;

        v_allowed :=
            (v_order_type = 'delivery' AND v_drawer_type = 'driver')
            OR (v_order_type = 'pickup' AND v_is_third_party AND v_drawer_type = 'third_party')
            OR (v_order_type = 'pickup' AND NOT v_is_third_party AND v_drawer_type = 'register');

        IF NOT v_allowed THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(
                v_id,
                CASE
                    WHEN v_order_type = 'delivery' THEN 'Delivery orders can only go to a driver'
                    WHEN v_is_third_party THEN 'Third-party pickups can only go to Third Party'
                    ELSE 'In-house pickups can only go to a register'
                END
            ));
            CONTINUE;
        END IF;

        IF v_locked THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Order is locked'));
            CONTINUE;
        END IF;

        SELECT COALESCE(is_locked, false) INTO v_day_locked
        FROM public."BusinessDaySummary"
        WHERE business_date = v_business_date;

        IF COALESCE(v_day_locked, false) THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Business day is locked'));
            CONTINUE;
        END IF;

        UPDATE public."Order"
        SET drawer_id = p_drawer_id
        WHERE order_id = v_order_id;

        v_successes := v_successes || to_jsonb(v_id);
    END LOOP;

    RETURN jsonb_build_object(
        'data', jsonb_build_object(
            'successes', v_successes,
            'failures', v_failures
        )
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_orders_from_drawer(p_drawer_id uuid, p_order_ids jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    v_id text;
    v_order_id uuid;
    v_successes jsonb := '[]'::jsonb;
    v_failures jsonb := '[]'::jsonb;
    v_locked boolean;
    v_day_locked boolean;
    v_business_date date;
    v_current_drawer uuid;
BEGIN
    IF p_order_ids IS NULL OR jsonb_typeof(p_order_ids) <> 'array' THEN
        RETURN jsonb_build_object('error', 'p_order_ids must be a JSON array');
    END IF;

    FOR v_id IN SELECT jsonb_array_elements_text(p_order_ids)
    LOOP
        BEGIN
            v_order_id := v_id::uuid;
        EXCEPTION WHEN invalid_text_representation THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Invalid order id'));
            CONTINUE;
        END;

        SELECT is_locked, business_date, drawer_id INTO v_locked, v_business_date, v_current_drawer
        FROM public."Order"
        WHERE order_id = v_order_id;

        IF NOT FOUND THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Order not found'));
            CONTINUE;
        END IF;

        IF v_locked THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Order is locked'));
            CONTINUE;
        END IF;

        SELECT COALESCE(is_locked, false) INTO v_day_locked
        FROM public."BusinessDaySummary"
        WHERE business_date = v_business_date;

        IF COALESCE(v_day_locked, false) THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Business day is locked'));
            CONTINUE;
        END IF;

        IF v_current_drawer IS DISTINCT FROM p_drawer_id THEN
            v_failures := v_failures || jsonb_build_array(jsonb_build_object(v_id, 'Order is not in this drawer'));
            CONTINUE;
        END IF;

        UPDATE public."Order"
        SET drawer_id = NULL
        WHERE order_id = v_order_id;

        v_successes := v_successes || to_jsonb(v_id);
    END LOOP;

    RETURN jsonb_build_object(
        'data', jsonb_build_object(
            'successes', v_successes,
            'failures', v_failures
        )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_orders_to_drawer(uuid, jsonb) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.remove_orders_from_drawer(uuid, jsonb) TO authenticated, anon, service_role;

NOTIFY pgrst, 'reload schema';
