# 🚀 iMoD Team

ระบบบริหารจัดการงานภายในองค์กร Mod Media Co., Ltd.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)

## ✨ Features

### 💼 Sales CRM
- Pipeline Management (Lead → ปิดงาน)
- Client Database + Contact Info
- Campaign Tracking
- Content Performance Analytics
- Auto Report Generation (PDF)

### 📰 News Intelligence
- AI-powered News Aggregation
- Priority Scoring (0-100)
- Content Brief Generation
- Multi-source RSS feeds
- Category Filtering

### 📝 Content Pipeline
- Kanban Board (To Do → Done)
- Writer Assignment
- Deadline Tracking
- Platform Tagging (iPhoneMod/EVMoD)

### 🎬 Video Production
- 6-stage Production Tracker
- Multi-platform Support (YouTube/Shorts/TikTok/Reels)
- Performance Metrics (Views/Likes/Comments)
- Editor Assignment

### 🎨 Creative & Design
- Design Request System
- Revision Tracking
- Multiple Design Types (Thumbnail/Banner/Infographic)
- Approval Workflow

### 👥 HR & People
- Employee Directory
- Leave Management
- Check-in/Check-out
- Org Chart

### 📅 Calendar
- Event Management
- Deadline Overview
- Team Schedule

### 📊 Reports & Analytics
- Content Performance
- Video Analytics
- Sales Revenue
- Team Performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Deployment**: Vercel (Singapore Region)

## 📦 Project Structure

```
iMoD-Team/
├── docs/                    # Documentation
│   ├── PROJECT_PLAN.md
│   ├── DATABASE_SCHEMA.md
│   ├── SALES_CRM.md
│   ├── NEWS_INTELLIGENCE.md
│   ├── SUPABASE_SETUP.md
│   ├── API_REFERENCE.md
│   ├── USER_GUIDE.md
│   └── DEPLOYMENT.md
├── supabase/
│   ├── migrations/          # SQL migrations
│   └── seed/                # Seed data
├── web/                     # Next.js app
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities & hooks
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── .env.template           # Environment template
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (optional for demo mode)

### Installation

```bash
# Clone
git clone https://github.com/modmedia/imod-team.git
cd imod-team

# Install dependencies
cd web
npm install

# Setup environment
cp ../.env.template .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Mode

The app runs in demo mode by default (using mock data).
To connect to Supabase, add your credentials to `.env.local`.

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) | Project overview & phases |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Database structure |
| [SALES_CRM.md](docs/SALES_CRM.md) | Sales module details |
| [NEWS_INTELLIGENCE.md](docs/NEWS_INTELLIGENCE.md) | News system details |
| [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) | Supabase configuration |
| [API_REFERENCE.md](docs/API_REFERENCE.md) | API documentation |
| [USER_GUIDE.md](docs/USER_GUIDE.md) | User manual |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guide |

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run migrations in order:
   ```sql
   -- 1. Enums
   -- 2. Tables
   -- 3. RLS Policies
   ```
3. Add credentials to `.env.local`

See [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for details.

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/modmedia/imod-team&project-name=imod-team&root-directory=web)

1. Connect your GitHub repo
2. Set root directory to `web`
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

## 👥 Team

**Mod Media Co., Ltd.**
- 📱 [iPhoneMod.net](https://www.iphonemod.net)
- 🚗 [EVMoD](https://ev.iphonemod.net)

## 📄 License

Private - Mod Media Co., Ltd. © 2026
