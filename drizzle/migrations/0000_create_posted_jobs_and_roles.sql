CREATE TABLE public.posted_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_website TEXT,
  location TEXT,
  remote_type TEXT NOT NULL DEFAULT 'onsite',
  employment_type TEXT NOT NULL DEFAULT 'full_time',
  experience_level TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  apply_url TEXT,
  apply_email TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.posted_jobs TO authenticated;
GRANT SELECT ON public.posted_jobs TO anon;
GRANT ALL ON public.posted_jobs TO service_role;

ALTER TABLE public.posted_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published jobs"
  ON public.posted_jobs FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Owners can read their own jobs"
  ON public.posted_jobs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert their own jobs"
  ON public.posted_jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their own jobs"
  ON public.posted_jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete their own jobs"
  ON public.posted_jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;