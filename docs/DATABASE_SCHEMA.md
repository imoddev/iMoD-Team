# 🗄️ Database Schema — iMoD Team

## Overview

ใช้ Supabase (PostgreSQL) เป็นฐานข้อมูลหลัก
แบ่ง Schema ตาม Module:

---

## 🔐 Auth & Users

```sql
-- โปรไฟล์พนักงาน (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
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

-- Enum: ทีม
CREATE TYPE team_enum AS ENUM (
  'sales', 'hr', 'content', 'video', 'creative', 'executive'
);

-- Enum: บทบาท
CREATE TYPE role_enum AS ENUM (
  'admin', 'executive', 'hr_manager', 'team_lead', 'member'
);
```

---

## 💼 Sales CRM

```sql
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

CREATE TYPE campaign_status AS ENUM (
  'lead', 'proposed', 'agreed', 'in_progress', 'delivered', 'closed', 'archived'
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

CREATE TYPE platform_enum AS ENUM (
  'facebook', 'youtube', 'x_twitter', 'tiktok', 'instagram', 'website'
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
```

---

## 📰 News Intelligence

```sql
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

CREATE TYPE news_category AS ENUM (
  'apple', 'ev', 'tech', 'economy', 'gadgets', 'other'
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

CREATE TYPE article_status AS ENUM (
  'available', 'claimed', 'writing', 'published', 'skipped'
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

CREATE TYPE brief_status AS ENUM (
  'pending', 'in_progress', 'review', 'published', 'cancelled'
);
```

---

## 📋 Tasks & Content Pipeline

```sql
-- งาน/Task
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

CREATE TYPE task_type_enum AS ENUM (
  'general', 'article', 'video', 'graphic', 'social_post'
);

CREATE TYPE task_status AS ENUM (
  'todo', 'in_progress', 'review', 'done', 'cancelled'
);

CREATE TYPE task_priority AS ENUM (
  'low', 'medium', 'high', 'urgent'
);
```

---

## 👥 HR & People

```sql
-- คำขอลา
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  leave_type leave_type_enum NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status approval_status DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE leave_type_enum AS ENUM (
  'sick', 'vacation', 'personal', 'maternity', 'other'
);

CREATE TYPE approval_status AS ENUM (
  'pending', 'approved', 'rejected'
);

-- เช็คอิน/เช็คเอาท์
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  work_mode work_mode_enum DEFAULT 'office',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE work_mode_enum AS ENUM (
  'office', 'wfh', 'leave', 'holiday'
);

-- ประกาศ
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_team team_enum,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 Row Level Security (RLS)

```sql
-- ตัวอย่าง: ทุกคนดูข่าวได้ แต่แก้ได้เฉพาะของตัวเอง
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news" ON news_articles
  FOR SELECT USING (true);

CREATE POLICY "Assigned user can update" ON news_articles
  FOR UPDATE USING (auth.uid() = assigned_to);

-- ผู้บริหาร เห็นทุกอย่าง
CREATE POLICY "Executives see all" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'executive'
    )
  );
```
