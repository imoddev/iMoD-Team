// Demo Social Stats Data - Facebook Insights Style

export interface SocialPost {
  id: string;
  postId: string;
  platform: "facebook" | "instagram" | "youtube" | "tiktok";
  pageName: string;
  pageAvatar: string;
  content: string;
  thumbnail?: string;
  postDate: string;
  postUrl: string;
  
  // Overview Stats
  views: number;
  engagement: number;
  linkClicks: number;
  newFollowers: number;
  
  // Engagement Breakdown
  reactions: number;
  comments: number;
  shares: number;
  saves: number;
  
  // Audience
  reach: number;
  uniqueViewers: number;
  
  // View Timeline (for chart)
  viewTimeline: {
    time: string;
    views: number;
    avgViews: number;
  }[];
  
  // Campaign link (optional)
  campaignId?: string;
  clientId?: string;
}

export interface SocialPage {
  id: string;
  name: string;
  platform: "facebook" | "instagram" | "youtube" | "tiktok";
  avatar: string;
  followers: number;
  pageId: string;
}

// Demo Pages
export const demoSocialPages: SocialPage[] = [
  {
    id: "page-1",
    name: "iPhoneMod",
    platform: "facebook",
    avatar: "📱",
    followers: 2850000,
    pageId: "iphonemod",
  },
  {
    id: "page-2",
    name: "EVMoD",
    platform: "facebook",
    avatar: "🚗",
    followers: 450000,
    pageId: "evmod",
  },
  {
    id: "page-3",
    name: "iPhoneMod",
    platform: "youtube",
    avatar: "📱",
    followers: 1200000,
    pageId: "iphonemod-yt",
  },
];

