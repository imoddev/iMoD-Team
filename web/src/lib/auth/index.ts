// Auth module exports
export { AuthProvider, useAuth, usePermission, usePermissions } from "./context";
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissions,
  canAccessPage,
  getAccessiblePages,
  pageAccessRules,
  type Permission,
  type PageAccess,
} from "./permissions";
