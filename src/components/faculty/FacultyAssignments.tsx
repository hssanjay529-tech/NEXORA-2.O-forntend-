import React, { useState, useEffect } from 'react';
import { Plus, Clock, Edit3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { api } from '../../api/endpoints';
import type { AssignmentItem } from '../../types';

export const FacultyAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(50);
  const [dueDate, setDueDate] = useState('2026-10-25');

  useEffect(() => {
    api.faculty.getAssignments().then(setAssignments);
  }, []);

  const handleCreate = () => {
    const newItem: AssignmentItem = {
      id: `asg-${Date.now()}`,
      title,
      course_code: 'CS401',
      due_date: dueDate,
      total_points: points,
      submissions_count: 0,
      graded_count: 0,
    };
    setAssignments([newItem, ...assignments]);
    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Assignment & Quiz Studio</h3>
          <p className="text-xs text-[#9E9AA8]">
            Author rubric-driven problem sets and review student submissions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> + New Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map((asg) => (
          <Card key={asg.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#00E5FF] font-semibold">
                  {asg.course_code}
                </span>
                <Badge variant="cyan">{asg.total_points} Points</Badge>
              </div>
              <CardTitle className="text-base mt-1">{asg.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#9E9AA8]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#00E5FF]" /> Due Date:
                </span>
                <span className="text-white font-medium">{asg.due_date}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#130E22] border border-[#2A2240] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#9E9AA8]">Submissions:</span>
                  <p className="font-semibold text-white">
                    {asg.submissions_count} Students
                  </p>
                </div>
                <div>
                  <span className="text-[#9E9AA8]">Graded:</span>
                  <p className="font-semibold text-[#34D399]">
                    {asg.graded_count} / {asg.submissions_count}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full text-xs flex items-center justify-center gap-2"
                onClick={() => alert(`Opening grading drawer for ${asg.title}`)}
              >
                <Edit3 className="w-3.5 h-3.5" /> Grade Submissions Roster
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Course Assignment"
        description="Students will receive an immediate notification alert on publish."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">Assignment Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Problem Set 2: Distributed Raft Election"
              className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Max Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate} disabled={!title}>
              Publish Assignment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
