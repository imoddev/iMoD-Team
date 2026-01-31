// Demo Video Production Data

export type VideoStatus = "idea" | "scripting" | "filming" | "editing" | "review" | "published";

export interface VideoProject {
  id: string;
  title: string;
  description?: string;
  platform: "youtube" | "tiktok" | "shorts" | "reels";
  status: VideoStatus;
  priority: "urgent" | "high" | "medium" | "low";
  assigned_to?: string;
  editor_name?: string;
  duration_seconds?: number;
  deadline?: string;
  publish_date?: string;
  youtube_url?: string;
  views?: number;
  likes?: number;
  comments?: number;
  created_at: string;
  updated_at: string;
}

export const demoVideoProjects: VideoProject[] = [
  // Idea
  {
    id: "v1",
    title: "iPhone 17 Air vs iPhone 17 Pro — ซื้อรุ่นไหนดี?",
    description: "เปรียบเทียบสเปค ราคา ความคุ้มค่า",
    platform: "youtube",
    status: "idea",
    priority: "high",
    created_at: "2026-01-28T10:00:00Z",
    updated_at: "2026-01-28T10:00:00Z",
  },
  {
    id: "v2",
    title: "5 ฟีเจอร์ลับ iOS 19 ที่คนไม่รู้",
    description: "Tips & Tricks แบบสั้นๆ",
    platform: "shorts",
    status: "idea",
    priority: "medium",
    created_at: "2026-01-28T14:00:00Z",
    updated_at: "2026-01-28T14:00:00Z",
  },
  // Scripting
  {
    id: "v3",
    title: "Tesla Model Y 2026 — ลดราคาแล้วน่าซื้อไหม?",
    description: "รีวิว + วิเคราะห์ตลาด EV ไทย",
    platform: "youtube",
    status: "scripting",
    priority: "urgent",
    assigned_to: "u5",
    editor_name: "เจมส์",
    deadline: "2026-01-30T18:00:00Z",
    created_at: "2026-01-27T09:00:00Z",
    updated_at: "2026-01-29T08:00:00Z",
  },
  // Filming
  {
    id: "v4",
    title: "Unboxing MacBook Pro M5 Max",
    description: "แกะกล่อง + First Impression",
    platform: "youtube",
    status: "filming",
    priority: "high",
    assigned_to: "u5",
    editor_name: "เจมส์",
    deadline: "2026-01-31T18:00:00Z",
    created_at: "2026-01-26T11:00:00Z",
    updated_at: "2026-01-29T07:00:00Z",
  },
  // Editing
  {
    id: "v5",
    title: "BYD Seal vs Tesla Model 3 — ศึกรถไฟฟ้าซีดาน",
    description: "เปรียบเทียบขับจริง 2 สัปดาห์",
    platform: "youtube",
    status: "editing",
    priority: "high",
    assigned_to: "u6",
    editor_name: "นิว",
    duration_seconds: 1200,
    deadline: "2026-01-30T12:00:00Z",
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-01-28T16:00:00Z",
  },
  {
    id: "v6",
    title: "รีวิว AirPods Pro 3 — เสียงดีขึ้นจริงไหม?",
    description: "ทดสอบ ANC, Spatial Audio",
    platform: "youtube",
    status: "editing",
    priority: "medium",
    assigned_to: "u6",
    editor_name: "นิว",
    duration_seconds: 720,
    deadline: "2026-02-01T18:00:00Z",
    created_at: "2026-01-22T09:00:00Z",
    updated_at: "2026-01-28T14:00:00Z",
  },
  // Review
  {
    id: "v7",
    title: "Galaxy S26 Ultra — กล้อง 200MP ดีจริงไหม?",
    description: "รีวิวกล้องเชิงลึก + ตัวอย่างภาพ",
    platform: "youtube",
    status: "review",
    priority: "high",
    assigned_to: "u6",
    editor_name: "นิว",
    duration_seconds: 900,
    deadline: "2026-01-29T18:00:00Z",
    created_at: "2026-01-18T10:00:00Z",
    updated_at: "2026-01-28T17:00:00Z",
  },
  // Published
  {
    id: "v8",
    title: "สรุปงาน CES 2026 — 10 Gadgets ที่น่าสนใจ",
    platform: "youtube",
    status: "published",
    priority: "high",
    assigned_to: "u5",
    editor_name: "เจมส์",
    duration_seconds: 1500,
    publish_date: "2026-01-15T10:00:00Z",
    youtube_url: "https://youtube.com/watch?v=abc123",
    views: 125000,
    likes: 4200,
    comments: 320,
    created_at: "2026-01-10T09:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "v9",
    title: "ทำไม EV ถึงขายดีในไทย? วิเคราะห์ตลาด 2025",
    platform: "youtube",
    status: "published",
    priority: "medium",
    assigned_to: "u6",
    editor_name: "นิว",
    duration_seconds: 1080,
    publish_date: "2026-01-12T10:00:00Z",
    youtube_url: "https://youtube.com/watch?v=def456",
    views: 89000,
    likes: 3100,
    comments: 245,
    created_at: "2026-01-05T11:00:00Z",
    updated_at: "2026-01-12T10:00:00Z",
  },
  {
    id: "v10",
    title: "iPhone Fold จะมาจริงไหม? รวมข่าวหลุด",
    platform: "shorts",
    status: "published",
    priority: "low",
    assigned_to: "u5",
    editor_name: "เจมส์",
    duration_seconds: 58,
    publish_date: "2026-01-20T12:00:00Z",
    views: 450000,
    likes: 18500,
    comments: 890,
    created_at: "2026-01-19T14:00:00Z",
    updated_at: "2026-01-20T12:00:00Z",
  },
];

export const videoStatusConfig: Record<VideoStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  idea: { label: "💡 ไอเดีย", color: "text-purple-400", bgColor: "bg-purple-900/30", icon: "💡" },
  scripting: { label: "📝 เขียนสคริปต์", color: "text-blue-400", bgColor: "bg-blue-900/30", icon: "📝" },
  filming: { label: "🎬 ถ่ายทำ", color: "text-orange-400", bgColor: "bg-orange-900/30", icon: "🎬" },
  editing: { label: "✂️ ตัดต่อ", color: "text-yellow-400", bgColor: "bg-yellow-900/30", icon: "✂️" },
  review: { label: "👀 รอตรวจ", color: "text-pink-400", bgColor: "bg-pink-900/30", icon: "👀" },
  published: { label: "🚀 เผยแพร่แล้ว", color: "text-green-400", bgColor: "bg-green-900/30", icon: "🚀" },
};

export const platformConfig: Record<string, { label: string; color: string; icon: string }> = {
  youtube: { label: "YouTube", color: "bg-red-600", icon: "▶️" },
  shorts: { label: "Shorts", color: "bg-red-500", icon: "📱" },
  tiktok: { label: "TikTok", color: "bg-black", icon: "🎵" },
  reels: { label: "Reels", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: "📸" },
};

export const priorityConfig: Record<string, { label: string; color: string }> = {
  urgent: { label: "🔴 ด่วน", color: "text-red-400" },
  high: { label: "🟠 สำคัญ", color: "text-orange-400" },
  medium: { label: "🟡 ปกติ", color: "text-yellow-400" },
  low: { label: "🟢 ไม่เร่ง", color: "text-green-400" },
};
