-- Fix intern_profiles data exposure by restricting SELECT policy
DROP POLICY IF EXISTS "Interns can view all profiles" ON intern_profiles;

CREATE POLICY "Restricted intern profile access"
ON intern_profiles FOR SELECT
USING (
  -- Users can view their own profile
  auth.uid() = user_id
  OR
  -- Organizations can view profiles of applicants who applied to their internships
  EXISTS (
    SELECT 1 FROM applications a
    JOIN internships i ON a.internship_id = i.id
    WHERE a.applicant_id = intern_profiles.user_id
    AND i.organization_id = auth.uid()
  )
);

-- Create a secure function for complete account deletion
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all user data in correct order (respecting foreign keys)
  DELETE FROM applications WHERE applicant_id = auth.uid();
  DELETE FROM messages WHERE sender_id = auth.uid();
  DELETE FROM conversations WHERE participant1_id = auth.uid() OR participant2_id = auth.uid();
  DELETE FROM intern_profiles WHERE user_id = auth.uid();
  DELETE FROM organization_profiles WHERE user_id = auth.uid();
  DELETE FROM user_roles WHERE user_id = auth.uid();
END;
$$;