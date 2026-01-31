// Script to create admin user in Supabase
// Run with: npx tsx scripts/create-admin.ts

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const envContent = readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        const value = valueParts.join("=");
        process.env[key] = value;
      }
    }
  } catch (err) {
    console.error("Could not load .env.local");
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupAdmin() {
  const adminEmail = "admin@modmedia.co.th";
  const adminPassword = "iMoD@2026!";

  console.log("🚀 Setting up admin user...\n");

  try {
    // List existing users
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("❌ List users error:", listError.message);
      process.exit(1);
    }

    console.log(`Found ${users?.users.length || 0} existing users`);
    users?.users.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.email} (${u.id})`);
    });

    // Check if admin exists
    let adminUser = users?.users.find(u => u.email === adminEmail);
    
    if (!adminUser) {
      console.log("\n📝 Creating admin auth user...");
      
      // Try to create user via admin API
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          full_name: "System Admin",
          nickname: "Admin",
        },
      });

      if (createError) {
        console.error("❌ Create user error:", createError.message);
        console.log("\nTrying signUp instead...");
        
        // Try regular signup
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            data: {
              full_name: "System Admin",
              nickname: "Admin",
            },
          },
        });

        if (signUpError) {
          console.error("❌ SignUp error:", signUpError.message);
          process.exit(1);
        }

        if (signUpData.user) {
          console.log("✅ User created via signUp:", signUpData.user.id);
          adminUser = signUpData.user as any;
        }
      } else {
        console.log("✅ Admin auth user created:", newUser.user?.id);
        adminUser = newUser.user as any;
      }

      // Wait a moment for trigger to create profile
      console.log("⏳ Waiting for profile creation...");
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log("\n✅ Admin auth user already exists:", adminUser.id);
    }

    if (!adminUser) {
      console.error("❌ Could not create or find admin user");
      process.exit(1);
    }

    // Check/update profile
    console.log("\n📝 Checking profile...");
    
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", adminUser.id)
      .single();

    if (existingProfile) {
      console.log("Profile exists, updating to admin role...");
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: "System Admin",
          nickname: "Admin",
          role: "admin",
          team: "executive",
          position: "System Administrator",
          is_active: true,
        })
        .eq("id", adminUser.id);

      if (updateError) {
        console.error("❌ Update error:", updateError.message);
      } else {
        console.log("✅ Profile updated to admin!");
      }
    } else {
      console.log("Profile not found, creating...");
      
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: adminUser.id,
          email: adminEmail,
          full_name: "System Admin",
          nickname: "Admin",
          role: "admin",
          team: "executive",
          position: "System Administrator",
          is_active: true,
        });

      if (insertError) {
        console.error("❌ Insert error:", insertError.message);
      } else {
        console.log("✅ Profile created!");
      }
    }

    // Final verification
    const { data: finalProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", adminUser.id)
      .single();

    console.log("\n========================================");
    console.log("🎉 Admin user ready!");
    console.log("========================================");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👤 Role: ${finalProfile?.role || "admin"}`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log("========================================\n");

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setupAdmin();
