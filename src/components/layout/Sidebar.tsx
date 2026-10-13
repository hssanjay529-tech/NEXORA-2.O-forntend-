import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { role, user } = useAuth();
  const { tenant } = useTenant();

  const userInitials = user.first_name?.[0] + (user.last_name?.[0] || '');

  return (
    <aside className="w-72 shrink-0 border-r border-cosmic-700/70 bg-cosmic-950/80 backdrop-blur-xl flex flex-col justify-between fixed top-0 bottom-0 left-0 z-40 transition-all duration-300">
      {/* Top Branding & Institution Identity */}
      <div>
        <div className="p-6 border-b border-cosmic-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* NEXORA Glowing Emblem */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet via-cyan to-transparent opacity-40 blur-md rounded-full pointer-events-none" />
              <img
                src="/assets/nexora-logo-mark.png"
                alt="NEXORA Logo"
                className="relative w-10 h-10 object-contain drop-shadow-glow-cyan"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-xl tracking-wider text-white">NEXORA</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan/15 text-cyan border border-cyan/30">
                  {role}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight uppercase truncate max-w-[140px]">
                {tenant.name.replace(' & Management', '')}
              </p>
            </div>
          </div>

          {/* Academic Term Indicator */}
          <span className="relative flex h-2 w-2" title="Academic Network Synchronized">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
          </span>
        </div>

        {/* Navigation Links (Branched Circuit Tree) */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] text-sm">
          {/* Core Portal */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-medium">
              Core Portal
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onSelectTab(role === 'STUDENT' ? 'overview' : role === 'FACULTY' ? 'dashboard' : role === 'DEAN' ? 'overview' : 'analytics')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition-all ${
                  activeTab === 'overview' || activeTab === 'dashboard' || activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-cyan/15 to-transparent text-cyan border border-cyan/30 shadow-glow-cyan'
                    : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Dashboard</span>
                </div>
                {(activeTab === 'overview' || activeTab === 'dashboard' || activeTab === 'analytics') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_8px_#00E5FF]" />
                )}
              </button>
            </div>
          </div>

          {/* Student Specific Tree */}
          {role === 'STUDENT' && (
            <>
              {/* Academics Cluster */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-medium">
                  Academics
                </div>
                <div className="branch-connector ml-3 pl-6 space-y-1">
                  <button
                    type="button"
                    onClick={() => onSelectTab('academics')}
                    className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                      activeTab === 'academics' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                    }`}
                  >
                    <span className="text-xs font-medium">Attendance Matrix</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-mint/15 text-mint border border-mint/30">87.4%</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTab('courses')}
                    className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                      activeTab === 'courses' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                    }`}
                  >
                    <span className="text-xs font-medium">Course Registration</span>
                    <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-1 rounded">Open</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTab('assignments')}
                    className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                      activeTab === 'assignments' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                    }`}
                  >
                    <span className="text-xs font-medium">Assignments & Lab</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-crimson/15 text-crimson border border-crimson/30">3 Due</span>
                  </button>
                </div>
              </div>

              {/* Examinations Cluster */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-medium">
                  Examinations
                </div>
                <div className="branch-connector ml-3 pl-6 space-y-1">
                  <button
                    type="button"
                    onClick={() => onSelectTab('exams')}
                    className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                      activeTab === 'exams' ? 'active text-violet bg-cosmic-900' : 'text-slate-300 hover:text-violet hover:bg-cosmic-900'
                    }`}
                  >
                    <span className="text-xs font-medium">Hall Ticket & Seating</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet/20 text-violet border border-violet/30">Issued</span>
                  </button>
                </div>
              </div>

              {/* Finance & Campus */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-medium">
                  Finance & Campus
                </div>
                <div className="branch-connector ml-3 pl-6 space-y-1">
                  <button
                    type="button"
                    onClick={() => onSelectTab('fees')}
                    className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                      activeTab === 'fees' ? 'active text-amber bg-cosmic-900' : 'text-slate-300 hover:text-amber hover:bg-cosmic-900'
                    }`}
                  >
                    <span className="text-xs font-medium">Fee Invoices & Dues</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber/20 text-amber border border-amber/30">Payable</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTab('services')}
                    className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                      activeTab === 'services' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                    }`}
                  >
                    <span className="text-xs font-medium">Helpdesk & Services</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Faculty Specific Tree */}
          {role === 'FACULTY' && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-medium">
                Teaching Operations
              </div>
              <div className="branch-connector ml-3 pl-6 space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('attendance')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'attendance' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Attendance Matrix</span>
                  <span className="text-[10px] font-mono text-cyan">75% Rule</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('materials')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'materials' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Course Vault</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('assignments')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'assignments' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Assignment Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('gradebook')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'gradebook' ? 'active text-violet bg-cosmic-900' : 'text-slate-300 hover:text-violet hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Official Gradebook</span>
                  <span className="text-[10px] font-mono text-violet">BR-04</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('requests')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'requests' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Duty Leave & Swaps</span>
                </button>
              </div>
            </div>
          )}

          {/* Admin Specific Tree */}
          {role === 'ADMIN' && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-medium">
                Governance & Control
              </div>
              <div className="branch-connector ml-3 pl-6 space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('users')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'users' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">User Directory</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('timetable')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'timetable' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Schedule Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('finance')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'finance' ? 'active text-amber bg-cosmic-900' : 'text-slate-300 hover:text-amber hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Batch Invoicing</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('approvals')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'approvals' ? 'active text-violet bg-cosmic-900' : 'text-slate-300 hover:text-violet hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Grade Approvals</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('audit')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'audit' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Audit Trail</span>
                </button>
              </div>
            </div>
          )}

          {/* Dean Specific Tree */}
          {role === 'DEAN' && (
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-2 font-medium">
                Academic Leadership
              </div>
              <div className="branch-connector ml-3 pl-6 space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('overview')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'overview' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">School Performance</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('proposals')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'proposals' ? 'active text-amber bg-cosmic-900' : 'text-slate-300 hover:text-amber hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Curriculum Proposals</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">PENDING</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('departments')}
                  className={`w-full branch-item flex items-center justify-between px-2.5 py-2 rounded-md transition-colors ${
                    activeTab === 'departments' ? 'active text-cyan bg-cosmic-900' : 'text-slate-300 hover:text-cyan hover:bg-cosmic-900'
                  }`}
                >
                  <span className="text-xs font-medium">Departmental Metrics</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Student Profile Chip matching demo.html */}
      <div className="p-4 border-t border-cosmic-700/60 bg-cosmic-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan via-violet to-purple-400 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-cosmic-900 flex items-center justify-center font-display font-semibold text-xs text-white">
                  {userInitials}
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-mint border-2 border-cosmic-950" />
            </div>
            <div>
              <div className="text-xs font-medium text-white">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {user.roll_number || user.employee_id || 'APEX-24-CS-042'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
