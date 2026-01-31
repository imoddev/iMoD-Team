-- =============================================
-- iMoD Team — Migration 003: Row Level Security
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- =====================
-- Helper: Check user role
-- =====================
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS role_enum AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth.user_team()
RETURNS team_enum AS $$
  SELECT team FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth.is_admin_or_executive()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'executive')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================
-- Profiles
-- =====================
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can manage profiles"
  ON profiles FOR ALL USING (auth.is_admin_or_executive());

-- =====================
-- Clients
-- =====================
CREATE POLICY "Sales and executives can view clients"
  ON clients FOR SELECT USING (
    auth.user_team() = 'sales'
    OR auth.is_admin_or_executive()
  );

CREATE POLICY "Sales can manage clients"
  ON clients FOR ALL USING (
    auth.user_team() = 'sales'
    OR auth.is_admin_or_executive()
  );

-- =====================
-- Campaigns
-- =====================
CREATE POLICY "Sales and executives can view campaigns"
  ON campaigns FOR SELECT USING (
    auth.user_team() = 'sales'
    OR auth.is_admin_or_executive()
  );

CREATE POLICY "Sales can manage campaigns"
  ON campaigns FOR ALL USING (
    auth.user_team() = 'sales'
    OR auth.is_admin_or_executive()
  );

-- =====================
-- News Articles
-- =====================
CREATE POLICY "Everyone can view news"
  ON news_articles FOR SELECT USING (true);

CREATE POLICY "Content team can claim news"
  ON news_articles FOR UPDATE USING (
    auth.user_team() = 'content'
    OR auth.is_admin_or_executive()
  );

-- =====================
-- Tasks
-- =====================
CREATE POLICY "Users can view own team tasks"
  ON tasks FOR SELECT USING (
    team = auth.user_team()
    OR assigned_to = auth.uid()
    OR auth.is_admin_or_executive()
  );

CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update assigned tasks"
  ON tasks FOR UPDATE USING (
    assigned_to = auth.uid()
    OR created_by = auth.uid()
    OR auth.is_admin_or_executive()
  );

-- =====================
-- Leave Requests
-- =====================
CREATE POLICY "Users can view own leave"
  ON leave_requests FOR SELECT USING (
    user_id = auth.uid()
    OR auth.user_role() IN ('hr_manager', 'admin', 'executive')
  );

CREATE POLICY "Users can create own leave"
  ON leave_requests FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY "HR can manage leave"
  ON leave_requests FOR UPDATE USING (
    auth.user_role() IN ('hr_manager', 'admin', 'executive')
  );

-- =====================
-- Attendance
-- =====================
CREATE POLICY "Users can view own attendance"
  ON attendance FOR SELECT USING (
    user_id = auth.uid()
    OR auth.user_role() IN ('hr_manager', 'admin', 'executive')
  );

CREATE POLICY "Users can check in/out"
  ON attendance FOR INSERT WITH CHECK (
    user_id = auth.uid()
  );

CREATE POLICY "Users can update own attendance"
  ON attendance FOR UPDATE USING (
    user_id = auth.uid()
  );

-- =====================
-- Announcements
-- =====================
CREATE POLICY "Everyone can view announcements"
  ON announcements FOR SELECT USING (
    target_team IS NULL
    OR target_team = auth.user_team()
    OR auth.is_admin_or_executive()
  );

CREATE POLICY "Admin can manage announcements"
  ON announcements FOR ALL USING (
    auth.is_admin_or_executive()
    OR auth.user_role() = 'hr_manager'
  );
