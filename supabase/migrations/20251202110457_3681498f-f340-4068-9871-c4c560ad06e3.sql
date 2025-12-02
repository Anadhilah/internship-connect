-- Update organization_profiles SELECT policy to restrict access
DROP POLICY IF EXISTS "Organizations can view all profiles" ON organization_profiles;

CREATE POLICY "Restricted organization profile access"
ON organization_profiles FOR SELECT
USING (
  -- Organizations can view their own profile
  auth.uid() = user_id
  OR
  -- Interns can view profiles of organizations whose internships they've applied to
  EXISTS (
    SELECT 1 FROM applications a
    JOIN internships i ON a.internship_id = i.id
    WHERE i.organization_id = organization_profiles.user_id
    AND a.applicant_id = auth.uid()
  )
  OR
  -- Admins can view all organization profiles
  public.has_role(auth.uid(), 'admin')
);