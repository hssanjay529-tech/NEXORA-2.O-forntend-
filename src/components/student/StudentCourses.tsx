import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Plus, Trash2, Clock, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { api } from '../../api/endpoints';
import type { CourseCatalogItem } from '../../types';

export const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<CourseCatalogItem[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    api.student.getAvailableCourses().then((data) => {
      setCourses(data);
    });
  }, []);

  const handleToggleEnrollment = (course: CourseCatalogItem) => {
    if (course.is_enrolled) {
      // Drop course
      api.student.dropCourse(course.id).catch(() => {});
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id
            ? { ...c, is_enrolled: false, enrolled_seats: c.enrolled_seats - 1 }
            : c
        )
      );
      setActionSuccess(`Successfully dropped ${course.code}`);
    } else {
      // Enroll
      api.student.registerCourse(course.id).catch(() => {});
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id
            ? { ...c, is_enrolled: true, enrolled_seats: c.enrolled_seats + 1 }
            : c
        )
      );
      setActionSuccess(`Successfully enrolled in ${course.code}`);
    }
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const totalEnrolledCredits = courses
    .filter((c) => c.is_enrolled)
    .reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6">
      {/* Active Enrolment Window Banner */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-[#19122E] via-[#120D24] to-[#0A0714] border border-[#3A2D5C] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-white">
                Fall 2026 Course Enrolment Window
              </h2>
              <Badge variant="emerald">ACTIVE</Badge>
            </div>
            <p className="text-xs text-[#9E9AA8] mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
              Add/Drop window closes on October 18, 2026 at 23:59 UTC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#130E22] px-4 py-2 rounded-xl border border-[#2A2240]">
          <div className="text-right">
            <span className="text-[11px] text-[#9E9AA8]">Registered Credits</span>
            <p className="font-heading font-extrabold text-lg text-[#00E5FF]">
              {totalEnrolledCredits} / 22 Max
            </p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#34D399] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Course Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const seatsLeft = course.total_seats - course.enrolled_seats;
          const isFull = seatsLeft <= 0;

          return (
            <Card
              key={course.id}
              className={`flex flex-col justify-between transition-all ${
                course.is_enrolled ? 'border-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.15)]' : ''
              }`}
            >
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#00E5FF] font-semibold">
                      {course.code}
                    </span>
                    <Badge variant={course.is_enrolled ? 'cyan' : 'outline'}>
                      {course.credits} Credits
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-1.5">{course.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-xs text-[#9E9AA8]">
                    <span>Instructor: </span>
                    <span className="text-white font-medium">{course.faculty_name}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2A2240]">
                    <span className="text-[#9E9AA8] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Seat Capacity:
                    </span>
                    <span
                      className={`font-semibold ${
                        isFull ? 'text-red-400' : 'text-[#34D399]'
                      }`}
                    >
                      {course.enrolled_seats} / {course.total_seats}{' '}
                      <span className="text-[10px] text-[#9E9AA8]">({seatsLeft} remaining)</span>
                    </span>
                  </div>
                </CardContent>
              </div>

              <div className="pt-4 border-t border-[#2A2240] mt-3">
                {course.is_enrolled ? (
                  <Button
                    variant="outline"
                    onClick={() => handleToggleEnrollment(course)}
                    className="w-full text-xs !text-red-400 hover:!bg-red-500/10 hover:!border-red-500/40 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Drop Enrolment
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    disabled={isFull}
                    onClick={() => handleToggleEnrollment(course)}
                    className="w-full text-xs flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {isFull ? 'Section Full' : 'Enrol in Course'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
