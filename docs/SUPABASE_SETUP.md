# 🗄️ Supabase Setup Guide

## 1. สร้าง Supabase Project

1. ไปที่ [supabase.com](https://supabase.com) แล้ว Login
2. กด **New Project**
3. ตั้งชื่อ: `imod-team`
4. ตั้ง Database Password (จำไว้ให้ดี!)
5. เลือก Region: **Singapore** (ใกล้ไทยที่สุด)
6. กด **Create new project** รอ 2-3 นาที

## 2. รัน Database Migrations

### วิธีที่ 1: ผ่าน Supabase Dashboard (ง่ายสุด)

1. ไปที่ **SQL Editor** ใน Dashboard
2. รัน SQL ตามลำดับ:

```sql
-- 1. สร้าง Enums
-- Copy จาก: supabase/migrations/001_create_enums.sql

-- 2. สร้าง Tables
-- Copy จาก: supabase/migrations/002_create_tables.sql

-- 3. สร้าง RLS Policies
-- Copy จาก: supabase/migrations/003_rls_policies.sql

-- 4. Seed Data (Optional)
-- Copy จาก: supabase/seed/001_news_sources.sql
```

### วิธีที่ 2: ผ่าน Supabase CLI (แนะนำสำหรับ Dev)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
cd iMoD-Team
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

## 3. ดึง API Keys

1. ไปที่ **Settings** → **API**
2. Copy ค่าเหล่านี้:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`
   - **service_role key**: `eyJhbGci...` (เก็บไว้ใน server เท่านั้น!)

## 4. ตั้งค่า Environment Variables

แก้ไฟล์ `web/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (สำหรับ server-side เท่านั้น)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. เปิดใช้งาน Auth Providers (Optional)

ไปที่ **Authentication** → **Providers**:

- ✅ Email (default)
- ⬜ Google
- ⬜ Facebook
- ⬜ Apple

## 6. ตั้งค่า Storage (สำหรับ Upload รูป)

1. ไปที่ **Storage**
2. สร้าง Bucket ใหม่:
   - `avatars` - รูปโปรไฟล์
   - `designs` - งานกราฟิก
   - `attachments` - ไฟล์แนบทั่วไป

3. ตั้ง Policies:
```sql
-- Public read for avatars
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Authenticated users can upload
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 7. ทดสอบการเชื่อมต่อ

```bash
cd web
npm run dev
```

ไปที่ http://localhost:3000/settings → ดู Supabase Status

## 8. Seed Demo Data (Optional)

ถ้าอยากมีข้อมูลตัวอย่าง:

```sql
-- รัน SQL ใน Supabase Dashboard

-- เพิ่มพนักงานตัวอย่าง
INSERT INTO profiles (id, email, full_name, nickname, team, role, position)
VALUES 
  ('u1', 'tom@modmedia.co.th', 'ทอม', 'ต้อม', 'executive', 'executive', 'CEO'),
  ('u2', 'sakura@modmedia.co.th', 'ซากุระ', 'ซากุ', 'executive', 'team_lead', 'PM');

-- เพิ่มลูกค้าตัวอย่าง
INSERT INTO clients (company_name, brand_name, industry, status, contact_name, contact_email)
VALUES 
  ('OPPO Thailand', 'OPPO', 'smartphone', 'active', 'คุณสมชาย', 'somchai@oppo.com');
```

## Troubleshooting

### ❌ Error: Invalid API key
- ตรวจสอบว่า copy key ถูกต้อง (ไม่มี space หรือ newline)
- ตรวจสอบว่าใช้ `anon` key ไม่ใช่ `service_role`

### ❌ Error: permission denied for table
- ตรวจสอบว่ารัน RLS policies แล้ว
- ตรวจสอบว่า user login แล้ว (สำหรับ authenticated tables)

### ❌ Error: relation does not exist
- ต้องรัน migrations ก่อน (001 → 002 → 003 ตามลำดับ)

---

## Quick Commands

```bash
# Check Supabase status
supabase status

# Reset database
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts
```
