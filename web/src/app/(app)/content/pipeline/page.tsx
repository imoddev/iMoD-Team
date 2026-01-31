"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FileText,
  Plus,
  Clock,
  User,
  GripVertical,
  Calendar,
  AlertTriangle,
  X,
} from "lucide-react";

// Types
type PipelineStatus = "idea" | "writing" | "review" | "published";
type Priority = "urgent" | "high" | "medium" | "low";

interface PipelineTask {
  id: string;
  title: string;
  description?: string;
  status: PipelineStatus;
  priority: Priority;
  author_name?: string;
  assigned_to?: string;
  deadline?: string;
  word_count?: number;
  platform?: string;
  created_at: string;
  updated_at: string;
}

// Demo Data
const demoPipelineTasks: PipelineTask[] = [
  // Idea
  {
    id: "p1",
    title: "รวม 5 เทคโนโลยีที่จะเปลี่ยนโลกในปี 2027",
    description: "AI, Quantum Computing, AR Glasses, Brain Interface, Robotics",
    status: "idea",
    priority: "medium",
    platform: "iPhoneMod",
    created_at: "2026-01-29T10:00:00Z",
    updated_at: "2026-01-29T10:00:00Z",
  },
  {
    id: "p2",
    title: "ทำไม Apple ถึงยังไม่ทำ iPhone จอพับ?",
    description: "วิเคราะห์กลยุทธ์ Apple",
    status: "idea",
    priority: "low",
    platform: "iPhoneMod",
    created_at: "2026-01-28T14:00:00Z",
    updated_at: "2026-01-28T14:00:00Z",
  },
  {
    id: "p3",
    title: "สรุปข่าว EV จีนบุกตลาดยุโรป",
    status: "idea",
    priority: "high",
    platform: "EVMoD",
    created_at: "2026-01-29T09:00:00Z",
    updated_at: "2026-01-29T09:00:00Z",
  },
  // Writing
  {
    id: "p4",
    title: "รีวิว iPhone 17 Air — บางที่สุดเท่าที่เคยมี",
    description: "รีวิวเชิงลึก iPhone 17 Air เปรียบเทียบกับรุ่นก่อน",
    status: "writing",
    priority: "urgent",
    assigned_to: "u3",
    author_name: "ชาร์ท",
    deadline: "2026-01-31T18:00:00Z",
    word_count: 1250,
    platform: "iPhoneMod",
    created_at: "2026-01-28T10:00:00Z",
    updated_at: "2026-01-29T16:00:00Z",
  },
  {
    id: "p5",
    title: "Tesla ลดราคา Model Y — ส่งผลกระทบอย่างไร?",
    description: "วิเคราะห์ผลกระทบต่อตลาด EV ไทย",
    status: "writing",
    priority: "high",
    assigned_to: "u4",
    author_name: "มิน",
    deadline: "2026-01-30T12:00:00Z",
    word_count: 800,
    platform: "EVMoD",
    created_at: "2026-01-28T14:00:00Z",
    updated_at: "2026-01-29T14:00:00Z",
  },
  // Review
  {
    id: "p6",
    title: "Apple Vision Pro 2 — ทุกสิ่งที่รู้ตอนนี้",
    description: "รวมข่าวหลุด สเปค ราคา วันเปิดตัว",
    status: "review",
    priority: "high",
    assigned_to: "u3",
    author_name: "ชาร์ท",
    deadline: "2026-01-29T18:00:00Z",
    word_count: 2100,
    platform: "iPhoneMod",
    created_at: "2026-01-25T10:00:00Z",
    updated_at: "2026-01-28T17:00:00Z",
  },
  {
    id: "p7",
    title: "BYD แซง Tesla — วิเคราะห์ตลาด EV โลก",
    description: "เจาะลึกทำไม BYD ถึงแซง Tesla ได้",
    status: "review",
    priority: "medium",
    assigned_to: "u4",
    author_name: "มิน",
    deadline: "2026-01-30T12:00:00Z",
    word_count: 1850,
    platform: "EVMoD",
    created_at: "2026-01-24T11:00:00Z",
    updated_at: "2026-01-28T15:00:00Z",
  },
  // Published
  {
    id: "p8",
    title: "สรุปยอดขาย EV ไทย 2025",
    description: "Infographic + บทวิเคราะห์",
    status: "published",
    priority: "high",
    assigned_to: "u3",
    author_name: "ชาร์ท",
    word_count: 1500,
    platform: "EVMoD",
    created_at: "2026-01-20T09:00:00Z",
    updated_at: "2026-01-27T16:00:00Z",
  },
  {
    id: "p9",
    title: "รีวิว Google Pixel 10 Pro — กล้อง AI ที่ดีที่สุด?",
    status: "published",
    priority: "medium",
    assigned_to: "u4",
    author_name: "มิน",
    word_count: 1650,
    platform: "iPhoneMod",
    created_at: "2026-01-22T10:00:00Z",
    updated_at: "2026-01-26T14:00:00Z",
  },
];

