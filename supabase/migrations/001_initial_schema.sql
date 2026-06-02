-- ============================================================
-- sundayLife — Initial Schema
-- Run this in your Supabase SQL editor (dev project first).
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Departments (seed data included)
CREATE TABLE departments (
  id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE
);

INSERT INTO departments (name) VALUES
  ('Operations'),
  ('Events'),
  ('Finance'),
  ('Life House'),
  ('PDT');

-- Profiles (extends Supabase auth.users — do NOT create a separate users table)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'Volunteer'
                  CHECK (role IN ('Admin', 'Lead', 'Volunteer')),
  department_id UUID REFERENCES departments(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lifehouses
CREATE TABLE lifehouses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  location     TEXT,
  meeting_time TEXT,
  lead_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Members (connected attendees, not staff)
CREATE TABLE members (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name    TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  address      TEXT,
  lifehouse_id UUID REFERENCES lifehouses(id) ON DELETE SET NULL,
  join_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public sign-up requests
CREATE TABLE lifehouse_requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name    TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT NOT NULL,
  address_area TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'Pending'
                 CHECK (status IN ('Pending', 'Approved')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Attendance tracking
CREATE TABLE attendance_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id    UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  lifehouse_id UUID NOT NULL REFERENCES lifehouses(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (member_id, meeting_date)
);

-- Internal task management
CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT,
  department_id UUID REFERENCES departments(id),
  requester_id  UUID NOT NULL REFERENCES profiles(id),
  assignee_id   UUID REFERENCES profiles(id),
  status        TEXT NOT NULL DEFAULT 'Draft'
                  CHECK (status IN ('Draft', 'Pending Triage', 'Assigned', 'In Review', 'Completed')),
  due_date      DATE,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Task templates with dynamic JSONB field definitions
CREATE TABLE task_templates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id   UUID REFERENCES departments(id),
  template_name   TEXT NOT NULL,
  required_fields JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge base links to external docs/SOPs
CREATE TABLE spaces (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES departments(id),
  title         TEXT NOT NULL,
  external_link TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- In-app notifications
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'info',
  action_link TEXT,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGER: auto-create profile on user sign-up
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- VIEWS
-- ============================================================

-- Monthly leaderboard: top task completers for the current calendar month
CREATE OR REPLACE VIEW monthly_leaderboard
WITH (security_invoker = true)
AS
SELECT
  p.id,
  p.full_name,
  COUNT(t.id) AS completed_count
FROM profiles p
LEFT JOIN tasks t
  ON  t.assignee_id  = p.id
  AND t.status       = 'Completed'
  AND DATE_TRUNC('month', t.completed_at) = DATE_TRUNC('month', NOW())
GROUP BY p.id, p.full_name
ORDER BY completed_count DESC;

-- Retention alerts: members with fewer than 3 check-ins in the last 30 days
CREATE OR REPLACE VIEW retention_alerts
WITH (security_invoker = true)
AS
SELECT
  m.id,
  m.full_name,
  m.phone,
  m.lifehouse_id,
  COUNT(al.id) AS attendance_count
FROM members m
LEFT JOIN attendance_logs al
  ON  al.member_id   = m.id
  AND al.meeting_date >= (NOW() - INTERVAL '30 days')::DATE
GROUP BY m.id, m.full_name, m.phone, m.lifehouse_id
HAVING COUNT(al.id) < 3;

-- ============================================================
-- GRANTS (required before RLS policies take effect)
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON departments TO authenticated;
GRANT SELECT ON lifehouses  TO authenticated;
GRANT SELECT ON monthly_leaderboard TO authenticated;

GRANT SELECT, INSERT ON lifehouse_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON lifehouse_requests TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON profiles       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON members        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON attendance_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tasks          TO authenticated;
GRANT SELECT ON task_templates TO authenticated;
GRANT SELECT ON spaces         TO authenticated;
GRANT SELECT, INSERT, UPDATE ON notifications TO authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifehouses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE members           ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifehouse_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_templates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces             ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;

-- ---- departments: all staff can read ----
CREATE POLICY "staff_read_departments"
  ON departments FOR SELECT TO authenticated USING (true);

-- ---- lifehouses: all staff can read, admins can write ----
CREATE POLICY "staff_read_lifehouses"
  ON lifehouses FOR SELECT TO authenticated USING (true);

CREATE POLICY "admins_write_lifehouses"
  ON lifehouses FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin');

-- ---- profiles ----
-- All authenticated staff can read profiles (needed for leaderboard + task assignment UI)
CREATE POLICY "staff_read_profiles"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ---- members ----
CREATE POLICY "lifehouse_lead_manage_members"
  ON members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lifehouses
      WHERE lifehouses.id          = members.lifehouse_id
        AND lifehouses.lead_user_id = auth.uid()
    )
  );

CREATE POLICY "admins_manage_all_members"
  ON members FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin');

-- ---- lifehouse_requests ----
-- Anyone (anon) can submit; authenticated staff can read and update
CREATE POLICY "public_insert_requests"
  ON lifehouse_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "staff_read_requests"
  ON lifehouse_requests FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "leads_update_requests"
  ON lifehouse_requests FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('Admin', 'Lead'));

-- ---- attendance_logs ----
CREATE POLICY "lifehouse_lead_manage_attendance"
  ON attendance_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lifehouses
      WHERE lifehouses.id          = attendance_logs.lifehouse_id
        AND lifehouses.lead_user_id = auth.uid()
    )
  );

CREATE POLICY "admins_manage_all_attendance"
  ON attendance_logs FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin');

-- ---- tasks ----
CREATE POLICY "users_read_own_tasks"
  ON tasks FOR SELECT
  USING (assignee_id = auth.uid() OR requester_id = auth.uid());

CREATE POLICY "leads_read_dept_tasks"
  ON tasks FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('Admin', 'Lead')
    AND (
      (SELECT department_id FROM profiles WHERE id = auth.uid()) = tasks.department_id
      OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin'
    )
  );

CREATE POLICY "authenticated_create_tasks"
  ON tasks FOR INSERT TO authenticated
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "assignee_update_task_status"
  ON tasks FOR UPDATE
  USING (assignee_id = auth.uid());

CREATE POLICY "leads_update_dept_tasks"
  ON tasks FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('Admin', 'Lead')
    AND (
      (SELECT department_id FROM profiles WHERE id = auth.uid()) = tasks.department_id
      OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin'
    )
  );

-- ---- task_templates: all staff read ----
CREATE POLICY "staff_read_templates"
  ON task_templates FOR SELECT TO authenticated USING (true);

CREATE POLICY "admins_manage_templates"
  ON task_templates FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin');

-- ---- spaces: all staff read ----
CREATE POLICY "staff_read_spaces"
  ON spaces FOR SELECT TO authenticated USING (true);

CREATE POLICY "admins_manage_spaces"
  ON spaces FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin');

-- ---- notifications: own only ----
CREATE POLICY "users_read_own_notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "system_insert_notifications"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "users_update_own_notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());
