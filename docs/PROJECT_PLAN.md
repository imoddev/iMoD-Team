# 📋 Project Plan — iMoD Team

## Phase 1: Foundation (สัปดาห์ที่ 1-2)
> เตรียมโครงสร้างพื้นฐาน

- [ ] ตั้ง Project (Next.js + Tailwind + Supabase)
- [ ] ออกแบบ Database Schema
- [ ] ระบบ Auth + Role-based Access (ผู้บริหาร, HR, Team Lead, Member)
- [ ] หน้า Login / Register
- [ ] Layout หลัก + Sidebar Navigation

## Phase 2: Sales CRM (สัปดาห์ที่ 3-4)
> ระบบทีมขาย — จัดการลูกค้าและรายงาน

- [ ] CRUD ข้อมูลลูกค้า (บริษัท, ผู้ติดต่อ, แบรนด์, งบ, หมวดหมู่)
- [ ] Sales Pipeline: Lead → เสนอราคา → ตกลง → กำลังทำ → ส่งมอบ → ปิดงาน
- [ ] ปฏิทินงาน + แจ้งเตือน Follow-up
- [ ] เชื่อม Social Media APIs (Facebook Page Insights, YouTube Analytics)
- [ ] Content Performance Dashboard (Reach, Engagement, Views, Clicks)
- [ ] Auto-generate Report PDF ส่งลูกค้า (1 คลิก)
- [ ] เปรียบเทียบ Performance ข้ามแคมเปญ

## Phase 3: News Intelligence (สัปดาห์ที่ 5-6)
> ระบบแนะนำข่าวอัจฉริยะสำหรับทีม Content

- [ ] RSS/API Aggregator จากแหล่งข่าวหลัก
  - Apple: 9to5Mac, MacRumors, AppleInsider
  - EV: Electrek, InsideEVs, CarNewsChina
  - Tech: The Verge, TechCrunch, Ars Technica
  - เศรษฐกิจ: Bloomberg, Reuters
  - ไทย: กรุงเทพธุรกิจ, ประชาชาติธุรกิจ
- [ ] AI News Scoring (Priority: 🔴 Hot / 🟡 Trending / 🟢 Normal)
- [ ] News Dashboard แบ่งหมวด (Apple / EV / Tech / Economy)
- [ ] กดเลือกข่าว → สร้าง Content Brief อัตโนมัติ
- [ ] ติดตามสถานะ: ข่าวไหนถูกหยิบไปเขียนแล้ว / ยังว่าง
- [ ] แจ้งเตือน Breaking News ผ่าน LINE/Discord

## Phase 4: Content Pipeline (สัปดาห์ที่ 7-8)
> ระบบติดตามงานคอนเทนต์ทุกประเภท

- [ ] Article Workflow: Pitch → Draft → Edit → Review → Publish
- [ ] Video Workflow: Script → Shoot → Edit → Thumbnail → Upload
- [ ] Kanban Board แยกตามทีม (Content / Video / Creative)
- [ ] มอบหมายงาน + กำหนด Deadline
- [ ] เชื่อม WordPress API (ดึงสถานะบทความ)
- [ ] Asset Upload & Sharing (รูป, วิดีโอ, กราฟิก)

## Phase 5: HR & People (สัปดาห์ที่ 9-10)
> ระบบ HR ภายใน

- [ ] ข้อมูลพนักงาน + โครงสร้างองค์กร (Org Chart)
- [ ] ระบบลาออนไลน์ (ป่วย / พักร้อน / กิจ / อื่นๆ)
- [ ] อนุมัติลาโดย Team Lead + HR
- [ ] เช็คอิน/เช็คเอาท์ (WFH / Office)
- [ ] สรุปวันลาคงเหลือ + รายงานประจำเดือน

## Phase 6: Executive Dashboard (สัปดาห์ที่ 11-12)
> Dashboard สำหรับผู้บริหาร

- [ ] ภาพรวมงานทั้งองค์กร (งานค้าง, เสร็จ, กำลังทำ)
- [ ] KPIs รายทีม:
  - ทีมขาย: จำนวนลูกค้า, Revenue, Conversion Rate
  - ทีม Content: จำนวนบทความ, ยอดวิว, Engagement
  - ทีม Video: จำนวนวิดีโอ, Watch Time, Subscribers
  - ทีม Creative: จำนวนงานกราฟิก, Turnaround Time
  - HR: จำนวนพนักงาน, อัตราการลา, Attendance Rate
- [ ] รายงานสรุปประจำสัปดาห์/เดือน (Auto-generate)
- [ ] เปรียบเทียบ Performance เดือนต่อเดือน

---

## 🗓️ Timeline Overview

| Phase | ระยะเวลา | Module |
|-------|----------|--------|
| 1 | สัปดาห์ 1-2 | Foundation + Auth |
| 2 | สัปดาห์ 3-4 | Sales CRM & Report |
| 3 | สัปดาห์ 5-6 | News Intelligence |
| 4 | สัปดาห์ 7-8 | Content Pipeline |
| 5 | สัปดาห์ 9-10 | HR & People |
| 6 | สัปดาห์ 11-12 | Executive Dashboard |

**รวมประมาณ 3 เดือน** (ทำเป็น MVP ก่อน แล้วค่อยเพิ่มฟีเจอร์)

---

## 🔗 เชื่อมงานขาย ↔ คอนเทนต์

```
ทีมขาย                         ทีม Content
   │                                │
   │  ลูกค้าต้องการโปรโมท EV        │  News Intelligence แนะนำข่าว EV
   │         │                      │         │
   │         ▼                      │         ▼
   │  สร้าง Campaign Brief ──────► │  รับ Brief → เขียนบทความ
   │                                │         │
   │                                │         ▼
   │  ดึง Performance Report ◄───── │  โพสต์ลง iPhoneMod / EVMoD
   │         │                      │
   │         ▼                      │
   │  ส่งรายงานให้ลูกค้า            │
   └────────────────────────────────┘
```

ข้อมูลไหลเชื่อมกัน ทำให้ทั้ง 2 ทีมทำงานประสานกันได้อย่างมีประสิทธิภาพ
