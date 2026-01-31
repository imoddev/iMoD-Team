"use client";

import { useState } from "react";
import { Building2, Plus, Search, Eye, Phone, Mail, MessageSquare, Loader2, RefreshCw, BarChart3 } from "lucide-react";
import Link from "next/link";

// Supabase hooks
import { useClients, useCampaigns } from "@/lib/supabase/hooks";

// Demo data fallback
import {
  demoClients,
  demoCampaigns,
  campaignStatusLabels,
  campaignStatusColors,
} from "@/lib/demo-data";

interface AddClientForm {
  company_name: string;
  brand: string;
  industry: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  contact_line: string;
  budget_range: string;
  notes: string;
}

const emptyForm: AddClientForm = {
  company_name: "",
  brand: "",
  industry: "Technology",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  contact_line: "",
  budget_range: "100,000 - 200,000",
  notes: "",
};

export default function SalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<AddClientForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Supabase data
  const { clients, loading: clientsLoading, error: clientsError, addClient, fetchClients } = useClients();
  const { campaigns, loading: campaignsLoading, fetchCampaigns } = useCampaigns();

  // Use real data if available, otherwise demo data
  const hasRealClients = clients.length > 0;
  const hasRealCampaigns = campaigns.length > 0;
  
  const displayClients = hasRealClients ? clients : demoClients;
  const displayCampaigns = hasRealCampaigns ? campaigns : demoCampaigns;

  const isLoading = clientsLoading || campaignsLoading;

  // Filter clients
  const filteredClients = displayClients.filter((client) => {
    const matchSearch =
      !searchQuery ||
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchIndustry =
      !industryFilter || client.industry === industryFilter;
    
    return matchSearch && matchIndustry;
  });

  // Pipeline calculations
  const pipelineCounts = displayCampaigns.reduce(
    (acc, camp) => {
      const status = camp.status || "lead";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pipelineValue = displayCampaigns.reduce(
    (acc, camp) => {
      const status = camp.status || "lead";
      const value = Number(camp.value || 0);
      acc[status] = (acc[status] || 0) + value;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalValue = displayCampaigns.reduce((sum, c) => {
    return sum + Number(c.value || 0);
  }, 0);

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("th-TH").format(num);

  const handleRefresh = () => {
    fetchClients();
    fetchCampaigns();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddClient = async () => {
    if (!formData.company_name.trim()) {
      setFormError("กรุณากรอกชื่อบริษัท");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      await addClient({
        company_name: formData.company_name,
        brand: formData.brand || undefined,
        industry: formData.industry || undefined,
        contact_name: formData.contact_name || undefined,
        contact_phone: formData.contact_phone || undefined,
        contact_email: formData.contact_email || undefined,
        contact_line: formData.contact_line || undefined,
        budget_range: formData.budget_range || undefined,
        notes: formData.notes || undefined,
      });
      
      setShowAddModal(false);
      setFormData(emptyForm);
    } catch (err: any) {
      setFormError(err.message || "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  // Get campaigns for a specific client
  const getClientCampaigns = (clientId: string) => {
    return displayCampaigns.filter(c => c.client_id === clientId);
  };

  // Get client value
  const getClientValue = (clientId: string) => {
    const clientCampaigns = getClientCampaigns(clientId);
    return clientCampaigns.reduce((sum, c) => {
      return sum + Number(c.value || 0);
    }, 0);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">ทีมขาย — CRM</h1>
          <p className="text-gray-400 mt-1">
            จัดการลูกค้าและติดตามแคมเปญ
            {!hasRealClients && <span className="text-yellow-500 ml-2">(Demo Mode)</span>}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/sales/social-stats"
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            <BarChart3 size={16} />
            Social Stats
          </Link>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            เพิ่มลูกค้าใหม่
          </button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {["lead", "proposed", "agreed", "in_progress", "delivered", "closed"].map(
          (status) => (
            <div
              key={status}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${campaignStatusColors[status]}`}
                ></span>
                <span className="text-xs text-gray-400">
                  {campaignStatusLabels[status]}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">
                {pipelineCounts[status] || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ฿{formatCurrency(pipelineValue[status] || 0)}
              </p>
            </div>
          )
        )}
      </div>

      {/* Total Value */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800/50 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-300">มูลค่ารวมทั้งหมด</p>
            <p className="text-3xl font-bold text-white mt-1">
              ฿{formatCurrency(totalValue)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-300">จำนวนแคมเปญ</p>
            <p className="text-3xl font-bold text-white mt-1">
              {displayCampaigns.length}
            </p>
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
            placeholder="ค้นหาลูกค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">ทุกอุตสาหกรรม</option>
          <option value="Technology">Technology</option>
          <option value="Automotive">Automotive / EV</option>
          <option value="Finance">Finance</option>
          <option value="Lifestyle">Lifestyle</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {clientsError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
          {clientsError}
        </div>
      )}

      {/* Client List */}
      {!isLoading && (
        <div className="space-y-3">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery || industryFilter ? "ไม่พบลูกค้าที่ตรงกับการค้นหา" : "ยังไม่มีลูกค้า"}
            </div>
          ) : (
            filteredClients.map((client) => {
              const clientCampaigns = getClientCampaigns(client.id);
              const clientValue = getClientValue(client.id);

              return (
                <Link
                  key={client.id}
                  href={`/sales/${client.id}`}
                  className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {client.company_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {client.company_name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {client.industry}
                            {client.brand && ` • ${client.brand}`}
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                        {client.contact_name && (
                          <span className="flex items-center gap-1.5">
                            <Eye size={14} />
                            {client.contact_name}
                          </span>
                        )}
                        {client.contact_phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone size={14} />
                            {client.contact_phone}
                          </span>
                        )}
                        {client.contact_email && (
                          <span className="flex items-center gap-1.5">
                            <Mail size={14} />
                            {client.contact_email}
                          </span>
                        )}
                        {client.contact_line && (
                          <span className="flex items-center gap-1.5">
                            <MessageSquare size={14} />
                            LINE: {client.contact_line}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right side stats */}
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-white">
                        ฿{formatCurrency(clientValue)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {clientCampaigns.length} แคมเปญ
                      </p>
                      <div className="flex gap-1 mt-2 justify-end">
                        {clientCampaigns.slice(0, 5).map((camp) => (
                          <span
                            key={camp.id}
                            className={`w-2 h-2 rounded-full ${campaignStatusColors[camp.status || "lead"]}`}
                            title={`${camp.name} — ${campaignStatusLabels[camp.status || "lead"]}`}
                          ></span>
                        ))}
                        {clientCampaigns.length > 5 && (
                          <span className="text-xs text-gray-500">+{clientCampaigns.length - 5}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {client.notes && (
                    <p className="mt-3 text-sm text-gray-500 border-t border-gray-800 pt-3">
                      💬 {client.notes}
                    </p>
                  )}
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              เพิ่มลูกค้าใหม่
            </h2>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  ชื่อบริษัท <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleFormChange}
                  placeholder="เช่น Apple Thailand"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    แบรนด์
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                    placeholder="เช่น Apple"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    อุตสาหกรรม
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Automotive">Automotive / EV</option>
                    <option value="Finance">Finance</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    ชื่อผู้ติดต่อ
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    เบอร์โทร
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    LINE ID
                  </label>
                  <input
                    type="text"
                    name="contact_line"
                    value={formData.contact_line}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  งบประมาณ
                </label>
                <select
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ต่ำกว่า 100,000">ต่ำกว่า 100,000</option>
                  <option value="100,000 - 200,000">100,000 - 200,000</option>
                  <option value="200,000 - 500,000">200,000 - 500,000</option>
                  <option value="500,000 - 1,000,000">500,000 - 1,000,000</option>
                  <option value="มากกว่า 1,000,000">มากกว่า 1,000,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  หมายเหตุ
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData(emptyForm);
                  setFormError("");
                }}
                disabled={saving}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddClient}
                disabled={saving}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
