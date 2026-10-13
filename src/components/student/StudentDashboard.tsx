import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HoldButton } from '../ui/HoldButton';

interface StudentDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [feePaid, setFeePaid] = useState(false);

  return (
    <div className="space-y-8">
      {/* ===================================================================== */}
      {/* 1. HERO SECTION: ProfileCard & Holistic Academic Snapshot             */}
      {/* ===================================================================== */}
      <section className="relative rounded-2xl bg-gradient-to-r from-cosmic-900 via-cosmic-850 to-cosmic-900 border border-cosmic-700/80 p-6 md:p-8 shadow-glass-card overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-violet/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Student Identity Block */}
          <div className="flex items-center space-x-6">
            {/* 3D Profile Avatar Badge */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan via-violet to-pink-500 p-[2px] shadow-glow-cyan">
                <div className="w-full h-full bg-cosmic-950 rounded-[14px] flex items-center justify-center overflow-hidden relative">
                  <div className="font-display font-black text-2xl bg-gradient-to-r from-cyan to-white bg-clip-text text-transparent">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                  <div className="absolute inset-0 bg-cyan/10 backdrop-blur-[1px]" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-cosmic-900 border border-mint/40 text-[10px] font-mono text-mint flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                <span>REGULAR</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                  {user.first_name} {user.last_name}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono font-medium">
                  {user.programme_name || 'B.TECH CSE'}
                </span>
              </div>
              <p className="text-sm text-slate-300">
                Department of Computer Science & Engineering{' '}
                <span className="text-slate-400">• Semester {user.current_semester || 4}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
                <span className="flex items-center space-x-1">
                  <span className="text-slate-400">Roll:</span>
                  <span className="text-slate-200">{user.roll_number || 'APEX-2024-CSE-042'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <span className="text-slate-400">Advisor:</span>
                  <span className="text-slate-200">Dr. Priya Nair</span>
                </span>
                <span>•</span>
                <span className="text-mint flex items-center space-x-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Dean's Honor List</span>
                </span>
              </div>
            </div>
          </div>

          {/* Academic KPIs (4 Glass Tiles) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            {/* CGPA Metric */}
            <div className="px-4 py-3 rounded-xl bg-cosmic-950/60 border border-cosmic-700/80 backdrop-blur-sm text-center">
              <div className="text-[11px] font-mono uppercase text-slate-400">Cumulative GPA</div>
              <div className="text-xl font-display font-bold text-white mt-0.5 flex items-baseline justify-center space-x-1">
                <span className="text-cyan">{user.cgpa?.toFixed(2) || '8.92'}</span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
              <div className="text-[10px] text-mint font-medium mt-0.5">Top 4% Cohort</div>
            </div>

            {/* Attendance Metric */}
            <div className="px-4 py-3 rounded-xl bg-cosmic-950/60 border border-cosmic-700/80 backdrop-blur-sm text-center">
              <div className="text-[11px] font-mono uppercase text-slate-400">Overall Attendance</div>
              <div className="text-xl font-display font-bold text-mint mt-0.5">87.4%</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Req: ≥ 75.0%</div>
            </div>

            {/* Earned Credits */}
            <div className="px-4 py-3 rounded-xl bg-cosmic-950/60 border border-cosmic-700/80 backdrop-blur-sm text-center">
              <div className="text-[11px] font-mono uppercase text-slate-400">Credits Earned</div>
              <div className="text-xl font-display font-bold text-white mt-0.5 flex items-baseline justify-center space-x-1">
                <span>84</span>
                <span className="text-xs text-slate-400">/ 160</span>
              </div>
              <div className="text-[10px] text-violet font-medium mt-0.5">52.5% Completed</div>
            </div>

            {/* Scholarship */}
            <div className="px-4 py-3 rounded-xl bg-cosmic-950/60 border border-cosmic-700/80 backdrop-blur-sm text-center">
              <div className="text-[11px] font-mono uppercase text-slate-400">Scholarship</div>
              <div className="text-xl font-display font-bold text-amber mt-0.5">30%</div>
              <div className="text-[10px] text-slate-300 font-medium mt-0.5">Merit Waiver</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. QUICK-ACTION LAUNCHPAD: GlassIcons 6-Tile Grid                     */}
      {/* ===================================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center space-x-2">
            <span>QUICK LAUNCHPAD</span>
            <span className="w-8 h-[1px] bg-cosmic-700" />
          </h2>
          <span className="text-xs text-slate-400">6 Shortcuts Available</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Tile 1: Attendance Register */}
          <div
            onClick={() => onNavigateTab('academics')}
            className="prism-glass p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center text-cyan mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-display font-semibold text-sm text-white group-hover:text-cyan transition-colors">Attendance</div>
            <div className="text-[11px] text-slate-400 mt-0.5">6 Enrolled Courses</div>
            <div className="mt-2 text-[10px] font-mono text-mint flex items-center space-x-1">
              <span>●</span>
              <span>All Eligible</span>
            </div>
          </div>

          {/* Tile 2: Live Timetable */}
          <div
            onClick={() => onNavigateTab('academics')}
            className="prism-glass p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan"
          >
            <div className="w-10 h-10 rounded-xl bg-violet/15 border border-violet/30 flex items-center justify-center text-violet mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-display font-semibold text-sm text-white group-hover:text-violet transition-colors">Timetable</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Wednesday Grid</div>
            <div className="mt-2 text-[10px] font-mono text-cyan flex items-center space-x-1">
              <span>Next: 11:00 AM</span>
            </div>
          </div>

          {/* Tile 3: Exam Grades & Hall Ticket */}
          <div
            onClick={() => onNavigateTab('exams')}
            className="prism-glass p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center text-cyan mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="font-display font-semibold text-sm text-white group-hover:text-cyan transition-colors">Examinations</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Mid-Sem Spring</div>
            <div className="mt-2 text-[10px] font-mono text-violet flex items-center space-x-1">
              <span>Hall Ticket Ready</span>
            </div>
          </div>

          {/* Tile 4: Fees & Online Payment */}
          <div
            onClick={() => onNavigateTab('fees')}
            className="prism-glass p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan"
          >
            <div className="w-10 h-10 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center text-amber mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="font-display font-semibold text-sm text-white group-hover:text-amber transition-colors">Fee Ledger</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Installment II</div>
            <div className="mt-2 text-[10px] font-mono text-amber flex items-center space-x-1">
              <span>₹24,500 Dues</span>
            </div>
          </div>

          {/* Tile 5: Assignments & Lab Work */}
          <div
            onClick={() => onNavigateTab('assignments')}
            className="prism-glass p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan"
          >
            <div className="w-10 h-10 rounded-xl bg-crimson/15 border border-crimson/30 flex items-center justify-center text-crimson mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div className="font-display font-semibold text-sm text-white group-hover:text-crimson transition-colors">Assignments</div>
            <div className="text-[11px] text-slate-400 mt-0.5">3 Submissions</div>
            <div className="mt-2 text-[10px] font-mono text-crimson flex items-center space-x-1">
              <span>1 Due Tonight</span>
            </div>
          </div>

          {/* Tile 6: Academic Vault & Course Registration */}
          <div
            onClick={() => onNavigateTab('courses')}
            className="prism-glass p-4 rounded-xl cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-cyan"
          >
            <div className="w-10 h-10 rounded-xl bg-mint/15 border border-mint/30 flex items-center justify-center text-mint mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="font-display font-semibold text-sm text-white group-hover:text-mint transition-colors">Enrolment</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Course Catalog</div>
            <div className="mt-2 text-[10px] font-mono text-mint flex items-center space-x-1">
              <span>Add / Drop Open</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. MAIN SPLIT GRID: Academic Attendance vs Live Timeline              */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT 7 COLUMNS: Course Attendance Breakdown & SGPA Progress */}
        <div className="lg:col-span-7 space-y-8">
          {/* Course-Level Attendance Matrix (Screen STU-3) */}
          <div className="rounded-2xl bg-cosmic-900/90 border border-cosmic-700/80 p-6 shadow-glass-card">
            <div className="flex items-center justify-between pb-5 border-b border-cosmic-700/60">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-display font-bold text-lg text-white">Course Attendance & Eligibility</h2>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-mint/15 text-mint border border-mint/30">
                    BR-07 ENFORCED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Minimum 75.0% mandatory for End-Semester Examination Hall Ticket
                </p>
              </div>
              <button onClick={() => onNavigateTab('academics')} className="text-xs text-cyan hover:underline font-mono">
                View Full Ledger →
              </button>
            </div>

            {/* Course Attendance Cards List */}
            <div className="mt-5 space-y-4">
              {/* Course 1: CS-301 */}
              <div className="p-4 rounded-xl bg-cosmic-950/60 border border-cosmic-700/70 hover:border-cyan/40 transition-all space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-cyan">CS-301</span>
                      <h3 className="text-sm font-semibold text-white">Advanced Data Structures & Algorithms</h3>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Faculty: Dr. Priya Nair • 4 Credits</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-mint/15 text-mint border border-mint/30 flex items-center space-x-1 shadow-sm">
                    <span>✓</span>
                    <span>Exam Eligible (91.9%)</span>
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>Attended: <b className="text-slate-200">34</b> / 37 sessions</span>
                    <span className="text-mint font-semibold">91.9%</span>
                  </div>
                  <div className="w-full bg-cosmic-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan to-mint h-2 rounded-full" style={{ width: '91.9%' }} />
                  </div>
                </div>
              </div>

              {/* Course 2: CS-304 */}
              <div className="p-4 rounded-xl bg-cosmic-950/60 border border-cosmic-700/70 hover:border-cyan/40 transition-all space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-cyan">CS-304</span>
                      <h3 className="text-sm font-semibold text-white">Database Systems Architecture</h3>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Faculty: Prof. K. Venkatesh • 4 Credits</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-mint/15 text-mint border border-mint/30 flex items-center space-x-1 shadow-sm">
                    <span>✓</span>
                    <span>Exam Eligible (86.1%)</span>
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>Attended: <b className="text-slate-200">31</b> / 36 sessions</span>
                    <span className="text-mint font-semibold">86.1%</span>
                  </div>
                  <div className="w-full bg-cosmic-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan to-mint h-2 rounded-full" style={{ width: '86.1%' }} />
                  </div>
                </div>
              </div>

              {/* Course 3: CS-308 (ATTENDANCE WARNING CASE) */}
              <div className="p-4 rounded-xl bg-cosmic-950/60 border border-amber/40 bg-gradient-to-r from-amber/5 via-transparent to-transparent space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-amber">CS-308</span>
                      <h3 className="text-sm font-semibold text-white">Operating Systems & Kernel Internals</h3>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Faculty: Prof. Vikram Rao • 4 Credits</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber/20 text-amber border border-amber/40 flex items-center space-x-1 shadow-sm animate-pulse">
                    <span>⚠️</span>
                    <span>At Risk (71.4%)</span>
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>Attended: <b className="text-slate-200">25</b> / 35 sessions</span>
                    <span className="text-amber font-semibold">71.4% (&lt; 75%)</span>
                  </div>
                  <div className="w-full bg-cosmic-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber to-crimson h-2 rounded-full" style={{ width: '71.4%' }} />
                  </div>
                </div>
                {/* Warning Remediation Note */}
                <div className="p-2.5 rounded-lg bg-amber/10 border border-amber/20 flex items-center space-x-2 text-xs text-amber-200">
                  <svg className="w-4 h-4 text-amber shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    <strong>Eligibility Flag:</strong> You must attend the next <strong>3 consecutive lectures</strong> to cross the 75% threshold before Mid-Sem.
                  </span>
                </div>
              </div>

              {/* Course 4: MA-202 */}
              <div className="p-4 rounded-xl bg-cosmic-950/60 border border-cosmic-700/70 hover:border-cyan/40 transition-all space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-cyan">MA-202</span>
                      <h3 className="text-sm font-semibold text-white">Discrete Mathematics & Graph Theory</h3>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Faculty: Dr. Anita Desai • 3 Credits</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-mint/15 text-mint border border-mint/30 flex items-center space-x-1 shadow-sm">
                    <span>✓</span>
                    <span>Exam Eligible (79.4%)</span>
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>Attended: <b className="text-slate-200">27</b> / 34 sessions</span>
                    <span className="text-mint font-semibold">79.4%</span>
                  </div>
                  <div className="w-full bg-cosmic-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan to-mint h-2 rounded-full" style={{ width: '79.4%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Progression & SGPA History (STU-07) */}
          <div className="rounded-2xl bg-cosmic-900/90 border border-cosmic-700/80 p-6 shadow-glass-card">
            <div className="flex items-center justify-between pb-4 border-b border-cosmic-700/60">
              <div>
                <h2 className="font-display font-bold text-base text-white">Academic Progression & SGPA Curve</h2>
                <p className="text-xs text-slate-400 mt-0.5">Historical GPA performance across evaluated semesters</p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan" />
                  <span className="text-slate-300">Actual SGPA</span>
                </span>
                <span className="flex items-center space-x-1 ml-3">
                  <span className="w-2.5 h-2.5 rounded-sm bg-violet" />
                  <span className="text-slate-300">Target (9.0+)</span>
                </span>
              </div>
            </div>

            {/* Visual Bar Chart Grid */}
            <div className="mt-6 grid grid-cols-4 gap-4 items-end h-40 pt-4 px-2">
              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-xs font-mono text-cyan mb-1.5 font-bold">8.42</span>
                <div className="w-full bg-cosmic-800/80 rounded-t-lg relative overflow-hidden" style={{ height: '75%' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-violet/40 to-cyan/80 group-hover:to-cyan transition-all" />
                </div>
                <span className="text-xs font-mono text-slate-400 mt-2">Sem I</span>
              </div>

              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-xs font-mono text-cyan mb-1.5 font-bold">8.70</span>
                <div className="w-full bg-cosmic-800/80 rounded-t-lg relative overflow-hidden" style={{ height: '82%' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-violet/40 to-cyan/80 group-hover:to-cyan transition-all" />
                </div>
                <span className="text-xs font-mono text-slate-400 mt-2">Sem II</span>
              </div>

              <div className="flex flex-col items-center h-full justify-end group">
                <span className="text-xs font-mono text-cyan mb-1.5 font-bold">8.88</span>
                <div className="w-full bg-cosmic-800/80 rounded-t-lg relative overflow-hidden" style={{ height: '88%' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-violet/40 to-cyan/80 group-hover:to-cyan transition-all" />
                </div>
                <span className="text-xs font-mono text-slate-400 mt-2">Sem III</span>
              </div>

              <div className="flex flex-col items-center h-full justify-end group">
                <div className="flex items-center space-x-1 mb-1.5">
                  <span className="text-xs font-mono text-mint font-bold">8.92</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-mint/20 text-mint">EST</span>
                </div>
                <div className="w-full bg-cosmic-800/80 rounded-t-lg relative overflow-hidden border-2 border-dashed border-cyan/60" style={{ height: '90%' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan/30 to-mint/60 group-hover:to-mint transition-all" />
                </div>
                <span className="text-xs font-mono text-cyan mt-2 font-semibold">Sem IV (Now)</span>
              </div>
            </div>

            {/* Credits Completed Bar */}
            <div className="mt-6 pt-4 border-t border-cosmic-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Graduation Audit Status:</span>
                <span className="text-xs text-slate-200 font-medium ml-1">84 Completed + 20 Current Sem = 104 / 160 Credits</span>
              </div>
              <span className="text-xs font-mono text-mint">65% Pace</span>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: Today's Schedule Timeline & Action Center */}
        <div className="lg:col-span-5 space-y-8">
          {/* Today's Schedule Live Timeline */}
          <div className="rounded-2xl bg-cosmic-900/90 border border-cosmic-700/80 p-6 shadow-glass-card">
            <div className="flex items-center justify-between pb-4 border-b border-cosmic-700/60">
              <div>
                <h2 className="font-display font-bold text-base text-white">Today's Class Schedule</h2>
                <p className="text-xs text-slate-400 mt-0.5">Wednesday • 4 Lectures Scheduled</p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cosmic-800 text-cyan border border-cosmic-700">08 OCT 2026</span>
            </div>

            <div className="mt-5 space-y-4 relative">
              {/* Timeline Item 1: Completed */}
              <div className="flex space-x-3 opacity-60">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-cosmic-800 border border-cosmic-700 flex items-center justify-center text-[10px] text-slate-400">✓</div>
                  <div className="w-[1px] h-full bg-cosmic-700 my-1" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-[11px] font-mono text-slate-400">09:00 AM – 10:30 AM • LECTURE HALL 402</div>
                  <div className="text-sm font-semibold text-slate-300">CS-301: Advanced Data Structures</div>
                  <div className="text-xs text-slate-400">Dr. Priya Nair • Marked Present</div>
                </div>
              </div>

              {/* Timeline Item 2: ACTIVE NOW */}
              <div className="flex space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-cyan/20 border border-cyan flex items-center justify-center shadow-glow-cyan">
                    <span className="w-2 h-2 rounded-full bg-cyan animate-ping" />
                  </div>
                  <div className="w-[1px] h-full bg-cyan/40 my-1" />
                </div>
                <div className="flex-1 pb-4 p-3 rounded-xl bg-gradient-to-r from-cyan/10 to-transparent border border-cyan/40 shadow-glow-cyan">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan mb-1">
                    <span>11:00 AM – 12:30 PM (LIVE NOW)</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan/20 text-cyan text-[10px]">ROOM LAB-03</span>
                  </div>
                  <div className="text-sm font-bold text-white">CS-308: Operating Systems Lab</div>
                  <div className="text-xs text-slate-300 mt-1">Prof. Vikram Rao • Hands-on POSIX Threads</div>
                </div>
              </div>

              {/* Timeline Item 3: Upcoming */}
              <div className="flex space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-cosmic-800 border border-cosmic-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">3</div>
                  <div className="w-[1px] h-full bg-cosmic-700 my-1" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-[11px] font-mono text-slate-400">02:00 PM – 03:30 PM • SEMINAR HALL 101</div>
                  <div className="text-sm font-semibold text-slate-200">MA-202: Discrete Mathematics</div>
                  <div className="text-xs text-slate-400">Dr. Anita Desai • Combinatorics</div>
                </div>
              </div>

              {/* Timeline Item 4: Upcoming */}
              <div className="flex space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-cosmic-800 border border-cosmic-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">4</div>
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-slate-400">04:00 PM – 05:00 PM • AUDITORIUM</div>
                  <div className="text-sm font-semibold text-slate-200">Industry Keynote: Quantum Comp.</div>
                  <div className="text-xs text-slate-400">Invited Speaker • Open to All</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Coursework & Quizzes */}
          <div className="rounded-2xl bg-cosmic-900/90 border border-cosmic-700/80 p-6 shadow-glass-card">
            <div className="flex items-center justify-between pb-4 border-b border-cosmic-700/60">
              <h2 className="font-display font-bold text-base text-white">Pending Assignments</h2>
              <span className="text-xs font-mono text-crimson bg-crimson/15 px-2 py-0.5 rounded border border-crimson/30">1 Urgent</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-cosmic-950/70 border border-crimson/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono text-crimson font-bold">CS-308</span>
                    <span className="text-xs font-semibold text-white">Virtual Memory Paging Sim</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-2">
                    <span className="text-crimson font-medium">Due Today • 11:59 PM</span>
                    <span>•</span>
                    <span>Max Marks: 25</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab('assignments')}
                  className="px-3 py-1.5 rounded-lg bg-crimson/20 hover:bg-crimson/30 text-crimson border border-crimson/50 text-xs font-medium transition-all"
                >
                  Upload Code
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-cosmic-950/70 border border-cosmic-700 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono text-cyan font-bold">CS-301</span>
                    <span className="text-xs font-semibold text-white">B+ Tree Indexing in C++</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Due in 2 days (10 Oct) • Max Marks: 30</div>
                </div>
                <button
                  onClick={() => onNavigateTab('assignments')}
                  className="px-3 py-1.5 rounded-lg bg-cosmic-800 hover:bg-cosmic-700 text-slate-200 border border-cosmic-700 text-xs font-medium transition-all"
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          {/* Fee Settlement & HoldButton Prototype */}
          <div className="rounded-2xl bg-gradient-to-br from-cosmic-900 to-cosmic-850 border border-amber/40 p-6 shadow-glass-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cosmic-700/60">
              <div className="flex items-center space-x-2">
                <span className="text-amber">💳</span>
                <h2 className="font-display font-bold text-base text-white">Fee Account Summary</h2>
              </div>
              <span className="text-xs font-mono text-amber bg-amber/15 px-2 py-0.5 rounded border border-amber/30">
                {feePaid ? 'SETTLED' : 'Spring 2026'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tuition & Laboratory Fee:</span>
                <span className="font-mono text-slate-200">₹ 65,000</span>
              </div>
              <div className="flex justify-between text-mint">
                <span>Merit Scholarship (30% Waiver):</span>
                <span className="font-mono">- ₹ 19,500</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Installment I Paid (Jul 2026):</span>
                <span className="font-mono text-slate-200">- ₹ 21,000</span>
              </div>
              <div className="pt-2 border-t border-cosmic-700/80 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-white">Net Balance Payable:</span>
                <span className="text-lg font-mono font-bold text-amber">
                  {feePaid ? '₹ 0.00' : '₹ 24,500'}
                </span>
              </div>
            </div>

            {/* HoldButton Micro-Component */}
            {!feePaid ? (
              <div className="pt-2">
                <HoldButton
                  label="Hold to Pay ₹24,500"
                  confirmedLabel="Paid & Verified"
                  variant="cyan"
                  className="w-full"
                  onHoldComplete={() => setFeePaid(true)}
                />
                <p className="text-[10px] text-center text-slate-400 mt-2 font-mono">
                  Instant digital receipt & GST invoice auto-generated
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-mint/15 border border-mint/30 text-mint text-xs text-center font-medium">
                ✓ Dues cleared for Spring 2026. Hall ticket unlocked!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
