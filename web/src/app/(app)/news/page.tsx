"use client";

import { useState } from "react";
import {
  Newspaper,
  RefreshCw,
  Clock,
  ExternalLink,
  Lightbulb,
  Tag,
  FileEdit,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import {
  demoNews,
  priorityConfig,
  categoryConfig,
  statusConfig,
  type NewsItem,
} from "@/lib/demo-news";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStatFilter, setActiveStatFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showBriefModal, setShowBriefModal] = useState<NewsItem | null>(null);

  const categories = [
    { label: "ทั้งหมด", value: "all" },
    { label: "🍎 Apple", value: "apple" },
    { label: "⚡ EV", value: "ev" },
    { label: "💻 Tech", value: "tech" },
    { label: "💰 เศรษฐกิจ", value: "economy" },
    { label: "📱 Gadgets", value: "gadgets" },
  ];

  // Filter by category first
  let filteredNews =
    activeCategory === "all"
      ? demoNews
      : demoNews.filter((n) => n.category === activeCategory);

  // Then filter by stat card selection
  if (activeStatFilter === "hot") {
    filteredNews = filteredNews.filter((n) => n.priority_level === "hot");
  } else if (activeStatFilter === "trending") {
    filteredNews = filteredNews.filter((n) => n.priority_level === "trending");
  } else if (activeStatFilter === "available") {
    filteredNews = filteredNews.filter((n) => n.status === "available");
  }

  const handleStatClick = (filter: string) => {
    setActiveStatFilter(activeStatFilter === filter ? null : filter);
  };

  // Sort by priority score descending
  const sortedNews = [...filteredNews].sort(
    (a, b) => b.priority_score - a.priority_score
  );

  const hotCount = demoNews.filter((n) => n.priority_level === "hot").length;
  const trendingCount = demoNews.filter((n) => n.priority_level === "trending").length;
  const availableCount = demoNews.filter((n) => n.status === "available").length;

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "เมื่อกี้";
    if (hours < 24) return `${hours} ชม.ที่แล้ว`;
    const days = Math.floor(hours / 24);
    return `${days} วันที่แล้ว`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">News Intelligence</h1>
          <p className="text-gray-400 mt-1">
            ข่าวสารอัจฉริยะสำหรับทีม Content
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
          <RefreshCw size={16} />
          ดึงข่าวใหม่
        </button>
      </div>

      {/* Quick Stats - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => setActiveStatFilter(null)}
          className={`bg-gray-900 border rounded-xl p-4 text-left transition-all hover:bg-gray-800 ${
            activeStatFilter === null
              ? "border-white/50 ring-2 ring-white/20"
              : "border-gray-800"
          }`}
        >
          <p className="text-xs text-gray-400">ข่าวทั้งหมด</p>
          <p className="text-2xl font-bold text-white mt-1">{demoNews.length}</p>
        </button>
        <button
          onClick={() => handleStatClick("hot")}
          className={`bg-gray-900 border rounded-xl p-4 text-left transition-all hover:bg-gray-800 ${
            activeStatFilter === "hot"
              ? "border-red-500 ring-2 ring-red-500/30"
              : "border-red-500/30"
          }`}
        >
          <p className="text-xs text-red-400">🔴 Hot</p>
          <p className="text-2xl font-bold text-white mt-1">{hotCount}</p>
        </button>
        <button
          onClick={() => handleStatClick("trending")}
          className={`bg-gray-900 border rounded-xl p-4 text-left transition-all hover:bg-gray-800 ${
            activeStatFilter === "trending"
              ? "border-yellow-500 ring-2 ring-yellow-500/30"
              : "border-yellow-500/30"
          }`}
        >
          <p className="text-xs text-yellow-400">🟡 Trending</p>
          <p className="text-2xl font-bold text-white mt-1">{trendingCount}</p>
        </button>
        <button
          onClick={() => handleStatClick("available")}
          className={`bg-gray-900 border rounded-xl p-4 text-left transition-all hover:bg-gray-800 ${
            activeStatFilter === "available"
              ? "border-green-500 ring-2 ring-green-500/30"
              : "border-green-500/30"
          }`}
        >
          <p className="text-xs text-green-400">📝 ว่าง (รอหยิบ)</p>
          <p className="text-2xl font-bold text-white mt-1">{availableCount}</p>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeCategory === cat.value
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Priority Legend */}
      <div className="flex gap-4 mb-6 text-sm">
        {Object.entries(priorityConfig).map(([key, config]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${config.color}`}></span>
            <span className="text-gray-400">{config.label.slice(2)}</span>
          </span>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-3">
        {sortedNews.map((news) => {
          const priority = priorityConfig[news.priority_level];
          const category = categoryConfig[news.category];
          const status = statusConfig[news.status];
          const isExpanded = expandedId === news.id;

          return (
            <div
              key={news.id}
              className={`bg-gray-900 border rounded-xl overflow-hidden transition-colors ${
                news.priority_level === "hot"
                  ? "border-red-500/40"
                  : news.priority_level === "trending"
                  ? "border-yellow-500/30"
                  : "border-gray-800"
              }`}
            >
              {/* Main Row */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Priority Score */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${priority.color}`}
                  >
                    {news.priority_score}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded text-white ${category.color}`}
                      >
                        {category.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded text-white ${status.color}`}
                      >
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {timeAgo(news.published_at)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-white mb-1">
                      {news.title_th}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {news.summary_th}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>📰 {news.source}</span>
                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:underline"
                      >
                        <ExternalLink size={12} />
                        ต้นฉบับ
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {news.status === "available" && (
                      <button
                        onClick={() => setShowBriefModal(news)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors"
                      >
                        <FileEdit size={14} />
                        หยิบข่าวนี้
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : news.id)
                      }
                      className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-800 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Title */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        หัวข้อต้นฉบับ
                      </p>
                      <p className="text-sm text-gray-300">{news.title}</p>
                    </div>

                    {/* AI Suggested Angle */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Lightbulb size={12} className="text-yellow-400" />
                        มุมเขียนที่แนะนำ (AI)
                      </p>
                      <p className="text-sm text-yellow-200/80">
                        {news.suggested_angle}
                      </p>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Tag size={12} />
                      Keywords
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {news.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Priority Analysis */}
                  <div className="mt-3 bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Zap size={12} className="text-blue-400" />
                      AI Priority Analysis
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${priority.color}`}
                            style={{
                              width: `${news.priority_score}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${priority.textColor}`}>
                        {news.priority_score}/100
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Content Brief Modal */}
      {showBriefModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-white mb-2">
              📝 สร้าง Content Brief
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              จากข่าว: {showBriefModal.title_th}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  หัวข้อภาษาไทย
                </label>
                <input
                  type="text"
                  defaultValue={showBriefModal.title_th}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  มุมเขียน
                </label>
                <textarea
                  rows={3}
                  defaultValue={showBriefModal.suggested_angle}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    แพลตฟอร์ม
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>iPhoneMod.net</option>
                    <option>EVMoD.net</option>
                    <option>ทั้งสองเว็บ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    มอบหมายให้
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>เลือกผู้เขียน...</option>
                    <option>Content Team A</option>
                    <option>Content Team B</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Keywords
                </label>
                <div className="flex gap-2 flex-wrap">
                  {showBriefModal.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-xs px-2 py-1 bg-blue-600/30 text-blue-300 rounded border border-blue-500/30"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBriefModal(null)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => setShowBriefModal(null)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                สร้าง Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
