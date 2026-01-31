# 🚀 Deployment Guide

## Vercel (Recommended)

### Option 1: Deploy from GitHub

1. **Push to GitHub**
   ```bash
   cd iMoD-Team
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/imod-team.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - ไปที่ [vercel.com](https://vercel.com)
   - กด "Add New Project"
   - เลือก Repository `imod-team`
   - Framework Preset: **Next.js**
   - Root Directory: **web**

3. **ตั้งค่า Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
   NEXT_PUBLIC_DEMO_MODE = false
   ```

4. **Deploy!**
   - กด "Deploy"
   - รอ 1-2 นาที
   - ได้ URL: `https://imod-team.vercel.app`

### Option 2: Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd iMoD-Team/web
vercel

# Production deploy
vercel --prod
```

---

## Environment Variables

### Required (Production)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Optional
```env
# Demo mode (uses mock data)
NEXT_PUBLIC_DEMO_MODE=true

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error tracking
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## Custom Domain

1. ไปที่ Vercel Dashboard → Project → Settings → Domains
2. เพิ่ม Domain: `team.iphonemod.net`
3. ตั้งค่า DNS:
   ```
   Type: CNAME
   Name: team
   Value: cname.vercel-dns.com
   ```
4. รอ DNS propagate (5-30 นาที)

---

## Build Settings

### Root Directory
```
web
```

### Build Command
```bash
npm run build
```

### Output Directory
```
.next
```

### Install Command
```bash
npm install
```

---

## Vercel Features

### ✅ Enabled by Default
- **Edge Functions** — API routes run on edge
- **Image Optimization** — Next.js Image component
- **ISR** — Incremental Static Regeneration
- **Preview Deployments** — Every PR gets a preview URL

### Region
- **sin1** (Singapore) — ใกล้ไทยที่สุด

---

## Troubleshooting

### ❌ Build Error: Module not found
```bash
# ตรวจสอบว่า dependencies ครบ
npm install
```

### ❌ Environment variable undefined
- ตรวจสอบว่าตั้ง Environment Variables ใน Vercel แล้ว
- ถ้าเป็น `NEXT_PUBLIC_*` ต้อง Redeploy หลังเปลี่ยน

### ❌ Supabase connection failed
- ตรวจสอบ URL และ Key ถูกต้อง
- ตรวจสอบว่า Supabase project ยังทำงานอยู่

### ❌ 500 Internal Server Error
- ดู Vercel Function Logs
- ตรวจสอบ API routes

---

## Monitoring

### Vercel Analytics
1. ไปที่ Project → Analytics
2. Enable Web Analytics
3. ดู:
   - Page Views
   - Unique Visitors
   - Top Pages
   - Performance (Core Web Vitals)

### Vercel Speed Insights
1. Enable Speed Insights
2. ดู:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

---

## CI/CD

### Auto Deploy on Push
- ทุก push ไป `main` branch จะ deploy production อัตโนมัติ
- ทุก push ไป branch อื่นจะได้ Preview URL

### Preview Comments
- Vercel จะ comment URL บน PR อัตโนมัติ

---

## Rollback

### From Dashboard
1. ไปที่ Project → Deployments
2. หา deployment ที่ต้องการ
3. กด "..." → "Promote to Production"

### From CLI
```bash
vercel rollback
```

---

## Cost

### Hobby (Free)
- Bandwidth: 100GB/month
- Serverless Function: 100GB-hrs
- Build Time: 6,000 min/month
- ✅ เพียงพอสำหรับ internal tool

### Pro ($20/month per member)
- Bandwidth: 1TB/month
- More build time
- Team features
- Password protection

---

## Security Checklist

- [ ] ตั้ง Environment Variables ใน Vercel (ไม่ใช่ในโค้ด)
- [ ] ไม่ commit `.env.local`
- [ ] ใช้ `NEXT_PUBLIC_` สำหรับ client-side เท่านั้น
- [ ] Service Role Key ใช้เฉพาะ server-side
- [ ] เปิด Vercel Authentication (ถ้าต้องการ)
