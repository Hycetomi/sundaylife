-- ============================================================
-- Migration 010: Volunteer batches + smarter profile trigger
-- ============================================================

-- ── Volunteer batches ─────────────────────────────────────────

CREATE TABLE volunteer_batches (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label          TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'open'
                   CHECK (status IN ('open', 'full', 'ongoing')),
  custom_message TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE volunteer_batches ENABLE ROW LEVEL SECURITY;

-- Anyone can read the current batch status (public page needs it)
CREATE POLICY "public_read_batches"
  ON volunteer_batches FOR SELECT TO anon, authenticated USING (true);

-- Only admins can create/update batches
CREATE POLICY "admins_manage_batches"
  ON volunteer_batches FOR ALL TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin');

GRANT SELECT ON volunteer_batches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON volunteer_batches TO authenticated;

-- Seed an initial open batch
INSERT INTO volunteer_batches (label, status)
VALUES ('Batch 1', 'open');

-- ── Update profile trigger to respect invited role/dept ───────
-- When an admin invites a user via inviteUserByEmail, they pass
-- { full_name, role, department_id } in user metadata. The
-- original trigger ignored these — this revision respects them.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, department_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN NEW.raw_user_meta_data->>'role' IN ('Admin', 'Lead', 'Volunteer')
      THEN NEW.raw_user_meta_data->>'role'
      ELSE 'Volunteer'
    END,
    NULLIF(NEW.raw_user_meta_data->>'department_id', '')::UUID
  );
  RETURN NEW;
END;
$$;
