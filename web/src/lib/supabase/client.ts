import { createBrowserClient } from "@supabase/ssr";

// Mock client for when Supabase is not configured
const mockClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: { message: "Supabase not configured" } }),
    update: () => ({ data: null, error: { message: "Supabase not configured" } }),
    delete: () => ({ data: null, error: { message: "Supabase not configured" } }),
  }),
};

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return mock client if Supabase is not configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project")) {
    return mockClient as any;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
