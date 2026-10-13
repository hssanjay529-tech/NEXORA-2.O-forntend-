import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Upload, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { api } from '../../api/endpoints';
import type { StudentAssignment } from '../../types';

export const StudentAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [selectedAsg, setSelectedAsg] = useState<StudentAssignment | null>(null);
  const [notes, setNotes] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    api.student.getAssignments().then(setAssignments);
  }, []);

  const handleOpenSubmit = (asg: StudentAssignment) => {
    setSelectedAsg(asg);
    setNotes('');
    setSubmitSuccess(false);
  };

  const handleConfirmSubmit = () => {
    if (!selectedAsg) return;
    setAssignments((prev) =>
      prev.map((a) => (a.id === selectedAsg.id ? { ...a, status: 'SUBMITTED' } : a))
    );
    setSubmitSuccess(true);
    setTimeout(() => {
      setSelectedAsg(null);
      setSubmitSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Student Assignment Hub</h3>
          <p className="text-xs text-[#9E9AA8]">
            Submit laboratory write-ups, problem sets, and review faculty rubrics
          </p>
        </div>
        <Badge variant="cyan">{assignments.length} Course Trackers</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((asg) => (
          <Card key={asg.id} className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00E5FF]">{asg.course_name}</span>
                  <Badge
                    variant={
                      asg.status === 'GRADED'
                        ? 'emerald'
                        : asg.status === 'SUBMITTED'
                        ? 'violet'
                        : 'amber'
                    }
                  >
                    {asg.status}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-1.5">{asg.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#9E9AA8]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#00E5FF]" /> Due:
                  </span>
                  <span className="text-white font-medium">{asg.due_date}</span>
                </div>

                {asg.status === 'GRADED' && (
                  <div className="p-3 rounded-xl bg-[#1C1533] border border-[#2A2240] space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#9E9AA8]">Awarded Score:</span>
                      <span className="font-heading font-bold text-base text-[#34D399]">
                        {asg.score} / {asg.max_score}
                      </span>
                    </div>
                    {asg.feedback && (
                      <p className="text-[11px] text-[#C4B5FD] flex items-start gap-1 pt-1 border-t border-[#2A2240]">
                        <MessageSquare className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 mt-0.5" />
                        <span>"{asg.feedback}"</span>
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </div>

            <div className="pt-4 border-t border-[#2A2240] mt-3">
              {asg.status === 'PENDING' ? (
                <Button
                  variant="primary"
                  onClick={() => handleOpenSubmit(asg)}
                  className="w-full text-xs flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" /> Submit Work
                </Button>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="w-full text-xs flex items-center justify-center gap-2 opacity-70"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  {asg.status === 'GRADED' ? 'Grading Finalized' : 'Submitted for Review'}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedAsg && (
        <Modal
          isOpen={!!selectedAsg}
          onClose={() => setSelectedAsg(null)}
          title={`Submit: ${selectedAsg.title}`}
          description={selectedAsg.course_name}
        >
          {submitSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
              <h4 className="font-heading font-bold text-white text-base">Submission Received</h4>
              <p className="text-xs text-[#9E9AA8]">
                Your deliverable was uploaded to the academic repository.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1.5">
                  Submission Notes / Code Repository URL
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste GitHub repository branch, commit hash, or submission remarks..."
                  className="w-full p-3 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl border border-dashed border-[#2A2240] bg-[#130E22]/50 text-center space-y-2">
                <Upload className="w-6 h-6 text-[#00E5FF] mx-auto" />
                <p className="text-xs text-white font-medium">Attach PDF or ZIP Deliverable</p>
                <p className="text-[10px] text-[#9E9AA8]">Drag and drop up to 25MB max</p>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button variant="outline" onClick={() => setSelectedAsg(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirmSubmit}>
                  Confirm & Dispatch
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
