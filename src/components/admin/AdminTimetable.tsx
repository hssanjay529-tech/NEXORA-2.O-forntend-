import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Plus, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { api } from '../../api/endpoints';
import type { TimetableSlot } from '../../types';

const DAY_LABELS: Record<string, string> = {
  MON: 'MONDAY',
  TUE: 'TUESDAY',
  WED: 'WEDNESDAY',
  THU: 'THURSDAY',
  FRI: 'FRIDAY',
};

const DAY_TO_BACKEND: Record<string, string> = {
  MON: 'MONDAY',
  TUE: 'TUESDAY',
  WED: 'WEDNESDAY',
  THU: 'THURSDAY',
  FRI: 'FRIDAY',
};

export const AdminTimetable: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'>('MON');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Allocation options
  const [options, setOptions] = useState<{ offerings: any[]; rooms: any[]; faculty: any[] }>({
    offerings: [],
    rooms: [],
    faculty: [],
  });

  // Form state
  const [formData, setFormData] = useState({
    offering_id: '',
    room_id: '',
    faculty_id: '',
    day_of_week: 'MON',
    start_time: '09:00',
    end_time: '10:30',
  });

  const loadSlots = () => {
    api.admin.getTimetableSlots().then(setSlots);
  };

  useEffect(() => {
    loadSlots();
    api.admin.getAllocationOptions().then((opts) => {
      setOptions(opts);
      if (opts.offerings.length > 0) {
        setFormData((prev) => ({
          ...prev,
          offering_id: prev.offering_id || opts.offerings[0].id,
          room_id: prev.room_id || (opts.rooms[0]?.id ?? ''),
          faculty_id: prev.faculty_id || (opts.faculty[0]?.id ?? ''),
        }));
      }
    });
  }, []);

  const days: Array<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'> = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const filteredSlots = slots.filter((s) => s.day_of_week === selectedDay);

  const handleOpenModal = () => {
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleAllocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (!formData.offering_id || !formData.room_id) {
        setErrorMessage('Please select both a course offering and a room facility.');
        setIsSubmitting(false);
        return;
      }

      const dayBackend = DAY_TO_BACKEND[formData.day_of_week] || 'MONDAY';
      await api.admin.createTimetableSlot({
        offering_id: formData.offering_id,
        room_id: formData.room_id,
        faculty_id: formData.faculty_id || undefined,
        day_of_week: dayBackend,
        start_time: formData.start_time.length === 5 ? `${formData.start_time}:00` : formData.start_time,
        end_time: formData.end_time.length === 5 ? `${formData.end_time}:00` : formData.end_time,
      });

      setSuccessMessage(`Lecture slot successfully scheduled and saved to database for ${DAY_LABELS[formData.day_of_week]}!`);
      setIsModalOpen(false);
      setSelectedDay(formData.day_of_week as any);
      loadSlots();

      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Conflict detected or unable to allocate slot';
      setErrorMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            Academic Schedule & Facility Matrix
          </h3>
          <p className="text-xs text-[#9E9AA8]">
            Automated conflict resolver prevents faculty overlaps and auditorium capacity breaches
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenModal}
          className="text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_20px_rgba(0,229,255,0.5)]"
        >
          <Plus className="w-3.5 h-3.5" /> + Allocate Lecture Slot
        </Button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-xs text-[#34D399] flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <span>{successMessage}</span>
          </div>
          <Badge variant="emerald">DATABASE COMMITTED</Badge>
        </div>
      )}

      {/* Days Tabs - Fixed Day Label Typos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedDay === day
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-[#0B0F19] shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'bg-[#130E22] text-[#9E9AA8] hover:text-white border border-[#2A2240]'
            }`}
          >
            {DAY_LABELS[day]}
          </button>
        ))}
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.length > 0 ? (
          filteredSlots.map((slot) => (
            <Card key={slot.id} className="border-[#2A2240] hover:border-[#00E5FF]/40 transition-all">
              <CardHeader className="!pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#00E5FF] font-semibold">
                    {slot.course_code}
                  </span>
                  <Badge variant="cyan" className="font-mono text-[10px]">
                    <Clock className="w-3 h-3 mr-1" /> {slot.start_time} - {slot.end_time}
                  </Badge>
                </div>
                <CardTitle className="text-sm mt-1">{slot.course_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#9E9AA8]">
                  <span>Faculty:</span>
                  <span className="text-white font-medium">{slot.faculty_name}</span>
                </div>
                <div className="flex items-center justify-between text-[#9E9AA8]">
                  <span>Facility Room:</span>
                  <span className="text-[#34D399] font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#7C3AED]" /> {slot.room_number}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-8 rounded-xl bg-[#130E22] border border-[#2A2240] text-center text-xs text-[#9E9AA8]">
            No lecture allocations scheduled for {DAY_LABELS[selectedDay]}. Click "+ Allocate Lecture Slot" to schedule one.
          </div>
        )}
      </div>

      {/* Allocation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F0B1E] border border-[#2A2240] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#2A2240] bg-[#16102B]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                <h4 className="font-heading font-bold text-white text-base">Allocate Lecture Slot</h4>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#9E9AA8] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Course Offering Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9E9AA8]">Course Offering / Subject</label>
                <select
                  value={formData.offering_id}
                  onChange={(e) => {
                    const offId = e.target.value;
                    const selectedOff = options.offerings.find((o) => o.id === offId);
                    setFormData((prev) => ({
                      ...prev,
                      offering_id: offId,
                      faculty_id: selectedOff?.faculty_id || prev.faculty_id,
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A142E] border border-[#2A2240] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  required
                >
                  <option value="" disabled>Select course offering...</option>
                  {options.offerings.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.course_code} - {off.title} (Sec {off.section || 'A'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Facility Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9E9AA8]">Facility / Classroom Room</label>
                <select
                  value={formData.room_id}
                  onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A142E] border border-[#2A2240] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  required
                >
                  <option value="" disabled>Select venue room...</option>
                  {options.rooms.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.code} - {rm.building} ({rm.room_type || 'Hall'}, Cap: {rm.capacity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Faculty Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9E9AA8]">Assigned Faculty</label>
                <select
                  value={formData.faculty_id}
                  onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A142E] border border-[#2A2240] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="">Auto-assign / Instructor from Offering</option>
                  {options.faculty.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Day of Week */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#9E9AA8]">Day of Week</label>
                <div className="grid grid-cols-5 gap-2">
                  {days.map((day) => (
                    <button
                      type="button"
                      key={day}
                      onClick={() => setFormData({ ...formData, day_of_week: day })}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                        formData.day_of_week === day
                          ? 'bg-[#00E5FF] text-[#0B0F19]'
                          : 'bg-[#1A142E] text-[#9E9AA8] border border-[#2A2240] hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#9E9AA8]">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1A142E] border border-[#2A2240] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#9E9AA8]">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1A142E] border border-[#2A2240] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                    required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A2240]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#9E9AA8] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="text-xs flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Allocating...' : 'Confirm & Allocate Slot'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
