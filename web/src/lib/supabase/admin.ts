import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key
// Use this for admin operations (bypasses RLS)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper functions for admin operations

export async function createUser(email: string, password: string, metadata?: Record<string, any>) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (error) throw error;
  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw error;
}

export async function listUsers() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw error;
  return data.users;
}

// Seed data helper
export async function seedDatabase() {
  // Run the seed SQL files
  // This would typically be done via Supabase CLI or dashboard
  console.log("Run seed SQL via Supabase dashboard or CLI");
}
