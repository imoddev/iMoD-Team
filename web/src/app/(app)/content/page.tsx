"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Clock,
  User,
  GripVertical,
  Calendar,
  FileEdit,
  Eye,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  demoContentTasks,
  taskStatusConfig,
  taskPriorityConfig,
  platformConfig,
  type ContentTask,
} from "@/lib/demo-content";
import type { TaskStatus } from "@/types/database";

const columns: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "📝 To Do" },
  { id: "in_progress", label: "✏️ กำลังเขียน" },
  { id: "review", label: "👀 รอตรวจ" },
  { id: "done", label: "✅ เสร็จแล้ว" },
];

export default function ContentPage() {
  const [tasks, setTasks] = useState(demoContentTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ContentTask | null>(null);

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              updated_at: new Date().toISOString(),
              completed_at: newStatus === "done" ? new Date().toISOString() : t.completed_at,
            }
          : t
      )
    );
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (diff < 0) return { text: "เลยกำหนด", urgent: true };
    if (hours < 24) return { text: `${hours} ชม.`, urgent: true };
    if (days < 3) return { text: `${days} วัน`, urgent: false };
    return { text: d.toLocaleDateString("th-TH", { day: "numeric", month: "short" }), urgent: false };
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "done").length;

  return (
    <div className="h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Pipeline</h1>
          <p className="text-gray-400 mt-1">Kanban Board สำหรับทีม Content Creator</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              ✅ {doneTasks}/{totalTasks} งาน
            </span>
            {urgentTasks > 0 && (
              <span className="text-red-400 flex items-center gap-1">
                <AlertTriangle size={14} />
                {urgentTasks} ด่วน
              </span>
            )}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            สร้างงานใหม่
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4 h-[calc(100%-5rem)]">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const config = taskStatusConfig[column.id];

          return (
            <div
              key={column.id}
              className={`flex flex-col rounded-xl border border-gray-800 ${config.bgColor}`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${config.color}`}>
                    {column.label}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {columnTasks.map((task) => {
                  const priority = taskPriorityConfig[task.priority];
                  const deadline = formatDeadline(task.deadline);
                  const platform = task.platform ? platformConfig[task.platform] : null;

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-500 transition-colors group"
                    >
                      {/* Drag Handle + Priority */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical
                            size={14}
                            className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded border ${priority.color}`}
                          >
                            {priority.label.split(" ")[0]}
                          </span>
                        </div>
                        {platform && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded text-white ${platform.color}`}
                          >
                            {platform.label}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          {task.author_name && (
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {task.author_name}
                            </span>
                          )}
                          {task.word_count && (
                            <span className="flex items-center gap-1">
                              <FileText size={12} />
                              {task.word_count.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {deadline && (
                          <span
                            className={`flex items-center gap-1 ${
                              deadline.urgent ? "text-red-400" : ""
                            }`}
                          >
                            <Clock size={12} />
                            {deadline.text}
                          </span>
                        )}
                      </div>

                      {/* Quick Actions (on hover) */}
                      {column.id !== "done" && (
                        <div className="mt-2 pt-2 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            {column.id === "todo" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTask(task.id, "in_progress");
                                }}
                                className="flex-1 text-xs py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30"
                              >
                                เริ่มเขียน
                              </button>
                            )}
                            {column.id === "in_progress" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveTask(task.id, "review");
                                }}
                                className="flex-1 text-xs py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30"
                              >
                                ส่งตรวจ
                              </button>
                            )}
                            {column.id === "review" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveTask(task.id, "in_progress");
                                  }}
                                  className="flex-1 text-xs py-1 bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/30"
                                >
                                  แก้ไข
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveTask(task.id, "done");
                                  }}
                                  className="flex-1 text-xs py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30"
                                >
                                  อนุมัติ
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-600 text-sm">
                    ไม่มีงาน
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${taskPriorityConfig[selectedTask.priority].color}`}
                  >
                    {taskPriorityConfig[selectedTask.priority].label}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${taskStatusConfig[selectedTask.status].bgColor} ${taskStatusConfig[selectedTask.status].color}`}
                  >
                    {taskStatusConfig[selectedTask.status].label}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {selectedTask.title}
                </h2>
              </div>
              {selectedTask.platform && (
                <span
                  className={`text-xs px-2 py-1 rounded text-white ${platformConfig[selectedTask.platform].color}`}
                >
                  {platformConfig[selectedTask.platform].label}
                </span>
              )}
            </div>

            {selectedTask.description && (
              <p className="text-gray-400 text-sm mb-4">
                {selectedTask.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">ผู้รับผิดชอบ</p>
                <p className="text-white flex items-center gap-2">
                  <User size={14} />
                  {selectedTask.author_name || "ยังไม่ได้มอบหมาย"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Deadline</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar size={14} />
                  {selectedTask.deadline
                    ? new Date(selectedTask.deadline).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
              {selectedTask.word_count && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">จำนวนคำ</p>
                  <p className="text-white flex items-center gap-2">
                    <FileText size={14} />
                    {selectedTask.word_count.toLocaleString()} คำ
                  </p>
                </div>
              )}
              {selectedTask.completed_at && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">เสร็จเมื่อ</p>
                  <p className="text-green-400 flex items-center gap-2">
                    <CheckCircle size={14} />
                    {new Date(selectedTask.completed_at).toLocaleDateString("th-TH")}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                ปิด
              </button>
              <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <FileEdit size={16} />
                แก้ไข
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">สร้างงานใหม่</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  หัวข้อ *
                </label>
                <input
                  type="text"
                  placeholder="ชื่อบทความ/คอนเทนต์"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  รายละเอียด
                </label>
                <textarea
                  rows={3}
                  placeholder="คำอธิบายเพิ่มเติม..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    แพลตฟอร์ม
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="iPhoneMod">iPhoneMod</option>
                    <option value="EVMoD">EVMoD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Priority
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="urgent">🔴 ด่วนมาก</option>
                    <option value="high">🟠 สำคัญ</option>
                    <option value="medium" selected>🟡 ปกติ</option>
                    <option value="low">🟢 ไม่เร่ง</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    มอบหมายให้
                  </label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">เลือกผู้เขียน...</option>
                    <option value="u3">ชาร์ท</option>
                    <option value="u4">มิน</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                สร้างงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
