/**
 * RSS Aggregator Library
 * Fetches and parses RSS feeds from various news sources
 */

// News source categories
export type NewsCategory = "apple" | "ev" | "tech" | "economy" | "gadgets";

// RSS Feed source definition
export interface RSSSource {
  name: string;
  url: string;
  feed_type: "rss" | "atom";
  category: NewsCategory;
}

// Parsed feed item
export interface FeedItem {
  id: string;
  title: string;
  link: string;
  description?: string;
  content?: string;
  pubDate: Date;
  author?: string;
  thumbnail?: string;
  source: string;
  category: NewsCategory;
}

// Aggregated feed result
export interface AggregatedFeed {
  items: FeedItem[];
  lastUpdated: Date;
  sources: number;
  errors: { source: string; error: string }[];
}

// Default news sources from seed data
export const NEWS_SOURCES: RSSSource[] = [
  // Apple & iOS
  { name: "9to5Mac", url: "https://9to5mac.com/feed/", feed_type: "rss", category: "apple" },
  { name: "MacRumors", url: "https://feeds.macrumors.com/MacRumors-All", feed_type: "rss", category: "apple" },
  { name: "AppleInsider", url: "https://appleinsider.com/rss/news/", feed_type: "rss", category: "apple" },

  // EV & Clean Energy
  { name: "Electrek", url: "https://electrek.co/feed/", feed_type: "rss", category: "ev" },
  { name: "InsideEVs", url: "https://insideevs.com/rss/news/all/", feed_type: "rss", category: "ev" },
  { name: "CarNewsChina", url: "https://carnewschina.com/feed/", feed_type: "rss", category: "ev" },
  { name: "CleanTechnica", url: "https://cleantechnica.com/feed/", feed_type: "rss", category: "ev" },

  // Tech
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", feed_type: "rss", category: "tech" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", feed_type: "rss", category: "tech" },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", feed_type: "rss", category: "tech" },

  // Economy
  { name: "Reuters Tech", url: "https://www.reuters.com/technology/rss", feed_type: "rss", category: "economy" },

  // Gadgets
  { name: "GSMArena", url: "https://www.gsmarena.com/rss-news-reviews.php3", feed_type: "rss", category: "gadgets" },
];

// Category labels in Thai
export const CATEGORY_LABELS: Record<NewsCategory, { label: string; color: string }> = {
  apple: { label: "Apple", color: "bg-gray-700" },
  ev: { label: "EV & พลังงาน", color: "bg-green-600" },
  tech: { label: "เทคโนโลยี", color: "bg-blue-600" },
  economy: { label: "เศรษฐกิจ", color: "bg-yellow-600" },
  gadgets: { label: "Gadgets", color: "bg-purple-600" },
};

/**
 * Parse RSS/Atom XML to extract feed items
 * Works in browser environment using DOMParser
 */
function parseRSSXML(xml: string, source: RSSSource): FeedItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items: FeedItem[] = [];

  // Check for RSS format
  const rssItems = doc.querySelectorAll("item");
  if (rssItems.length > 0) {
    rssItems.forEach((item, index) => {
      const title = item.querySelector("title")?.textContent?.trim() || "";
      const link = item.querySelector("link")?.textContent?.trim() || "";
      const description = item.querySelector("description")?.textContent?.trim();
      const content =
        item.querySelector("content\\:encoded")?.textContent?.trim() ||
        item.querySelector("encoded")?.textContent?.trim();
      const pubDateStr = item.querySelector("pubDate")?.textContent?.trim();
      const author =
        item.querySelector("author")?.textContent?.trim() ||
        item.querySelector("dc\\:creator")?.textContent?.trim() ||
        item.querySelector("creator")?.textContent?.trim();

      // Try to extract thumbnail from various sources
      let thumbnail: string | undefined =
        item.querySelector("media\\:thumbnail")?.getAttribute("url") ||
        item.querySelector("thumbnail")?.getAttribute("url") ||
        item.querySelector("enclosure[type^='image']")?.getAttribute("url") ||
        undefined;

      // Try to extract from content or description
      if (!thumbnail && (content || description)) {
        const imgMatch = (content || description || "").match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) {
          thumbnail = imgMatch[1];
        }
      }

      items.push({
        id: `${source.name}-${index}-${Date.now()}`,
        title,
        link,
        description: stripHtml(description),
        content: stripHtml(content),
        pubDate: pubDateStr ? new Date(pubDateStr) : new Date(),
        author,
        thumbnail,
        source: source.name,
        category: source.category,
      });
    });
    return items;
  }

  // Check for Atom format
  const atomEntries = doc.querySelectorAll("entry");
  if (atomEntries.length > 0) {
    atomEntries.forEach((entry, index) => {
      const title = entry.querySelector("title")?.textContent?.trim() || "";
      const link =
        entry.querySelector("link[rel='alternate']")?.getAttribute("href") ||
        entry.querySelector("link")?.getAttribute("href") ||
        "";
      const summary = entry.querySelector("summary")?.textContent?.trim();
      const content = entry.querySelector("content")?.textContent?.trim();
      const updatedStr =
        entry.querySelector("updated")?.textContent?.trim() ||
        entry.querySelector("published")?.textContent?.trim();
      const author = entry.querySelector("author name")?.textContent?.trim();

      let thumbnail: string | undefined = entry.querySelector("media\\:thumbnail")?.getAttribute("url") || undefined;
      if (!thumbnail && (content || summary)) {
        const imgMatch = (content || summary || "").match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) {
          thumbnail = imgMatch[1];
        }
      }

      items.push({
        id: `${source.name}-${index}-${Date.now()}`,
        title,
        link,
        description: stripHtml(summary),
        content: stripHtml(content),
        pubDate: updatedStr ? new Date(updatedStr) : new Date(),
        author,
        thumbnail,
        source: source.name,
        category: source.category,
      });
    });
  }

  return items;
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html?: string): string | undefined {
  if (!html) return undefined;
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch a single RSS feed
 */
export async function fetchFeed(source: RSSSource): Promise<FeedItem[]> {
  try {
    // Use a CORS proxy for client-side fetching
    const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(source.url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    return parseRSSXML(xml, source);
  } catch (error) {
    console.error(`Failed to fetch ${source.name}:`, error);
    throw error;
  }
}

/**
 * Fetch multiple RSS feeds and aggregate results
 */
export async function aggregateFeeds(
  sources: RSSSource[] = NEWS_SOURCES,
  options?: {
    categories?: NewsCategory[];
    limit?: number;
    sortBy?: "date" | "source";
  }
): Promise<AggregatedFeed> {
  const { categories, limit = 50, sortBy = "date" } = options || {};

  // Filter sources by category if specified
  const filteredSources = categories
    ? sources.filter((s) => categories.includes(s.category))
    : sources;

  const results = await Promise.allSettled(filteredSources.map((s) => fetchFeed(s)));

  const items: FeedItem[] = [];
  const errors: { source: string; error: string }[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    } else {
      errors.push({
        source: filteredSources[index].name,
        error: result.reason?.message || "Unknown error",
      });
    }
  });

  // Sort items
  if (sortBy === "date") {
    items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  } else {
    items.sort((a, b) => a.source.localeCompare(b.source));
  }

  return {
    items: items.slice(0, limit),
    lastUpdated: new Date(),
    sources: filteredSources.length - errors.length,
    errors,
  };
}

