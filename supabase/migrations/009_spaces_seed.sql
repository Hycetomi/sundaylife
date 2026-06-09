-- ============================================================
-- 009: Seed initial Knowledge Base spaces per department
-- Run AFTER 001_initial_schema.sql and 006_spaces_file_uploads.sql
-- ============================================================

INSERT INTO spaces (department_id, title, external_link)
SELECT d.id, s.title, s.external_link
FROM (VALUES
  ('Operations', 'Onboarding Checklist',            'https://notion.so'),
  ('Operations', 'Event Run-Sheet Template',         'https://notion.so'),
  ('Operations', 'Vendor Contact Directory',         'https://notion.so'),
  ('Events',     'Stage & Sound Setup SOP',          'https://notion.so'),
  ('Events',     'Night of Worship Planning Guide',  'https://notion.so'),
  ('Events',     'Volunteer Briefing Template',      'https://notion.so'),
  ('Finance',    'Budget Request Form',              'https://notion.so'),
  ('Finance',    'Expense Reimbursement Policy',     'https://notion.so'),
  ('Life House', 'Lifehouse Leader Handbook',        'https://notion.so'),
  ('Life House', 'Member Care Guidelines',           'https://notion.so'),
  ('PDT',        'Preaching Schedule',               'https://notion.so'),
  ('PDT',        'Sermon Preparation Resources',     'https://notion.so')
) AS s(dept_name, title, external_link)
JOIN departments d ON d.name = s.dept_name
ON CONFLICT DO NOTHING;
