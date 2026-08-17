-- Align live Order/Payment with what the app and create_new_order_from_json expect.
-- Old schema used customer_name; the app uses order_name.
-- Safe to re-run.

ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS order_name text;
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS last_updated_by uuid;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Order'
          AND column_name = 'customer_name'
    ) THEN
        UPDATE public."Order"
        SET order_name = customer_name
        WHERE order_name IS NULL;
    END IF;
END $$;

ALTER TABLE public."Payment" ADD COLUMN IF NOT EXISTS business_date date;
ALTER TABLE public."Payment" ADD COLUMN IF NOT EXISTS last_updated_by uuid;
ALTER TABLE public."Payment" ADD COLUMN IF NOT EXISTS special_note text DEFAULT '' NOT NULL;

UPDATE public."Payment" AS p
SET business_date = o.business_date
FROM public."Order" AS o
WHERE o.order_id = p.order_id
  AND p.business_date IS NULL;

CREATE OR REPLACE FUNCTION public.create_new_order_from_json(p_order_json jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    v_order public."Order"%ROWTYPE;
    v_payment public."Payment"%ROWTYPE;
    v_is_locked boolean;
    v_created_at timestamptz;
    v_drawer_id uuid;
BEGIN
    v_created_at := COALESCE((p_order_json->>'created_at')::timestamptz, now());
    v_drawer_id := NULLIF(p_order_json->>'drawer_id', '')::uuid;

    SELECT is_locked INTO v_is_locked
    FROM public."BusinessDaySummary"
    WHERE business_date = (p_order_json->>'business_date')::date;

    IF v_is_locked THEN
        RAISE EXCEPTION 'Cannot process order: Business day is locked';
    END IF;

    INSERT INTO public."Order" (
        created_at,
        order_type,
        business_date,
        drawer_id,
        order_name,
        order_number,
        origin_id,
        phone,
        total_in_cents,
        delivery_fee_in_cents,
        last_updated_by
    ) VALUES (
        v_created_at,
        (p_order_json->>'order_type')::order_type,
        (p_order_json->>'business_date')::date,
        v_drawer_id,
        NULLIF(p_order_json->>'order_name', ''),
        NULLIF(p_order_json->>'order_number', '')::integer,
        (p_order_json->>'origin_id')::uuid,
        NULLIF(p_order_json->>'phone', ''),
        (p_order_json->>'total_in_cents')::integer,
        COALESCE((p_order_json->>'delivery_fee_in_cents')::integer, 0),
        NULLIF(p_order_json->>'last_updated_by', '')::uuid
    )
    RETURNING * INTO v_order;

    INSERT INTO public."Payment" (
        created_at,
        order_id,
        payment_type,
        amount_in_cents,
        business_date,
        last_updated_by
    ) VALUES (
        v_created_at,
        v_order.order_id,
        (p_order_json->>'initial_payment_type')::payment_type,
        (p_order_json->>'total_in_cents')::integer,
        (p_order_json->>'business_date')::date,
        NULLIF(p_order_json->>'last_updated_by', '')::uuid
    )
    RETURNING * INTO v_payment;

    RETURN jsonb_set(to_jsonb(v_order), '{payments}', jsonb_build_array(to_jsonb(v_payment)));
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_new_order_from_json(jsonb) TO authenticated, anon, service_role;

NOTIFY pgrst, 'reload schema';
