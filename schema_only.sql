-- Bari Pizza Database Schema
-- Extracted from backup: Aug 7, 2025

CREATE TYPE public.drawer_type AS ENUM (
CREATE TYPE public.order_type AS ENUM (
CREATE TYPE public.payment_type AS ENUM (
CREATE TYPE public.transfer_type AS ENUM (
CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
        create or replace function graphql_public.graphql(
COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';
CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
CREATE FUNCTION public.add_orders_to_drawer(p_order_ids json, p_drawer_id text) RETURNS json
        FROM public."Drawer" 
        INSERT INTO public.error_logs (error_message, context)
        FROM public."Order"
            FROM public."OrderOrigin"
            UPDATE public."Order"
            INSERT INTO public.error_logs (error_message, context)
CREATE FUNCTION public.check_cash_transfer_lock() RETURNS trigger
        FROM public."BusinessDayDrawer" bdd
        JOIN public."Drawer" d ON bdd.drawer_id = d.drawer_id
        FROM public."BusinessDayDrawer" bdd
        JOIN public."Drawer" d ON bdd.drawer_id = d.drawer_id
CREATE FUNCTION public.check_drawer_lock() RETURNS trigger
            FROM public."BusinessDayDrawer"
            FROM public."BusinessDayDrawer"
            FROM public."Order"
            FROM public."BusinessDayDrawer"
        INSERT INTO public.error_logs (error_message, context, order_id)
        INSERT INTO public.error_logs (error_message, context, order_id)
CREATE FUNCTION public.check_drawer_lock_conditions() RETURNS trigger
CREATE FUNCTION public.check_locked_drawer_on_order() RETURNS trigger
        FROM public."BusinessDayDrawer"
        FROM public."BusinessDayDrawer"
CREATE FUNCTION public.create_new_order_from_json(p_order_json jsonb) RETURNS jsonb
    FROM public."BusinessDaySummary"
    INSERT INTO public."Order" (
    RETURNING row_to_json(public."Order".*) INTO v_order_json;
    INSERT INTO public."Payment" (
    RETURNING row_to_json(public."Payment".*) INTO v_payment_json;
CREATE FUNCTION public.create_profile_on_user_signup() RETURNS trigger
    -- Create a new profile entry in the public.Profile table
    INSERT INTO public."Profile" (id, email, first_name, last_name, phone)
CREATE FUNCTION public.delete_order_trigger_function() RETURNS trigger
CREATE TABLE public."Profile" (
-- Name: handle_employee_update(public."Profile", boolean); Type: FUNCTION; Schema: public; Owner: postgres
CREATE FUNCTION public.handle_employee_update(p_profile public."Profile", p_is_driver boolean) RETURNS jsonb
    UPDATE public."Profile"
    RETURNING to_jsonb(public."Profile".*) INTO result_profile;
        IF NOT EXISTS (SELECT 1 FROM public."Driver" WHERE driver_id = p_profile.id) THEN
            INSERT INTO public."Drawer" (name, drawer_type,drawer_id)
            INSERT INTO public."Driver" (drawer_id, driver_id)
            RETURNING to_jsonb(public."Driver".*) INTO result_driver;
            UPDATE public."Driver"
            RETURNING to_jsonb(public."Driver".*) INTO result_driver;
        UPDATE public."Driver"
        RETURNING to_jsonb(public."Driver".*) INTO result_driver;
CREATE FUNCTION public.lock_drawer(p_drawer_id uuid, p_business_date date) RETURNS jsonb
CREATE FUNCTION public.payment_trigger_function() RETURNS trigger
CREATE FUNCTION public.prevent_business_day_driver_delete_if_order_exists() RETURNS trigger
    FROM public."Order"
CREATE FUNCTION public.remove_orders_from_drawer(p_order_ids json, p_drawer_id text) RETURNS json
        FROM public."Drawer" 
        FROM public."Order"
                UPDATE public."Order"
CREATE FUNCTION public.unlock_drawer(p_drawer_id uuid, p_business_date date) RETURNS jsonb
        INSERT INTO public.error_logs (error_message, context, order_id, created_at)
CREATE FUNCTION public.update_employee(p_id uuid, p_is_deleted boolean DEFAULT true) RETURNS void
    UPDATE public."Profile"
    UPDATE public."Driver"
    UPDATE public."Drawer"
        FROM public."Driver"
CREATE FUNCTION public.update_global_change_tracker() RETURNS trigger
CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
-- Regclass of the table e.g. public.notes
CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
CREATE FUNCTION realtime.topic() RETURNS text
CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
CREATE FUNCTION storage.extension(name text) RETURNS text
CREATE FUNCTION storage.filename(name text) RETURNS text
CREATE FUNCTION storage.foldername(name text) RETURNS text[]
CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
CREATE FUNCTION storage.operation() RETURNS text
CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
CREATE TABLE public."AppSetting" (
CREATE TABLE public."BusinessDayDrawer" (
COMMENT ON TABLE public."BusinessDayDrawer" IS 'Only used to keep track of drawer summaries at the end of the day';
CREATE TABLE public."BusinessDayDriver" (
CREATE TABLE public."BusinessDaySummary" (
CREATE TABLE public."CashTransfer" (
    transfer_type public.transfer_type NOT NULL
COMMENT ON TABLE public."CashTransfer" IS 'Used to track transfers of cash from one drawer to another';
CREATE TABLE public."Drawer" (
    drawer_type public.drawer_type NOT NULL,
CREATE TABLE public."Driver" (
CREATE TABLE public."GlobalChangeTracker" (
CREATE TABLE public."Order" (
    order_type public.order_type DEFAULT 'delivery'::public.order_type NOT NULL,
CREATE TABLE public."OrderOrigin" (
CREATE TABLE public."Payment" (
    payment_type public.payment_type NOT NULL,
CREATE TABLE public."Resource" (
ALTER TABLE public."AppSetting" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.appsetting_id_seq
CREATE TABLE public.error_logs (
ALTER TABLE public.error_logs ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.error_logs_id_seq
SELECT pg_catalog.setval('public.appsetting_id_seq', 6, true);
SELECT pg_catalog.setval('public.error_logs_id_seq', 289, true);
ALTER TABLE ONLY public."BusinessDayDrawer"
ALTER TABLE ONLY public."BusinessDayDriver"
ALTER TABLE ONLY public."BusinessDaySummary"
ALTER TABLE ONLY public."CashTransfer"
ALTER TABLE ONLY public."Drawer"
ALTER TABLE ONLY public."GlobalChangeTracker"
ALTER TABLE ONLY public."OrderOrigin"
ALTER TABLE ONLY public."Profile"
ALTER TABLE ONLY public."Resource"
ALTER TABLE ONLY public."AppSetting"
ALTER TABLE ONLY public."Driver"
ALTER TABLE ONLY public.error_logs
ALTER TABLE ONLY public."Order"
ALTER TABLE ONLY public."Payment"
ALTER TABLE ONLY public."Profile"
CREATE TRIGGER app_setting_update AFTER INSERT OR DELETE OR UPDATE ON public."AppSetting" FOR EACH ROW EXECUTE FUNCTION public.update_global_change_tracker();
CREATE TRIGGER before_lock_drawer BEFORE UPDATE ON public."BusinessDayDrawer" FOR EACH ROW WHEN ((new.is_locked = true)) EXECUTE FUNCTION public.check_drawer_lock_conditions();
CREATE TRIGGER before_update_order BEFORE UPDATE ON public."Order" FOR EACH ROW EXECUTE FUNCTION public.check_locked_drawer_on_order();
CREATE TRIGGER cash_transfer_lock_check BEFORE INSERT OR DELETE OR UPDATE ON public."CashTransfer" FOR EACH ROW EXECUTE FUNCTION public.check_cash_transfer_lock();
CREATE TRIGGER delete_order_trigger BEFORE DELETE ON public."Order" FOR EACH ROW EXECUTE FUNCTION public.delete_order_trigger_function();
CREATE TRIGGER drawer_update AFTER INSERT OR DELETE OR UPDATE ON public."Drawer" FOR EACH ROW EXECUTE FUNCTION public.update_global_change_tracker();
CREATE TRIGGER driver_update AFTER INSERT OR DELETE OR UPDATE ON public."Driver" FOR EACH ROW EXECUTE FUNCTION public.update_global_change_tracker();
CREATE TRIGGER order_origin_update AFTER INSERT OR DELETE OR UPDATE ON public."OrderOrigin" FOR EACH ROW EXECUTE FUNCTION public.update_global_change_tracker();
CREATE TRIGGER payment_trigger BEFORE INSERT OR DELETE OR UPDATE ON public."Payment" FOR EACH ROW EXECUTE FUNCTION public.payment_trigger_function();
CREATE TRIGGER prevent_delete_trigger BEFORE DELETE ON public."BusinessDayDriver" FOR EACH ROW EXECUTE FUNCTION public.prevent_business_day_driver_delete_if_order_exists();
CREATE TRIGGER profile_update AFTER INSERT OR DELETE OR UPDATE ON public."Profile" FOR EACH ROW EXECUTE FUNCTION public.update_global_change_tracker();
CREATE TRIGGER resource_update BEFORE INSERT OR DELETE OR UPDATE ON public."Resource" FOR EACH ROW EXECUTE FUNCTION public.update_global_change_tracker();
CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();
CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();
ALTER TABLE ONLY public."BusinessDayDrawer"
    ADD CONSTRAINT "BusinessDayDrawer_drawer_id_fkey" FOREIGN KEY (drawer_id) REFERENCES public."Drawer"(drawer_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."CashTransfer"
    ADD CONSTRAINT "CashTransfer_destination_fkey" FOREIGN KEY (destination) REFERENCES public."Drawer"(drawer_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."CashTransfer"
    ADD CONSTRAINT "CashTransfer_source_fkey" FOREIGN KEY (source) REFERENCES public."Drawer"(drawer_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_last_updated_by_fkey" FOREIGN KEY (last_updated_by) REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_origin_id_fkey" FOREIGN KEY (origin_id) REFERENCES public."OrderOrigin"(origin_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_last_updated_by_fkey" FOREIGN KEY (last_updated_by) REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."BusinessDayDriver"
    ADD CONSTRAINT businessdaysdriver_drawer_id_fkey FOREIGN KEY (drawer_id) REFERENCES public."Drawer"(drawer_id);
ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "drawers.drivers_driver_id_fkey" FOREIGN KEY (driver_id) REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "drawers.drivers_id_fkey" FOREIGN KEY (drawer_id) REFERENCES public."Drawer"(drawer_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT orders_drawer_id_fkey FOREIGN KEY (drawer_id) REFERENCES public."Drawer"(drawer_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."Order"(order_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public."Profile"
   FROM public."Profile"
   FROM public."Profile" "Profile_1"
   FROM public."Profile" "Profile_1"
   FROM public."Profile" "Profile_1"
   FROM public."Profile" "Profile_1"
ALTER TABLE public."AppSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BusinessDayDrawer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BusinessDayDriver" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BusinessDaySummary" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CashTransfer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Drawer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Driver" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable delete for all users" ON public."BusinessDayDriver" FOR DELETE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public."CashTransfer" FOR DELETE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public."Order" FOR DELETE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public."Payment" FOR DELETE TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."BusinessDayDriver" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."BusinessDaySummary" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."CashTransfer" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."Drawer" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."Driver" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."Order" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."Payment" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."Profile" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable insert for authenticated users only" ON public."Resource" FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable read access for all users" ON public."AppSetting" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."BusinessDayDrawer" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."BusinessDayDriver" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."BusinessDaySummary" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."CashTransfer" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."Drawer" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."Driver" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."GlobalChangeTracker" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."Order" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."OrderOrigin" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."Payment" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."Profile" FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public."Resource" FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated users only" ON public."AppSetting" FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public."BusinessDaySummary" FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable update for authenticated users only" ON public."CashTransfer" FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable update for authenticated users only" ON public."Order" FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public."Payment" FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
ALTER TABLE public."GlobalChangeTracker" ENABLE ROW LEVEL SECURITY;
   FROM public."Profile"
ALTER TABLE public."Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrderOrigin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Resource" ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."BusinessDayDrawer";
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."BusinessDayDriver";
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."BusinessDaySummary";
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."CashTransfer";
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."GlobalChangeTracker";
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Order";
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Payment";
ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Profile";
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;
GRANT ALL ON FUNCTION public.add_orders_to_drawer(p_order_ids json, p_drawer_id text) TO anon;
GRANT ALL ON FUNCTION public.add_orders_to_drawer(p_order_ids json, p_drawer_id text) TO authenticated;
GRANT ALL ON FUNCTION public.add_orders_to_drawer(p_order_ids json, p_drawer_id text) TO service_role;
GRANT ALL ON FUNCTION public.check_cash_transfer_lock() TO anon;
GRANT ALL ON FUNCTION public.check_cash_transfer_lock() TO authenticated;
GRANT ALL ON FUNCTION public.check_cash_transfer_lock() TO service_role;
GRANT ALL ON FUNCTION public.check_drawer_lock() TO anon;
GRANT ALL ON FUNCTION public.check_drawer_lock() TO authenticated;
GRANT ALL ON FUNCTION public.check_drawer_lock() TO service_role;
GRANT ALL ON FUNCTION public.check_drawer_lock_conditions() TO anon;
GRANT ALL ON FUNCTION public.check_drawer_lock_conditions() TO authenticated;
GRANT ALL ON FUNCTION public.check_drawer_lock_conditions() TO service_role;
GRANT ALL ON FUNCTION public.check_locked_drawer_on_order() TO anon;
GRANT ALL ON FUNCTION public.check_locked_drawer_on_order() TO authenticated;
GRANT ALL ON FUNCTION public.check_locked_drawer_on_order() TO service_role;
GRANT ALL ON FUNCTION public.create_new_order_from_json(p_order_json jsonb) TO anon;
GRANT ALL ON FUNCTION public.create_new_order_from_json(p_order_json jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.create_new_order_from_json(p_order_json jsonb) TO service_role;
GRANT ALL ON FUNCTION public.create_profile_on_user_signup() TO anon;
GRANT ALL ON FUNCTION public.create_profile_on_user_signup() TO authenticated;
GRANT ALL ON FUNCTION public.create_profile_on_user_signup() TO service_role;
GRANT ALL ON FUNCTION public.delete_order_trigger_function() TO anon;
GRANT ALL ON FUNCTION public.delete_order_trigger_function() TO authenticated;
GRANT ALL ON FUNCTION public.delete_order_trigger_function() TO service_role;
GRANT ALL ON TABLE public."Profile" TO anon;
GRANT ALL ON TABLE public."Profile" TO authenticated;
GRANT ALL ON TABLE public."Profile" TO service_role;
-- Name: FUNCTION handle_employee_update(p_profile public."Profile", p_is_driver boolean); Type: ACL; Schema: public; Owner: postgres
GRANT ALL ON FUNCTION public.handle_employee_update(p_profile public."Profile", p_is_driver boolean) TO anon;
GRANT ALL ON FUNCTION public.handle_employee_update(p_profile public."Profile", p_is_driver boolean) TO authenticated;
GRANT ALL ON FUNCTION public.handle_employee_update(p_profile public."Profile", p_is_driver boolean) TO service_role;
GRANT ALL ON FUNCTION public.lock_drawer(p_drawer_id uuid, p_business_date date) TO anon;
GRANT ALL ON FUNCTION public.lock_drawer(p_drawer_id uuid, p_business_date date) TO authenticated;
GRANT ALL ON FUNCTION public.lock_drawer(p_drawer_id uuid, p_business_date date) TO service_role;
GRANT ALL ON FUNCTION public.payment_trigger_function() TO anon;
GRANT ALL ON FUNCTION public.payment_trigger_function() TO authenticated;
GRANT ALL ON FUNCTION public.payment_trigger_function() TO service_role;
GRANT ALL ON FUNCTION public.prevent_business_day_driver_delete_if_order_exists() TO anon;
GRANT ALL ON FUNCTION public.prevent_business_day_driver_delete_if_order_exists() TO authenticated;
GRANT ALL ON FUNCTION public.prevent_business_day_driver_delete_if_order_exists() TO service_role;
GRANT ALL ON FUNCTION public.remove_orders_from_drawer(p_order_ids json, p_drawer_id text) TO anon;
GRANT ALL ON FUNCTION public.remove_orders_from_drawer(p_order_ids json, p_drawer_id text) TO authenticated;
GRANT ALL ON FUNCTION public.remove_orders_from_drawer(p_order_ids json, p_drawer_id text) TO service_role;
GRANT ALL ON FUNCTION public.unlock_drawer(p_drawer_id uuid, p_business_date date) TO anon;
GRANT ALL ON FUNCTION public.unlock_drawer(p_drawer_id uuid, p_business_date date) TO authenticated;
GRANT ALL ON FUNCTION public.unlock_drawer(p_drawer_id uuid, p_business_date date) TO service_role;
GRANT ALL ON FUNCTION public.update_employee(p_id uuid, p_is_deleted boolean) TO anon;
GRANT ALL ON FUNCTION public.update_employee(p_id uuid, p_is_deleted boolean) TO authenticated;
GRANT ALL ON FUNCTION public.update_employee(p_id uuid, p_is_deleted boolean) TO service_role;
GRANT ALL ON FUNCTION public.update_global_change_tracker() TO anon;
GRANT ALL ON FUNCTION public.update_global_change_tracker() TO authenticated;
GRANT ALL ON FUNCTION public.update_global_change_tracker() TO service_role;
GRANT ALL ON TABLE public."AppSetting" TO anon;
GRANT ALL ON TABLE public."AppSetting" TO authenticated;
GRANT ALL ON TABLE public."AppSetting" TO service_role;
GRANT ALL ON TABLE public."BusinessDayDrawer" TO anon;
GRANT ALL ON TABLE public."BusinessDayDrawer" TO authenticated;
GRANT ALL ON TABLE public."BusinessDayDrawer" TO service_role;
GRANT ALL ON TABLE public."BusinessDayDriver" TO anon;
GRANT ALL ON TABLE public."BusinessDayDriver" TO authenticated;
GRANT ALL ON TABLE public."BusinessDayDriver" TO service_role;
GRANT ALL ON TABLE public."BusinessDaySummary" TO anon;
GRANT ALL ON TABLE public."BusinessDaySummary" TO authenticated;
GRANT ALL ON TABLE public."BusinessDaySummary" TO service_role;
GRANT ALL ON TABLE public."CashTransfer" TO anon;
GRANT ALL ON TABLE public."CashTransfer" TO authenticated;
GRANT ALL ON TABLE public."CashTransfer" TO service_role;
GRANT ALL ON TABLE public."Drawer" TO anon;
GRANT ALL ON TABLE public."Drawer" TO authenticated;
GRANT ALL ON TABLE public."Drawer" TO service_role;
GRANT ALL ON TABLE public."Driver" TO anon;
GRANT ALL ON TABLE public."Driver" TO authenticated;
GRANT ALL ON TABLE public."Driver" TO service_role;
GRANT ALL ON TABLE public."GlobalChangeTracker" TO anon;
GRANT ALL ON TABLE public."GlobalChangeTracker" TO authenticated;
GRANT ALL ON TABLE public."GlobalChangeTracker" TO service_role;
GRANT ALL ON TABLE public."Order" TO anon;
GRANT ALL ON TABLE public."Order" TO authenticated;
GRANT ALL ON TABLE public."Order" TO service_role;
GRANT ALL ON TABLE public."OrderOrigin" TO anon;
GRANT ALL ON TABLE public."OrderOrigin" TO authenticated;
GRANT ALL ON TABLE public."OrderOrigin" TO service_role;
GRANT ALL ON TABLE public."Payment" TO anon;
GRANT ALL ON TABLE public."Payment" TO authenticated;
GRANT ALL ON TABLE public."Payment" TO service_role;
GRANT ALL ON TABLE public."Resource" TO anon;
GRANT ALL ON TABLE public."Resource" TO authenticated;
GRANT ALL ON TABLE public."Resource" TO service_role;
GRANT ALL ON SEQUENCE public.appsetting_id_seq TO anon;
GRANT ALL ON SEQUENCE public.appsetting_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.appsetting_id_seq TO service_role;
GRANT ALL ON TABLE public.error_logs TO anon;
GRANT ALL ON TABLE public.error_logs TO authenticated;
GRANT ALL ON TABLE public.error_logs TO service_role;
GRANT ALL ON SEQUENCE public.error_logs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.error_logs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.error_logs_id_seq TO service_role;
