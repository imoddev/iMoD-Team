/**
 * PDF Report Generator Library
 * Generates Campaign Reports using @react-pdf/renderer
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register Thai font
Font.register({
  family: "NotoSansThai",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/notosansthai/v25/iJWQBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKV1Rqw.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/notosansthai/v25/iJWQBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcdFN6V1Rqw.ttf",
      fontWeight: 700,
    },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "NotoSansThai",
  },
  header: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  col2: {
    flex: 1,
    paddingHorizontal: 5,
  },
  col3: {
    width: "33.33%",
    paddingHorizontal: 5,
  },
  col4: {
    width: "25%",
    paddingHorizontal: 5,
  },
  statCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 10,
    color: "#666666",
  },
  statChange: {
    fontSize: 10,
    marginTop: 5,
  },
  statPositive: {
    color: "#22c55e",
  },
  statNegative: {
    color: "#ef4444",
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 700,
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 10,
    color: "#374151",
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  chartText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
  },
  badgeSuccess: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  badgeWarning: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  badgeInfo: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  summaryBox: {
    backgroundColor: "#f0f9ff",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    padding: 15,
    marginTop: 10,
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 11,
    color: "#1e40af",
    lineHeight: 1.5,
  },
});

// Types
export interface CampaignReportData {
  // Campaign Info
  campaignName: string;
  clientName: string;
  reportPeriod: string;
  generatedDate: string;

  // Overview Stats
  totalReach: number;
  totalEngagement: number;
  totalImpressions: number;
  totalClicks: number;
  reachChange?: number;
  engagementChange?: number;
  impressionsChange?: number;
  clicksChange?: number;

  // Platform Breakdown
  platforms: {
    name: string;
    reach: number;
    engagement: number;
    posts: number;
    topPost?: string;
  }[];

  // Content Performance
  topContent: {
    title: string;
    platform: string;
    reach: number;
    engagement: number;
    date: string;
  }[];

  // Summary
  summary: string;
  recommendations?: string[];
}

// Helper to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

// Campaign Report Document Component
export function CampaignReportDocument({ data }: { data: CampaignReportData }) {
  return (
    <Document>
      {/* Page 1: Overview */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{data.campaignName}</Text>
          <Text style={styles.subtitle}>
            Campaign Report • {data.reportPeriod}
          </Text>
          <Text style={[styles.subtitle, { marginTop: 5 }]}>
            Client: {data.clientName}
          </Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ภาพรวม Campaign</Text>
          <View style={styles.row}>
            <View style={styles.col4}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatNumber(data.totalReach)}
                </Text>
                <Text style={styles.statLabel}>Total Reach</Text>
                {data.reachChange !== undefined && (
                  <Text
                    style={[
                      styles.statChange,
                      data.reachChange >= 0
                        ? styles.statPositive
                        : styles.statNegative,
                    ]}
                  >
                    {data.reachChange >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(data.reachChange)}%
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.col4}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatNumber(data.totalEngagement)}
                </Text>
                <Text style={styles.statLabel}>Engagement</Text>
                {data.engagementChange !== undefined && (
                  <Text
                    style={[
                      styles.statChange,
                      data.engagementChange >= 0
                        ? styles.statPositive
                        : styles.statNegative,
                    ]}
                  >
                    {data.engagementChange >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(data.engagementChange)}%
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.col4}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatNumber(data.totalImpressions)}
                </Text>
                <Text style={styles.statLabel}>Impressions</Text>
                {data.impressionsChange !== undefined && (
                  <Text
                    style={[
                      styles.statChange,
                      data.impressionsChange >= 0
                        ? styles.statPositive
                        : styles.statNegative,
                    ]}
                  >
                    {data.impressionsChange >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(data.impressionsChange)}%
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.col4}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatNumber(data.totalClicks)}
                </Text>
                <Text style={styles.statLabel}>Clicks</Text>
                {data.clicksChange !== undefined && (
                  <Text
                    style={[
                      styles.statChange,
                      data.clicksChange >= 0
                        ? styles.statPositive
                        : styles.statNegative,
                    ]}
                  >
                    {data.clicksChange >= 0 ? "▲" : "▼"}{" "}
                    {Math.abs(data.clicksChange)}%
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Platform Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance by Platform</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "25%" }]}>
                Platform
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                Reach
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                Engagement
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "15%" }]}>
                Posts
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                Top Content
              </Text>
            </View>
            {data.platforms.map((platform, index) => (
              <View
                key={platform.name}
                style={[
                  styles.tableRow,
                  ...(index % 2 === 1 ? [styles.tableRowAlt] : []),
                ]}
              >
                <Text style={[styles.tableCell, { width: "25%", fontWeight: 700 }]}>
                  {platform.name}
                </Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>
                  {formatNumber(platform.reach)}
                </Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>
                  {formatNumber(platform.engagement)}
                </Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>
                  {platform.posts}
                </Text>
                <Text
                  style={[styles.tableCell, { width: "20%", fontSize: 8 }]}
                >
                  {platform.topPost || "-"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>สรุปผลการดำเนินงาน</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by iMoD Team • {data.generatedDate}
          </Text>
          <Text style={styles.footerText}>Page 1 of 2</Text>
        </View>
      </Page>

      {/* Page 2: Top Content & Recommendations */}
      <Page size="A4" style={styles.page}>
        {/* Top Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Content</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "35%" }]}>
                Content
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "15%" }]}>
                Platform
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "15%" }]}>
                Reach
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "15%" }]}>
                Engagement
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                Date
              </Text>
            </View>
            {data.topContent.map((content, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  ...(index % 2 === 1 ? [styles.tableRowAlt] : []),
                ]}
              >
                <Text
                  style={[styles.tableCell, { width: "35%" }]}
                >
                  {content.title}
                </Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>
                  {content.platform}
                </Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>
                  {formatNumber(content.reach)}
                </Text>
                <Text style={[styles.tableCell, { width: "15%" }]}>
                  {formatNumber(content.engagement)}
                </Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>
                  {content.date}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ข้อเสนอแนะ</Text>
            {data.recommendations.map((rec, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", marginBottom: 8 }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#3b82f6",
                    marginRight: 8,
                    fontWeight: 700,
                  }}
                >
                  {index + 1}.
                </Text>
                <Text style={{ fontSize: 11, color: "#374151", flex: 1 }}>
                  {rec}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement Trend</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>
              📊 Engagement trend chart will be rendered here
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <View
            style={{
              backgroundColor: "#1e293b",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 10,
              }}
            >
              ติดต่อเรา
            </Text>
            <Text style={{ fontSize: 10, color: "#94a3b8", marginBottom: 5 }}>
              iMoD Team - Digital Media Agency
            </Text>
            <Text style={{ fontSize: 10, color: "#94a3b8", marginBottom: 5 }}>
              Email: contact@imod.co.th
            </Text>
            <Text style={{ fontSize: 10, color: "#94a3b8" }}>
              Website: www.iphonemod.net
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by iMoD Team • {data.generatedDate}
          </Text>
          <Text style={styles.footerText}>Page 2 of 2</Text>
        </View>
      </Page>
    </Document>
  );
}

// Demo data for testing
export const DEMO_CAMPAIGN_REPORT: CampaignReportData = {
  campaignName: "iPhone 17 Launch Campaign",
  clientName: "Apple Thailand",
  reportPeriod: "1 - 31 มกราคม 2026",
  generatedDate: new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),

  totalReach: 2450000,
  totalEngagement: 185000,
  totalImpressions: 5800000,
  totalClicks: 42000,
  reachChange: 15.5,
  engagementChange: 22.3,
  impressionsChange: 18.7,
  clicksChange: -3.2,

  platforms: [
    {
      name: "Facebook",
      reach: 1200000,
      engagement: 85000,
      posts: 15,
      topPost: "iPhone 17 Air Unboxing",
    },
    {
      name: "YouTube",
      reach: 650000,
      engagement: 45000,
      posts: 8,
      topPost: "รีวิว iPhone 17 Pro Max",
    },
    {
      name: "Instagram",
      reach: 400000,
      engagement: 35000,
      posts: 20,
      topPost: "iPhone 17 Camera Test",
    },
    {
      name: "TikTok",
      reach: 200000,
      engagement: 20000,
      posts: 12,
      topPost: "#iPhone17Challenge",
    },
  ],

  topContent: [
    {
      title: "รีวิว iPhone 17 Air - บางที่สุดเท่าที่เคยมี",
      platform: "YouTube",
      reach: 450000,
      engagement: 32000,
      date: "15 ม.ค. 2026",
    },
    {
      title: "iPhone 17 vs Galaxy S26 - ศึกเรือธง 2026",
      platform: "YouTube",
      reach: 320000,
      engagement: 28000,
      date: "20 ม.ค. 2026",
    },
    {
      title: "10 ฟีเจอร์ลับใน iPhone 17 ที่คุณต้องรู้",
      platform: "Facebook",
      reach: 280000,
      engagement: 22000,
      date: "18 ม.ค. 2026",
    },
    {
      title: "กล้อง iPhone 17 Pro ถ่ายภาพดีแค่ไหน?",
      platform: "Instagram",
      reach: 180000,
      engagement: 15000,
      date: "22 ม.ค. 2026",
    },
    {
      title: "#iPhone17Challenge - ถ่ายวิดีโอด้วย iPhone 17",
      platform: "TikTok",
      reach: 150000,
      engagement: 18000,
      date: "25 ม.ค. 2026",
    },
  ],

  summary:
    "แคมเปญ iPhone 17 Launch ประสบความสำเร็จอย่างดีเยี่ยม โดยมียอด Reach รวมกว่า 2.45 ล้าน และ Engagement เติบโต 22.3% เมื่อเทียบกับแคมเปญก่อนหน้า คอนเทนต์ที่ได้รับความนิยมสูงสุดคือวิดีโอรีวิว iPhone 17 Air บน YouTube ซึ่งมียอดเข้าถึงกว่า 450,000 ครั้ง",

  recommendations: [
    "เพิ่มคอนเทนต์ประเภท Short-form Video บน TikTok และ YouTube Shorts เนื่องจากมี Engagement Rate สูง",
    "พิจารณาทำ Live Stream ร่วมกับ Influencer เพื่อเพิ่ม Real-time Engagement",
    "สร้าง UGC Campaign เพื่อให้ผู้ใช้มีส่วนร่วมในการสร้างคอนเทนต์",
    "วิเคราะห์ช่วงเวลาที่ Engagement สูงสุดเพื่อเลือกเวลาโพสต์ที่เหมาะสม",
  ],
};
