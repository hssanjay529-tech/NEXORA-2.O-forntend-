import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  FolderOpen,
  FileCheck,
  Award,
  Send,
} from 'lucide-react';
import { ProfileCard } from '../ui/ProfileCard';
import { GlassIcons, type GlassIconItem } from '../ui/GlassIcons';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/endpoints';
import type { FacultyLecture } from '../../types';

interface FacultyDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState<FacultyLecture[]>([]);

  useEffect(() => {
    api.faculty.getTodayLectures().then(setLectures);
  }, []);

  const launchpadItems: GlassIconItem[] = [
    {
      id: 'attendance',
      label: 'Attendance',
      description: 'Record lecture roster',
      icon: CheckCircle2,
      color: '#00E5FF',
      badge: 'Today',
      onClick: () => onNavigateTab('attendance'),
    },
    {
      id: 'gradebook',
      label: 'Gradebook',
      description: 'Review final marks',
      icon: Award,
      color: '#7C3AED',
      badge: 'Hold Lock',
      onClick: () => onNavigateTab('gradebook'),
    },
    {
      id: 'materials',
      label: 'Materials',
      description: 'Upload unit notes',
      icon: FolderOpen,
      color: '#10B981',
      onClick: () => onNavigateTab('materials'),
    },
    {
      id: 'assignments',
      label: 'Assignments',
      description: 'Grade student papers',
      icon: FileCheck,
      color: '#F59E0B',
      badge: '61 Papers',
      onClick: () => onNavigateTab('assignments'),
    },
    {
      id: 'requests',
      label: 'Duty Leave',
      description: 'Swaps & applications',
      icon: Send,
      color: '#00E5FF',
      onClick: () => onNavigateTab('requests'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Faculty 3D Profile Card */}
      <ProfileCard user={user} />

      {/* Glass Icons Launchpad */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-sm text-white">Faculty Launchpad</h3>
          <span className="text-[11px] text-[#9E9AA8]">Teaching Workspace</span>
        </div>
        <GlassIcons items={launchpadItems} />
      </div>

      {/* Today's Teaching Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00E5FF]" />
              <CardTitle>Today's Teaching Schedule</CardTitle>
            </div>
            <Badge variant="cyan">FALL 2026 SEMESTER</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lectures.map((lec) => (
              <div
                key={lec.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#1C1533]/80 border border-[#2A2240] hover:border-[#00E5FF]/40 transition-all gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#00E5FF] font-semibold">
                      {lec.course_code}
                    </span>
                    <span className="font-semibold text-sm text-white">{lec.course_name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#9E9AA8] mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#00E5FF]" /> {lec.time_slot}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" /> {lec.room_number}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#10B981]" /> {lec.student_count} Enrolled
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('attendance')}
                  className="btn-primary text-xs !py-1.5 !px-3"
                >
                  Open Attendance Matrix →
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
