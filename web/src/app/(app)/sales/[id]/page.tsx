"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  TrendingUp,
  Eye,
  MousePointerClick,
  Heart,
  Play,
} from "lucide-react";
import {
  demoClients,
  demoCampaigns,
  demoCampaignPosts,
  campaignStatusLabels,
  campaignStatusColors,
  platformLabels,
  platformColors,
} from "@/lib/demo-data";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const client = demoClients.find((c) => c.id === id);
  const campaigns = demoCampaigns.filter((c) => c.client_id === id);

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("th-TH").format(num);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("th-TH").format(num);

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">ไม่พบข้อมูลลูกค้า</p>
        <Link href="/sales" className="text-blue-400 hover:underline mt-2 inline-block">
          กลับหน้า CRM
        </Link>
      </div>
    );
  }

  const totalValue = campaigns.reduce((sum, c) => sum + (c.value || 0), 0);

  // Get all posts for this client's campaigns
  const clientPosts = demoCampaignPosts.filter((post) =>
    campaigns.some((camp) => camp.id === post.campaign_id)
  );

  const totalReach = clientPosts.reduce((sum, p) => sum + p.reach, 0);
  const totalEngagement = clientPosts.reduce((sum, p) => sum + p.engagement, 0);
  const totalClicks = clientPosts.reduce((sum, p) => sum + p.clicks, 0);
  const totalViews = clientPosts.reduce((sum, p) => sum + p.views, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/sales"
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-300" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">
            {client.company_name}
          </h1>
          <p className="text-gray-400 mt-0.5">
            {client.industry}
            {client.brand && ` • ${client.brand}`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
          <Plus size={16} />
          สร้างแคมเปญ
        </button>
      </div>

      {/* Client Info + Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Contact Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-400 mb-4">
            ข้อมูลติดต่อ
          </h3>
          <div className="space-y-3">
            {client.contact_name && (
              <div className="flex items-center gap-3 text-sm">
                <Eye size={16} className="text-gray-500" />
                <span className="text-white">{client.contact_name}</span>
              </div>
            )}
            {client.contact_phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-500" />
                <span className="text-white">{client.contact_phone}</span>
              </div>
            )}
            {client.contact_email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-500" />
                <span className="text-white">{client.contact_email}</span>
              </div>
            )}
            {client.contact_line && (
              <div className="flex items-center gap-3 text-sm">
                <MessageSquare size={16} className="text-gray-500" />
                <span className="text-white">
                  LINE: {client.contact_line}
                </span>
              </div>
            )}
          </div>
          {client.budget_range && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500">งบประมาณ</p>
              <p className="text-sm text-white font-medium mt-0.5">
                ฿{client.budget_range}
              </p>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-blue-400" />
            <h3 className="text-sm font-medium text-gray-400">
              Performance รวม
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye size={14} className="text-blue-400" />
                <span className="text-xs text-gray-400">Reach</span>
              </div>
              <p className="text-xl font-bold text-white">
                {formatNumber(totalReach)}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Heart size={14} className="text-pink-400" />
                <span className="text-xs text-gray-400">Engagement</span>
              </div>
              <p className="text-xl font-bold text-white">
                {formatNumber(totalEngagement)}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <MousePointerClick size={14} className="text-green-400" />
                <span className="text-xs text-gray-400">Clicks</span>
              </div>
              <p className="text-xl font-bold text-white">
                {formatNumber(totalClicks)}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Play size={14} className="text-orange-400" />
                <span className="text-xs text-gray-400">Views</span>
              </div>
              <p className="text-xl font-bold text-white">
                {formatNumber(totalViews)}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">มูลค่ารวม</p>
              <p className="text-lg font-bold text-white">
                ฿{formatCurrency(totalValue)}
              </p>
            </div>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
              📄 สร้าง Report PDF
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns */}
      <h2 className="text-lg font-semibold text-white mb-4">
        แคมเปญ ({campaigns.length})
      </h2>
      <div className="space-y-3 mb-8">
        {campaigns.map((campaign) => {
          const posts = demoCampaignPosts.filter(
            (p) => p.campaign_id === campaign.id
          );
          return (
            <div
              key={campaign.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">
                      {campaign.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full text-white ${campaignStatusColors[campaign.status]}`}
                    >
                      {campaignStatusLabels[campaign.status]}
                    </span>
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-gray-400 mt-1">
                      {campaign.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    ฿{formatCurrency(campaign.value || 0)}
                  </p>
                  {campaign.start_date && campaign.end_date && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {campaign.start_date} → {campaign.end_date}
                    </p>
                  )}
                </div>
              </div>

              {/* Posts Performance */}
              {posts.length > 0 && (
                <div className="border-t border-gray-800 pt-3 mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    📊 Content Performance ({posts.length} โพสต์)
                  </p>
                  <div className="space-y-2">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2"
                      >
                        <span
                          className={`text-xs px-2 py-0.5 rounded text-white ${platformColors[post.platform]}`}
                        >
                          {platformLabels[post.platform]}
                        </span>
                        <div className="flex-1 flex items-center gap-4 text-xs text-gray-400">
                          <span>
                            👁 {formatNumber(post.reach)}
                          </span>
                          <span>
                            ❤️ {formatNumber(post.engagement)}
                          </span>
                          <span>
                            🔗 {formatNumber(post.clicks)}
                          </span>
                          {post.views > 0 && (
                            <span>
                              ▶️ {formatNumber(post.views)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            หมายเหตุ
          </h3>
          <p className="text-sm text-gray-300">{client.notes}</p>
        </div>
      )}
    </div>
  );
}
