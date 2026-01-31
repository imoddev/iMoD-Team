"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  FileText,
  Video,
  Users,
  DollarSign,
  Eye,
  ThumbsUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  Youtube,
} from "lucide-react";
import { useYouTubeData, formatYouTubeStats } from "@/lib/hooks/useYouTubeData";
import { formatNumber } from "@/lib/youtube-api";

type ReportPeriod = "week" | "month" | "quarter" | "year";
type ReportType = "content" | "video" | "sales" | "team";

interface MetricCard {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const contentMetrics: MetricCard[] = [
  { label: "บทความทั้งหมด", value: "127", change: 12, icon: FileText, color: "text-green-400" },
  { label: "ยอดวิวรวม", value: "2.4M", change: 18, icon: Eye, color: "text-blue-400" },
  { label: "Engagement Rate", value: "4.2%", change: -0.3, icon: ThumbsUp, color: "text-purple-400" },
  { label: "เวลาอ่านเฉลี่ย", value: "3:24", change: 8, icon: Calendar, color: "text-orange-400" },
];

const salesMetrics: MetricCard[] = [
  { label: "รายได้รวม", value: "฿2.8M", change: 15, icon: DollarSign, color: "text-green-400" },
  { label: "แคมเปญ Active", value: "12", change: 3, icon: BarChart3, color: "text-blue-400" },
  { label: "ลูกค้าใหม่", value: "5", change: 25, icon: Users, color: "text-purple-400" },
  { label: "Conversion Rate", value: "32%", change: 5, icon: TrendingUp, color: "text-orange-400" },
];

const topContent = [
  { title: "รีวิว iPhone 17 Pro Max", views: "245K", engagement: "5.2%" },
  { title: "Tesla Model Y 2026 ลดราคา", views: "189K", engagement: "4.8%" },
  { title: "สรุป CES 2026", views: "156K", engagement: "4.5%" },
  { title: "BYD แซง Tesla", views: "134K", engagement: "4.2%" },
  { title: "Galaxy S26 vs iPhone 17", views: "98K", engagement: "3.9%" },
];

const teamPerformance = [
  { name: "ชาร์ท", role: "Content Writer", tasks: 24, completed: 22, rating: 4.8 },
  { name: "มิน", role: "Content Writer", tasks: 18, completed: 17, rating: 4.6 },
  { name: "เจมส์", role: "Video Editor", tasks: 12, completed: 11, rating: 4.9 },
  { name: "นิว", role: "Video Editor", tasks: 15, completed: 14, rating: 4.7 },
  { name: "พลอย", role: "Creative", tasks: 32, completed: 30, rating: 4.8 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [reportType, setReportType] = useState<ReportType>("content");
  const [youtubeChannel, setYoutubeChannel] = useState<"iphonemod" | "evmod">("iphonemod");
  
  // YouTube data hook
  const { data: youtubeData, loading: youtubeLoading, error: youtubeError, isDemo, refetch } = useYouTubeData(youtubeChannel);
  const formattedYouTubeStats = formatYouTubeStats(youtubeData);

  // Dynamic video metrics from YouTube
  const getVideoMetrics = (): MetricCard[] => {
    if (!formattedYouTubeStats) {
      return [
        { label: "วิดีโอทั้งหมด", value: "-", change: 0, icon: Video, color: "text-red-400" },
        { label: "ยอดวิวรวม", value: "-", change: 0, icon: Eye, color: "text-blue-400" },
        { label: "Subscribers ใหม่", value: "-", change: 0, icon: Users, color: "text-green-400" },
        { label: "Watch Time", value: "-", change: 0, icon: Calendar, color: "text-yellow-400" },
      ];
    }

    return [
      { label: "วิดีโอทั้งหมด", value: formattedYouTubeStats.totalVideos, change: 6, icon: Video, color: "text-red-400" },
      { label: "ยอดวิวรวม", value: formattedYouTubeStats.totalViews, change: formattedYouTubeStats.viewsChange, icon: Eye, color: "text-blue-400" },
      { label: "Subscribers ใหม่", value: formattedYouTubeStats.totalSubscribers, change: formattedYouTubeStats.subscriberChange, icon: Users, color: "text-green-400" },
      { label: "Watch Time", value: formattedYouTubeStats.watchTimeHours, change: 22, icon: Calendar, color: "text-yellow-400" },
    ];
  };

  const getMetrics = () => {
    switch (reportType) {
      case "content": return contentMetrics;
      case "video": return getVideoMetrics();
      case "sales": return salesMetrics;
      default: return contentMetrics;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1">รายงานและสถิติภาพรวม</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
          >
            <option value="week">สัปดาห์นี้</option>
            <option value="month">เดือนนี้</option>
            <option value="quarter">ไตรมาสนี้</option>
            <option value="year">ปีนี้</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "content" as ReportType, label: "📝 Content", color: "bg-green-600" },
          { id: "video" as ReportType, label: "🎬 Video", color: "bg-red-600" },
          { id: "sales" as ReportType, label: "💰 Sales", color: "bg-blue-600" },
          { id: "team" as ReportType, label: "👥 Team", color: "bg-purple-600" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              reportType === tab.id
                ? `${tab.color} text-white`
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* YouTube Channel Selector (for Video tab) */}
      {reportType === "video" && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Youtube size={20} className="text-red-500" />
            <span className="text-gray-400 text-sm">YouTube Channel:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setYoutubeChannel("iphonemod")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                youtubeChannel === "iphonemod"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              iPhoneMod
            </button>
            <button
              onClick={() => setYoutubeChannel("evmod")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                youtubeChannel === "evmod"
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              EVMoD
            </button>
          </div>
          <button
            onClick={refetch}
            disabled={youtubeLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={youtubeLoading ? "animate-spin" : ""} />
          </button>
          {isDemo && (
            <span className="flex items-center gap-1 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
              <AlertCircle size={12} />
              Demo Data (ยังไม่ได้ใส่ API Key)
            </span>
          )}
        </div>
      )}

      {/* Metrics Cards */}
      {reportType !== "team" && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {getMetrics().map((metric, idx) => {
            const Icon = metric.icon;
            const isPositive = metric.change >= 0;

            return (
              <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">{metric.label}</span>
                  <Icon size={18} className={metric.color} />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-white">
                    {youtubeLoading && reportType === "video" ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      metric.value
                    )}
                  </span>
                  <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(metric.change)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content Report */}
      {reportType === "content" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Chart Placeholder */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">📈 ยอดวิวรายวัน</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {[65, 45, 78, 52, 90, 68, 85, 72, 95, 80, 88, 76, 92, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
              <span>15 ม.ค.</span>
              <span>22 ม.ค.</span>
              <span>29 ม.ค.</span>
            </div>
          </div>

          {/* Top Content */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">🏆 Top Content</h3>
            <div className="space-y-3">
              {topContent.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-500 w-6">#{idx + 1}</span>
                    <span className="text-sm text-white">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">{item.views} views</span>
                    <span className="text-green-400">{item.engagement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Report - Now with YouTube Data */}
      {reportType === "video" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">📈 Watch Time รายสัปดาห์</h3>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
              {[45, 62, 58, 75, 68, 82, 78].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-xs text-gray-500">
                    {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Videos - From YouTube */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">🎬 Top Videos</h3>
              {isDemo && (
                <span className="text-xs text-yellow-500">(Demo)</span>
              )}
            </div>
            
            {youtubeLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-700 rounded" />
                      <div className="w-48 h-4 bg-gray-700 rounded" />
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-4 bg-gray-700 rounded" />
                      <div className="w-16 h-4 bg-gray-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : youtubeError ? (
              <div className="text-center text-red-400 py-8">
                <AlertCircle size={32} className="mx-auto mb-2" />
                <p>{youtubeError}</p>
              </div>
            ) : formattedYouTubeStats ? (
              <div className="space-y-3">
                {formattedYouTubeStats.topVideos.map((video, idx) => (
                  <div key={video.videoId} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-500 w-6">#{idx + 1}</span>
                      <span className="text-sm text-white truncate max-w-[200px]">{video.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Eye size={14} /> {video.viewsFormatted}
                      </span>
                      <span className="text-red-400 flex items-center gap-1">
                        <ThumbsUp size={14} /> {video.likesFormatted}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Sales Report */}
      {reportType === "sales" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">💰 รายได้รายเดือน</h3>
            <div className="h-64 flex items-end justify-between gap-3 px-4">
              {[
                { month: "ส.ค.", value: 65 },
                { month: "ก.ย.", value: 72 },
                { month: "ต.ค.", value: 58 },
                { month: "พ.ย.", value: 85 },
                { month: "ธ.ค.", value: 92 },
                { month: "ม.ค.", value: 88 },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                    style={{ height: `${item.value}%` }}
                  />
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Distribution */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4">🎯 สัดส่วนรายได้ตามลูกค้า</h3>
            <div className="space-y-4">
              {[
                { name: "OPPO Thailand", value: 35, color: "bg-green-500" },
                { name: "Samsung Thailand", value: 28, color: "bg-blue-500" },
                { name: "BYD Thailand", value: 22, color: "bg-red-500" },
                { name: "อื่นๆ", value: 15, color: "bg-gray-500" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{item.name}</span>
                    <span className="text-gray-400">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Report */}
      {reportType === "team" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-5 py-4">พนักงาน</th>
                <th className="px-5 py-4">ตำแหน่ง</th>
                <th className="px-5 py-4">งานที่ได้รับ</th>
                <th className="px-5 py-4">เสร็จแล้ว</th>
                <th className="px-5 py-4">% สำเร็จ</th>
                <th className="px-5 py-4">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {teamPerformance.map((member, idx) => {
                const completion = Math.round((member.completed / member.tasks) * 100);
                return (
                  <tr key={idx} className="hover:bg-gray-800/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">{member.role}</td>
                    <td className="px-5 py-4 text-white">{member.tasks}</td>
                    <td className="px-5 py-4 text-green-400">{member.completed}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${completion >= 90 ? "bg-green-500" : completion >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{completion}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-yellow-400">⭐ {member.rating}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
