import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { api } from '../../api/endpoints';
import type { GrievanceTicket } from '../../types';

export const StudentServices: React.FC = () => {
  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'ACADEMIC' | 'FINANCE' | 'FACILITY' | 'EXAMINATION' | 'GENERAL'>('ACADEMIC');
  const [description, setDescription] = useState('');

  useEffect(() => {
    api.student.getGrievances().then(setTickets);
  }, []);

  const handleCreate = () => {
    api.student.createGrievance(category, subject, description).catch(() => {});
    const newTicket: GrievanceTicket = {
      id: `GRV-${Math.floor(100 + Math.random() * 900)}`,
      category,
      subject,
      status: 'IN_PROGRESS',
      created_at: new Date().toISOString().split('T')[0],
      last_reply: 'Ticket acknowledged by Student Support Desk.',
    };
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setSubject('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Student Support & Services Desk</h3>
          <p className="text-xs text-[#9E9AA8]">
            Lodge administrative appeals, service grievances, or request bonafide certificates
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="text-xs">
          + Lodge Grievance Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Grievances List */}
        <div className="lg:col-span-2 space-y-3">
          {tickets.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#00E5FF] font-semibold">{t.id}</span>
                  <Badge variant="outline">{t.category}</Badge>
                </div>
                <Badge variant={t.status === 'RESOLVED' ? 'emerald' : 'amber'}>
                  {t.status}
                </Badge>
              </div>

              <h4 className="font-semibold text-sm text-white mt-2">{t.subject}</h4>
              {t.last_reply && (
                <p className="text-xs text-[#9E9AA8] mt-1.5 p-2.5 rounded-lg bg-[#1C1533] border border-[#2A2240]">
                  <strong className="text-white">Admin Response:</strong> {t.last_reply}
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Certificate Requests Quick Box */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00E5FF]" />
              <CardTitle className="text-base">Document Issuance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#130E22] border border-[#2A2240] flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Bonafide Certificate</p>
                <p className="text-[10px] text-[#9E9AA8]">Verification Code: DOC-88F41A</p>
              </div>
              <Badge variant="emerald">READY</Badge>
            </div>
            <div className="p-3 rounded-xl bg-[#130E22] border border-[#2A2240] flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Official Grade Transcript</p>
                <p className="text-[10px] text-[#9E9AA8]">Signed by Academic Registrar</p>
              </div>
              <Badge variant="emerald">READY</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="File Support Grievance"
        description="Your concern will be assigned directly to the institutional ombudsperson."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
            >
              <option value="ACADEMIC">Academic / Course Issue</option>
              <option value="FINANCE">Finance / Scholarship Dues</option>
              <option value="FACILITY">Laboratory / Campus Facility</option>
              <option value="EXAMINATION">Examination / Hall Ticket</option>
              <option value="GENERAL">General Support</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your grievance..."
              className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1.5">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete facts, affected course codes, or reference receipts..."
              className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate} disabled={!subject}>
              Submit Ticket
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