// Config
const columns: { id: PipelineStatus; label: string; color: string; bgColor: string }[] = [
  { id: "idea", label: "💡 Idea", color: "text-purple-400", bgColor: "bg-purple-900/20" },
  { id: "writing", label: "✍️ Writing", color: "text-blue-400", bgColor: "bg-blue-900/20" },
  { id: "review", label: "👀 Review", color: "text-yellow-400", bgColor: "bg-yellow-900/20" },
  { id: "published", label: "🚀 Published", color: "text-green-400", bgColor: "bg-green-900/20" },
];

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  urgent: { label: "🔴 ด่วนมาก", color: "text-red-400 bg-red-500/20 border-red-500/30" },
  high: { label: "🟠 สำคัญ", color: "text-orange-400 bg-orange-500/20 border-orange-500/30" },
  medium: { label: "🟡 ปกติ", color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30" },
  low: { label: "🟢 ไม่เร่ง", color: "text-green-400 bg-green-500/20 border-green-500/30" },
};

const platformConfig: Record<string, { label: string; color: string }> = {
  iPhoneMod: { label: "iPhoneMod", color: "bg-blue-600" },
  EVMoD: { label: "EVMoD", color: "bg-emerald-600" },
};

// Sortable Task Card
function SortableTaskCard({ 
  task, 
  onClick 
}: { 
  task: PipelineTask; 
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priority = priorityConfig[task.priority];
  const platform = task.platform ? platformConfig[task.platform] : null;
  const deadline = formatDeadline(task.deadline);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-500 transition-colors group"
    >
      {/* Drag Handle + Priority */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical
              size={14}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            />
          </div>
          <span className={`text-xs px-1.5 py-0.5 rounded border ${priority.color}`}>
            {priority.label.split(" ")[0]}
          </span>
        </div>
        {platform && (
          <span className={`text-xs px-1.5 py-0.5 rounded text-white ${platform.color}`}>
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
          <span className={`flex items-center gap-1 ${deadline.urgent ? "text-red-400" : ""}`}>
            <Clock size={12} />
            {deadline.text}
          </span>
        )}
      </div>
    </div>
  );
}

// Task Card for Overlay
function TaskCard({ task }: { task: PipelineTask }) {
  const priority = priorityConfig[task.priority];
  const platform = task.platform ? platformConfig[task.platform] : null;

  return (
    <div className="bg-gray-900 border border-blue-500 rounded-lg p-3 shadow-lg shadow-blue-500/20 w-64">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-1.5 py-0.5 rounded border ${priority.color}`}>
          {priority.label.split(" ")[0]}
        </span>
        {platform && (
          <span className={`text-xs px-1.5 py-0.5 rounded text-white ${platform.color}`}>
            {platform.label}
          </span>
        )}
      </div>
      <h4 className="text-sm font-medium text-white line-clamp-2">{task.title}</h4>
    </div>
  );
}

// Helper
function formatDeadline(deadline?: string) {
  if (!deadline) return null;
  const d = new Date(deadline);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (diff < 0) return { text: "เลยกำหนด", urgent: true };
  if (hours < 24) return { text: `${hours} ชม.`, urgent: true };
  if (days < 3) return { text: `${days} วัน`, urgent: false };
  return {
    text: d.toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
    urgent: false,
  };
}

export default function ContentPipelinePage() {
  const [tasks, setTasks] = useState(demoPipelineTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<PipelineTask | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksByStatus = (status: PipelineStatus) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Check if over a column
    const overColumn = columns.find((c) => c.id === over.id);
    if (overColumn && activeTask.status !== overColumn.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? { ...t, status: overColumn.id, updated_at: new Date().toISOString() }
            : t
        )
      );
      return;
    }

    // Check if over another task
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? { ...t, status: overTask.status, updated_at: new Date().toISOString() }
            : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const activeTask = tasks.find((t) => t.id === active.id);
      const overTask = tasks.find((t) => t.id === over.id);

      if (activeTask && overTask && activeTask.status === overTask.status) {
        const oldIndex = tasks.findIndex((t) => t.id === active.id);
        const newIndex = tasks.findIndex((t) => t.id === over.id);
        setTasks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  // Stats
  const totalTasks = tasks.length;
  const publishedTasks = tasks.filter((t) => t.status === "published").length;
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "published").length;

  return (
    <div className="h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Pipeline</h1>
          <p className="text-gray-400 mt-1">ลากและวางเพื่อจัดการงาน Content</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              🚀 {publishedTasks}/{totalTasks} งาน
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

      {/* Kanban Board with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-4 h-[calc(100%-5rem)]">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);

            return (
              <div
                key={column.id}
                className={`flex flex-col rounded-xl border border-gray-800 ${column.bgColor}`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${column.color}`}>{column.label}</h3>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                  id={column.id}
                >
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
                    {columnTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-600 text-sm border-2 border-dashed border-gray-700 rounded-lg">
                        ลากงานมาวางที่นี่
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${priorityConfig[selectedTask.priority].color}`}
                  >
                    {priorityConfig[selectedTask.priority].label}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      columns.find((c) => c.id === selectedTask.status)?.bgColor
                    } ${columns.find((c) => c.id === selectedTask.status)?.color}`}
                  >
                    {columns.find((c) => c.id === selectedTask.status)?.label}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedTask.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {selectedTask.description && (
              <p className="text-gray-400 text-sm mb-4">{selectedTask.description}</p>
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
              {selectedTask.platform && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">แพลตฟอร์ม</p>
                  <span
                    className={`text-xs px-2 py-1 rounded text-white ${
                      platformConfig[selectedTask.platform]?.color
                    }`}
                  >
                    {platformConfig[selectedTask.platform]?.label}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTask(null)}
              className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">สร้าง Idea ใหม่</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

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
                    <option value="medium">🟡 ปกติ</option>
                    <option value="low">🟢 ไม่เร่ง</option>
                  </select>
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
                สร้าง Idea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
