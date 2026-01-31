"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  Heart,
  Users,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  BarChart3,
  MousePointer,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  demoSocialPosts,
  demoSocialPages,
  formatNumber,
  formatDate,
  getTimeAgo,
  type SocialPost,
} from "@/lib/demo-social-stats";

export default function SocialStatsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

  // Filter posts
  const filteredPosts = demoSocialPosts.filter((post) => {
    const matchSearch =
      !searchQuery ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.postId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchPage = !selectedPage || post.pageName === selectedPage;
    
    return matchSearch && matchPage;
  });

  // Calculate totals
  const totalViews = filteredPosts.reduce((sum, p) => sum + p.views, 0);
  const totalEngagement = filteredPosts.reduce((sum, p) => sum + p.engagement, 0);
  const totalReach = filteredPosts.reduce((sum, p) => sum + p.reach, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/sales" className="hover:text-white">ทีมขาย</Link>
            <span>/</span>
            <span className="text-white">Social Stats</span>
          </div>
          <h1 className="text-2xl font-bold text-white">สถิติโซเชียล</h1>
          <p className="text-gray-400 mt-1">
            ดูสถิติโพสต์จาก Facebook, Instagram, YouTube
            <span className="text-yellow-500 ml-2">(Demo Mode)</span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Eye className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">ยอดดูรวม</p>
              <p className="text-2xl font-bold text-white">{formatNumber(totalViews)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">การโต้ตอบรวม</p>
              <p className="text-2xl font-bold text-white">{formatNumber(totalEngagement)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Users className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">การเข้าถึงรวม</p>
              <p className="text-2xl font-bold text-white">{formatNumber(totalReach)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="ค้นหาโพสต์หรือ Post ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทุกเพจ</option>
          {demoSocialPages.map((page) => (
            <option key={page.id} value={page.name}>
              {page.avatar} {page.name}
            </option>
          ))}
        </select>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Page Avatar */}
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {post.pageAvatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{post.pageName}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{getTimeAgo(post.postDate)}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.content}</p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Eye size={14} className="text-blue-400" />
                    <span>{formatNumber(post.views)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Heart size={14} className="text-red-400" />
                    <span>{formatNumber(post.reactions)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <MessageCircle size={14} className="text-green-400" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Share2 size={14} className="text-purple-400" />
                    <span>{post.shares}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Users size={14} className="text-orange-400" />
                    <span>{formatNumber(post.uniqueViewers)} ผู้ชม</span>
                  </div>
                </div>
              </div>

              {/* View Details */}
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{formatNumber(post.views)}</p>
                <p className="text-xs text-gray-500">ยอดดู</p>
              </div>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            ไม่พบโพสต์ที่ตรงกับการค้นหา
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl">
                  {selectedPost.pageAvatar}
                </div>
                <div>
                  <p className="font-medium text-white">{selectedPost.pageName}</p>
                  <p className="text-xs text-gray-500">{formatDate(selectedPost.postDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedPost.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button className="px-5 py-3 text-sm text-gray-400 hover:text-white border-b-2 border-transparent">
                ภาพรวม
              </button>
              <button className="px-5 py-3 text-sm text-blue-400 border-b-2 border-blue-400 font-medium">
                ประสิทธิภาพ
              </button>
              <button className="px-5 py-3 text-sm text-gray-400 hover:text-white border-b-2 border-transparent">
                ดูตัวอย่างฟีด
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Post Content */}
              <p className="text-gray-300 mb-6">{selectedPost.content}</p>

              {/* Overview Stats */}
              <div className="bg-gray-800/50 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">ภาพรวม</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Eye size={12} />
                      <span>ยอดดู</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatNumber(selectedPost.views)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <TrendingUp size={12} />
                      <span>การโต้ตอบ</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatNumber(selectedPost.engagement)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <MousePointer size={12} />
                      <span>การคลิกลิงก์</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedPost.linkClicks || "--"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <UserPlus size={12} />
                      <span>การติดตาม</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedPost.newFollowers || 0}</p>
                  </div>
                </div>
              </div>

              {/* View Chart */}
              <div className="bg-gray-800/50 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Eye size={12} />
                      <span>ยอดดู</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatNumber(selectedPost.views)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md">รวม</button>
                    <button className="px-3 py-1 text-xs text-gray-400 hover:bg-gray-700 rounded-md">ผู้ติดตาม</button>
                  </div>
                </div>

                {/* Simple Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-2 mb-4">
                  {selectedPost.viewTimeline.map((point, idx) => {
                    const maxViews = Math.max(...selectedPost.viewTimeline.map(p => p.views));
                    const height = (point.views / maxViews) * 100;
                    const avgHeight = (point.avgViews / maxViews) * 100;
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex gap-0.5 items-end" style={{ height: '160px' }}>
                          <div 
                            className="flex-1 bg-blue-500 rounded-t transition-all"
                            style={{ height: `${height}%` }}
                            title={`${formatNumber(point.views)} ยอดดู`}
                          />
                          <div 
                            className="flex-1 bg-gray-600 rounded-t transition-all"
                            style={{ height: `${avgHeight}%` }}
                            title={`${formatNumber(point.avgViews)} เฉลี่ย`}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 text-center">{point.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span className="text-gray-400">ยอดดูของโพสต์นี้</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-600 rounded" />
                    <span className="text-gray-400">ยอดดูโพสต์ตามปกติของคุณ</span>
                  </div>
                </div>
              </div>

              {/* Audience */}
              <div className="bg-gray-800/50 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                  <Users size={12} />
                  <span>ผู้ชม</span>
                </div>
                <p className="text-2xl font-bold text-white">{formatNumber(selectedPost.uniqueViewers)}</p>
              </div>

              {/* Engagement Breakdown */}
              <div className="bg-gray-800/50 rounded-xl p-5">
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
                  <TrendingUp size={12} />
                  <span>การโต้ตอบ</span>
                </div>
                <p className="text-2xl font-bold text-white mb-4">{formatNumber(selectedPost.engagement)}</p>
                
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Heart size={12} />
                      <span>การกดถูกใจและความรู้สึก</span>
                    </div>
                    <p className="text-xl font-bold text-white">{formatNumber(selectedPost.reactions)}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <MessageCircle size={12} />
                      <span>ความคิดเห็น</span>
                    </div>
                    <p className="text-xl font-bold text-white">{selectedPost.comments}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Share2 size={12} />
                      <span>การแชร์</span>
                    </div>
                    <p className="text-xl font-bold text-white">{selectedPost.shares}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Bookmark size={12} />
                      <span>การบันทึก</span>
                    </div>
                    <p className="text-xl font-bold text-white">{selectedPost.saves}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
