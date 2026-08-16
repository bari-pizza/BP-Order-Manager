-- Seed the UI resource rows the app looks up by title.
-- Safe to re-run. Requires a unique constraint on "Resource".title
-- (the live schema uses title as the row identity).

INSERT INTO "Resource" (title, src)
VALUES
    ('Register', NULL),
    ('Third Party Pickup', NULL),
    ('Unassigned Drawer', NULL),
    ('Missing Avatar', NULL),
    ('Add Driver', NULL)
ON CONFLICT (title) DO NOTHING;
