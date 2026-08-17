-- Align OrderOrigin with the columns the app actually uses.
-- Run this in Supabase → SQL Editor, then retry saving an origin.
-- Reloads PostgREST schema cache at the end.

ALTER TABLE "OrderOrigin"
    ADD COLUMN IF NOT EXISTS can_deliver boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS can_tip boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS has_order_number boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS default_is_prepaid boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_prepaid_toggleable boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_third_party boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS icon text;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'OrderOrigin'
          AND column_name = 'logo_src'
    ) THEN
        UPDATE "OrderOrigin"
        SET icon = logo_src
        WHERE icon IS NULL AND logo_src IS NOT NULL;
    END IF;
END $$;

UPDATE "OrderOrigin"
SET
    can_deliver = true,
    can_tip = true,
    is_third_party = false,
    default_is_prepaid = false,
    is_prepaid_toggleable = true
WHERE name = 'Bari Pizza';

UPDATE "OrderOrigin"
SET
    can_deliver = true,
    can_tip = true,
    is_third_party = true,
    default_is_prepaid = true,
    is_prepaid_toggleable = false
WHERE name IN ('DoorDash', 'UberEats', 'Uber Eats', 'Grubhub', 'Pizzamico');

NOTIFY pgrst, 'reload schema';
