// Team types
export type Team = "sales" | "hr" | "content" | "video" | "creative" | "executive";

export type Role = "admin" | "executive" | "hr_manager" | "team_lead" | "member";

// Profile
export interface Profile {
  id: string;
  full_name: string;
  nickname?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  team: Team;
  role: Role;
  position?: string;
  join_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Campaign status
export type CampaignStatus =
  | "lead"
  | "proposed"
  | "agreed"
  | "in_progress"
  | "delivered"
  | "closed"
  | "archived";

// Client
export interface Client {
  id: string;
  company_name: string;
  brand?: string;
  industry?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_line?: string;
  budget_range?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Campaign
export interface Campaign {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  value?: number;
  start_date?: string;
  end_date?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Platform
export type Platform = "facebook" | "youtube" | "x_twitter" | "tiktok" | "instagram" | "website";

// Campaign Post
export interface CampaignPost {
  id: string;
  campaign_id: string;
  platform: Platform;
  post_url?: string;
  post_date?: string;
  content_type?: string;
  reach: number;
  impressions: number;
  engagement: number;
  views: number;
  clicks: number;
  watch_time_seconds: number;
  screenshot_url?: string;
  created_at: string;
}

// News
export type NewsCategory = "apple" | "ev" | "tech" | "economy" | "gadgets" | "other";

export type PriorityLevel = "hot" | "trending" | "normal" | "low";

export type ArticleStatus = "available" | "claimed" | "writing" | "published" | "skipped";

export interface NewsArticle {
  id: string;
  source_id: string;
  title: string;
  title_th?: string;
  summary?: string;
  summary_th?: string;
  url: string;
  image_url?: string;
  published_at?: string;
  fetched_at: string;
  category: NewsCategory;
  priority_score: number;
  priority_level: PriorityLevel;
  ai_analysis?: Record<string, unknown>;
  suggested_angle?: string;
  keywords?: string[];
  status: ArticleStatus;
  assigned_to?: string;
  created_at: string;
}

// Task
export type TaskStatus = "todo" | "in_progress" | "review" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskType = "general" | "article" | "video" | "graphic" | "social_post";

export interface Task {
  id: string;
  title: string;
  description?: string;
  team: Team;
  task_type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
  created_by?: string;
  brief_id?: string;
  deadline?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Leave
export type LeaveType = "sick" | "vacation" | "personal" | "maternity" | "other";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason?: string;
  status: ApprovalStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}
