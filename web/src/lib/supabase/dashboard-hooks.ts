"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "./client";

const supabase = createClient();

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes("your-project");
};

// ============ DASHBOARD STATS ============

export interface DashboardStats {
  clients: { total: number; change: number };
  campaigns: { active: number; change: number };
  revenue: { total: number; change: number };
  reach: { total: number; change: number };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    clients: { total: 0, change: 0 },
    campaigns: { active: 0, change: 0 },
    revenue: { total: 0, change: 0 },
    reach: { total: 0, change: 0 },
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get client count
      const { count: clientCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

      // Get active campaigns
      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("status, budget")
        .in("status", ["in_progress", "agreed"]);

      const activeCampaigns = campaigns?.length || 0;
      const totalRevenue = campaigns?.reduce((sum: number, c: { budget?: number | string }) => sum + (Number(c.budget) || 0), 0) || 0;

      // Get content posts for reach (estimate)
      const { data: posts } = await supabase
        .from("content_posts")
        .select("reach");
      
      const totalReach = posts?.reduce((sum: number, p: { reach?: number }) => sum + (p.reach || 0), 0) || 0;

      setStats({
        clients: { total: clientCount || 0, change: 12 }, // TODO: calculate real change
        campaigns: { active: activeCampaigns, change: 8 },
        revenue: { total: totalRevenue, change: 15 },
        reach: { total: totalReach || 2500000, change: 20 },
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}

// ============ PIPELINE DATA ============

export interface PipelineItem {
  stage: string;
  count: number;
  value: number;
  color: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  lead: { label: "Lead", color: "bg-gray-500" },
  proposed: { label: "ติดต่อแล้ว", color: "bg-blue-500" },
  agreed: { label: "เสนอราคา", color: "bg-yellow-500" },
  in_progress: { label: "เจรจา", color: "bg-orange-500" },
  delivered: { label: "ส่งมอบ", color: "bg-purple-500" },
  closed: { label: "ปิดงาน", color: "bg-green-500" },
};

export function usePipelineData() {
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPipeline = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("status, budget");

      if (campaigns) {
        const grouped = campaigns.reduce((acc: Record<string, { count: number; value: number }>, c: { status?: string; budget?: number | string }) => {
          const status = c.status || "lead";
          if (!acc[status]) {
            acc[status] = { count: 0, value: 0 };
          }
          acc[status].count++;
          acc[status].value += Number(c.budget) || 0;
          return acc;
        }, {} as Record<string, { count: number; value: number }>);

        const pipelineData: PipelineItem[] = Object.entries(statusLabels).map(
          ([key, { label, color }]) => ({
            stage: label,
            count: grouped[key]?.count || 0,
            value: grouped[key]?.value || 0,
            color,
          })
        );

        setPipeline(pipelineData);
      }
    } catch (err) {
      console.error("Error fetching pipeline:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  return { pipeline, loading, refresh: fetchPipeline };
}

// ============ RECENT CAMPAIGNS ============

export interface RecentCampaign {
  id: string;
  clientName: string;
  campaignName: string;
  status: string;
  budget: number;
  reach: number;
  endDate: string | null;
}

export function useRecentCampaigns(limit = 5) {
  const [campaigns, setCampaigns] = useState<RecentCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await supabase
        .from("campaigns")
        .select(`
          id,
          name,
          status,
          budget,
          end_date,
          clients (
            company_name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (data) {
        const mapped: RecentCampaign[] = data.map((c: any) => ({
          id: c.id,
          clientName: c.clients?.company_name || "Unknown",
          campaignName: c.name,
          status: c.status || "lead",
          budget: Number(c.budget) || 0,
          reach: 0, // TODO: calculate from posts
          endDate: c.end_date,
        }));
        setCampaigns(mapped);
      }
    } catch (err) {
      console.error("Error fetching recent campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, refresh: fetchCampaigns };
}

// ============ UPCOMING DEADLINES ============

export interface UpcomingDeadline {
  id: string;
  title: string;
  type: "content" | "video" | "design" | "campaign";
  assignee: string;
  deadline: string;
  priority: "urgent" | "high" | "medium" | "low";
}

export function useUpcomingDeadlines(limit = 5) {
  const [deadlines, setDeadlines] = useState<UpcomingDeadline[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeadlines = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const now = new Date().toISOString();
      const { data } = await supabase
        .from("tasks")
        .select(`
          id,
          title,
          task_type,
          priority,
          deadline,
          profiles!tasks_assigned_to_fkey (
            nickname,
            full_name
          )
        `)
        .neq("status", "done")
        .neq("status", "cancelled")
        .gte("deadline", now)
        .order("deadline", { ascending: true })
        .limit(limit);

      if (data) {
        const mapped: UpcomingDeadline[] = data.map((t: any) => ({
          id: t.id,
          title: t.title,
          type: mapTaskType(t.task_type),
          assignee: t.profiles?.nickname || t.profiles?.full_name || "Unassigned",
          deadline: t.deadline,
          priority: t.priority || "medium",
        }));
        setDeadlines(mapped);
      }
    } catch (err) {
      console.error("Error fetching deadlines:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  return { deadlines, loading, refresh: fetchDeadlines };
}

function mapTaskType(type: string): "content" | "video" | "design" | "campaign" {
  switch (type) {
    case "article":
      return "content";
    case "video":
      return "video";
    case "graphic":
      return "design";
    case "social_post":
      return "content";
    default:
      return "content";
  }
}

// ============ QUICK STATS ============

export interface QuickStats {
  todayPublished: number;
  pendingReview: number;
  overdueTask: number;
  teamOnline: number;
}

export function useQuickStats() {
  const [stats, setStats] = useState<QuickStats>({
    todayPublished: 0,
    pendingReview: 0,
    overdueTask: 0,
    teamOnline: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Tasks done today
      const { count: publishedCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "done")
        .gte("completed_at", `${today}T00:00:00`);

      // Tasks in review
      const { count: reviewCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "review");

      // Overdue tasks
      const { count: overdueCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .neq("status", "done")
        .neq("status", "cancelled")
        .lt("deadline", now.toISOString());

      // Team online (checked in today)
      const { count: onlineCount } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("date", today)
        .not("check_in", "is", null);

      setStats({
        todayPublished: publishedCount || 0,
        pendingReview: reviewCount || 0,
        overdueTask: overdueCount || 0,
        teamOnline: onlineCount || 0,
      });
    } catch (err) {
      console.error("Error fetching quick stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}

// ============ TEAM ACTIVITIES ============

export interface TeamActivity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

export function useTeamActivities(limit = 5) {
  const [activities, setActivities] = useState<TeamActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get recent task updates as activity
      const { data: tasks } = await supabase
        .from("tasks")
        .select(`
          id,
          title,
          status,
          updated_at,
          profiles!tasks_assigned_to_fkey (
            nickname,
            full_name
          )
        `)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (tasks) {
        const mapped: TeamActivity[] = tasks.map((t: any) => {
          const name = t.profiles?.nickname || t.profiles?.full_name || "Unknown";
          return {
            id: t.id,
            user: name,
            avatar: name.charAt(0),
            action: mapStatusToAction(t.status),
            target: t.title,
            time: formatTimeAgo(new Date(t.updated_at)),
          };
        });
        setActivities(mapped);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, refresh: fetchActivities };
}

function mapStatusToAction(status: string): string {
  switch (status) {
    case "done":
      return "เสร็จงาน";
    case "review":
      return "ส่งตรวจ";
    case "in_progress":
      return "กำลังทำ";
    case "todo":
      return "รับงาน";
    default:
      return "อัปเดต";
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "เมื่อกี้";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชม.ที่แล้ว`;
  return `${days} วันที่แล้ว`;
}

// ============ PLATFORM STATS ============

export interface PlatformStat {
  platform: string;
  articles: number;
  videos: number;
  reach: number;
}

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStat[]>([
    { platform: "iPhoneMod", articles: 0, videos: 0, reach: 0 },
    { platform: "EVMoD", articles: 0, videos: 0, reach: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data: posts } = await supabase
        .from("content_posts")
        .select("platform, reach");

      if (posts) {
        type PostItem = { platform?: string; reach?: number };
        // Group by platform-like categories
        const iphonemod = posts.filter((p: PostItem) =>
          ["facebook", "youtube", "website"].includes(p.platform || "")
        );
        const evmod = posts.filter((p: PostItem) =>
          ["tiktok", "instagram", "x_twitter"].includes(p.platform || "")
        );

        setStats([
          {
            platform: "iPhoneMod",
            articles: iphonemod.length,
            videos: Math.floor(iphonemod.length * 0.4),
            reach: iphonemod.reduce((sum: number, p: PostItem) => sum + (p.reach || 0), 0),
          },
          {
            platform: "EVMoD",
            articles: evmod.length,
            videos: Math.floor(evmod.length * 0.5),
            reach: evmod.reduce((sum: number, p: PostItem) => sum + (p.reach || 0), 0),
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching platform stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}

// ============ WEEKLY TREND ============

export interface WeeklyTrend {
  day: string;
  content: number;
  video: number;
}

export function useWeeklyTrend() {
  const [trend, setTrend] = useState<WeeklyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrend = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get tasks completed in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: tasks } = await supabase
        .from("tasks")
        .select("task_type, completed_at")
        .eq("status", "done")
        .gte("completed_at", weekAgo.toISOString());

      const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
      const days: WeeklyTrend[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        type TaskItem = { completed_at?: string; task_type?: string };
        const dayTasks =
          tasks?.filter((t: TaskItem) => {
            const completed = new Date(t.completed_at || "");
            return completed >= dayStart && completed <= dayEnd;
          }) || [];

        days.push({
          day: dayNames[dayStart.getDay()],
          content: dayTasks.filter(
            (t: TaskItem) => t.task_type === "article" || t.task_type === "social_post"
          ).length,
          video: dayTasks.filter((t: TaskItem) => t.task_type === "video").length,
        });
      }

      setTrend(days);
    } catch (err) {
      console.error("Error fetching weekly trend:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return { trend, loading, refresh: fetchTrend };
}
