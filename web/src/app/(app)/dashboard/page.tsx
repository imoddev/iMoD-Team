"use client";

import { useEffect } from "react";
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
  Video,
  Image,
  AlertTriangle,
  CheckCircle,
  Activity,
  RefreshCw,
  Loader2,
} from "lucide-react";

// Supabase hooks
import {
  useDashboardStats,
  usePipelineData,
  useRecentCampaigns,
  useUpcomingDeadlines,
  useQuickStats,
  useTeamActivities,
  usePlatformStats,
  useWeeklyTrend,
} from "@/lib/supabase/dashboard-hooks";

// Fallback demo data
import {
  dashboardStats as demoStats,
  pipelineData as demoPipeline,
  recentCampaigns as demoCampaigns,
  teamActivities as demoActivities,
  upcomingDeadlines as demoDeadlines,
  quickStats as demoQuickStats,
  platformStats as demoPlatformStats,
  weeklyTrend as demoWeeklyTrend,
} from "@/lib/demo-dashboard";

const typeIcons: Record<string, any> = {
  content: FileText,
  video: Video,
  design: Image,
  campaign: Briefcase,
};

const typeColors: Record<string, string> = {
  content: "text-green-400",
  video: "text-red-400",
  design: "text-purple-400",
  campaign: "text-blue-400",
};

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function DashboardPage() {
  // Supabase data hooks
  const { stats: dashboardStats, loading: statsLoading, refresh: refreshStats } = useDashboardStats();
  const { pipeline: pipelineData, loading: pipelineLoading, refresh: refreshPipeline } = usePipelineData();
  const { campaigns: recentCampaigns, loading: campaignsLoading, refresh: refreshCampaigns } = useRecentCampaigns(5);
  const { deadlines: upcomingDeadlines, loading: deadlinesLoading, refresh: refreshDeadlines } = useUpcomingDeadlines(5);
  const { stats: quickStats, loading: quickStatsLoading, refresh: refreshQuickStats } = useQuickStats();
  const { activities: teamActivities, loading: activitiesLoading, refresh: refreshActivities } = useTeamActivities(5);
  const { stats: platformStats, loading: platformLoading, refresh: refreshPlatform } = usePlatformStats();
  const { trend: weeklyTrend, loading: trendLoading, refresh: refreshTrend } = useWeeklyTrend();

  // Use demo data as fallback if no real data
  const hasRealData = dashboardStats.clients.total > 0 || quickStats.teamOnline > 0;
  
  const displayStats = hasRealData ? dashboardStats : demoStats;
  const displayPipeline = pipelineData.length > 0 ? pipelineData : demoPipeline;
  const displayCampaigns = recentCampaigns.length > 0 ? recentCampaigns : demoCampaigns;
  const displayDeadlines = upcomingDeadlines.length > 0 ? upcomingDeadlines : demoDeadlines;
  const displayQuickStats = hasRealData ? quickStats : demoQuickStats;
  const displayActivities = teamActivities.length > 0 ? teamActivities : demoActivities;
  const displayPlatform = platformStats[0]?.articles > 0 ? platformStats : demoPlatformStats;
  const displayTrend = weeklyTrend.length > 0 ? weeklyTrend : demoWeeklyTrend;

  const isLoading = statsLoading || pipelineLoading || campaignsLoading;

  const refreshAll = () => {
    refreshStats();
    refreshPipeline();
    refreshCampaigns();
    refreshDeadlines();
    refreshQuickStats();
    refreshActivities();
    refreshPlatform();
    refreshTrend();
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `฿${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `฿${(value / 1000).toFixed(0)}K`;
    return `฿${value}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const today = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            ภาพรวมระบบ iMoD Team — {today}
            {!hasRealData && (
              <span className="ml-2 text-yellow-500 text-xs">(Demo Mode)</span>
            )}
          </p>
        </div>
        <button
          onClick={refreshAll}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-400" size={24} />
          <div>
            <p className="text-2xl font-bold text-white">{displayQuickStats.todayPublished}</p>
            <p className="text-xs text-green-400">เผยแพร่วันนี้</p>
          </div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
          <Clock className="text-yellow-400" size={24} />
          <div>
            <p className="text-2xl font-bold text-white">{displayQuickStats.pendingReview}</p>
            <p className="text-xs text-yellow-400">รอตรวจ</p>
          </div>
        </div>
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-400" size={24} />
          <div>
            <p className="text-2xl font-bold text-white">{displayQuickStats.overdueTask}</p>
            <p className="text-xs text-red-400">เลยกำหนด</p>
          </div>
        </div>
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3">
          <Activity className="text-blue-400" size={24} />
          <div>
            <p className="text-2xl font-bold text-white">{displayQuickStats.teamOnline}</p>
            <p className="text-xs text-blue-400">ทีมออนไลน์</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "ลูกค้าทั้งหมด", value: displayStats.clients.total, change: displayStats.clients.change, icon: Users, color: "text-blue-400" },
          { label: "แคมเปญ Active", value: displayStats.campaigns.active, change: displayStats.campaigns.change, icon: Briefcase, color: "text-purple-400" },
          { label: "รายได้รวม", value: formatCurrency(displayStats.revenue.total), change: displayStats.revenue.change, icon: DollarSign, color: "text-green-400", isRevenue: true },
          { label: "Reach รวม", value: formatNumber(displayStats.reach.total), change: displayStats.reach.change, icon: TrendingUp, color: "text-orange-400" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">{stat.label}</span>
                <Icon size={20} className={stat.color} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
                  {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Sales Pipeline */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Sales Pipeline</h3>
          <div className="space-y-3">
            {displayPipeline.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-400">{item.stage}</div>
                <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${Math.min((item.count / 10) * 100, 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-xs text-white font-medium">{item.count} ราย</span>
                    <span className="text-xs text-white/70">{formatCurrency(item.value)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">แพลตฟอร์ม</h3>
          <div className="space-y-4">
            {displayPlatform.map((p, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{p.platform}</span>
                  <span className="text-xs text-gray-400">{formatNumber(p.reach)} reach</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-green-400" />
                    <span className="text-gray-400">{p.articles} บทความ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video size={14} className="text-red-400" />
                    <span className="text-gray-400">{p.videos} วิดีโอ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Upcoming Deadlines */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">⏰ Deadline ใกล้ถึง</h3>
          <div className="space-y-3">
            {displayDeadlines.slice(0, 5).map((item) => {
              const Icon = typeIcons[item.type] || FileText;
              const deadline = new Date(item.deadline);
              const now = new Date();
              const hoursLeft = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
              
              return (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                  <Icon size={16} className={typeColors[item.type] || "text-gray-400"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.assignee}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${priorityColors[item.priority]}`}>
                    {hoursLeft > 0 ? `${hoursLeft}ชม.` : "เลย!"}
                  </span>
                </div>
              );
            })}
            {displayDeadlines.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">ไม่มี deadline ใกล้ถึง</p>
            )}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">🎯 แคมเปญล่าสุด</h3>
          <div className="space-y-3">
            {displayCampaigns.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{campaign.campaignName}</p>
                  <p className="text-xs text-gray-500">{campaign.clientName}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  campaign.status === "in_progress" || campaign.status === "active" ? "bg-green-600 text-white" :
                  campaign.status === "closed" || campaign.status === "completed" ? "bg-gray-600 text-white" :
                  "bg-yellow-600 text-white"
                }`}>
                  {campaign.status === "in_progress" || campaign.status === "active" ? "Active" : 
                   campaign.status === "closed" || campaign.status === "completed" ? "เสร็จ" : "รอ"}
                </span>
              </div>
            ))}
            {displayCampaigns.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">ยังไม่มีแคมเปญ</p>
            )}
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">👥 กิจกรรมทีม</h3>
          <div className="space-y-3">
            {displayActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {activity.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-gray-400">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 truncate">{activity.target}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))}
            {displayActivities.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">ยังไม่มีกิจกรรม</p>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">📈 ผลงานรายสัปดาห์</h3>
        <div className="flex items-end justify-between gap-4 h-40 px-4">
          {displayTrend.map((day, idx) => {
            const maxHeight = 120;
            const maxContent = Math.max(...displayTrend.map((d) => d.content), 1);
            const maxVideo = Math.max(...displayTrend.map((d) => d.video), 1);
            const contentHeight = (day.content / maxContent) * maxHeight;
            const videoHeight = (day.video / maxVideo) * maxHeight;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex gap-1 items-end" style={{ height: maxHeight }}>
                  <div
                    className="w-4 bg-green-500 rounded-t transition-all duration-300"
                    style={{ height: Math.max(contentHeight, 4) }}
                    title={`${day.content} บทความ`}
                  />
                  <div
                    className="w-4 bg-red-500 rounded-t transition-all duration-300"
                    style={{ height: Math.max(videoHeight, 4) }}
                    title={`${day.video} วิดีโอ`}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-xs text-gray-400">บทความ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-xs text-gray-400">วิดีโอ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
