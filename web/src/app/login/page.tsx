"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    // Check for registered param
    if (searchParams.get("registered") === "true") {
      setMessage("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
    }
    
    // Load remembered email
    const savedEmail = localStorage.getItem("imod_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("Invalid login")) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else if (authError.message.includes("Email not confirmed")) {
        setError("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // Remember email if checked
    if (rememberMe) {
      localStorage.setItem("imod_remembered_email", email);
      // Store session preference
      localStorage.setItem("imod_remember_session", "true");
    } else {
      localStorage.removeItem("imod_remembered_email");
      localStorage.removeItem("imod_remember_session");
      // Set session to expire when browser closes
      sessionStorage.setItem("imod_session_only", "true");
    }

    // Store last login time
    localStorage.setItem("imod_last_login", new Date().toISOString());

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800"
    >
      <h2 className="text-xl font-semibold text-white mb-6">เข้าสู่ระบบ</h2>

      {message && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            อีเมล
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@modmedia.co.th"
            required
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            รหัสผ่าน
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
            />
            <span className="text-sm text-gray-400">จดจำการเข้าสู่ระบบ</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
            ลืมรหัสผ่าน?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-gray-400 text-sm mt-4">
        ยังไม่มีบัญชี?{" "}
        <Link href="/signup" className="text-blue-400 hover:text-blue-300">
          สมัครสมาชิก
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">iM</span>
          </div>
          <h1 className="text-2xl font-bold text-white">iMoD Team</h1>
          <p className="text-gray-400 mt-1">ระบบบริหารงานภายใน Mod Media</p>
        </div>

        {/* Login Form wrapped in Suspense */}
        <Suspense fallback={
          <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-800 rounded"></div>
                <div className="h-10 bg-gray-800 rounded"></div>
              </div>
              <div className="h-10 bg-gray-800 rounded mt-6"></div>
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 Mod Media Co., Ltd. — iMoD Team v1.0
        </p>
      </div>
    </div>
  );
}
