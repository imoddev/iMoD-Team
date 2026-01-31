"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "./client";
import type { 
  Client, 
  Campaign, 
  NewsArticle, 
  Profile, 
  LeaveRequest, 
  Task,
  ArticleStatus
} from "@/types/database";

// Attendance type (not in main types file)
interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  work_mode: "office" | "wfh" | "leave" | "holiday";
  notes?: string;
  created_at: string;
}

const supabase = createClient();

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes("your-project");
};

// ============ CLIENTS (Sales CRM) ============

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = async (client: Partial<Client>) => {
    if (!isSupabaseConfigured()) return null;
    
    const { data, error } = await supabase
      .from("clients")
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    setClients((prev) => [data, ...prev]);
    return data;
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    setClients((prev) => prev.map((c) => (c.id === id ? data : c)));
    return data;
  };

  const deleteClient = async (id: string) => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw error;
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return { clients, loading, error, fetchClients, addClient, updateClient, deleteClient };
}

// ============ CAMPAIGNS ============

export function useCampaigns(clientId?: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from("campaigns").select("*");
      
      if (clientId) {
        query = query.eq("client_id", clientId);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      setCampaigns(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, error, fetchCampaigns };
}

// ============ NEWS ITEMS ============

export function useNewsArticles(category?: string) {
  const [newsItems, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsArticles = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from("news_articles").select("*");
      
      if (category) {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query
        .order("priority_score", { ascending: false })
        .limit(50);

      if (error) throw error;
      setNewsArticles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchNewsArticles();
  }, [fetchNewsArticles]);

  const updateNewsStatus = async (id: string, status: ArticleStatus) => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("news_articles")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    setNewsArticles((prev) => 
      prev.map((n) => (n.id === id ? { ...n, status } : n))
    );
  };

  return { newsItems, loading, error, fetchNewsArticles, updateNewsStatus };
}

// ============ PROFILES (HR) ============

export function useProfiles(team?: string) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from("profiles").select("*").eq("is_active", true);
      
      if (team) {
        query = query.eq("team", team);
      }
      
      const { data, error } = await query.order("full_name");
      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [team]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return { profiles, loading, error, fetchProfiles };
}

// ============ LEAVE REQUESTS ============

export function useLeaveRequests(userId?: string) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveRequests = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from("leave_requests").select("*");
      
      if (userId) {
        query = query.eq("user_id", userId);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      setLeaveRequests(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const approveLeave = async (id: string, approverId: string) => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("leave_requests")
      .update({ 
        status: "approved", 
        approved_by: approverId,
        approved_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) throw error;
    fetchLeaveRequests();
  };

  const rejectLeave = async (id: string, approverId: string) => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("leave_requests")
      .update({ 
        status: "rejected", 
        approved_by: approverId,
        approved_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) throw error;
    fetchLeaveRequests();
  };

  return { leaveRequests, loading, error, fetchLeaveRequests, approveLeave, rejectLeave };
}

// ============ TASKS (Content/Video) ============

export function useTasks(team?: string, status?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from("tasks").select("*");
      
      if (team) query = query.eq("team", team);
      if (status) query = query.eq("status", status);
      
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      setTasks(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [team, status]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateTaskStatus = async (id: string, newStatus: string) => {
    if (!isSupabaseConfigured()) return;

    const updates: Partial<Task> = { 
      status: newStatus as any, 
      updated_at: new Date().toISOString() 
    };
    
    if (newStatus === "done") {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase.from("tasks").update(updates).eq("id", id);
    if (error) throw error;
    
    setTasks((prev) => 
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const addTask = async (task: Partial<Task>) => {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    setTasks((prev) => [data, ...prev]);
    return data;
  };

  return { tasks, loading, error, fetchTasks, updateTaskStatus, addTask };
}

// ============ ATTENDANCE ============

export function useAttendance(date?: string) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = date || new Date().toISOString().split("T")[0];

  const fetchAttendance = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", today);

      if (error) throw error;
      setAttendance(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const checkIn = async (userId: string, workMode: "office" | "wfh") => {
    if (!isSupabaseConfigured()) return;

    const now = new Date();
    const { error } = await supabase.from("attendance").insert({
      user_id: userId,
      date: today,
      check_in: now.toISOString(),
      work_mode: workMode,
    });

    if (error) throw error;
    fetchAttendance();
  };

  const checkOut = async (userId: string) => {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
      .from("attendance")
      .update({ check_out: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("date", today);

    if (error) throw error;
    fetchAttendance();
  };

  return { attendance, loading, error, fetchAttendance, checkIn, checkOut };
}

// ============ UTILITY ============

export function useSupabaseStatus() {
  return {
    isConfigured: isSupabaseConfigured(),
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  };
}
