-- Allow Admins to update any profile (role, department_id, etc.)
-- The existing "users_update_own_profile" policy only covers self-updates.

CREATE POLICY "admins_update_any_profile"
  ON profiles FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin'
  )
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin'
  );
