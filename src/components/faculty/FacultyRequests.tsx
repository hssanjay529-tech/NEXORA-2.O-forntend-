import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const FacultyRequests: React.FC = () => {
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [dates, setDates] = useState('2026-10-28 to 2026-10-30');
  const [reason, setReason] = useState('');

  const requests = [
    { id: 'REQ-402', type: 'Duty Leave', details: 'International ACM SIGMOD Conference', dates: 'Nov 12 - Nov 15', status: 'APPROVED' },
    { id: 'REQ-389', type: 'Timetable Swap', details: 'Swap CS401 Lab Slot with Prof. Chen', dates: 'Oct 14', status: 'IN_PROGRESS' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSubmitted(true);
    setTimeout(() => setLeaveSubmitted(false), 3000);
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-bold text-lg text-white">
          Operational Requests & Timetable Swaps
        </h3>
        <p className="text-xs text-[#9E9AA8]">
          Submit duty leaves, casual leaves, and request substitute coverage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Leave Application Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Submit Leave / Duty Travel Request</CardTitle>
          </CardHeader>
          <CardContent>
            {leaveSubmitted && (
              <div className="mb-4 p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#34D399] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Leave application dispatched to Dean of Faculty Affairs.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-1.5">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
                  >
                    <option value="CASUAL">Casual Leave</option>
                    <option value="DUTY">On Duty (Conference / Research)</option>
                    <option value="MEDICAL">Medical Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-1.5">Target Dates Range</label>
                  <input
                    type="text"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-1.5">
                  Academic Justification & Class Coverage Arrangements
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detail who will cover assigned laboratory sessions..."
                  className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" type="submit" disabled={!reason}>
                  Submit Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Existing Status Tracker */}
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-xl bg-[#130E22] border border-[#2A2240] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{req.type}</span>
                  <Badge variant={req.status === 'APPROVED' ? 'emerald' : 'amber'}>
                    {req.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#9E9AA8]">{req.details}</p>
                <span className="text-[10px] text-[#00E5FF] font-mono">{req.dates}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
