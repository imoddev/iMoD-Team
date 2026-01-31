"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Video,
  Plus,
  Clock,
  User,
  GripVertical,
  Eye,
  ThumbsUp,
  Play,
  X,
  Film,
  Scissors,
  FileText,
  Lightbulb,
  CheckCircle,
  Camera,
} from "lucide-react";

// Types
type VideoStage = "pre_production" | "filming" | "editing" | "review" | "published";
type Priority = "urgent" | "high" | "medium" | "low";
type Platform = "youtube" | "shorts" | "tiktok" | "reels";

interface VideoTask {
  id: string;
  title: string;
  description?: string;
  stage: VideoStage;
  platform: Platform;
  priority: Priority;
  progress: number; // 0-100
  editor_name?: string;
  thumbnail?: string;
  duration_seconds?: number;
  deadline?: string;
  publish_date?: string;
  views?: number;
  likes?: number;
  created_at: string;
  updated_at: string;
}

// Demo Data
const demoVideoTasks: VideoTask[] = [
  // Pre-production
  {
    id: "vt1",
    title: "iPhone 17 Air vs iPhone 17 Pro — ซื้อรุ่นไหนดี?",
    description: "เปรียบเทียบสเปค ราคา ความคุ้มค่า",
    stage: "pre_production",
    platform: "youtube",
    priority: "high",
    progress: 20,
    editor_name: "เจมส์",
    deadline: "2026-02-05T18:00:00Z",
    created_at: "2026-01-29T10:00:00Z",
    updated_at: "2026-01-29T10:00:00Z",
  },
  {
    id: "vt2",
    title: "5 ฟีเจอร์ลับ iOS 19 ที่คนไม่รู้",
    description: "Tips & Tricks แบบสั้นๆ",
    stage: "pre_production",
    platform: "shorts",
    priority: "medium",
    progress: 15,
    created_at: "2026-01-28T14:00:00Z",
    updated_at: "2026-01-28T14:00:00Z",
  },
  // Filming
  {
    id: "vt3",
    title: "Tesla Model Y 2026 — ลดราคาแล้วน่าซื้อไหม?",
    description: "รีวิว + วิเคราะห์ตลาด EV ไทย",
    stage: "filming",
    platform: "youtube",
    priority: "urgent",
    progress: 45,
    editor_name: "เจมส์",
    deadline: "2026-01-31T18:00:00Z",
    created_at: "2026-01-27T09:00:00Z",
    updated_at: "2026-01-29T15:00:00Z",
  },
  {
    id: "vt4",
    title: "Unboxing MacBook Pro M5 Max",
    description: "แกะกล่อง + First Impression",
    stage: "filming",
    platform: "youtube",
    priority: "high",
    progress: 55,
    editor_name: "นิว",
    deadline: "2026-02-01T18:00:00Z",
    created_at: "2026-01-26T11:00:00Z",
    updated_at: "2026-01-29T12:00:00Z",
  },
  // Editing
  {
    id: "vt5",
    title: "BYD Seal vs Tesla Model 3 — ศึกรถไฟฟ้าซีดาน",
    description: "เปรียบเทียบขับจริง 2 สัปดาห์",
    stage: "editing",
    platform: "youtube",
    priority: "high",
    progress: 75,
    editor_name: "นิว",
    duration_seconds: 1200,
    deadline: "2026-01-30T12:00:00Z",
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-01-29T14:00:00Z",
  },
  {
    id: "vt6",
    title: "รีวิว AirPods Pro 3 — เสียงดีขึ้นจริงไหม?",
    description: "ทดสอบ ANC, Spatial Audio",
    stage: "editing",
    platform: "youtube",
    priority: "medium",
    progress: 60,
    editor_name: "เจมส์",
    duration_seconds: 720,
    deadline: "2026-02-02T18:00:00Z",
    created_at: "2026-01-22T09:00:00Z",
    updated_at: "2026-01-28T16:00:00Z",
  },
  // Review
  {
    id: "vt7",
    title: "Galaxy S26 Ultra — กล้อง 200MP ดีจริงไหม?",
    description: "รีวิวกล้องเชิงลึก + ตัวอย่างภาพ",
    stage: "review",
    platform: "youtube",
    priority: "high",
    progress: 95,
    editor_name: "นิว",
    duration_seconds: 900,
    deadline: "2026-01-29T18:00:00Z",
    created_at: "2026-01-18T10:00:00Z",
    updated_at: "2026-01-28T17:00:00Z",
  },
  {
    id: "vt8",
    title: "Quick Look: Apple Vision Pro 2",
    description: "First look สั้นๆ",
    stage: "review",
    platform: "shorts",
    priority: "medium",
    progress: 90,
    editor_name: "เจมส์",
    duration_seconds: 58,
    deadline: "2026-01-30T12:00:00Z",
    created_at: "2026-01-25T14:00:00Z",
    updated_at: "2026-01-29T10:00:00Z",
  },
  // Published
  {
    id: "vt9",
    title: "สรุปงาน CES 2026 — 10 Gadgets ที่น่าสนใจ",
    stage: "published",
    platform: "youtube",
    priority: "high",
    progress: 100,
    editor_name: "เจมส์",
    duration_seconds: 1500,
    publish_date: "2026-01-15T10:00:00Z",
    views: 125000,
    likes: 4200,
    created_at: "2026-01-10T09:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "vt10",
    title: "ทำไม EV ถึงขายดีในไทย? วิเคราะห์ตลาด 2025",
    stage: "published",
    platform: "youtube",
    priority: "medium",
    progress: 100,
    editor_name: "นิว",
    duration_seconds: 1080,
    publish_date: "2026-01-12T10:00:00Z",
    views: 89000,
    likes: 3100,
    created_at: "2026-01-05T11:00:00Z",
    updated_at: "2026-01-12T10:00:00Z",
  },
];

