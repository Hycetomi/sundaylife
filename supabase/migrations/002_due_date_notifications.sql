-- ============================================================
-- Due-date reminder notifications via pg_cron
--
-- Prerequisites:
--   1. Enable pg_cron in Supabase: Database → Extensions → pg_cron
--   2. Run this migration AFTER 001_initial_schema.sql
-- ============================================================

-- Function: insert notifications for tasks due tomorrow
CREATE OR REPLACE FUNCTION notify_upcoming_due_dates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notifications (user_id, message, type, action_link)
  SELECT
    t.assignee_id,
    'Task "' || t.title || '" is due tomorrow.',
    'due_date_reminder',
    '/dashboard'
  FROM tasks t
  WHERE
    t.due_date     = CURRENT_DATE + INTERVAL '1 day'
    AND t.assignee_id IS NOT NULL
    AND t.status   NOT IN ('Completed', 'Draft');
END;
$$;

-- ============================================================
-- STEP 2 (run separately, AFTER enabling pg_cron extension):
--   Dashboard → Database → Extensions → pg_cron → Enable
--
-- Then run:
--   SELECT cron.schedule('due-date-notifier', '0 8 * * *', 'SELECT notify_upcoming_due_dates()');
--
-- Schedule runs every day at 08:00 UTC.
-- Adjust the time to match your team's timezone if needed.
-- ============================================================
