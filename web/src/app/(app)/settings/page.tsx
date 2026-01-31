"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Server,
  Shield,
  Bell,
  Palette,
  Globe,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ConnectionStatus {
  connected: boolean;
  latency?: number;
  error?: string;
  tables?: string[];
}

export default function SettingsPage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const isConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

  const checkConnection = async () => {
    if (!isConfigured) {
      setConnectionStatus({ connected: false, error: "ยังไม่ได้ตั้งค่า Supabase" });
      return;
    }

    setChecking(true);
    const startTime = Date.now();

    try {
      const supabase = createClient();
      
      // Try to fetch from a simple table
      const { data, error } = await supabase.from("profiles").select("id").limit(1);
      
      const latency = Date.now() - startTime;

      if (error) {
        // Check if it's just empty or actual error
        if (error.message.includes("does not exist")) {
          setConnectionStatus({
            connected: true,
            latency,
            error: "ยังไม่ได้รัน Migrations (ไม่มี table profiles)",
          });
        } else {
          setConnectionStatus({ connected: false, error: error.message });
        }
      } else {
        setConnectionStatus({ connected: true, latency });
      }
    } catch (err: any) {
      setConnectionStatus({ connected: false, error: err.message });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskKey = (key: string) => {
    if (!key || key.length < 20) return key;
    return key.substring(0, 20) + "..." + key.substring(key.length - 10);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">ตั้งค่าระบบและการเชื่อมต่อ</p>
      </div>

      {/* Supabase Connection */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Database size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Supabase Database</h2>
              <p className="text-sm text-gray-400">PostgreSQL + Auth + Realtime</p>
            </div>
          </div>
          <button
            onClick={checkConnection}
            disabled={checking}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={checking ? "animate-spin" : ""} />
            ทดสอบ
          </button>
        </div>

        {/* Status */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">สถานะการเชื่อมต่อ</span>
            {connectionStatus === null ? (
              <span className="text-gray-500">กำลังตรวจสอบ...</span>
            ) : connectionStatus.connected ? (
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-green-400">เชื่อมต่อแล้ว</span>
                {connectionStatus.latency && (
                  <span className="text-xs text-gray-500">({connectionStatus.latency}ms)</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-red-400" />
                <span className="text-red-400">ไม่ได้เชื่อมต่อ</span>
              </div>
            )}
          </div>
          {connectionStatus?.error && (
            <div className="mt-2 text-sm text-orange-400 flex items-center gap-2">
              <AlertTriangle size={14} />
              {connectionStatus.error}
            </div>
          )}
        </div>

        {/* Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Project URL</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                {isConfigured ? supabaseUrl : "ยังไม่ได้ตั้งค่า"}
              </code>
              {isConfigured && (
                <button
                  onClick={() => copyToClipboard(supabaseUrl, "url")}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {copied === "url" ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} className="text-gray-500" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Anon Key</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                {isConfigured
                  ? showKeys
                    ? supabaseKey
                    : maskKey(supabaseKey)
                  : "ยังไม่ได้ตั้งค่า"}
              </code>
              {isConfigured && (
                <>
                  <button
                    onClick={() => setShowKeys(!showKeys)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    {showKeys ? (
                      <EyeOff size={14} className="text-gray-500" />
                    ) : (
                      <Eye size={14} className="text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(supabaseKey, "key")}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    {copied === "key" ? (
                      <CheckCircle size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} className="text-gray-500" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isConfigured && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300 mb-3">
              ยังไม่ได้ตั้งค่า Supabase — ระบบกำลังใช้ Demo Data
            </p>
            <div className="flex gap-3">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
              >
                <ExternalLink size={16} />
                สร้าง Supabase Project
              </a>
              <a
                href="https://github.com/imod-team/docs/SUPABASE_SETUP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
              >
                📖 คู่มือการตั้งค่า
              </a>
            </div>
          </div>
        )}

        {isConfigured && connectionStatus?.connected && (
          <div className="mt-4">
            <a
              href={`${supabaseUrl.replace(".supabase.co", "")}/project/default`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
            >
              <ExternalLink size={14} />
              เปิด Supabase Dashboard
            </a>
          </div>
        )}
      </div>

      {/* Other Settings */}
      <div className="grid grid-cols-2 gap-4">
        {/* Notifications */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bell size={16} className="text-white" />
            </div>
            <h3 className="font-semibold text-white">การแจ้งเตือน</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-400">แจ้งเตือน Deadline</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-blue-600" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-400">แจ้งเตือน Leave Request</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-blue-600" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-400">แจ้งเตือนข่าว Hot</span>
              <input type="checkbox" className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-blue-600" />
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Palette size={16} className="text-white" />
            </div>
            <h3 className="font-semibold text-white">หน้าตา</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">Theme</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm">
                <option value="dark">🌙 Dark</option>
                <option value="light">☀️ Light</option>
                <option value="system">💻 System</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">ภาษา</label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm">
                <option value="th">🇹🇭 ไทย</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <h3 className="font-semibold text-white">ความปลอดภัย</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-400">Two-Factor Auth</span>
              <input type="checkbox" className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-blue-600" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-400">Session Timeout (30 min)</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-blue-600" />
            </label>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
              <Server size={16} className="text-white" />
            </div>
            <h3 className="font-semibold text-white">ระบบ</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Version</span>
              <span className="text-gray-300">1.0.0-beta</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Next.js</span>
              <span className="text-gray-300">16.1.6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Environment</span>
              <span className="text-gray-300">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
