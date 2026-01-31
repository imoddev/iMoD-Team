import { NextRequest, NextResponse } from "next/server";

/**
 * RSS Proxy API Route
 * Proxies RSS feed requests to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // Validate URL
    const feedUrl = new URL(url);
    if (!["http:", "https:"].includes(feedUrl.protocol)) {
      return NextResponse.json({ error: "Invalid URL protocol" }, { status: 400 });
    }

    // Fetch the RSS feed
    const response = await fetch(feedUrl.toString(), {
      headers: {
        "User-Agent": "iMoD-Team-RSS-Aggregator/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml",
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "text/xml";
    const text = await response.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("RSS Proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
