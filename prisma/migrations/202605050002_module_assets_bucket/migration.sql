INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'module-assets',
  'module-assets',
  true,
  10485760,
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/pdf',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'module_assets_public_read'
  ) THEN
    CREATE POLICY "module_assets_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'module-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'module_assets_authenticated_insert'
  ) THEN
    CREATE POLICY "module_assets_authenticated_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'module-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'module_assets_authenticated_update'
  ) THEN
    CREATE POLICY "module_assets_authenticated_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'module-assets')
    WITH CHECK (bucket_id = 'module-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'module_assets_authenticated_delete'
  ) THEN
    CREATE POLICY "module_assets_authenticated_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'module-assets');
  END IF;
END $$;
