import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { useAuth } from '../../context/AuthContext';
import { LoginView } from '../auth/LoginView';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { NexoraIntro, DISABLE_INTRO, INTRO_SEEN_KEY } from '../intro/NexoraIntro';

// Student Components
import { StudentDashboard } from '../student/StudentDashboard';
import { StudentCourses } from '../student/StudentCourses';
import { StudentAcademics } from '../student/StudentAcademics';
import { StudentAssignments } from '../student/StudentAssignments';
import { StudentFees } from '../student/StudentFees';
import { StudentExams } from '../student/StudentExams';
import { StudentServices } from '../student/StudentServices';

// Faculty Components
import { FacultyDashboard } from '../faculty/FacultyDashboard';
import { FacultyAttendance } from '../faculty/FacultyAttendance';
import { FacultyMaterials } from '../faculty/FacultyMaterials';
import { FacultyAssignments } from '../faculty/FacultyAssignments';
import { FacultyGradebook } from '../faculty/FacultyGradebook';
import { FacultyRequests } from '../faculty/FacultyRequests';

// Admin Components
import { AdminDashboard } from '../admin/AdminDashboard';
import { AdminUsers } from '../admin/AdminUsers';
import { AdminTimetable } from '../admin/AdminTimetable';
import { AdminFinance } from '../admin/AdminFinance';
import { AdminApprovals } from '../admin/AdminApprovals';
import { AdminAuditLogs } from '../admin/AdminAuditLogs';

// Dean Components
import { DeanDashboard } from '../dean/DeanDashboard';

export const AppLayout: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Determine whether the intro animation should play
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    // 1. Never show intro if user is already authenticated
    if (isAuthenticated) return false;

    // 2. Check global disable switch
    if (DISABLE_INTRO) return false;

    // 3. Check explicit URL query param to force replay (e.g. ?replay_intro=true)
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      if (search.includes('replay_intro=true') || search.includes('intro=1')) {
        try {
          sessionStorage.removeItem(INTRO_SEEN_KEY);
        } catch {
          // ignore storage error
        }
        return true;
      }
    }

    // 4. Check if already played in this browser session
    try {
      const seen = sessionStorage.getItem(INTRO_SEEN_KEY);
      return seen !== 'true';
    } catch {
      return false;
    }
  });

  // Sync default tab whenever the role changes
  useEffect(() => {
    if (role === 'STUDENT') setActiveTab('overview');
    else if (role === 'FACULTY') setActiveTab('dashboard');
    else if (role === 'ADMIN') setActiveTab('analytics');
    else if (role === 'DEAN') setActiveTab('overview');
  }, [role]);

  // If user is unauthenticated, strictly block portal layout and show Login
  if (showIntro) {
    return (
      <NexoraIntro
        onComplete={() => {
          setShowIntro(false);
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderContent = () => {
    if (role === 'STUDENT') {
      switch (activeTab) {
        case 'overview':
          return <StudentDashboard onNavigateTab={setActiveTab} />;
        case 'courses':
          return <StudentCourses />;
        case 'academics':
          return <StudentAcademics />;
        case 'assignments':
          return <StudentAssignments />;
        case 'fees':
          return <StudentFees />;
        case 'exams':
          return <StudentExams />;
        case 'services':
          return <StudentServices />;
        default:
          return <StudentDashboard onNavigateTab={setActiveTab} />;
      }
    }

    if (role === 'FACULTY') {
      switch (activeTab) {
        case 'dashboard':
          return <FacultyDashboard onNavigateTab={setActiveTab} />;
        case 'attendance':
          return <FacultyAttendance />;
        case 'materials':
          return <FacultyMaterials />;
        case 'assignments':
          return <FacultyAssignments />;
        case 'gradebook':
          return <FacultyGradebook />;
        case 'requests':
          return <FacultyRequests />;
        default:
          return <FacultyDashboard onNavigateTab={setActiveTab} />;
      }
    }

    if (role === 'ADMIN') {
      switch (activeTab) {
        case 'analytics':
          return <AdminDashboard />;
        case 'users':
          return <AdminUsers />;
        case 'timetable':
          return <AdminTimetable />;
        case 'finance':
          return <AdminFinance />;
        case 'approvals':
          return <AdminApprovals />;
        case 'audit':
          return <AdminAuditLogs />;
        default:
          return <AdminDashboard />;
      }
    }

    if (role === 'DEAN') {
      return <DeanDashboard />;
    }

    return null;
  };

  return (
    <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN', 'DEAN']}>
      <div className="bg-cosmic-950 text-slate-100 font-sans antialiased cosmic-mesh min-h-screen flex selection:bg-cyan selection:text-black">
        {/* Left Sidebar: BranchedMenu Navigation */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Main Application Workspace */}
        <div className="flex-1 ml-72 flex flex-col min-h-screen">
          {/* Top Floating Header */}
          <Navbar />

          {/* Scrollable Main Area */}
          <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            <ErrorBoundary fallbackTitle="Portal Workspace View Error">
              {renderContent()}
            </ErrorBoundary>
          </main>

          {/* Footer Status Bar */}
          <footer className="border-t border-cosmic-700/60 bg-cosmic-950/80 backdrop-blur-md py-4 px-8 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-white tracking-wider">NEXORA</span>
                <span>• Multi-Tenant Academic Operations Engine</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      sessionStorage.removeItem(INTRO_SEEN_KEY);
                    } catch {
                      // ignore storage error
                    }
                    setShowIntro(true);
                  }}
                  className="text-slate-400 hover:text-cyan transition-colors"
                  title="Replay Brand Intro Splash Screen"
                >
                  Replay Intro
                </button>
                <span className="text-slate-500">v2.0 DOCKER READY</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
};
