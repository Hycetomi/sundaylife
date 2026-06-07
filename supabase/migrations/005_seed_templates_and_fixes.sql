-- ============================================================
-- 005: Seed task templates + schema fixes
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ---- Fix 1: remove 'Draft' from the tasks status constraint ----
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks
  ADD CONSTRAINT tasks_status_check
  CHECK (status IN ('Pending Triage', 'Assigned', 'In Review', 'Completed'));

-- ---- Fix 2: allow Leads (not just Admins) to manage spaces ----
DROP POLICY IF EXISTS "admins_manage_spaces" ON spaces;
CREATE POLICY "leads_admins_manage_spaces"
  ON spaces FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('Admin', 'Lead')
  );

-- ---- Seed: task templates ----
INSERT INTO task_templates (department_id, template_name, required_fields) VALUES

-- Operations
(
  (SELECT id FROM departments WHERE name = 'Operations'),
  'Venue Setup',
  '[
    {"name":"venue","label":"Venue / Location","type":"text","required":true},
    {"name":"setup_time","label":"Setup Time","type":"text","required":true},
    {"name":"headcount","label":"Expected Headcount","type":"text","required":false},
    {"name":"equipment","label":"Equipment Needed","type":"textarea","required":false}
  ]'::jsonb
),
(
  (SELECT id FROM departments WHERE name = 'Operations'),
  'Location Scouting',
  '[
    {"name":"proposed_location","label":"Proposed Location","type":"text","required":true},
    {"name":"purpose","label":"Purpose / Event","type":"text","required":true},
    {"name":"capacity","label":"Estimated Capacity Needed","type":"text","required":false},
    {"name":"date_needed","label":"Date Needed By","type":"date","required":false}
  ]'::jsonb
),
(
  (SELECT id FROM departments WHERE name = 'Operations'),
  'Equipment Procurement',
  '[
    {"name":"item_name","label":"Item(s) Required","type":"text","required":true},
    {"name":"quantity","label":"Quantity","type":"text","required":true},
    {"name":"purpose","label":"Purpose","type":"text","required":true},
    {"name":"budget","label":"Budget Estimate (₦)","type":"text","required":false}
  ]'::jsonb
),

-- Events
(
  (SELECT id FROM departments WHERE name = 'Events'),
  'Event Planning',
  '[
    {"name":"event_name","label":"Event Name","type":"text","required":true},
    {"name":"event_date","label":"Event Date","type":"date","required":true},
    {"name":"venue","label":"Venue","type":"text","required":true},
    {"name":"expected_attendance","label":"Expected Attendance","type":"text","required":false},
    {"name":"theme","label":"Theme / Notes","type":"textarea","required":false}
  ]'::jsonb
),
(
  (SELECT id FROM departments WHERE name = 'Events'),
  'Volunteer Coordination',
  '[
    {"name":"event_name","label":"Event Name","type":"text","required":true},
    {"name":"event_date","label":"Event Date","type":"date","required":true},
    {"name":"volunteers_needed","label":"Number of Volunteers Needed","type":"text","required":true},
    {"name":"roles","label":"Roles Required","type":"textarea","required":false}
  ]'::jsonb
),
(
  (SELECT id FROM departments WHERE name = 'Events'),
  'Event Debrief',
  '[
    {"name":"event_name","label":"Event Name","type":"text","required":true},
    {"name":"attendance_count","label":"Actual Attendance","type":"text","required":true},
    {"name":"highlights","label":"What Went Well","type":"textarea","required":false},
    {"name":"improvements","label":"What to Improve","type":"textarea","required":false}
  ]'::jsonb
),

-- Finance
(
  (SELECT id FROM departments WHERE name = 'Finance'),
  'Budget Request',
  '[
    {"name":"purpose","label":"Purpose","type":"text","required":true},
    {"name":"amount","label":"Amount Requested (₦)","type":"text","required":true},
    {"name":"vendor","label":"Vendor / Payee","type":"text","required":true},
    {"name":"date_needed","label":"Date Funds Needed","type":"date","required":false},
    {"name":"notes","label":"Additional Notes","type":"textarea","required":false}
  ]'::jsonb
),
(
  (SELECT id FROM departments WHERE name = 'Finance'),
  'Reimbursement',
  '[
    {"name":"payee_name","label":"Payee Name","type":"text","required":true},
    {"name":"amount","label":"Amount (₦)","type":"text","required":true},
    {"name":"purpose","label":"What Was Purchased","type":"text","required":true},
    {"name":"date_incurred","label":"Date Incurred","type":"date","required":true},
    {"name":"receipt","label":"Receipt Available?","type":"select","options":["Yes","No"],"required":true}
  ]'::jsonb
),

-- Life House
(
  (SELECT id FROM departments WHERE name = 'Life House'),
  'Member Follow-Up',
  '[
    {"name":"member_name","label":"Member Name","type":"text","required":true},
    {"name":"contact_method","label":"Contact Method","type":"select","options":["Phone Call","WhatsApp","Visit","Email"],"required":true},
    {"name":"reason","label":"Reason for Follow-Up","type":"text","required":true},
    {"name":"notes","label":"Notes","type":"textarea","required":false}
  ]'::jsonb
),
(
  (SELECT id FROM departments WHERE name = 'Life House'),
  'Outreach Visit',
  '[
    {"name":"target_area","label":"Target Area / Community","type":"text","required":true},
    {"name":"team_members","label":"Team Members","type":"text","required":true},
    {"name":"scheduled_date","label":"Scheduled Date","type":"date","required":true},
    {"name":"purpose","label":"Purpose / Goals","type":"textarea","required":false}
  ]'::jsonb
),

-- PDT
(
  (SELECT id FROM departments WHERE name = 'PDT'),
  'Training Session',
  '[
    {"name":"topic","label":"Training Topic","type":"text","required":true},
    {"name":"trainer","label":"Trainer / Facilitator","type":"text","required":true},
    {"name":"session_date","label":"Session Date","type":"date","required":true},
    {"name":"target_audience","label":"Target Audience","type":"text","required":false},
    {"name":"duration","label":"Duration","type":"text","required":false}
  ]'::jsonb
),
(
  (SELECT id FROM departments WHERE name = 'PDT'),
  'Resource Creation',
  '[
    {"name":"resource_type","label":"Resource Type","type":"select","options":["Document","Slide Deck","Video","Flier","Proposal"],"required":true},
    {"name":"topic","label":"Topic","type":"text","required":true},
    {"name":"target_audience","label":"Target Audience","type":"text","required":false},
    {"name":"notes","label":"Additional Notes","type":"textarea","required":false}
  ]'::jsonb
);
