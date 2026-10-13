import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FolderFloat } from '../ui/FolderFloat';
import { api } from '../../api/endpoints';
import type { ExamHallTicket } from '../../types';

export const StudentExams: React.FC = () => {
  const [hallTickets, setHallTickets] = useState<ExamHallTicket[]>([]);

  useEffect(() => {
    api.student.getHallTickets().then(setHallTickets);
  }, []);

  const eligibilityCriteria = [
    { rule: 'Attendance Threshold (BR-07)', required: '>= 75.0%', status: '88.5% Achieved' },
    { rule: 'Tuition Fee Dues Clearance', required: 'Zero Overdue', status: 'Settled' },
    { rule: 'Academic Disciplinary Sanctions', required: 'Clean Record', status: 'No Violations' },
    { rule: 'Laboratory Practical Sign-off', required: 'All Completed', status: 'Signed by HOD' },
  ];

  const hallTicketFiles = hallTickets.map((ht) => ({
    id: ht.exam_id,
    name: `${ht.exam_name}_HallTicket.pdf`,
    size: '1.4 MB',
    date: ht.issue_date,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Examinations & Hall Tickets</h3>
          <p className="text-xs text-[#9E9AA8]">
            Automated eligibility verification rule engine (BR-07) and tamper-proof ticket issuance
          </p>
        </div>
        <Badge variant="emerald">EXAMINATION CLEARED</Badge>
      </div>

      {/* Statutory Eligibility Checklist */}
      <Card className="border-emerald-500/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <CardTitle>Institutional Eligibility Checklist</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {eligibilityCriteria.map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{item.rule}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="flex items-center justify-between text-[#9E9AA8] text-[11px]">
                  <span>Required: {item.required}</span>
                  <span className="text-[#34D399] font-medium">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hall Ticket & Scheduled Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ReactBits FolderFloat Document Vault */}
        <FolderFloat
          title="Verified Hall Ticket Repository"
          category="Term End Examinations"
          files={hallTicketFiles}
          onDownload={(id) => alert(`Downloading verified hall ticket for ${id}`)}
        />

        {/* Seat & Desk Verification Card */}
        {hallTickets[0] && (
          <Card className="bg-gradient-to-br from-[#16102B] via-[#120D24] to-[#0A0714]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Allocated Desk & Security Token</CardTitle>
                <Badge variant="cyan">HALL A-101</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-[#130E22] border border-[#2A2240] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9E9AA8]">Allocated Exam Desk:</span>
                  <span className="text-white font-mono font-bold text-sm">
                    {hallTickets[0].seat_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9AA8]">Verification Checksum:</span>
                  <span className="text-[#00E5FF] font-mono font-semibold">
                    {hallTickets[0].verification_code}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9AA8]">Examination Window:</span>
                  <span className="text-white">Nov 02 – Nov 16, 2026</span>
                </div>
              </div>

              <p className="text-[11px] text-[#9E9AA8] leading-relaxed">
                Physical printed hall ticket with digital QR verification must be presented at the
                examination hall 15 minutes prior to session commencement.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
