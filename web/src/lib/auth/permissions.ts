// Permission System for iMoD Team

import type { Role, Team } from "@/types/database";

// Define all permissions in the system
export type Permission =
  // Dashboard
  | "dashboard:view"
  // Sales/CRM
  | "sales:view"
  | "sales:create"
  | "sales:edit"
  | "sales:delete"
  // News
  | "news:view"
  | "news:claim"
  | "news:manage"
  // Content
  | "content:view"
  | "content:create"
  | "content:edit"
  | "content:approve"
  // Video
  | "video:view"
  | "video:create"
  | "video:edit"
  | "video:approve"
  // Creative
  | "creative:view"
  | "creative:create"
  | "creative:edit"
  | "creative:approve"
  // HR
  | "hr:view"
  | "hr:manage"
  | "hr:leave_approve"
  | "hr:attendance"
  // Reports
  | "reports:view"
  | "reports:export"
  // Settings
  | "settings:view"
  | "settings:manage"
  // Calendar
  | "calendar:view"
  | "calendar:create"
  | "calendar:manage";

// Role-based permission mapping
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    // Admin has all permissions
    "dashboard:view",
    "sales:view", "sales:create", "sales:edit", "sales:delete",
    "news:view", "news:claim", "news:manage",
    "content:view", "content:create", "content:edit", "content:approve",
    "video:view", "video:create", "video:edit", "video:approve",
    "creative:view", "creative:create", "creative:edit", "creative:approve",
    "hr:view", "hr:manage", "hr:leave_approve", "hr:attendance",
    "reports:view", "reports:export",
    "settings:view", "settings:manage",
    "calendar:view", "calendar:create", "calendar:manage",
  ],
  
  executive: [
    // Executive can view everything, manage some
    "dashboard:view",
    "sales:view", "sales:create", "sales:edit",
    "news:view", "news:manage",
    "content:view", "content:approve",
    "video:view", "video:approve",
    "creative:view", "creative:approve",
    "hr:view", "hr:leave_approve",
    "reports:view", "reports:export",
    "settings:view",
    "calendar:view", "calendar:create", "calendar:manage",
  ],
  
  hr_manager: [
    // HR Manager focuses on people management
    "dashboard:view",
    "hr:view", "hr:manage", "hr:leave_approve", "hr:attendance",
    "reports:view",
    "calendar:view", "calendar:create", "calendar:manage",
  ],
  
  team_lead: [
    // Team Lead manages their team
    "dashboard:view",
    "news:view", "news:claim",
    "content:view", "content:create", "content:edit",
    "video:view", "video:create", "video:edit",
    "creative:view", "creative:create", "creative:edit",
    "hr:view", "hr:leave_approve",
    "reports:view",
    "calendar:view", "calendar:create",
  ],
  
  member: [
    // Member has basic access
    "dashboard:view",
    "news:view", "news:claim",
    "content:view", "content:create", "content:edit",
    "video:view", "video:create", "video:edit",
    "creative:view", "creative:create", "creative:edit",
    "calendar:view", "calendar:create",
  ],
};

// Team-based additional permissions
const teamPermissions: Record<Team, Permission[]> = {
  sales: ["sales:view", "sales:create", "sales:edit"],
  content: ["content:view", "content:create", "content:edit", "news:view", "news:claim"],
  video: ["video:view", "video:create", "video:edit"],
  creative: ["creative:view", "creative:create", "creative:edit"],
  hr: ["hr:view", "hr:attendance"],
  executive: ["reports:view", "reports:export"],
};

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

// Check if a role has all of the specified permissions
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

// Get all permissions for a role (including team-based)
export function getPermissions(role: Role, team?: Team): Permission[] {
  const base = rolePermissions[role] || [];
  const teamPerms = team ? teamPermissions[team] || [] : [];
  
  // Combine and deduplicate
  return [...new Set([...base, ...teamPerms])];
}

// Page access control
export interface PageAccess {
  path: string;
  requiredPermissions: Permission[];
  requireAll?: boolean; // If true, user needs ALL permissions. Default: ANY
}

export const pageAccessRules: PageAccess[] = [
  { path: "/dashboard", requiredPermissions: ["dashboard:view"] },
  { path: "/sales", requiredPermissions: ["sales:view"] },
  { path: "/news", requiredPermissions: ["news:view"] },
  { path: "/content", requiredPermissions: ["content:view"] },
  { path: "/video", requiredPermissions: ["video:view"] },
  { path: "/creative", requiredPermissions: ["creative:view"] },
  { path: "/hr", requiredPermissions: ["hr:view"] },
  { path: "/reports", requiredPermissions: ["reports:view"] },
  { path: "/settings", requiredPermissions: ["settings:view"] },
  { path: "/calendar", requiredPermissions: ["calendar:view"] },
];

// Check if user can access a page
export function canAccessPage(role: Role, path: string, team?: Team): boolean {
  const rule = pageAccessRules.find((r) => path.startsWith(r.path));
  
  if (!rule) return true; // No rule = public access
  
  const userPermissions = getPermissions(role, team);
  
  if (rule.requireAll) {
    return rule.requiredPermissions.every((p) => userPermissions.includes(p));
  }
  
  return rule.requiredPermissions.some((p) => userPermissions.includes(p));
}

// Get accessible pages for a role
export function getAccessiblePages(role: Role, team?: Team): string[] {
  return pageAccessRules
    .filter((rule) => canAccessPage(role, rule.path, team))
    .map((rule) => rule.path);
}
