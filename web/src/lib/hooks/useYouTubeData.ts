"use client";

import { useState, useEffect, useCallback } from "react";
import { formatNumber } from "@/lib/youtube-api";

export interface YouTubeStats {
  totalVideos: number;
  totalViews: number;
  totalSubscribers: number;
  subscriberChange: number;
  viewsChange: number;
  watchTimeHours: number;
  topVideos: {
    videoId: string;
    title: string;
    viewCount: number;
    likeCount: number;
    thumbnailUrl?: string;
  }[];
}

export interface UseYouTubeDataResult {
  data: YouTubeStats | null;
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  refetch: () => void;
}

export function useYouTubeData(channel: "iphonemod" | "evmod" = "iphonemod"): UseYouTubeDataResult {
  const [data, setData] = useState<YouTubeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/youtube?channel=${channel}&action=analytics`);
      const result = await response.json();

      if (result.demo) {
        setIsDemo(true);
        setData(result.data);
      } else if (result.data) {
        setIsDemo(false);
        setData(result.data);
      } else {
        setError("ไม่สามารถดึงข้อมูลจาก YouTube ได้");
      }
    } catch (err) {
      console.error("Error fetching YouTube data:", err);
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setLoading(false);
    }
  }, [channel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, isDemo, refetch: fetchData };
}

// Helper to format stats for display
export function formatYouTubeStats(data: YouTubeStats | null) {
  if (!data) return null;

  return {
    totalVideos: data.totalVideos.toString(),
    totalViews: formatNumber(data.totalViews),
    totalSubscribers: "+" + formatNumber(data.totalSubscribers),
    subscriberChange: data.subscriberChange,
    viewsChange: data.viewsChange,
    watchTimeHours: formatNumber(data.watchTimeHours) + " hrs",
    topVideos: data.topVideos.map((v) => ({
      ...v,
      viewsFormatted: formatNumber(v.viewCount),
      likesFormatted: formatNumber(v.likeCount),
    })),
  };
}
