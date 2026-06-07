-- ============================================================
-- 006: Knowledge Base file uploads via Supabase Storage
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ---- Schema changes ----
-- Make external_link nullable (spaces can now be a file OR a link)
ALTER TABLE spaces ALTER COLUMN external_link DROP NOT NULL;

-- Store the storage path for uploaded files
ALTER TABLE spaces ADD COLUMN IF NOT EXISTS file_path TEXT;

-- At least one of external_link or file_path must be present
ALTER TABLE spaces ADD CONSTRAINT spaces_has_url
  CHECK (external_link IS NOT NULL OR file_path IS NOT NULL);

-- ---- Storage bucket ----
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('knowledge-base', 'knowledge-base', true, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload
CREATE POLICY "kb_upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'knowledge-base');

-- Authenticated users can read
CREATE POLICY "kb_read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'knowledge-base');

-- Leads and Admins can delete files
CREATE POLICY "kb_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'knowledge-base'
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('Lead', 'Admin')
  );
