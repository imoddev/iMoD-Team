"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import type { Profile, Role, Team } from "@/types/database";
import { getPermissions, hasPermission, canAccessPage, type Permission } from "./permissions";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  // Auth actions
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  
  // Permission helpers
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  canAccessPage: (path: string) => boolean;
  
  // Refresh
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as Profile;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return null;
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if session-only mode (should logout on browser close)
        const isSessionOnly = typeof window !== "undefined" && 
          sessionStorage.getItem("imod_session_only") === "true";
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            profile,
            loading: false,
            error: null,
          });
          
          // Update last activity
          if (typeof window !== "undefined") {
            localStorage.setItem("imod_last_activity", new Date().toISOString());
          }
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: "Failed to initialize auth",
        });
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            profile,
            loading: false,
            error: null,
          });
        } else if (event === "SIGNED_OUT") {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({ ...prev, loading: false, error: error.message }));
        return { error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setState({
          user: data.user,
          profile,
          loading: false,
          error: null,
        });
      }

      return {};
    } catch (err: any) {
      const errorMsg = err.message || "Login failed";
      setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
      return { error: errorMsg };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("imod_session_only");
        // Keep remembered email but clear session data
        localStorage.removeItem("imod_remember_session");
        localStorage.removeItem("imod_last_activity");
      }
      
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      setState((prev) => ({ ...prev, profile }));
    }
  };

  // Get current permissions
  const role = state.profile?.role || "member";
  const team = state.profile?.team;
  const permissions = getPermissions(role as Role, team as Team | undefined);

  // Permission check helpers
  const checkPermission = (permission: Permission) => {
    return hasPermission(role as Role, permission);
  };

  const checkPageAccess = (path: string) => {
    return canAccessPage(role as Role, path, team as Team | undefined);
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signOut,
    permissions,
    hasPermission: checkPermission,
    canAccessPage: checkPageAccess,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for permission checks
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

// Hook for multiple permission checks
export function usePermissions(permissions: Permission[]): boolean[] {
  const { hasPermission } = useAuth();
  return permissions.map(hasPermission);
}
