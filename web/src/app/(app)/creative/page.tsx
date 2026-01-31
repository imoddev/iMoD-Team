"use client";

import { useState } from "react";
import {
  Palette,
  Plus,
  Clock,
  User,
  Image,
  RefreshCw,
  Download,
  ExternalLink,
  FileImage,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  demoDesignRequests,
  designTypeConfig,
  designStatusConfig,
  priorityConfig,
  type DesignRequest,
  type DesignStatus,
} from "@/lib/demo-creative";

const statusOrder: DesignStatus[] = ["requested", "in_progress", "review", "revision", "approved", "delivered"];

export default function CreativePage() {
  const [requests, setRequests] = useState(demoDesignRequests);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null);
  const [filterType, setFilterType] = useState("");

  const getRequestsByStatus = (status: DesignStatus) =>
    requests.filter((r) => r.status === status && (!filterType || r.design_type === filterType));

  const moveRequest = (requestId: string, newStatus: DesignStatus) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: newStatus,
              updated_at: new Date().toISOString(),
              completed_at: newStatus === "delivered" ? new Date().toISOString() : r.completed_at,
            }
          : r
      )
    );
  };

  // Stats
  const pendingCount = requests.filter((r) => r.status === "requested").length;
  const inProgressCount = requests.filter((r) => ["in_progress", "review", "revision"].includes(r.status)).length;
  const completedCount = requests.filter((r) => ["approved", "delivered"].includes(r.status)).length;
  const urgentCount = requests.filter((r) => r.priority === "urgent" && !["approved", "delivered"].includes(r.status)).length;

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (diff < 0) return { text: "เลยกำหนด", urgent: true };
    if (hours < 24) return { text: `${hours} ชม.`, urgent: true };
    return { text: d.toLocaleDateString("th-TH", { day: "numeric", month: "short" }), urgent: false };
  };

  return (
    <div className="h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Creative & Design</h1>
          <p className="text-gray-400 mt-1">จัดการงานกราฟิก, Thumbnail, Infographic</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
          >
            <option value="">ทุกประเภท</option>
            {Object.entries(designTypeConfig).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            ขอออกแบบ
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <FileImage size={14} />
            รอรับงาน
          </div>
          <p className="text-2xl font-bold text-white mt-1">{pendingCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Palette size={14} />
            กำลังทำ
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <CheckCircle size={14} />
            เสร็จแล้ว
          </div>
          <p className="text-2xl font-bold text-green-400 mt-1">{completedCount}</p>
        </div>
        {urgentCount > 0 && (
          <div className="bg-gray-900 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <AlertTriangle size={14} />
              งานด่วน
            </div>
            <p className="text-2xl font-bold text-red-400 mt-1">{urgentCount}</p>
          </div>
        )}
        {urgentCount === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <RefreshCw size={14} />
              แก้ไข
            </div>
            <p className="text-2xl font-bold text-orange-400 mt-1">
              {requests.filter((r) => r.status === "revision").length}
            </p>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-6 gap-3 h-[calc(100%-10rem)] overflow-x-auto">
        {statusOrder.map((status) => {
          const statusRequests = getRequestsByStatus(status);
          const config = designStatusConfig[status];

          return (
            <div
              key={status}
              className={`flex flex-col rounded-xl border border-gray-800 min-w-[180px] ${config.bgColor}`}
            >
              <div className="p-3 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold text-sm ${config.color}`}>{config.label}</h3>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                    {statusRequests.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {statusRequests.map((request) => {
                  const typeConfig = designTypeConfig[request.design_type];
                  const deadline = formatDeadline(request.deadline);

                  return (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className="bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-500 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded text-white ${typeConfig.color}`}>
                          {typeConfig.icon} {typeConfig.label}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${priorityConfig[request.priority].color}`}>
                          {priorityConfig[request.priority].label.split(" ")[0]}
                        </span>
                      </div>

                      <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
                        {request.title}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {request.designer_name || request.requester_name}
                        </span>
                        {deadline && (
                          <span className={`flex items-center gap-1 ${deadline.urgent ? "text-red-400" : ""}`}>
                            <Clock size={12} />
                            {deadline.text}
                          </span>
                        )}
                      </div>

                      {request.revision_count > 0 && (
                        <div className="mt-1 text-xs text-orange-400">
                          <RefreshCw size={10} className="inline mr-1" />
                          แก้ไข {request.revision_count} ครั้ง
                        </div>
                      )}

                      {status !== "delivered" && (
                        <div className="mt-2 pt-2 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIndex = statusOrder.indexOf(status) + 1;
                              if (nextIndex < statusOrder.length) {
                                moveRequest(request.id, statusOrder[nextIndex]);
                              }
                            }}
                            className="w-full text-xs py-1 bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/30"
                          >
                            → ถัดไป
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded text-white ${designTypeConfig[selectedRequest.design_type].color}`}>
                    {designTypeConfig[selectedRequest.design_type].icon} {designTypeConfig[selectedRequest.design_type].label}
                  </span>
                  <span className={`text-xs ${designStatusConfig[selectedRequest.status].color}`}>
                    {designStatusConfig[selectedRequest.status].label}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedRequest.title}</h2>
              </div>
            </div>

            {selectedRequest.description && (
              <p className="text-gray-400 text-sm mb-4">{selectedRequest.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">ขอโดย</p>
                <p className="text-white">{selectedRequest.requester_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Designer</p>
                <p className="text-white">{selectedRequest.designer_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Platform</p>
                <p className="text-white">{selectedRequest.platform || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ขนาด</p>
                <p className="text-white">{selectedRequest.dimensions || "-"}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                ปิด
              </button>
              {selectedRequest.file_url && (
                <button className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  ดาวน์โหลด
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">ขอออกแบบใหม่</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">ชื่องาน *</label>
                <input type="text" placeholder="เช่น Thumbnail: รีวิว iPhone 17" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">รายละเอียด</label>
                <textarea rows={2} placeholder="อธิบายสิ่งที่ต้องการ..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">ประเภท</label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
                    {Object.entries(designTypeConfig).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Priority</label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
                    <option value="urgent">🔴 ด่วน</option>
                    <option value="high">🟠 สำคัญ</option>
                    <option value="medium" selected>🟡 ปกติ</option>
                    <option value="low">🟢 ไม่เร่ง</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">ขนาด</label>
                  <input type="text" placeholder="1280x720" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Deadline</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">ยกเลิก</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">ส่งคำขอ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