// Config
const stages: { id: VideoStage; label: string; color: string; bgColor: string; icon: React.ReactNode }[] = [
  { id: "pre_production", label: "Pre-production", color: "text-purple-400", bgColor: "bg-purple-900/20", icon: <Lightbulb size={14} /> },
  { id: "filming", label: "Filming", color: "text-orange-400", bgColor: "bg-orange-900/20", icon: <Camera size={14} /> },
  { id: "editing", label: "Editing", color: "text-yellow-400", bgColor: "bg-yellow-900/20", icon: <Scissors size={14} /> },
  { id: "review", label: "Review", color: "text-blue-400", bgColor: "bg-blue-900/20", icon: <Eye size={14} /> },
  { id: "published", label: "Published", color: "text-green-400", bgColor: "bg-green-900/20", icon: <CheckCircle size={14} /> },
];

const platformConfig: Record<Platform, { label: string; color: string; icon: string }> = {
  youtube: { label: "YouTube", color: "bg-red-600", icon: "▶️" },
  shorts: { label: "Shorts", color: "bg-red-500", icon: "📱" },
  tiktok: { label: "TikTok", color: "bg-black border border-gray-700", icon: "🎵" },
  reels: { label: "Reels", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: "📸" },
};

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  urgent: { label: "🔴 ด่วน", color: "text-red-400" },
  high: { label: "🟠 สำคัญ", color: "text-orange-400" },
  medium: { label: "🟡 ปกติ", color: "text-yellow-400" },
  low: { label: "🟢 ไม่เร่ง", color: "text-green-400" },
};

// Sortable Video Card
function SortableVideoCard({
  task,
  onClick,
}: {
  task: VideoTask;
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

  const platform = platformConfig[task.platform];
  const priority = priorityConfig[task.priority];

  const formatViews = (views?: number) => {
    if (!views) return "0";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="bg-gray-900 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-500 transition-colors group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical size={14} className="text-gray-500 hover:text-gray-300 transition-colors" />
          </div>
          <span className={`text-xs px-1.5 py-0.5 rounded text-white ${platform.color}`}>
            {platform.icon} {platform.label}
          </span>
        </div>
        <span className={`text-xs ${priority.color}`}>
          {priority.label.split(" ")[0]}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Progress Bar */}
      {task.stage !== "published" && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span className="text-white">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                task.progress >= 75
                  ? "bg-green-500"
                  : task.progress >= 50
                  ? "bg-yellow-500"
                  : task.progress >= 25
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {task.editor_name && (
          <span className="flex items-center gap-1">
            <User size={12} />
            {task.editor_name}
          </span>
        )}
        {task.duration_seconds && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDuration(task.duration_seconds)}
          </span>
        )}
      </div>

      {/* Published Stats */}
      {task.stage === "published" && task.views && (
        <div className="mt-2 pt-2 border-t border-gray-800 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {formatViews(task.views)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp size={12} />
            {formatViews(task.likes)}
          </span>
        </div>
      )}
    </div>
  );
}