// Demo Posts
export const demoSocialPosts: SocialPost[] = [
  {
    id: "post-1",
    postId: "fb-123456789",
    platform: "facebook",
    pageName: "iPhoneMod",
    pageAvatar: "📱",
    content: "สื่อเผย iPhone Air 2 บางสุดในโลก เปิดตัวมีนาคมนี้!",
    thumbnail: "/demo/iphone-air.jpg",
    postDate: "2026-01-27T14:39:00Z",
    postUrl: "https://facebook.com/iphonemod/posts/123456789",
    
    views: 17422,
    engagement: 106,
    linkClicks: 0,
    newFollowers: 0,
    
    reactions: 98,
    comments: 2,
    shares: 5,
    saves: 1,
    
    reach: 17422,
    uniqueViewers: 12285,
    
    viewTimeline: [
      { time: "15 นาที", views: 1200, avgViews: 800 },
      { time: "4 ชั่วโมง", views: 8500, avgViews: 12000 },
      { time: "9 ชั่วโมง", views: 12800, avgViews: 15000 },
      { time: "16 ชั่วโมง", views: 15200, avgViews: 16500 },
      { time: "1 วัน 6 ชม.", views: 16800, avgViews: 17000 },
      { time: "3 วัน", views: 17200, avgViews: 17200 },
      { time: "7 วัน", views: 17422, avgViews: 17300 },
    ],
  },
  {
    id: "post-2",
    postId: "fb-987654321",
    platform: "facebook",
    pageName: "iPhoneMod",
    pageAvatar: "📱",
    content: "รีวิว MacBook Pro M5 Max แรงจัด ตัดต่อ 8K ลื่นมาก!",
    postDate: "2026-01-26T10:00:00Z",
    postUrl: "https://facebook.com/iphonemod/posts/987654321",
    
    views: 45680,
    engagement: 892,
    linkClicks: 234,
    newFollowers: 45,
    
    reactions: 756,
    comments: 89,
    shares: 42,
    saves: 5,
    
    reach: 45680,
    uniqueViewers: 38420,
    
    viewTimeline: [
      { time: "15 นาที", views: 5200, avgViews: 800 },
      { time: "4 ชั่วโมง", views: 18500, avgViews: 12000 },
      { time: "9 ชั่วโมง", views: 28800, avgViews: 15000 },
      { time: "16 ชั่วโมง", views: 35200, avgViews: 16500 },
      { time: "1 วัน 6 ชม.", views: 40800, avgViews: 17000 },
      { time: "3 วัน", views: 44200, avgViews: 17200 },
      { time: "7 วัน", views: 45680, avgViews: 17300 },
    ],
    
    campaignId: "camp-1",
    clientId: "client-1",
  },
  {
    id: "post-3",
    postId: "fb-456789123",
    platform: "facebook",
    pageName: "EVMoD",
    pageAvatar: "🚗",
    content: "BYD Seal เปิดราคาไทย 1.19 ล้าน คุ้มสุดในคลาส!",
    postDate: "2026-01-25T16:30:00Z",
    postUrl: "https://facebook.com/evmod/posts/456789123",
    
    views: 89420,
    engagement: 2450,
    linkClicks: 567,
    newFollowers: 128,
    
    reactions: 1890,
    comments: 312,
    shares: 234,
    saves: 14,
    
    reach: 89420,
    uniqueViewers: 72340,
    
    viewTimeline: [
      { time: "15 นาที", views: 8200, avgViews: 3000 },
      { time: "4 ชั่วโมง", views: 35500, avgViews: 20000 },
      { time: "9 ชั่วโมง", views: 52800, avgViews: 35000 },
      { time: "16 ชั่วโมง", views: 68200, avgViews: 45000 },
      { time: "1 วัน 6 ชม.", views: 78800, avgViews: 55000 },
      { time: "3 วัน", views: 85200, avgViews: 60000 },
      { time: "7 วัน", views: 89420, avgViews: 62000 },
    ],
    
    campaignId: "camp-2",
    clientId: "client-2",
  },
  {
    id: "post-4",
    postId: "fb-789123456",
    platform: "facebook",
    pageName: "iPhoneMod",
    pageAvatar: "📱",
    content: "OPPO Find X8 Ultra กล้อง Hasselblad รุ่นใหม่ ถ่ายสวยขึ้นอีก!",
    postDate: "2026-01-24T09:15:00Z",
    postUrl: "https://facebook.com/iphonemod/posts/789123456",
    
    views: 32150,
    engagement: 678,
    linkClicks: 145,
    newFollowers: 23,
    
    reactions: 534,
    comments: 67,
    shares: 72,
    saves: 5,
    
    reach: 32150,
    uniqueViewers: 28900,
    
    viewTimeline: [
      { time: "15 นาที", views: 2800, avgViews: 800 },
      { time: "4 ชั่วโมง", views: 12500, avgViews: 12000 },
      { time: "9 ชั่วโมง", views: 19800, avgViews: 15000 },
      { time: "16 ชั่วโมง", views: 25200, avgViews: 16500 },
      { time: "1 วัน 6 ชม.", views: 29800, avgViews: 17000 },
      { time: "3 วัน", views: 31200, avgViews: 17200 },
      { time: "7 วัน", views: 32150, avgViews: 17300 },
    ],
    
    campaignId: "camp-3",
    clientId: "client-3",
  },
  {
    id: "post-5",
    postId: "fb-321654987",
    platform: "facebook",
    pageName: "EVMoD",
    pageAvatar: "🚗",
    content: "Tesla Model Y 2026 ลดราคาเหลือ 1.29 ล้าน แข่ง BYD!",
    postDate: "2026-01-23T11:00:00Z",
    postUrl: "https://facebook.com/evmod/posts/321654987",
    
    views: 125890,
    engagement: 4520,
    linkClicks: 892,
    newFollowers: 256,
    
    reactions: 3450,
    comments: 678,
    shares: 378,
    saves: 14,
    
    reach: 125890,
    uniqueViewers: 98760,
    
    viewTimeline: [
      { time: "15 นาที", views: 15200, avgViews: 3000 },
      { time: "4 ชั่วโมง", views: 52500, avgViews: 20000 },
      { time: "9 ชั่วโมง", views: 78800, avgViews: 35000 },
      { time: "16 ชั่วโมง", views: 95200, avgViews: 45000 },
      { time: "1 วัน 6 ชม.", views: 112800, avgViews: 55000 },
      { time: "3 วัน", views: 121200, avgViews: 60000 },
      { time: "7 วัน", views: 125890, avgViews: 62000 },
    ],
  },
];

// Helper functions
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString("th-TH");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days} วันที่แล้ว`;
  if (hours > 0) return `${hours} ชั่วโมงที่แล้ว`;
  if (minutes > 0) return `${minutes} นาทีที่แล้ว`;
  return "เมื่อกี้";
}
