// Demo Dashboard Data - Enhanced

export interface DashboardStats {
  clients: { total: number; change: number };
  campaigns: { active: number; change: number };
  revenue: { total: number; change: number };
  reach: { total: number; change: number };
}

export interface PipelineItem {
  stage: string;
  count: number;
  value: number;
  color: string;
}

export interface RecentCampaign {
  id: string;
  clientName: string;
  campaignName: string;
  status: "active" | "completed" | "pending";
  budget: number;
  reach: number;
  endDate: string;
}

export interface TeamActivity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  type: "content" | "video" | "design" | "campaign";
  assignee: string;
  deadline: string;
  priority: "urgent" | "high" | "medium" | "low";
}

export const dashboardStats: DashboardStats = {
  clients: { total: 12, change: 20 },
  campaigns: { active: 8, change: 14 },
  revenue: { total: 2850000, change: 18 },
  reach: { total: 4200000, change: 25 },
};

export const pipelineData: PipelineItem[] = [
  { stage: "Lead", count: 5, value: 750000, color: "bg-gray-500" },
  { stage: "ติดต่อแล้ว", count: 3, value: 450000, color: "bg-blue-500" },
  { stage: "เสนอราคา", count: 4, value: 1200000, color: "bg-yellow-500" },
  { stage: "เจรจา", count: 2, value: 600000, color: "bg-orange-500" },
  { stage: "ปิดงาน", count: 8, value: 2850000, color: "bg-green-500" },
];

export const recentCampaigns: RecentCampaign[] = [
  {
    id: "rc1",
    clientName: "OPPO Thailand",
    campaignName: "OPPO Reno 12 Launch",
    status: "active",
    budget: 500000,
    reach: 850000,
    endDate: "2026-02-28",
  },
  {
    id: "rc2",
    clientName: "Samsung Thailand",
    campaignName: "Galaxy S26 Pre-order",
    status: "active",
    budget: 750000,
    reach: 1200000,
    endDate: "2026-02-15",
  },
  {
    id: "rc3",
    clientName: "BYD Thailand",
    campaignName: "BYD Seal Launch TH",
    status: "active",
    budget: 600000,
    reach: 920000,
    endDate: "2026-03-15",
  },
  {
    id: "rc4",
    clientName: "OPPO Thailand",
    campaignName: "OPPO Find X8 Review",
    status: "completed",
    budget: 350000,
    reach: 680000,
    endDate: "2026-01-15",
  },
  {
    id: "rc5",
    clientName: "Xiaomi Thailand",
    campaignName: "Xiaomi 15 Ultra Launch",
    status: "pending",
    budget: 400000,
    reach: 0,
    endDate: "2026-03-01",
  },
];

export const teamActivities: TeamActivity[] = [
  {
    id: "a1",
    user: "ชาร์ท",
    avatar: "ช",
    action: "เสร็จบทความ",
    target: "รีวิว iPhone 17 Air",
    time: "5 นาทีที่แล้ว",
  },
  {
    id: "a2",
    user: "นิว",
    avatar: "น",
    action: "อัปโหลดวิดีโอ",
    target: "BYD vs Tesla ศึกรถไฟฟ้า",
    time: "15 นาทีที่แล้ว",
  },
  {
    id: "a3",
    user: "พลอย",
    avatar: "พ",
    action: "ส่งงาน",
    target: "Thumbnail Galaxy S26",
    time: "32 นาทีที่แล้ว",
  },
  {
    id: "a4",
    user: "มิน",
    avatar: "ม",
    action: "เริ่มเขียน",
    target: "Tesla Model Y ลดราคา",
    time: "1 ชม.ที่แล้ว",
  },
  {
    id: "a5",
    user: "เจมส์",
    avatar: "จ",
    action: "ถ่ายทำเสร็จ",
    target: "Unboxing MacBook Pro M5",
    time: "2 ชม.ที่แล้ว",
  },
];

export const upcomingDeadlines: UpcomingDeadline[] = [
  {
    id: "d1",
    title: "Tesla Model Y ลดราคา",
    type: "content",
    assignee: "มิน",
    deadline: "2026-01-29T12:00:00Z",
    priority: "urgent",
  },
  {
    id: "d2",
    title: "Thumbnail BYD vs Tesla",
    type: "design",
    assignee: "พลอย",
    deadline: "2026-01-29T14:00:00Z",
    priority: "urgent",
  },
  {
    id: "d3",
    title: "iPhone 17 Air Review",
    type: "content",
    assignee: "ชาร์ท",
    deadline: "2026-01-30T18:00:00Z",
    priority: "high",
  },
  {
    id: "d4",
    title: "BYD vs Tesla Video",
    type: "video",
    assignee: "นิว",
    deadline: "2026-01-30T12:00:00Z",
    priority: "high",
  },
  {
    id: "d5",
    title: "EV Sales Infographic",
    type: "design",
    assignee: "พลอย",
    deadline: "2026-01-30T18:00:00Z",
    priority: "high",
  },
];

export const quickStats = {
  todayPublished: 3,
  pendingReview: 5,
  overdueTask: 1,
  teamOnline: 8,
};

export const platformStats = [
  { platform: "iPhoneMod", articles: 89, videos: 34, reach: 2800000 },
  { platform: "EVMoD", articles: 45, videos: 18, reach: 1400000 },
];

export const weeklyTrend = [
  { day: "จ", content: 4, video: 2 },
  { day: "อ", content: 3, video: 1 },
  { day: "พ", content: 5, video: 2 },
  { day: "พฤ", content: 4, video: 3 },
  { day: "ศ", content: 6, video: 2 },
  { day: "ส", content: 2, video: 1 },
  { day: "อา", content: 1, video: 0 },
];
