import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { api } from '../../api/endpoints';
import type { CourseAttendanceSummary } from '../../types';

export const StudentAcademics: React.FC = () => {
  const [attendance, setAttendance] = useState<CourseAttendanceSummary[]>([]);

  useEffect(() => {
    api.student.getAttendanceSummary().then(setAttendance);
  }, []);

  const scheduleSlots = [
    { day: 'Monday', time: '09:00 - 10:30', course: 'CS401: Advanced Algorithms', room: 'Hall A-101', faculty: 'Dr. Elena Vance' },
    { day: 'Monday', time: '11:00 - 12:30', course: 'CS402: Distributed Systems', room: 'Lab 3B', faculty: 'Prof. Marcus Chen' },
    { day: 'Tuesday', time: '14:00 - 15:30', course: 'CS405: Cloud Computing', room: 'Hall B-204', faculty: 'Dr. Elena Vance' },
    { day: 'Wednesday', time: '10:00 - 12:00', course: 'EE301: Embedded Microcontrollers', room: 'Hardware Lab', faculty: 'Dr. Rajesh Rao' },
    { day: 'Thursday', time: '09:00 - 10:30', course: 'CS401: Advanced Algorithms (Tutorial)', room: 'Seminar Hall 2', faculty: 'Dr. Elena Vance' },
    { day: 'Friday', time: '14:00 - 17:00', course: 'CS402: Distributed Systems Lab Practicum', room: 'Systems Lab 1', faculty: 'Prof. Marcus Chen' },
  ];

  return (
    <div className="space-y-6">
      {/* Attendance Breakdown Grid with Exam Eligibility (BR-07) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">
              Course Attendance & Exam Eligibility
            </h3>
            <p className="text-xs text-[#9E9AA8]">
              Statutory 75.0% threshold enforced for Hall Ticket clearance
            </p>
          </div>
          <Badge variant="cyan">FALL 2026 AUDIT</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {attendance.map((item) => (
            <Card
              key={item.course_code}
              className={
                item.is_eligible
                  ? 'border-emerald-500/30'
                  : 'border-red-500/50 bg-gradient-to-br from-[#1C0D1B] to-[#130E22]'
              }
            >
              <CardHeader className="!pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#00E5FF] font-semibold">
                    {item.course_code}
                  </span>
                  {item.is_eligible ? (
                    <Badge variant="emerald" className="text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Eligible
                    </Badge>
                  ) : (
                    <Badge variant="crimson" className="text-[10px]">
                      <AlertTriangle className="w-3 h-3 mr-1" /> At Risk
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm mt-1 truncate">{item.course_name}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold font-heading text-white">
                    {item.percentage.toFixed(1)}%
                  </span>
                  <span className="text-[11px] text-[#9E9AA8]">
                    {item.sessions_attended} / {item.sessions_held} Sessions
                  </span>
                </div>

                <div className="w-full bg-[#1C1533] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      item.is_eligible
                        ? 'bg-gradient-to-r from-[#00E5FF] to-[#10B981]'
                        : 'bg-gradient-to-r from-red-600 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>

                {!item.is_eligible && (
                  <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    Must attend next <strong>{item.classes_needed} consecutive sessions</strong> to regain 75% eligibility.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interactive Weekly Timetable Matrix */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00E5FF]" />
              <CardTitle>Weekly Academic Schedule</CardTitle>
            </div>
            <span className="text-xs text-[#9E9AA8]">Synced with Room Allocations</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {scheduleSlots.map((slot, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-[#1C1533]/80 border border-[#2A2240] hover:border-[#00E5FF]/40 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-[#00E5FF] font-semibold">
                    <span>{slot.day}</span>
                    <span className="text-[11px] text-[#9E9AA8] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {slot.time}
                    </span>
                  </div>
                  <p className="font-semibold text-white">{slot.course}</p>
                  <div className="flex items-center justify-between text-[#9E9AA8] pt-1 border-t border-[#2A2240]/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#7C3AED]" /> {slot.room}
                    </span>
                    <span>{slot.faculty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
