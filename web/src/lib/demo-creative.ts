// Demo Creative/Design Data

export type DesignType = "thumbnail" | "banner" | "infographic" | "social" | "logo" | "other";
export type DesignStatus = "requested" | "in_progress" | "review" | "revision" | "approved" | "delivered";

export interface DesignRequest {
  id: string;
  title: string;
  description?: string;
  design_type: DesignType;
  status: DesignStatus;
  priority: "urgent" | "high" | "medium" | "low";
  requested_by?: string;
  requester_name?: string;
  assigned_to?: string;
  designer_name?: string;
  platform?: string;
  dimensions?: string;
  reference_url?: string;
  file_url?: string;
  revision_count: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export const demoDesignRequests: DesignRequest[] = [
  // Requested
  {
    id: "d1",
    title: "Thumbnail: iPhone 17 Air Review",
    description: "ต้องการภาพที่โชว์ความบางของ iPhone 17 Air",
    design_type: "thumbnail",
    status: "requested",
    priority: "urgent",
    requested_by: "u3",
    requester_name: "ชาร์ท",
    platform: "YouTube",
    dimensions: "1280x720",
    revision_count: 0,
    deadline: "2026-01-30T12:00:00Z",
    created_at: "2026-01-29T08:00:00Z",
    updated_at: "2026-01-29T08:00:00Z",
  },
  {
    id: "d2",
    title: "Banner: โปร EV สงกรานต์",
    description: "Banner โปรโมทโปรรถยนต์ไฟฟ้าช่วงสงกรานต์",
    design_type: "banner",
    status: "requested",
    priority: "high",
    requested_by: "u8",
    requester_name: "ฟ้า",
    platform: "Website",
    dimensions: "1920x600",
    revision_count: 0,
    deadline: "2026-02-01T18:00:00Z",
    created_at: "2026-01-28T14:00:00Z",
    updated_at: "2026-01-28T14:00:00Z",
  },
  // In Progress
  {
    id: "d3",
    title: "Infographic: EV Sales 2025",
    description: "สรุปยอดขาย EV ไทย 2025 แบบ Infographic",
    design_type: "infographic",
    status: "in_progress",
    priority: "high",
    requested_by: "u3",
    requester_name: "ชาร์ท",
    assigned_to: "u7",
    designer_name: "พลอย",
    platform: "iPhoneMod + Social",
    dimensions: "1080x1920",
    revision_count: 0,
    deadline: "2026-01-30T18:00:00Z",
    created_at: "2026-01-27T10:00:00Z",
    updated_at: "2026-01-29T07:00:00Z",
  },
  // Review
  {
    id: "d4",
    title: "Thumbnail: Tesla Model Y ลดราคา",
    design_type: "thumbnail",
    status: "review",
    priority: "urgent",
    requested_by: "u5",
    requester_name: "เจมส์",
    assigned_to: "u7",
    designer_name: "พลอย",
    platform: "YouTube",
    dimensions: "1280x720",
    revision_count: 1,
    deadline: "2026-01-29T14:00:00Z",
    created_at: "2026-01-28T09:00:00Z",
    updated_at: "2026-01-29T06:00:00Z",
  },
  // Revision
  {
    id: "d5",
    title: "Social: Galaxy S26 vs iPhone 17",
    description: "ขอเปลี่ยนสีพื้นหลังเป็นโทนเข้มกว่านี้",
    design_type: "social",
    status: "revision",
    priority: "medium",
    requested_by: "u4",
    requester_name: "มิน",
    assigned_to: "u7",
    designer_name: "พลอย",
    platform: "Facebook/IG",
    dimensions: "1080x1080",
    revision_count: 2,
    deadline: "2026-01-30T12:00:00Z",
    created_at: "2026-01-26T11:00:00Z",
    updated_at: "2026-01-28T16:00:00Z",
  },
  // Approved
  {
    id: "d6",
    title: "Thumbnail: BYD vs Tesla",
    design_type: "thumbnail",
    status: "approved",
    priority: "high",
    requested_by: "u6",
    requester_name: "นิว",
    assigned_to: "u7",
    designer_name: "พลอย",
    platform: "YouTube",
    dimensions: "1280x720",
    revision_count: 1,
    file_url: "/designs/byd-tesla-thumb.jpg",
    deadline: "2026-01-29T10:00:00Z",
    created_at: "2026-01-25T09:00:00Z",
    updated_at: "2026-01-28T15:00:00Z",
  },
  // Delivered
  {
    id: "d7",
    title: "Infographic: CES 2026 Highlights",
    design_type: "infographic",
    status: "delivered",
    priority: "high",
    requested_by: "u3",
    requester_name: "ชาร์ท",
    assigned_to: "u7",
    designer_name: "พลอย",
    platform: "iPhoneMod",
    dimensions: "1080x2400",
    revision_count: 0,
    file_url: "/designs/ces-2026-info.jpg",
    deadline: "2026-01-15T18:00:00Z",
    completed_at: "2026-01-14T16:00:00Z",
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-01-14T16:00:00Z",
  },
  {
    id: "d8",
    title: "Banner: iPhoneMod New Year",
    design_type: "banner",
    status: "delivered",
    priority: "medium",
    requested_by: "u2",
    requester_name: "ซากุ",
    assigned_to: "u7",
    designer_name: "พลอย",
    platform: "Website",
    dimensions: "1920x400",
    revision_count: 1,
    file_url: "/designs/newyear-banner.jpg",
    completed_at: "2026-01-01T10:00:00Z",
    created_at: "2025-12-28T09:00:00Z",
    updated_at: "2026-01-01T10:00:00Z",
  },
];

export const designTypeConfig: Record<DesignType, { label: string; icon: string; color: string }> = {
  thumbnail: { label: "Thumbnail", icon: "🖼️", color: "bg-red-600" },
  banner: { label: "Banner", icon: "🎨", color: "bg-blue-600" },
  infographic: { label: "Infographic", icon: "📊", color: "bg-green-600" },
  social: { label: "Social Post", icon: "📱", color: "bg-purple-600" },
  logo: { label: "Logo", icon: "✨", color: "bg-yellow-600" },
  other: { label: "อื่นๆ", icon: "📁", color: "bg-gray-600" },
};

export const designStatusConfig: Record<DesignStatus, { label: string; color: string; bgColor: string }> = {
  requested: { label: "📥 รอรับงาน", color: "text-gray-400", bgColor: "bg-gray-800" },
  in_progress: { label: "🎨 กำลังออกแบบ", color: "text-blue-400", bgColor: "bg-blue-900/30" },
  review: { label: "👀 รอตรวจ", color: "text-yellow-400", bgColor: "bg-yellow-900/30" },
  revision: { label: "🔄 แก้ไข", color: "text-orange-400", bgColor: "bg-orange-900/30" },
  approved: { label: "✅ อนุมัติ", color: "text-green-400", bgColor: "bg-green-900/30" },
  delivered: { label: "📤 ส่งมอบแล้ว", color: "text-emerald-400", bgColor: "bg-emerald-900/30" },
};

export const priorityConfig: Record<string, { label: string; color: string }> = {
  urgent: { label: "🔴 ด่วน", color: "text-red-400 border-red-500/30 bg-red-500/10" },
  high: { label: "🟠 สำคัญ", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  medium: { label: "🟡 ปกติ", color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  low: { label: "🟢 ไม่เร่ง", color: "text-green-400 border-green-500/30 bg-green-500/10" },
};
