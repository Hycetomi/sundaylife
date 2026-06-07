-- Volunteer Applications
-- Migration 008

CREATE TABLE volunteer_applications (
  id                     UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name              TEXT         NOT NULL,
  email                  TEXT         NOT NULL,
  phone                  TEXT,
  message                TEXT,
  preferred_department_id UUID        REFERENCES departments(id) ON DELETE SET NULL,
  assigned_department_id  UUID        REFERENCES departments(id) ON DELETE SET NULL,
  status                 TEXT         NOT NULL DEFAULT 'Pending'
                                      CHECK (status IN ('Pending','Approved','Rejected')),
  created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application
CREATE POLICY "public_submit_application"
  ON volunteer_applications FOR INSERT WITH CHECK (true);

-- Leads and Admins can read all applications
CREATE POLICY "staff_read_applications"
  ON volunteer_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('Lead', 'Admin')
    )
  );

-- Leads and Admins can update status and assignment
CREATE POLICY "staff_update_applications"
  ON volunteer_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('Lead', 'Admin')
    )
  );
