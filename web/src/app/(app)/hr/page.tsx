"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  CalendarOff,
  Clock,
  Building,
  CheckCircle,
  XCircle,
  Home,
  Laptop,
  Search,
} from "lucide-react";
import {
  demoProfiles,
  demoLeaveRequests,
  demoAttendance,
  teamLabels,
  teamColors,
  roleLabels,
  leaveTypeLabels,
  approvalStatusConfig,
} from "@/lib/demo-hr";

type Tab = "employees" | "leave" | "attendance" | "org";

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<Tab>("employees");
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("");

  const tabs = [
    { id: "employees" as Tab, label: "พนักงาน", icon: Users },
    { id: "leave" as Tab, label: "การลา", icon: CalendarOff },
    { id: "attendance" as Tab, label: "เช็คอิน", icon: Clock },
    { id: "org" as Tab, label: "โครงสร้างองค์กร", icon: Building },
  ];

  const pendingLeaves = demoLeaveRequests.filter((l) => l.status === "pending");
  const checkedIn = demoAttendance.length;
  const wfhCount = demoAttendance.filter((a) => a.work_mode === "wfh").length;

  const filteredProfiles = demoProfiles.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nickname?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTeam = !teamFilter || p.team === teamFilter;
    return matchSearch && matchTeam;
  });

  const teamCounts = demoProfiles.reduce(
    (acc, p) => {
      acc[p.team] = (acc[p.team] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">HR & People</h1>
          <p className="text-gray-400 mt-1">จัดการพนักงาน, ลา, เช็คอิน</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
          <UserPlus size={16} />
          เพิ่มพนักงาน
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-purple-400" />
            <span className="text-xs text-gray-400">พนักงานทั้งหมด</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{demoProfiles.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-green-400" />
            <span className="text-xs text-gray-400">เช็คอินวันนี้</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{checkedIn}/{demoProfiles.length}</p>
        </div>
        <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <CalendarOff size={18} className="text-yellow-400" />
            <span className="text-xs text-gray-400">รออนุมัติลา</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{pendingLeaves.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Home size={18} className="text-blue-400" />
            <span className="text-xs text-gray-400">WFH วันนี้</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{wfhCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB: Employees */}
      {activeTab === "employees" && (
        <div>
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="ค้นหาพนักงาน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทุกทีม</option>
              {Object.entries(teamLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-600 transition-colors"
              >
                <div className={`w-11 h-11 ${teamColors[profile.team]} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {profile.nickname?.charAt(0) || profile.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{profile.full_name}</span>
                    {profile.nickname && (
                      <span className="text-sm text-gray-500">({profile.nickname})</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{profile.position}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded text-white ${teamColors[profile.team]}`}>
                    {teamLabels[profile.team]}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                    {roleLabels[profile.role]}
                  </span>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{profile.email}</p>
                  <p>{profile.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Leave */}
      {activeTab === "leave" && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">คำขอลาทั้งหมด</h3>
          <div className="space-y-3">
            {demoLeaveRequests.map((leave) => {
              const user = demoProfiles.find((p) => p.id === leave.user_id);
              const approver = leave.approved_by ? demoProfiles.find((p) => p.id === leave.approved_by) : null;
              const statusCfg = approvalStatusConfig[leave.status];

              return (
                <div
                  key={leave.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${teamColors[user?.team || "content"]} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {user?.nickname?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.full_name}</p>
                        <p className="text-sm text-gray-400">{user?.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full text-white ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      {leave.status === "pending" && (
                        <div className="flex gap-1">
                          <button className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors">
                            <CheckCircle size={16} className="text-white" />
                          </button>
                          <button className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-colors">
                            <XCircle size={16} className="text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">ประเภท</p>
                      <p className="text-gray-300">{leaveTypeLabels[leave.leave_type]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">วันที่</p>
                      <p className="text-gray-300">
                        {leave.start_date === leave.end_date
                          ? leave.start_date
                          : `${leave.start_date} → ${leave.end_date}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">เหตุผล</p>
                      <p className="text-gray-300">{leave.reason || "-"}</p>
                    </div>
                  </div>
                  {approver && (
                    <p className="text-xs text-gray-500 mt-2">อนุมัติโดย: {approver.full_name}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: Attendance */}
      {activeTab === "attendance" && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">เช็คอินวันนี้ — 28 ม.ค. 2026</h3>
          <div className="space-y-2">
            {demoAttendance.map((att) => {
              const user = demoProfiles.find((p) => p.id === att.user_id);
              return (
                <div
                  key={att.user_id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className={`w-10 h-10 ${teamColors[user?.team || "content"]} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {user?.nickname?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{user?.full_name}</p>
                    <p className="text-xs text-gray-400">{user?.position}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {att.work_mode === "office" ? (
                        <Building size={14} className="text-green-400" />
                      ) : (
                        <Laptop size={14} className="text-blue-400" />
                      )}
                      <span className="text-xs text-gray-400">
                        {att.work_mode === "office" ? "Office" : "WFH"}
                      </span>
                    </div>
                    <span className="text-sm text-green-400 font-mono">{att.check_in}</span>
                  </div>
                </div>
              );
            })}
            {/* Not checked in */}
            {demoProfiles
              .filter((p) => !demoAttendance.some((a) => a.user_id === p.id))
              .map((user) => (
                <div
                  key={user.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 opacity-50"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">
                    {user.nickname?.charAt(0) || user.full_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-400">{user.full_name}</p>
                    <p className="text-xs text-gray-600">{user.position}</p>
                  </div>
                  <span className="text-xs text-gray-600">ยังไม่เช็คอิน</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB: Org Chart */}
      {activeTab === "org" && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-6">โครงสร้างองค์กร — Mod Media</h3>

          {/* CEO */}
          <div className="flex justify-center mb-8">
            <div className="bg-amber-600/20 border border-amber-500/40 rounded-xl p-4 text-center w-48">
              <div className="w-12 h-12 bg-amber-600 rounded-full mx-auto flex items-center justify-center text-white font-bold mb-2">ต</div>
              <p className="font-semibold text-white">ทอม</p>
              <p className="text-xs text-amber-300">CEO / Founder</p>
            </div>
          </div>

          {/* Teams */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(teamLabels).map(([teamKey, label]) => {
              const members = demoProfiles.filter((p) => p.team === teamKey);
              return (
                <div key={teamKey} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="text-center mb-3">
                    <span className={`inline-block text-xs px-2 py-1 rounded text-white ${teamColors[teamKey]}`}>
                      {label}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{members.length} คน</p>
                  </div>
                  <div className="space-y-2">
                    {members.map((m) => (
                      <div key={m.id} className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${teamColors[teamKey]} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                          {m.nickname?.charAt(0) || m.full_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white truncate">{m.nickname || m.full_name}</p>
                          <p className="text-xs text-gray-500 truncate">{roleLabels[m.role]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
