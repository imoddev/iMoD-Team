"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  FileText,
  Image,
  Users,
  MapPin,
} from "lucide-react";

type EventType = "content" | "video" | "meeting" | "design" | "deadline" | "holiday";

interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  endTime?: string;
  description?: string;
  attendees?: string[];
  location?: string;
}

const eventTypeConfig: Record<EventType, { label: string; color: string; icon: any }> = {
  content: { label: "Content", color: "bg-green-600", icon: FileText },
  video: { label: "Video", color: "bg-red-600", icon: Video },
  meeting: { label: "Meeting", color: "bg-blue-600", icon: Users },
  design: { label: "Design", color: "bg-purple-600", icon: Image },
  deadline: { label: "Deadline", color: "bg-orange-600", icon: Clock },
  holiday: { label: "วันหยุด", color: "bg-gray-600", icon: CalendarIcon },
};

const demoEvents: CalendarEvent[] = [
  { id: "e1", title: "ประชุมทีม Content", type: "meeting", date: "2026-01-29", time: "10:00", endTime: "11:00", attendees: ["ชาร์ท", "มิน", "ซากุ"], location: "ห้องประชุม A" },
  { id: "e2", title: "Deadline: iPhone 17 Air Review", type: "deadline", date: "2026-01-30", time: "18:00" },
  { id: "e3", title: "ถ่าย Unboxing MacBook Pro", type: "video", date: "2026-01-30", time: "14:00", endTime: "16:00" },
  { id: "e4", title: "Deadline: Tesla Model Y ลดราคา", type: "deadline", date: "2026-01-29", time: "12:00" },
  { id: "e5", title: "ส่ง Thumbnail BYD vs Tesla", type: "design", date: "2026-01-29", time: "10:00" },
  { id: "e6", title: "Publish: BYD vs Tesla Video", type: "video", date: "2026-01-31", time: "10:00" },
  { id: "e7", title: "ประชุม Sales Report", type: "meeting", date: "2026-02-01", time: "09:00", endTime: "10:00", attendees: ["ฟ้า", "บิ๊ก", "ซากุ"] },
  { id: "e8", title: "วันหยุดชดเชย", type: "holiday", date: "2026-02-03" },
  { id: "e9", title: "Deadline: EV Sales Infographic", type: "deadline", date: "2026-01-30", time: "18:00" },
  { id: "e10", title: "บทความ macOS 17 Features", type: "content", date: "2026-02-01", time: "18:00" },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 29)); // Jan 29, 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 29));
  const [showAddModal, setShowAddModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date(2026, 0, 29);
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getEventsForDate = (date: string) => demoEvents.filter((e) => e.date === date);

  const formatDateKey = (y: number, m: number, d: number) => 
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isToday = (d: number) => {
    const today = new Date(2026, 0, 29);
    return year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
  };

  const isSelected = (d: number) => {
    if (!selectedDate) return false;
    return year === selectedDate.getFullYear() && month === selectedDate.getMonth() && d === selectedDate.getDate();
  };

  // Generate calendar days
  const calendarDays: { day: number; currentMonth: boolean; dateKey: string }[] = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarDays.push({ day: d, currentMonth: false, dateKey: formatDateKey(year, month - 1, d) });
  }
  
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, currentMonth: true, dateKey: formatDateKey(year, month, d) });
  }
  
  // Next month days
  const remainingDays = 42 - calendarDays.length;
  for (let d = 1; d <= remainingDays; d++) {
    calendarDays.push({ day: d, currentMonth: false, dateKey: formatDateKey(year, month + 1, d) });
  }

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : null;
  const selectedEvents = selectedDateKey ? getEventsForDate(selectedDateKey) : [];

  return (
    <div className="h-[calc(100vh-3rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <p className="text-gray-400 mt-1">ปฏิทินงานและกิจกรรม</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={goToToday} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm">
            วันนี้
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
            <Plus size={16} />
            เพิ่มกิจกรรม
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
        {/* Calendar */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-lg">
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold text-white">
              {monthNames[month]} {year + 543}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg">
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, i) => (
              <div key={day} className={`text-center text-xs font-medium py-2 ${i === 0 ? "text-red-400" : "text-gray-500"}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, idx) => {
              const events = getEventsForDate(item.dateKey);
              const isTodayDate = item.currentMonth && isToday(item.day);
              const isSelectedDate = item.currentMonth && isSelected(item.day);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.currentMonth) {
                      setSelectedDate(new Date(year, month, item.day));
                    }
                  }}
                  className={`min-h-[80px] p-1 rounded-lg cursor-pointer transition-colors ${
                    !item.currentMonth ? "opacity-30" : ""
                  } ${isSelectedDate ? "bg-blue-600/20 border border-blue-500" : "hover:bg-gray-800"} ${
                    isTodayDate && !isSelectedDate ? "bg-gray-800" : ""
                  }`}
                >
                  <div className={`text-sm mb-1 ${
                    isTodayDate ? "text-blue-400 font-bold" : item.currentMonth ? "text-gray-300" : "text-gray-600"
                  } ${idx % 7 === 0 ? "text-red-400" : ""}`}>
                    {item.day}
                  </div>
                  <div className="space-y-0.5">
                    {events.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded truncate text-white ${eventTypeConfig[event.type].color}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-gray-500 px-1">+{events.length - 3} อื่นๆ</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedDate ? (
              <>
                {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear() + 543}
              </>
            ) : (
              "เลือกวันที่"
            )}
          </h3>

          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event) => {
                const config = eventTypeConfig[event.type];
                const Icon = config.icon;

                return (
                  <div key={event.id} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm">{event.title}</h4>
                        {event.time && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Clock size={12} />
                            {event.time}{event.endTime ? ` - ${event.endTime}` : ""}
                          </p>
                        )}
                        {event.location && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} />
                            {event.location}
                          </p>
                        )}
                        {event.attendees && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Users size={12} />
                            {event.attendees.join(", ")}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded text-white ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">ไม่มีกิจกรรมในวันนี้</p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-2">ประเภทกิจกรรม</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(eventTypeConfig).map(([key, cfg]) => (
                <span key={key} className={`text-xs px-2 py-1 rounded text-white ${cfg.color}`}>
                  {cfg.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-6">เพิ่มกิจกรรมใหม่</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">ชื่อกิจกรรม *</label>
                <input type="text" placeholder="ชื่อกิจกรรม..." className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">ประเภท</label>
                  <select className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300">
                    {Object.entries(eventTypeConfig).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">วันที่</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">เวลาเริ่ม</label>
                  <input type="time" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">เวลาสิ้นสุด</label>
                  <input type="time" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">ยกเลิก</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
