-- =============================================
-- iMoD Team — Migration 001: Create Enums
-- =============================================

-- ทีม
CREATE TYPE team_enum AS ENUM (
  'sales', 'hr', 'content', 'video', 'creative', 'executive'
);

-- บทบาท
CREATE TYPE role_enum AS ENUM (
  'admin', 'executive', 'hr_manager', 'team_lead', 'member'
);

-- สถานะแคมเปญ
CREATE TYPE campaign_status AS ENUM (
  'lead', 'proposed', 'agreed', 'in_progress', 'delivered', 'closed', 'archived'
);

-- แพลตฟอร์ม
CREATE TYPE platform_enum AS ENUM (
  'facebook', 'youtube', 'x_twitter', 'tiktok', 'instagram', 'website'
);

-- หมวดข่าว
CREATE TYPE news_category AS ENUM (
  'apple', 'ev', 'tech', 'economy', 'gadgets', 'other'
);

-- สถานะข่าว
CREATE TYPE article_status AS ENUM (
  'available', 'claimed', 'writing', 'published', 'skipped'
);

-- สถานะ Brief
CREATE TYPE brief_status AS ENUM (
  'pending', 'in_progress', 'review', 'published', 'cancelled'
);

-- ประเภทงาน
CREATE TYPE task_type_enum AS ENUM (
  'general', 'article', 'video', 'graphic', 'social_post'
);

-- สถานะงาน
CREATE TYPE task_status AS ENUM (
  'todo', 'in_progress', 'review', 'done', 'cancelled'
);

-- ความสำคัญงาน
CREATE TYPE task_priority AS ENUM (
  'low', 'medium', 'high', 'urgent'
);

-- ประเภทลา
CREATE TYPE leave_type_enum AS ENUM (
  'sick', 'vacation', 'personal', 'maternity', 'other'
);

-- สถานะอนุมัติ
CREATE TYPE approval_status AS ENUM (
  'pending', 'approved', 'rejected'
);

-- โหมดทำงาน
CREATE TYPE work_mode_enum AS ENUM (
  'office', 'wfh', 'leave', 'holiday'
);
