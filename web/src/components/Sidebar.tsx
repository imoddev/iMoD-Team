"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  FileText,
  Video,
  Palette,
  BarChart3,
  CalendarDays,
  Settings,
  LogOut,
  Building2,
  Wrench,
  Image,
} from "lucide-react";
import { useAuth, type Permission } from "@/lib/auth";

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  permission?: Permission;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
  { label: "ทีมขาย (CRM)", href: "/sales", icon: Building2, permission: "sales:view" },
  { label: "News Intelligence", href: "/news", icon: Newspaper, permission: "news:view" },
  { label: "Content Pipeline", href: "/content", icon: FileText, permission: "content:view" },
  { label: "└ Kanban Board", href: "/content/pipeline", icon: FileText, permission: "content:view" },
  { label: "Video Production", href: "/video", icon: Video, permission: "video:view" },
  { label: "└ Video Tracker", href: "/video/tracker", icon: Video, permission: "video:view" },
  { label: "Creative", href: "/creative", icon: Palette, permission: "creative:view" },
  { label: "Thumbnail Generator", href: "/tools/thumbnail", icon: Image, permission: "content:view" },
  { label: "HR & People", href: "/hr", icon: Users, permission: "hr:view" },
  { label: "ปฏิทิน", href: "/calendar", icon: CalendarDays, permission: "calendar:view" },
  { label: "รายงาน", href: "/reports", icon: BarChart3, permission: "reports:view" },
  { label: "ตั้งค่า", href: "/settings", icon: Settings, permission: "settings:view" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, hasPermission } = useAuth();

  // Check bypass mode
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  // Filter menu items based on permissions (show all in bypass mode)
  const visibleMenuItems = bypassAuth
    ? menuItems
    : menuItems.filter((item) => !item.permission || hasPermission(item.permission));

  // User display info
  const displayName = profile?.nickname || profile?.full_name || user?.email?.split("@")[0] || "Demo User";
  const displayEmail = user?.email || profile?.email || "demo@modmedia.co.th";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  // Role badge color
  const roleColors: Record<string, string> = {
    admin: "bg-red-600",
    executive: "bg-purple-600",
    hr_manager: "bg-green-600",
    team_lead: "bg-blue-600",
    member: "bg-gray-600",
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
          iM
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">iMoD Team</h1>
          <p className="text-xs text-gray-400">Mod Media Co., Ltd.</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {visibleMenuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
            {avatarInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              {profile?.role && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${roleColors[profile.role] || "bg-gray-600"}`}>
                  {profile.role}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
