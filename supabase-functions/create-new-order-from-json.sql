DECLARE
    v_order_id UUID := gen_random_uuid();
    v_payment_id UUID := gen_random_uuid();
    v_order_json JSONB;
    v_payment_json JSONB;
    v_is_locked BOOLEAN;
BEGIN
    -- Check if the business day is locked
    SELECT is_locked INTO v_is_locked
    FROM public."BusinessDaySummary"
    WHERE business_date = (p_order_json->>'business_date')::DATE;

    IF v_is_locked THEN
        RAISE EXCEPTION 'Cannot process order: Business day is locked';
    END IF;
    -- Insert into Orders table
    INSERT INTO public."Order" (
        order_id,
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
        v_order_id,
        NOW(),
        (p_order_json->>'order_type')::order_type,
        (p_order_json->>'business_date')::DATE,
        (p_order_json->>'drawer_id')::UUID,
        p_order_json->>'order_name',
        (p_order_json->>'order_number')::SMALLINT,
        (p_order_json->>'origin_id')::UUID,
        p_order_json->>'phone',
        (p_order_json->>'total_in_cents')::INTEGER,
        (p_order_json->>'delivery_fee_in_cents')::INTEGER,
        (p_order_json->>'last_updated_by')::UUID
    )
    RETURNING row_to_json(public."Order".*) INTO v_order_json;

    -- Insert into Payment table
    INSERT INTO public."Payment" (
        payment_id,
        created_at,
        order_id,
        payment_type,
        amount_in_cents,
        business_date,
        last_updated_by
    ) VALUES (
        v_payment_id,
        NOW(),
        v_order_id,
        (p_order_json->>'initial_payment_type')::payment_type,
        (p_order_json->>'total_in_cents')::INTEGER,
        (p_order_json->>'business_date')::DATE,
        (p_order_json->>'last_updated_by')::UUID
    )
    RETURNING row_to_json(public."Payment".*) INTO v_payment_json;

    -- Return the order with payments array as JSON
    RETURN jsonb_set(
        v_order_json,
        '{payments}',
        jsonb_build_array(v_payment_json)
    );
END;