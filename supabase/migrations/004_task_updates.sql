-- ============================================================
-- Task Updates: status change history + assignee comments
-- Run AFTER 001_initial_schema.sql
-- ============================================================

CREATE TABLE task_updates (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES profiles(id),
  new_status  TEXT,
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Grant access before enabling RLS
GRANT SELECT, INSERT ON task_updates TO authenticated;

ALTER TABLE task_updates ENABLE ROW LEVEL SECURITY;

-- Anyone involved in the task (assignee, requester) or Lead/Admin can read
CREATE POLICY "task_updates_select" ON task_updates
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM tasks t
      WHERE t.id = task_updates.task_id
        AND (t.assignee_id = auth.uid() OR t.requester_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('Lead', 'Admin')
    )
  );

-- Authenticated users can insert their own updates
CREATE POLICY "task_updates_insert" ON task_updates
  FOR INSERT WITH CHECK (user_id = auth.uid());
