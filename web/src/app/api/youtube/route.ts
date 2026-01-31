import { NextRequest, NextResponse } from "next/server";
import {
  getYouTubeAnalytics,
  fetchChannelStats,
  fetchTopVideos,
  YOUTUBE_CHANNELS,
} from "@/lib/youtube-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const channelId = searchParams.get("channelId");
  const channel = searchParams.get("channel"); // "iphonemod" or "evmod"

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    // Return demo data if API key is not configured
    return NextResponse.json({
      demo: true,
      message: "YouTube API key not configured. Showing demo data.",
      data: getDemoData(channel || "iphonemod"),
    });
  }

  // Resolve channel ID
  const resolvedChannelId =
    channelId ||
    (channel === "evmod"
      ? YOUTUBE_CHANNELS.evmod.id
      : YOUTUBE_CHANNELS.iphonemod.id);

  try {
    switch (action) {
      case "stats":
        const stats = await fetchChannelStats(resolvedChannelId, apiKey);
        return NextResponse.json({ data: stats });

      case "top-videos":
        const topVideos = await fetchTopVideos(resolvedChannelId, apiKey, 5);
        return NextResponse.json({ data: topVideos });

      case "analytics":
      default:
        const analytics = await getYouTubeAnalytics(resolvedChannelId, apiKey);
        return NextResponse.json({ data: analytics });
    }
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}

// Demo data when API key is not available
function getDemoData(channel: string) {
  if (channel === "evmod") {
    return {
      totalVideos: 32,
      totalViews: 890000,
      totalSubscribers: 15200,
      subscriberChange: 12,
      viewsChange: 18,
      watchTimeHours: 28000,
      topVideos: [
        {
          videoId: "ev1",
          title: "ทำไม EV ถึงขายดีในไทย?",
          viewCount: 89000,
          likeCount: 3100,
          thumbnailUrl: "",
        },
        {
          videoId: "ev2",
          title: "Tesla Model Y 2026 ลดราคา",
          viewCount: 67000,
          likeCount: 2400,
          thumbnailUrl: "",
        },
        {
          videoId: "ev3",
          title: "BYD แซง Tesla",
          viewCount: 54000,
          likeCount: 2100,
          thumbnailUrl: "",
        },
        {
          videoId: "ev4",
          title: "รีวิว MG4 Electric",
          viewCount: 45000,
          likeCount: 1800,
          thumbnailUrl: "",
        },
        {
          videoId: "ev5",
          title: "EV ไหนคุ้มสุด 2026",
          viewCount: 38000,
          likeCount: 1500,
          thumbnailUrl: "",
        },
      ],
    };
  }

  // iPhoneMod demo data
  return {
    totalVideos: 48,
    totalViews: 1800000,
    totalSubscribers: 125000,
    subscriberChange: 15,
    viewsChange: 24,
    watchTimeHours: 45000,
    topVideos: [
      {
        videoId: "vid1",
        title: "iPhone Fold จะมาจริงไหม? (Shorts)",
        viewCount: 450000,
        likeCount: 18500,
        thumbnailUrl: "",
      },
      {
        videoId: "vid2",
        title: "สรุปงาน CES 2026",
        viewCount: 125000,
        likeCount: 4200,
        thumbnailUrl: "",
      },
      {
        videoId: "vid3",
        title: "ทำไม EV ถึงขายดีในไทย?",
        viewCount: 89000,
        likeCount: 3100,
        thumbnailUrl: "",
      },
      {
        videoId: "vid4",
        title: "รีวิว Pixel 10 Pro",
        viewCount: 67000,
        likeCount: 2400,
        thumbnailUrl: "",
      },
      {
        videoId: "vid5",
        title: "MacBook Pro M5 Preview",
        viewCount: 54000,
        likeCount: 2100,
        thumbnailUrl: "",
      },
    ],
  };
}