/**
 * Get sources by category
 */
export function getSourcesByCategory(category: NewsCategory): RSSSource[] {
  return NEWS_SOURCES.filter((s) => s.category === category);
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days < 7) return `${days} วันที่แล้ว`;

  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: days > 365 ? "numeric" : undefined,
  });
}

/**
 * Demo/mock data for development
 */
export const DEMO_FEED_ITEMS: FeedItem[] = [
  {
    id: "demo-1",
    title: "Apple เปิดตัว iPhone 17 Air - บางที่สุดเท่าที่เคยมี",
    link: "https://example.com/iphone-17-air",
    description: "Apple เปิดตัว iPhone 17 Air รุ่นใหม่ที่บางเพียง 5.5 มม. พร้อมชิป A19 Bionic และกล้อง 48MP",
    pubDate: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    source: "9to5Mac",
    category: "apple",
    thumbnail: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
  },
  {
    id: "demo-2",
    title: "Tesla ลดราคา Model Y ในไทยอีก 200,000 บาท",
    link: "https://example.com/tesla-model-y-price-cut",
    description: "Tesla ประกาศลดราคา Model Y ในประเทศไทย เริ่มต้นเพียง 1.59 ล้านบาท",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    source: "Electrek",
    category: "ev",
    thumbnail: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
  },
  {
    id: "demo-3",
    title: "BYD แซง Tesla ขึ้นแท่นผู้ผลิต EV อันดับ 1 ของโลก",
    link: "https://example.com/byd-overtakes-tesla",
    description: "BYD ทำยอดขาย EV สูงสุดในไตรมาส 4/2025 แซง Tesla เป็นครั้งแรก",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    source: "InsideEVs",
    category: "ev",
    thumbnail: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400",
  },
  {
    id: "demo-4",
    title: "MacBook Pro M5 Max - Benchmark หลุดแล้ว เร็วกว่าเดิม 40%",
    link: "https://example.com/macbook-m5-max-benchmark",
    description: "ผลทดสอบ Geekbench แสดงให้เห็นว่าชิป M5 Max มีประสิทธิภาพสูงกว่า M4 Max ถึง 40%",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    source: "MacRumors",
    category: "apple",
  },
  {
    id: "demo-5",
    title: "Samsung Galaxy S26 Ultra จะมาพร้อมกล้อง 200MP ใหม่",
    link: "https://example.com/galaxy-s26-ultra-camera",
    description: "รายงานล่าสุดเผย Samsung กำลังพัฒนาเซ็นเซอร์กล้อง 200MP ใหม่สำหรับ Galaxy S26 Ultra",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    source: "GSMArena",
    category: "gadgets",
  },
  {
    id: "demo-6",
    title: "NVIDIA RTX 5090 Ti เปิดตัวอย่างเป็นทางการ",
    link: "https://example.com/rtx-5090-ti",
    description: "NVIDIA เปิดตัว GeForce RTX 5090 Ti การ์ดจอเรือธงรุ่นใหม่พร้อม VRAM 32GB",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    source: "The Verge",
    category: "tech",
    thumbnail: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
  },
  {
    id: "demo-7",
    title: "Google Pixel 10 Pro กล้อง AI ที่ดีที่สุดในโลก?",
    link: "https://example.com/pixel-10-pro-camera",
    description: "รีวิว Google Pixel 10 Pro พร้อมระบบ AI Camera ใหม่ที่อัจฉริยะที่สุด",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    source: "TechCrunch",
    category: "tech",
  },
  {
    id: "demo-8",
    title: "Apple Vision Pro 2 จะมาพร้อมชิป M5 และราคาถูกลง",
    link: "https://example.com/vision-pro-2",
    description: "Apple กำลังพัฒนา Vision Pro 2 ที่จะมาพร้อมชิป M5 และราคาเริ่มต้นที่ $2,499",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    source: "AppleInsider",
    category: "apple",
  },
];
