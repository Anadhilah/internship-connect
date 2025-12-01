-- Create a SECURITY DEFINER function to safely check if an admin exists
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE role = 'admin'
  )
$$;

-- Drop the old INSERT policy that allows any role assignment
DROP POLICY IF EXISTS "Users can insert their own roles during signup" ON user_roles;

-- Create new INSERT policy that only allows non-admin roles
CREATE POLICY "Users can insert non-admin roles only"
ON user_roles FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND role IN ('intern', 'organization')
);

-- Add explicit UPDATE policy to prevent role changes
CREATE POLICY "No direct role updates"
ON user_roles FOR UPDATE
USING (false);

-- Add explicit DELETE policy to prevent role deletion by users
CREATE POLICY "No direct role deletion"
ON user_roles FOR DELETE
USING (false);