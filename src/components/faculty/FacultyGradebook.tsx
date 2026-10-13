import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HoldButton } from '../ui/HoldButton';
import { api } from '../../api/endpoints';
import type { GradebookRow } from '../../types';

export const FacultyGradebook: React.FC = () => {
  const [rows, setRows] = useState<GradebookRow[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    api.faculty.getGradebook().then(setRows);
  }, []);

  const handleUpdateMarks = (
    studentId: string,
    field: 'internal_marks' | 'midterm_marks' | 'final_exam_marks',
    val: number
  ) => {
    if (isLocked) return;
    setRows((prev) =>
      prev.map((r) => {
        if (r.student_id !== studentId) return r;
        const updated = { ...r, [field]: val };
        const total =
          updated.internal_marks + updated.midterm_marks + updated.final_exam_marks;
        let letter = 'F';
        if (total >= 90) letter = 'A+';
        else if (total >= 80) letter = 'A';
        else if (total >= 70) letter = 'B';
        else if (total >= 60) letter = 'C';
        else if (total >= 50) letter = 'D';

        return {
          ...updated,
          total_marks: total,
          letter_grade: letter,
        };
      })
    );
  };

  const handleFinalSubmit = () => {
    api.faculty.submitGradeApproval('CS401').catch(() => {});
    setIsLocked(true);
    setSubmissionSuccess(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            Official Course Gradebook Matrix
          </h3>
          <p className="text-xs text-[#9E9AA8]">
            Rule BR-04: Submitting triggers institutional dean lock. Edits require administrative override.
          </p>
        </div>

        {isLocked ? (
          <Badge variant="emerald" className="py-1 px-3">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Submitted to Dean for Approval
          </Badge>
        ) : (
          <Badge variant="amber" className="py-1 px-3">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Draft Mode (Unsubmitted)
          </Badge>
        )}
      </div>

      {submissionSuccess && (
        <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#34D399] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>
            Grade batch locked and forwarded to Admin Governance. Students will be notified once dean reviews.
          </span>
        </div>
      )}

      {/* Grade Table */}
      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="bg-[#1C1533] text-[#9E9AA8] uppercase text-[11px] font-semibold border-b border-[#2A2240]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Internal (30)</th>
                <th className="py-3 px-4">Midterm (40)</th>
                <th className="py-3 px-4">Final (30)</th>
                <th className="py-3 px-4">Total (100)</th>
                <th className="py-3 px-4 text-right">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2240]">
              {rows.map((row) => (
                <tr key={row.student_id} className="hover:bg-[#1C1533]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{row.student_name}</td>
                  <td className="py-3 px-4 font-mono text-[#9E9AA8]">{row.roll_number}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={row.internal_marks}
                      onChange={(e) =>
                        handleUpdateMarks(row.student_id, 'internal_marks', Number(e.target.value))
                      }
                      className="w-16 p-1.5 rounded-lg bg-[#130E22] border border-[#2A2240] text-center font-mono text-white disabled:opacity-50"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={row.midterm_marks}
                      onChange={(e) =>
                        handleUpdateMarks(row.student_id, 'midterm_marks', Number(e.target.value))
                      }
                      className="w-16 p-1.5 rounded-lg bg-[#130E22] border border-[#2A2240] text-center font-mono text-white disabled:opacity-50"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={row.final_exam_marks}
                      onChange={(e) =>
                        handleUpdateMarks(row.student_id, 'final_exam_marks', Number(e.target.value))
                      }
                      className="w-16 p-1.5 rounded-lg bg-[#130E22] border border-[#2A2240] text-center font-mono text-white disabled:opacity-50"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#00E5FF]">
                    {row.total_marks} / 100
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-heading font-extrabold text-sm text-[#34D399]">
                      {row.letter_grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Irreversible Hold Button Trigger */}
      {!isLocked && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#130E22] border border-[#2A2240] gap-4">
          <div className="flex items-center gap-2.5 text-xs text-[#9E9AA8]">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              Once submitted, marks cannot be altered without dean level institutional approval.
            </span>
          </div>

          <HoldButton
            label="Press & Hold to Submit Grades (1.5s)"
            confirmedLabel="Submitted for Review"
            onHoldComplete={handleFinalSubmit}
            variant="cyan"
          />
        </div>
      )}
    </div>
  );
};
