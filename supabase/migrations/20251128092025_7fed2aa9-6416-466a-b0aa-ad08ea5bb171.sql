-- Create internships table
CREATE TABLE public.internships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  work_type TEXT NOT NULL CHECK (work_type IN ('remote', 'onsite', 'hybrid')),
  duration TEXT NOT NULL,
  stipend TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT NOT NULL,
  requirements TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  education_level TEXT NOT NULL,
  application_deadline DATE NOT NULL,
  start_date DATE NOT NULL,
  positions_available INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'interview_scheduled', 'interviewed', 'accepted', 'rejected', 'withdrawn')),
  cover_letter TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for internships
CREATE POLICY "Anyone can view active internships"
ON public.internships
FOR SELECT
USING (status = 'active');

CREATE POLICY "Organizations can insert their own internships"
ON public.internships
FOR INSERT
WITH CHECK (
  auth.uid() = organization_id
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'organization'
  )
);

CREATE POLICY "Organizations can update their own internships"
ON public.internships
FOR UPDATE
USING (
  auth.uid() = organization_id
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'organization'
  )
);

CREATE POLICY "Organizations can delete their own internships"
ON public.internships
FOR DELETE
USING (
  auth.uid() = organization_id
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'organization'
  )
);

-- RLS Policies for applications
CREATE POLICY "Applicants can view their own applications"
ON public.applications
FOR SELECT
USING (
  auth.uid() = applicant_id
  OR EXISTS (
    SELECT 1 FROM public.internships
    WHERE internships.id = applications.internship_id
    AND internships.organization_id = auth.uid()
  )
);

CREATE POLICY "Applicants can create applications"
ON public.applications
FOR INSERT
WITH CHECK (
  auth.uid() = applicant_id
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'intern'
  )
);

CREATE POLICY "Applicants can update their own applications"
ON public.applications
FOR UPDATE
USING (auth.uid() = applicant_id);

CREATE POLICY "Organizations can update applications for their internships"
ON public.applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.internships
    WHERE internships.id = applications.internship_id
    AND internships.organization_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_internships_updated_at
BEFORE UPDATE ON public.internships
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();