// Overlay Card
function VideoCard({ task }: { task: VideoTask }) {
  const platform = platformConfig[task.platform];

  return (
    <div className="bg-gray-900 border border-red-500 rounded-lg p-3 shadow-lg shadow-red-500/20 w-56">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-1.5 py-0.5 rounded text-white ${platform.color}`}>
          {platform.icon} {platform.label}
        </span>
      </div>
      <h4 className="text-sm font-medium text-white line-clamp-2">{task.title}</h4>
    </div>
  );
}

export default function VideoTrackerPage() {
  const [tasks, setTasks] = useState(demoVideoTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<VideoTask | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByStage = (stage: VideoStage) => tasks.filter((t) => t.stage === stage);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overStage = stages.find((s) => s.id === over.id);
    if (overStage && activeTask.stage !== overStage.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? {
                ...t,
                stage: overStage.id,
                progress: overStage.id === "published" ? 100 : t.progress,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );
      return;
    }

    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask && activeTask.stage !== overTask.stage) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? {
                ...t,
                stage: overTask.stage,
                progress: overTask.stage === "published" ? 100 : t.progress,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  // Stats
  const totalTasks = tasks.length;
  const inProgress = tasks.filter((t) => !["pre_production", "published"].includes(t.stage)).length;
  const published = tasks.filter((t) => t.stage === "published").length;
  const totalViews = tasks.reduce((acc, t) => acc + (t.views || 0), 0);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <div className="h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Video Production Tracker</h1>
          <p className="text-gray-400 mt-1">ลากและวางเพื่อจัดการงาน Video</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
        >
          <Plus size={16} />
          สร้างโปรเจค
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Video size={14} />
            โปรเจคทั้งหมด
          </div>
          <p className="text-2xl font-bold text-white mt-1">{totalTasks}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Film size={14} />
            กำลังดำเนินการ
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{inProgress}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <CheckCircle size={14} />
            เผยแพร่แล้ว
          </div>
          <p className="text-2xl font-bold text-green-400 mt-1">{published}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Eye size={14} />
            ยอดวิวรวม
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-1">{formatViews(totalViews)}</p>
        </div>
      </div>

      {/* Video Pipeline Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-5 gap-3 h-[calc(100%-11rem)] overflow-x-auto">
          {stages.map((stage) => {
            const stageTasks = getTasksByStage(stage.id);

            return (
              <div
                key={stage.id}
                className={`flex flex-col rounded-xl border border-gray-800 min-w-[200px] ${stage.bgColor}`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-sm flex items-center gap-2 ${stage.color}`}>
                      {stage.icon}
                      {stage.label}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                      {stageTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <SortableContext
                  items={stageTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                  id={stage.id}
                >
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
                    {stageTasks.map((task) => (
                      <SortableVideoCard
                        key={task.id}
                        task={task}
                        onClick={() => setSelectedTask(task)}
                      />
                    ))}

                    {stageTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-600 text-sm border-2 border-dashed border-gray-700 rounded-lg">
                        ลากมาวางที่นี่
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <VideoCard task={activeTask} /> : null}
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
                    className={`text-xs px-2 py-1 rounded text-white ${platformConfig[selectedTask.platform].color}`}
                  >
                    {platformConfig[selectedTask.platform].icon} {platformConfig[selectedTask.platform].label}
                  </span>
                  <span
                    className={`text-xs ${stages.find((s) => s.id === selectedTask.stage)?.color}`}
                  >
                    {stages.find((s) => s.id === selectedTask.stage)?.label}
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

            {/* Progress */}
            {selectedTask.stage !== "published" && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span className="text-white font-medium">{selectedTask.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      selectedTask.progress >= 75
                        ? "bg-green-500"
                        : selectedTask.progress >= 50
                        ? "bg-yellow-500"
                        : selectedTask.progress >= 25
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${selectedTask.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">ผู้รับผิดชอบ</p>
                <p className="text-white flex items-center gap-2">
                  <User size={14} />
                  {selectedTask.editor_name || "ยังไม่ได้มอบหมาย"}
                </p>
              </div>
              {selectedTask.duration_seconds && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">ความยาว</p>
                  <p className="text-white flex items-center gap-2">
                    <Clock size={14} />
                    {Math.floor(selectedTask.duration_seconds / 60)}:{(selectedTask.duration_seconds % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              )}
            </div>

            {/* Published Stats */}
            {selectedTask.stage === "published" && selectedTask.views && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 mb-2">Performance</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{formatViews(selectedTask.views)}</p>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                      <Eye size={12} /> Views
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{formatViews(selectedTask.likes || 0)}</p>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                      <ThumbsUp size={12} /> Likes
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedTask(null)}
              className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">สร้างโปรเจควิดีโอใหม่</h2>
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
                    <option value="medium">🟡 ปกติ</option>
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
