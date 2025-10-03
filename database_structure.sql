-- ============================================
-- COMPLETE DATABASE RECREATION SCRIPT
-- Generated from your Supabase database
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.logs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;

-- Create roles table
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  colour TEXT DEFAULT '#000000'::text,
  PRIMARY KEY (id)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  unsubscribed BOOLEAN NOT NULL DEFAULT false,
  role_id UUID NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT profiles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);

-- Create logs table
CREATE TABLE public.logs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  ip_address INET,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT logs_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic settings info
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  default_value JSONB,
  
  -- Display information
  label TEXT NOT NULL,
  description TEXT,
  input_type TEXT NOT NULL DEFAULT 'text',
  
  -- Grouping and organization
  group_key TEXT NOT NULL DEFAULT 'general',
  group_label TEXT,
  sort_order INTEGER DEFAULT 0,
  
  -- Validation and options
  validation JSONB,
  options JSONB,
  
  -- Permissions (using role names as text arrays)
  view_roles TEXT[] DEFAULT ARRAY['admin'],
  edit_roles TEXT[] DEFAULT ARRAY['admin'],
  
  -- UI hints
  is_readonly BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Default setting
INSERT INTO public.settings (key, value, default_value, label, description, input_type, group_key, group_label, sort_order, validation, options, view_roles, edit_roles) VALUES
  ('site_title', NULL, '"My Application"', 'Site Title', 'The name of your application', 'text', 'general', 1, '{"required": true, "maxLength": 100}', NULL, ARRAY['public'], ARRAY['admin'])
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

-- Logs indexes
CREATE INDEX idx_logs_created_at ON public.logs USING btree (created_at DESC);
CREATE INDEX idx_logs_user_id ON public.logs USING btree (user_id);

-- Roles indexes
CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);

-- Settings indexes (for performance on common queries)
CREATE INDEX idx_settings_key ON public.settings(key);
CREATE INDEX idx_settings_group ON public.settings(group_key, sort_order);

-- ============================================
-- 3. INSERT DEFAULT ROLES
-- ============================================

INSERT INTO public.roles (name, description, colour) VALUES 
  ('admin', 'Full system access', '#FF0000'),
  ('user', 'Standard user access', '#0000FF')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 5. CREATE FUNCTIONS
-- ============================================

-- Function: get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT r.name 
  FROM public.profiles p
  JOIN public.roles r ON p.role_id = r.id
  WHERE p.id = user_id;
$function$;

-- Function: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url, role_id)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    (SELECT id FROM public.roles WHERE name = 'user') -- Default to 'user' role
  );
  return new;
end;
$function$;

-- Function: restore_last_sign_in
-- Used to restore the original last_sign_in_at timestamp after impersonation
CREATE OR REPLACE FUNCTION public.restore_last_sign_in(
  user_id uuid,
  last_sign_in_timestamp timestamp with time zone
)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  UPDATE auth.users
  SET last_sign_in_at = last_sign_in_timestamp
  WHERE id = user_id;
end;
$function$;

-- ============================================
-- 6. CREATE TRIGGERS
-- ============================================

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. CREATE RLS POLICIES
-- ============================================

-- Logs policies
CREATE POLICY "Admins see all logs" ON public.logs
  AS PERMISSIVE FOR SELECT TO public
  USING (get_user_role(auth.uid()) = 'admin'::text);

CREATE POLICY "Enable insert for authenticated users only" ON public.logs
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users see own logs" ON public.logs
  AS PERMISSIVE FOR SELECT TO public
  USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Enable update access for admins (temp)" ON public.profiles
  AS PERMISSIVE FOR ALL TO public
  USING (true);

CREATE POLICY "Profiles are viewable by self." ON public.profiles
  AS PERMISSIVE FOR SELECT TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  AS PERMISSIVE FOR INSERT TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  AS PERMISSIVE FOR UPDATE TO public
  USING (auth.uid() = id);

-- Roles policies
CREATE POLICY "Enable access for authenticated users only" ON public.roles
  AS PERMISSIVE FOR ALL TO authenticated
  USING (true);

-- Settings policies
CREATE POLICY "Users can view settings based on role" ON public.settings
  FOR SELECT
  USING (
    public.get_user_role(auth.uid()) = ANY(view_roles) 
    OR 'public' = ANY(view_roles)
  );

CREATE POLICY "Users can update settings based on role" ON public.settings
  FOR UPDATE
  USING (public.get_user_role(auth.uid()) = ANY(edit_roles));

CREATE POLICY "Only admins can insert settings" ON public.settings
  FOR INSERT
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete settings" ON public.settings
  FOR DELETE
  USING (public.get_user_role(auth.uid()) = 'admin');

-- ============================================
-- 9. GRANT PERMISSIONS
-- ============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ============================================
-- END OF SCRIPT
-- ============================================