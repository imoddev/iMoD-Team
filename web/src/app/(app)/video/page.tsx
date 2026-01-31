"use client";

import { useState } from "react";
import {
  Video,
  Plus,
  Clock,
  User,
  Eye,
  ThumbsUp,
  MessageSquare,
  Play,
  Calendar,
  ExternalLink,
  Film,
  Scissors,
  FileText,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import {
  demoVideoProjects,
  videoStatusConfig,
  platformConfig,
  priorityConfig,
  type VideoProject,
  type VideoStatus,
} from "@/lib/demo-video";

type ViewMode = "board" | "list";

const statusOrder: VideoStatus[] = ["idea", "scripting", "filming", "editing", "review", "published"];

export default function VideoPage() {
  const [projects, setProjects] = useState(demoVideoProjects);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [selectedProject, setSelectedProject] = useState<VideoProject | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const getProjectsByStatus = (status: VideoStatus) =>
    projects.filter((p) => p.status === status);

  const moveProject = (projectId: string, newStatus: VideoStatus) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: newStatus,
              updated_at: new Date().toISOString(),
              publish_date: newStatus === "published" ? new Date().toISOString() : p.publish_date,
            }
          : p
      )
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views?: number) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  // Stats
  const totalProjects = projects.length;
  const publishedCount = projects.filter((p) => p.status === "published").length;
  const inProgressCount = projects.filter((p) => !["idea", "published"].includes(p.status)).length;
  const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div className="h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Video Production</h1>
          <p className="text-gray-400 mt-1">Tracker งานวิดีโอทีม Video Editor</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("board")}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === "board" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            สร้างโปรเจค
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Video size={14} />
            โปรเจคทั้งหมด
          </div>
          <p className="text-2xl font-bold text-white mt-1">{totalProjects}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Film size={14} />
            กำลังดำเนินการ
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <CheckCircle size={14} />
            เผยแพร่แล้ว
          </div>
          <p className="text-2xl font-bold text-green-400 mt-1">{publishedCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Eye size={14} />
            ยอดวิวรวม
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-1">{formatViews(totalViews)}</p>
        </div>
      </div>

      {/* Board View */}
      {viewMode === "board" && (
        <div className="grid grid-cols-6 gap-3 h-[calc(100%-10rem)] overflow-x-auto">
          {statusOrder.map((status) => {
            const statusProjects = getProjectsByStatus(status);
            const config = videoStatusConfig[status];

            return (
              <div
                key={status}
                className={`flex flex-col rounded-xl border border-gray-800 min-w-[200px] ${config.bgColor}`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-sm ${config.color}`}>
                      {config.label}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                      {statusProjects.length}
                    </span>
                  </div>
                </div>

                {/* Projects */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {statusProjects.map((project) => {
                    const platform = platformConfig[project.platform];

                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-500 transition-colors group"
                      >
                        {/* Platform + Priority */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded text-white ${platform.color}`}>
                            {platform.icon} {platform.label}
                          </span>
                          <span className={`text-xs ${priorityConfig[project.priority].color}`}>
                            {priorityConfig[project.priority].label.split(" ")[0]}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
                          {project.title}
                        </h4>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {project.editor_name && (
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {project.editor_name}
                            </span>
                          )}
                          {project.duration_seconds && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatDuration(project.duration_seconds)}
                            </span>
                          )}
                        </div>

                        {/* Published Stats */}
                        {project.status === "published" && project.views && (
                          <div className="mt-2 pt-2 border-t border-gray-800 flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {formatViews(project.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp size={12} />
                              {formatViews(project.likes)}
                            </span>
                          </div>
                        )}

                        {/* Quick Action */}
                        {status !== "published" && (
                          <div className="mt-2 pt-2 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextIndex = statusOrder.indexOf(status) + 1;
                                if (nextIndex < statusOrder.length) {
                                  moveProject(project.id, statusOrder[nextIndex]);
                                }
                              }}
                              className="w-full text-xs py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30"
                            >
                              → {videoStatusConfig[statusOrder[statusOrder.indexOf(status) + 1]]?.label || "ถัดไป"}
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
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr className="text-left text-xs text-gray-400">
                <th className="px-4 py-3">โปรเจค</th>
                <th className="px-4 py-3">แพลตฟอร์ม</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3">Editor</th>
                <th className="px-4 py-3">ความยาว</th>
                <th className="px-4 py-3">ยอดวิว</th>
                <th className="px-4 py-3">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projects.map((project) => {
                const status = videoStatusConfig[project.status];
                const platform = platformConfig[project.platform];

                return (
                  <tr
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="hover:bg-gray-800/50 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <p className="text-white font-medium text-sm">{project.title}</p>
                      <p className={`text-xs ${priorityConfig[project.priority].color}`}>
                        {priorityConfig[project.priority].label}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded text-white ${platform.color}`}>
                        {platform.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {project.editor_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDuration(project.duration_seconds) || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {project.views ? formatViews(project.views) : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                          })
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded text-white ${platformConfig[selectedProject.platform].color}`}
                  >
                    {platformConfig[selectedProject.platform].label}
                  </span>
                  <span className={`text-xs ${videoStatusConfig[selectedProject.status].color}`}>
                    {videoStatusConfig[selectedProject.status].label}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
              </div>
              {selectedProject.youtube_url && (
                <a
                  href={selectedProject.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <ExternalLink size={16} className="text-white" />
                </a>
              )}
            </div>

            {selectedProject.description && (
              <p className="text-gray-400 text-sm mb-4">{selectedProject.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Editor</p>
                <p className="text-white flex items-center gap-2">
                  <User size={14} />
                  {selectedProject.editor_name || "ยังไม่ได้มอบหมาย"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ความยาว</p>
                <p className="text-white flex items-center gap-2">
                  <Clock size={14} />
                  {formatDuration(selectedProject.duration_seconds) || "ยังไม่ระบุ"}
                </p>
              </div>
              {selectedProject.deadline && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Deadline</p>
                  <p className="text-white flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(selectedProject.deadline).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {selectedProject.publish_date && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">วันเผยแพร่</p>
                  <p className="text-green-400 flex items-center gap-2">
                    <Play size={14} />
                    {new Date(selectedProject.publish_date).toLocaleDateString("th-TH")}
                  </p>
                </div>
              )}
            </div>

            {/* Stats for Published */}
            {selectedProject.status === "published" && selectedProject.views && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 mb-2">Performance</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{formatViews(selectedProject.views)}</p>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                      <Eye size={12} /> Views
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{formatViews(selectedProject.likes)}</p>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                      <ThumbsUp size={12} /> Likes
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{formatViews(selectedProject.comments)}</p>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                      <MessageSquare size={12} /> Comments
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                ปิด
              </button>
              {selectedProject.status !== "published" && (
                <button
                  onClick={() => {
                    const nextIndex = statusOrder.indexOf(selectedProject.status) + 1;
                    if (nextIndex < statusOrder.length) {
                      moveProject(selectedProject.id, statusOrder[nextIndex]);
                      setSelectedProject(null);
                    }
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  → {videoStatusConfig[statusOrder[statusOrder.indexOf(selectedProject.status) + 1]]?.label}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">สร้างโปรเจควิดีโอใหม่</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  ชื่อวิดีโอ *
                </label>
                <input
                  type="text"
                  placeholder="หัวข้อวิดีโอ..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  รายละเอียด
                </label>
                <textarea
                  rows={2}
                  placeholder="คำอธิบายสั้นๆ..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    แพลตฟอร์ม
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="youtube">YouTube</option>
                    <option value="shorts">Shorts</option>
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Reels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Priority
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="urgent">🔴 ด่วน</option>
                    <option value="high">🟠 สำคัญ</option>
                    <option value="medium" selected>🟡 ปกติ</option>
                    <option value="low">🟢 ไม่เร่ง</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Editor
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">เลือก Editor...</option>
                    <option value="u5">เจมส์</option>
                    <option value="u6">นิว</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                สร้างโปรเจค
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
