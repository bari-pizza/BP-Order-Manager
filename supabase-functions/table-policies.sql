-- BAR-15 Phase 2: RLS for all public shop tables.
-- Safe to re-run. Apply to DEV first, then verify (smoke / full-day) before prod.
--
-- Model (single shop, first pass):
--   * anon: no table access (no policies for role anon)
--   * authenticated: SELECT on shop tables the POS loads after sign-in
--   * Order / Payment: any signed-in employee may write (no role guard on /orders)
--   * Business day close / cash / settings / origins / resources: admin or manager
--   * Profile: SELECT roster; UPDATE own editable columns; role flags / activity via DEFINER RPCs only
--   * Drawer / Driver rows: created by handle_employee_update (DEFINER); no direct client writes
--
-- Helper predicates are SECURITY DEFINER so policies that reference Profile do not recurse.
-- Soft-delete does not revoke Auth sessions; every authenticated policy must require an
-- active (not is_deleted) Profile so retained JWTs cannot keep reading/writing shop data.

CREATE OR REPLACE FUNCTION public.is_active_employee()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public."Profile"
        WHERE id = auth.uid()
          AND NOT is_deleted
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public."Profile"
        WHERE id = auth.uid()
          AND is_admin
          AND NOT is_deleted
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public."Profile"
        WHERE id = auth.uid()
          AND NOT is_deleted
          AND (is_admin OR is_manager)
    );
$$;

REVOKE ALL ON FUNCTION public.is_active_employee() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin_or_manager() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_active_employee() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_manager() TO authenticated;

-- ---------------------------------------------------------------------------
-- Profile
-- ---------------------------------------------------------------------------
ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profile_select_authenticated" ON public."Profile";
DROP POLICY IF EXISTS "profile_update_own" ON public."Profile";

CREATE POLICY "profile_select_authenticated"
ON public."Profile" FOR SELECT
TO authenticated
-- Active employees see the roster; soft-deleted users may still read their own row
-- so the client can detect is_deleted and sign them out.
USING (public.is_active_employee() OR id = auth.uid());

-- Own row only. Role / soft-delete / activity columns are not in the column GRANT below,
-- so even this policy cannot elevate privileges via PostgREST.
CREATE POLICY "profile_update_own"
ON public."Profile" FOR UPDATE
TO authenticated
USING (id = auth.uid() AND public.is_active_employee())
WITH CHECK (id = auth.uid() AND public.is_active_employee());

REVOKE ALL ON TABLE public."Profile" FROM anon, authenticated;
GRANT SELECT ON TABLE public."Profile" TO authenticated;
GRANT UPDATE (
    first_name,
    last_name,
    phone,
    avatar_src,
    locale
) ON TABLE public."Profile" TO authenticated;
-- INSERT stays with service_role (create-user Edge Function / seed).

-- ---------------------------------------------------------------------------
-- Drawer / Driver (mutations via DEFINER employee RPCs)
-- ---------------------------------------------------------------------------
ALTER TABLE public."Drawer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Driver" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "drawer_select_authenticated" ON public."Drawer";
DROP POLICY IF EXISTS "driver_select_authenticated" ON public."Driver";

CREATE POLICY "drawer_select_authenticated"
ON public."Drawer" FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "driver_select_authenticated"
ON public."Driver" FOR SELECT
TO authenticated
USING (public.is_active_employee());

REVOKE ALL ON TABLE public."Drawer" FROM anon, authenticated;
REVOKE ALL ON TABLE public."Driver" FROM anon, authenticated;
GRANT SELECT ON TABLE public."Drawer" TO authenticated;
GRANT SELECT ON TABLE public."Driver" TO authenticated;

-- ---------------------------------------------------------------------------
-- OrderOrigin / Resource / AppSetting (admin-manager write)
-- ---------------------------------------------------------------------------
ALTER TABLE public."OrderOrigin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Resource" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."AppSetting" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_origin_select_authenticated" ON public."OrderOrigin";
DROP POLICY IF EXISTS "order_origin_write_admin_manager" ON public."OrderOrigin";
DROP POLICY IF EXISTS "resource_select_authenticated" ON public."Resource";
DROP POLICY IF EXISTS "resource_write_admin_manager" ON public."Resource";
DROP POLICY IF EXISTS "app_setting_select_authenticated" ON public."AppSetting";
DROP POLICY IF EXISTS "app_setting_write_admin_manager" ON public."AppSetting";

CREATE POLICY "order_origin_select_authenticated"
ON public."OrderOrigin" FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "order_origin_write_admin_manager"
ON public."OrderOrigin" FOR ALL
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "resource_select_authenticated"
ON public."Resource" FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "resource_write_admin_manager"
ON public."Resource" FOR ALL
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "app_setting_select_authenticated"
ON public."AppSetting" FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "app_setting_write_admin_manager"
ON public."AppSetting" FOR ALL
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

