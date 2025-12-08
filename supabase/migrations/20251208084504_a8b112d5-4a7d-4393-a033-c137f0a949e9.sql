-- Add approval_status column to organization_profiles
ALTER TABLE organization_profiles 
ADD COLUMN approval_status text NOT NULL DEFAULT 'pending';

-- Add rejection_reason column for rejected organizations
ALTER TABLE organization_profiles 
ADD COLUMN rejection_reason text;

-- Add approved_at and approved_by columns
ALTER TABLE organization_profiles 
ADD COLUMN approved_at timestamp with time zone;

ALTER TABLE organization_profiles 
ADD COLUMN approved_by uuid;

-- Create index for faster queries on approval_status
CREATE INDEX idx_organization_profiles_approval_status ON organization_profiles(approval_status);

-- Create admin function to update organization approval status
CREATE OR REPLACE FUNCTION public.update_organization_approval(
  _org_id uuid,
  _status text,
  _reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can update organization approval status';
  END IF;
  
  -- Validate status
  IF _status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status. Must be pending, approved, or rejected';
  END IF;
  
  -- Update organization
  UPDATE organization_profiles
  SET 
    approval_status = _status,
    rejection_reason = CASE WHEN _status = 'rejected' THEN _reason ELSE NULL END,
    approved_at = CASE WHEN _status = 'approved' THEN now() ELSE NULL END,
    approved_by = CASE WHEN _status IN ('approved', 'rejected') THEN auth.uid() ELSE NULL END,
    updated_at = now()
  WHERE id = _org_id;
END;
$$;