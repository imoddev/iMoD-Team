-- =============================================
-- iMoD Team — Migration 002: Create Tables
-- =============================================

-- =====================
-- 1. Profiles (พนักงาน)
-- =====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  nickname TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  team team_enum NOT NULL,
  role role_enum NOT NULL DEFAULT 'member',
  position TEXT,
  join_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, team, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'team')::team_enum, 'content'),
    COALESCE((NEW.raw_user_meta_data->>'role')::role_enum, 'member')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- 2. Sales CRM
-- =====================

-- ลูกค้า
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  brand TEXT,
  industry TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_line TEXT,
  budget_range TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- แคมเปญ
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status campaign_status DEFAULT 'lead',
  value NUMERIC(12,2),
  start_date DATE,
  end_date DATE,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- โพสต์ในแคมเปญ
CREATE TABLE campaign_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  platform platform_enum NOT NULL,
  post_url TEXT,
  post_date TIMESTAMPTZ,
  content_type TEXT,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  watch_time_seconds INTEGER DEFAULT 0,
  screenshot_url TEXT,
  raw_data JSONB,
  fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- บันทึกลูกค้า
CREATE TABLE client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id),
  note TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ไฟล์แนบ
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'campaign', 'client', 'task'
  entity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. News Intelligence
-- =====================

-- แหล่งข่าว
CREATE TABLE news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  feed_type TEXT DEFAULT 'rss',
  category news_category NOT NULL,
  is_active BOOLEAN DEFAULT true,
  fetch_interval_minutes INTEGER DEFAULT 15,
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ข่าว
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES news_sources(id),
  title TEXT NOT NULL,
  title_th TEXT,
  summary TEXT,
  summary_th TEXT,
  url TEXT UNIQUE NOT NULL,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  category news_category,
  priority_score INTEGER DEFAULT 0,
  priority_level TEXT DEFAULT 'normal',
  ai_analysis JSONB,
  suggested_angle TEXT,
  keywords TEXT[],
  status article_status DEFAULT 'available',
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Brief
CREATE TABLE content_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_article_id UUID REFERENCES news_articles(id),
  title_th TEXT NOT NULL,
  writing_angle TEXT,
  keywords TEXT[],
  target_platform TEXT DEFAULT 'iphonemod',
  deadline TIMESTAMPTZ,
  assigned_to UUID REFERENCES profiles(id),
  status brief_status DEFAULT 'pending',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 4. Tasks
-- =====================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  team team_enum NOT NULL,
  task_type task_type_enum DEFAULT 'general',
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  brief_id UUID REFERENCES content_briefs(id),
  deadline TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 5. HR
-- =====================

-- คำขอลา
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  leave_type leave_type_enum NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status approval_status DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- เช็คอิน
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  work_mode work_mode_enum DEFAULT 'office',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ประกาศ
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_team team_enum, -- NULL = ทุกทีม
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- Indexes
-- =====================
CREATE INDEX idx_campaigns_client ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_posts_campaign ON campaign_posts(campaign_id);
CREATE INDEX idx_news_articles_category ON news_articles(category);
CREATE INDEX idx_news_articles_priority ON news_articles(priority_level);
CREATE INDEX idx_news_articles_status ON news_articles(status);
CREATE INDEX idx_tasks_team ON tasks(team);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_leave_requests_user ON leave_requests(user_id);
CREATE INDEX idx_attendance_user_date ON attendance(user_id, date);