REVOKE ALL ON TABLE public."OrderOrigin" FROM anon, authenticated;
REVOKE ALL ON TABLE public."Resource" FROM anon, authenticated;
REVOKE ALL ON TABLE public."AppSetting" FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."OrderOrigin" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Resource" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."AppSetting" TO authenticated;

-- ---------------------------------------------------------------------------
-- Order / Payment (any signed-in employee — POS + /orders)
-- ---------------------------------------------------------------------------
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_all_authenticated" ON public."Order";
DROP POLICY IF EXISTS "payment_all_authenticated" ON public."Payment";

CREATE POLICY "order_all_authenticated"
ON public."Order" FOR ALL
TO authenticated
USING (public.is_active_employee())
WITH CHECK (public.is_active_employee());

CREATE POLICY "payment_all_authenticated"
ON public."Payment" FOR ALL
TO authenticated
USING (public.is_active_employee())
WITH CHECK (public.is_active_employee());

REVOKE ALL ON TABLE public."Order" FROM anon, authenticated;
REVOKE ALL ON TABLE public."Payment" FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Order" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."Payment" TO authenticated;

-- ---------------------------------------------------------------------------
-- Business day tables
-- ---------------------------------------------------------------------------
ALTER TABLE public."BusinessDayDriver" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BusinessDayDrawer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BusinessDaySummary" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CashTransfer" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bdd_select_authenticated" ON public."BusinessDayDriver";
DROP POLICY IF EXISTS "bdd_write_admin_manager" ON public."BusinessDayDriver";
DROP POLICY IF EXISTS "bddrawer_select_authenticated" ON public."BusinessDayDrawer";
DROP POLICY IF EXISTS "bddrawer_write_admin_manager" ON public."BusinessDayDrawer";
DROP POLICY IF EXISTS "bdsummary_select_authenticated" ON public."BusinessDaySummary";
DROP POLICY IF EXISTS "bdsummary_write_admin_manager" ON public."BusinessDaySummary";
DROP POLICY IF EXISTS "cash_transfer_select_authenticated" ON public."CashTransfer";
DROP POLICY IF EXISTS "cash_transfer_write_admin_manager" ON public."CashTransfer";

CREATE POLICY "bdd_select_authenticated"
ON public."BusinessDayDriver" FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "bdd_write_admin_manager"
ON public."BusinessDayDriver" FOR ALL
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "bddrawer_select_authenticated"
ON public."BusinessDayDrawer" FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "bddrawer_write_admin_manager"
ON public."BusinessDayDrawer" FOR ALL
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "bdsummary_select_authenticated"
ON public."BusinessDaySummary" FOR SELECT
TO authenticated
USING (public.is_active_employee());

-- Closing / reopening the shop day is admin or manager only.
CREATE POLICY "bdsummary_write_admin_manager"
ON public."BusinessDaySummary" FOR ALL
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "cash_transfer_select_authenticated"
ON public."CashTransfer" FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "cash_transfer_write_admin_manager"
ON public."CashTransfer" FOR ALL
TO authenticated
USING (public.is_admin_or_manager())
WITH CHECK (public.is_admin_or_manager());

REVOKE ALL ON TABLE public."BusinessDayDriver" FROM anon, authenticated;
REVOKE ALL ON TABLE public."BusinessDayDrawer" FROM anon, authenticated;
REVOKE ALL ON TABLE public."BusinessDaySummary" FROM anon, authenticated;
REVOKE ALL ON TABLE public."CashTransfer" FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."BusinessDayDriver" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."BusinessDayDrawer" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."BusinessDaySummary" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public."CashTransfer" TO authenticated;

-- ---------------------------------------------------------------------------
-- GlobalChangeTracker (realtime invalidation; writes usually via DB triggers)
-- ---------------------------------------------------------------------------
ALTER TABLE public."GlobalChangeTracker" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gct_select_authenticated" ON public."GlobalChangeTracker";

CREATE POLICY "gct_select_authenticated"
ON public."GlobalChangeTracker" FOR SELECT
TO authenticated
USING (public.is_active_employee());

REVOKE ALL ON TABLE public."GlobalChangeTracker" FROM anon, authenticated;
GRANT SELECT ON TABLE public."GlobalChangeTracker" TO authenticated;

-- ---------------------------------------------------------------------------
-- INVOKER RPCs: stop anon execute (table RLS alone does not cover RPC entry)
-- ---------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.create_new_order_from_json(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_new_order_from_json(jsonb) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.add_orders_to_drawer(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_orders_to_drawer(uuid, jsonb) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.remove_orders_from_drawer(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.remove_orders_from_drawer(uuid, jsonb) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.lock_drawer(uuid, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.lock_drawer(uuid, date) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.unlock_drawer(uuid, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.unlock_drawer(uuid, date) TO authenticated, service_role;
