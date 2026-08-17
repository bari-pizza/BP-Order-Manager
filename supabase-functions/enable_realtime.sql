-- Enable live UI updates for orders/payments (Dashboard → Database → Replication also works).
-- Safe to re-run.

ALTER TABLE public."Order" REPLICA IDENTITY FULL;
ALTER TABLE public."Payment" REPLICA IDENTITY FULL;

DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public."Order";
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public."Payment";
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END $$;
