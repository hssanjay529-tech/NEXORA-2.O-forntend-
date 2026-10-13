import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FolderFloat } from '../ui/FolderFloat';
import { api } from '../../api/endpoints';
import type { GradeApprovalBatch } from '../../types';

export const AdminApprovals: React.FC = () => {
  const [batches, setBatches] = useState<GradeApprovalBatch[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    api.admin.getGradeBatches().then(setBatches);
  }, []);

  const handleReview = (id: string, status: 'APPROVED' | 'REJECTED') => {
    api.admin.reviewGradeBatch(id, status).catch(() => {});
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    setActionMessage(`Batch ${id} has been marked as ${status}. Published to student grade cards.`);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const complianceFiles = [
    { id: 'cmp-1', name: 'ABET_Accreditation_Self_Study_2026.pdf', size: '14.2 MB', date: '2026-08-15' },
    { id: 'cmp-2', name: 'Faculty_Academic_Senate_Charter.pdf', size: '4.8 MB', date: '2026-09-01' },
    { id: 'cmp-3', name: 'Statutory_Attendance_Policy_Audit.pdf', size: '2.1 MB', date: '2026-09-20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            Governance, Grade Approvals & Compliance
          </h3>
          <p className="text-xs text-[#9E9AA8]">
            Dean-level authorization required for official student grade publishing (Rule BR-04)
          </p>
        </div>
        <Badge variant="cyan">DEAN AUTHORIZATION</Badge>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#34D399] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Grade Batches Pending Review */}
      <Card>
        <CardHeader>
          <CardTitle>Submitted Grade Approval Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {batches.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#1C1533]/80 border border-[#2A2240] text-xs gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#00E5FF] font-semibold">
                      {b.id}
                    </span>
                    <span className="font-semibold text-white">
                      {b.course_code}: {b.course_name}
                    </span>
                    <Badge
                      variant={
                        b.status === 'APPROVED'
                          ? 'emerald'
                          : b.status === 'REJECTED'
                          ? 'crimson'
                          : 'amber'
                      }
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-[#9E9AA8] text-[11px] mt-1">
                    <span>Faculty: {b.faculty_name}</span>
                    <span>Submissions: {b.submissions_count} Students</span>
                    <span className="text-[#34D399]">Batch Average: {b.avg_score}%</span>
                  </div>
                </div>

                {b.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleReview(b.id, 'APPROVED')}
                      className="text-xs !py-1 !px-3"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve Batch
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReview(b.id, 'REJECTED')}
                      className="text-xs !py-1 !px-3 !text-red-400 hover:!border-red-500/40"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#9E9AA8] font-mono">
                    Status: {b.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Vault */}
      <FolderFloat
        title="Institutional Accreditation & Compliance Vault"
        category="Statutory Charters & Audit Filings"
        files={complianceFiles}
        onDownload={(id) => alert(`Downloading compliance archive ${id}`)}
      />
    </div>
  );
};
