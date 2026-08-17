-- Seed the UI resource rows the app looks up by title.
-- Safe to re-run. Requires a unique constraint on "Resource".title
-- (the live schema uses title as the row identity).

INSERT INTO "Resource" (title, src, bucket_name)
VALUES
    ('Register', '', 'resources'),
    ('Third Party Pickup', '', 'resources'),
    ('Unassigned Drawer', '', 'resources'),
    ('Missing Avatar', '', 'resources'),
    ('Add Driver', '', 'resources')
ON CONFLICT (title) DO NOTHING;
