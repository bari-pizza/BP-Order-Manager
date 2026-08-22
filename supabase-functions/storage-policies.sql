-- Storage RLS for avatars, order_origins, and resources.
-- Public buckets still need INSERT/UPDATE/DELETE policies; without them uploads 403 with
-- "new row violates row-level security policy".
-- Avatar paths are `{auth.uid()}/{timestamp}-avatar.ext` (see AvatarUploader).
-- Safe to re-run.

INSERT INTO storage.buckets (id, name, public)
VALUES
    ('avatars', 'avatars', true),
    ('order_origins', 'order_origins', true),
    ('resources', 'resources', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Avatars: anyone can read; each signed-in user writes only in their own folder.
DROP POLICY IF EXISTS "avatars_public_select" ON storage.objects;
DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects;

CREATE POLICY "avatars_public_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Origin logos and UI resources: public read; admin/manager write.
DROP POLICY IF EXISTS "order_origins_public_select" ON storage.objects;
DROP POLICY IF EXISTS "order_origins_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "order_origins_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "order_origins_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "resources_public_select" ON storage.objects;
DROP POLICY IF EXISTS "resources_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "resources_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "resources_admin_delete" ON storage.objects;

CREATE POLICY "order_origins_public_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'order_origins');

CREATE POLICY "order_origins_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'order_origins'
    AND EXISTS (
        SELECT 1 FROM public."Profile"
        WHERE id = auth.uid()
          AND (is_admin OR is_manager)
    )
);

CREATE POLICY "order_origins_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'order_origins'
    AND EXISTS (
        SELECT 1 FROM public."Profile"
        WHERE id = auth.uid()
          AND (is_admin OR is_manager)
    )
)
WITH CHECK (
    bucket_id = 'order_origins'
    AND EXISTS (
        SELECT 1 FROM public."Profile"
        WHERE id = auth.uid()
          AND (is_admin OR is_manager)
    )
);

CREATE POLICY "order_origins_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'order_origins'
    AND EXISTS (
        SELECT 1 FROM public."Profile"
        WHERE id = auth.uid()
          AND (is_admin OR is_manager)
    )
);

CREATE POLICY "resources_public_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'resources');

CREATE POLICY "resources_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'resources'
    AND EXISTS (
        SELECT 1 FROM public."Profile"
        WHERE id = auth.uid()
          AND (is_admin OR is_manager)
    )
);

CREATE POLICY "resources_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'resources'
    AND EXISTS (
        SELECT 1 FROM public."Profile"
        WHERE id = auth.uid()
          AND (is_admin OR is_manager)
    )
)
WITH CHECK (
    bucket_id = 'resources'
    AND EXISTS (
        SELECT 1 FROM public."Profile"
        WHERE id = auth.uid()
          AND (is_admin OR is_manager)
    )
);

CREATE POLICY "resources_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'resources'
    AND EXISTS (
        SELECT 1 FROM public."Profile"
        WHERE id = auth.uid()
          AND (is_admin OR is_manager)
    )
);
