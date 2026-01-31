/**
 * YouTube Data API Integration
 * Fetches real channel and video statistics from YouTube
 */

export interface YouTubeChannelStats {
  channelId: string;
  channelName: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  thumbnailUrl?: string;
}

export interface YouTubeVideoStats {
  videoId: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string;
  duration?: string;
}

export interface YouTubeAnalytics {
  totalVideos: number;
  totalViews: number;
  totalSubscribers: number;
  subscriberChange: number;
  viewsChange: number;
  topVideos: YouTubeVideoStats[];
  recentVideos: YouTubeVideoStats[];
  watchTimeHours?: number;
}

// iPhoneMod and EVMoD Channel IDs
export const YOUTUBE_CHANNELS = {
  iphonemod: {
    id: "UCC1hWOd-EtRNuqVKkOyPLXQ", // @imodofficial channel ID
    name: "iPhoneMod",
  },
  evmod: {
    id: "UC1234567890", // TODO: Add EVMoD channel ID when available
    name: "EVMoD",
  },
};

/**
 * Fetch channel statistics from YouTube API
 */
export async function fetchChannelStats(
  channelId: string,
  apiKey: string
): Promise<YouTubeChannelStats | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("YouTube API error:", response.status, errorBody);
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const channel = data.items[0];
    return {
      channelId: channel.id,
      channelName: channel.snippet.title,
      subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
      videoCount: parseInt(channel.statistics.videoCount) || 0,
      viewCount: parseInt(channel.statistics.viewCount) || 0,
      thumbnailUrl: channel.snippet.thumbnails?.default?.url,
    };
  } catch (error) {
    console.error("Error fetching channel stats:", error);
    return null;
  }
}

/**
 * Fetch recent videos from a channel
 */
export async function fetchChannelVideos(
  channelId: string,
  apiKey: string,
  maxResults: number = 10
): Promise<YouTubeVideoStats[]> {
  try {
    // First, get the uploads playlist ID
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      return [];
    }

    const uploadsPlaylistId =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from uploads playlist
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`;
    const playlistResponse = await fetch(playlistUrl);
    const playlistData = await playlistResponse.json();

    if (!playlistData.items) {
      return [];
    }

    // Get video IDs
    const videoIds = playlistData.items
      .map((item: { contentDetails: { videoId: string } }) => item.contentDetails.videoId)
      .join(",");

    // Fetch video statistics
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    if (!videosData.items) {
      return [];
    }

    return videosData.items.map((video: {
      id: string;
      snippet: {
        title: string;
        publishedAt: string;
        thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
      };
      statistics: {
        viewCount?: string;
        likeCount?: string;
        commentCount?: string;
      };
      contentDetails?: {
        duration?: string;
      };
    }) => ({
      videoId: video.id,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
      viewCount: parseInt(video.statistics.viewCount || "0"),
      likeCount: parseInt(video.statistics.likeCount || "0"),
      commentCount: parseInt(video.statistics.commentCount || "0"),
      thumbnailUrl:
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.medium?.url ||
        video.snippet.thumbnails.default?.url ||
        "",
      duration: video.contentDetails?.duration,
    }));
  } catch (error) {
    console.error("Error fetching channel videos:", error);
    return [];
  }
}

/**
 * Fetch top videos by view count
 */
export async function fetchTopVideos(
  channelId: string,
  apiKey: string,
  maxResults: number = 10
): Promise<YouTubeVideoStats[]> {
  try {
    // Search for videos from channel, ordered by view count
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=${maxResults}&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.items) {
      return [];
    }

    // Get video IDs
    const videoIds = searchData.items
      .map((item: { id: { videoId: string } }) => item.id.videoId)
      .join(",");

    // Fetch video statistics
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    if (!videosData.items) {
      return [];
    }

    return videosData.items.map((video: {
      id: string;
      snippet: {
        title: string;
        publishedAt: string;
        thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
      };
      statistics: {
        viewCount?: string;
        likeCount?: string;
        commentCount?: string;
      };
    }) => ({
      videoId: video.id,
      title: video.snippet.title,
      publishedAt: video.snippet.publishedAt,
      viewCount: parseInt(video.statistics.viewCount || "0"),
      likeCount: parseInt(video.statistics.likeCount || "0"),
      commentCount: parseInt(video.statistics.commentCount || "0"),
      thumbnailUrl:
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.medium?.url ||
        video.snippet.thumbnails.default?.url ||
        "",
    }));
  } catch (error) {
    console.error("Error fetching top videos:", error);
    return [];
  }
}

/**
 * Get combined YouTube analytics for reports
 */
export async function getYouTubeAnalytics(
  channelId: string,
  apiKey: string
): Promise<YouTubeAnalytics | null> {
  try {
    const [channelStats, topVideos, recentVideos] = await Promise.all([
      fetchChannelStats(channelId, apiKey),
      fetchTopVideos(channelId, apiKey, 5),
      fetchChannelVideos(channelId, apiKey, 10),
    ]);

    if (!channelStats) {
      return null;
    }

    return {
      totalVideos: channelStats.videoCount,
      totalViews: channelStats.viewCount,
      totalSubscribers: channelStats.subscriberCount,
      subscriberChange: 15, // TODO: Calculate from historical data
      viewsChange: 24, // TODO: Calculate from historical data
      topVideos,
      recentVideos,
      watchTimeHours: Math.round(channelStats.viewCount * 0.05), // Rough estimate
    };
  } catch (error) {
    console.error("Error getting YouTube analytics:", error);
    return null;
  }
}

/**
 * Format large numbers for display (e.g., 1500000 -> "1.5M")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Parse ISO 8601 duration to human readable format
 */
export function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
