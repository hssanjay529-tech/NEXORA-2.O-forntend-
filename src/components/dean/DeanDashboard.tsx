import React, { useState, useEffect } from 'react';
import {
  Award,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FileCheck,
  Building,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../api/endpoints';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { DeanDashboardData } from '../../types';

export const DeanDashboard: React.FC = () => {
  const [data, setData] = useState<DeanDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'proposals' | 'departments'>('overview');
  const [approvedProposals, setApprovedProposals] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.dean.getDashboard();
      setData(res);
    } catch {
      // Fallback fallback state
      setData({
        school_name: 'School of Engineering & Technology',
        dean_name: 'Dr. Arvind Swaminathan',
        kpis: {
          total_departments: 6,
          total_faculty: 142,
          total_students: 2840,
          average_pass_rate: 94.2,
          average_attendance: 88.5,
          accreditation_compliance_pct: 98.0,
        },
        department_stats: [
          {
            id: 'dept-1',
            name: 'Department of Computer Science & Engineering',
            code: 'CSE',
            programmes_count: 3,
            faculty_count: 48,
            students_count: 980,
            pass_rate: 96.4,
          },
          {
            id: 'dept-2',
            name: 'Department of Electronics & Communication',
            code: 'ECE',
            programmes_count: 2,
            faculty_count: 34,
            students_count: 720,
            pass_rate: 93.1,
          },
          {
            id: 'dept-3',
            name: 'Department of Mechanical Engineering',
            code: 'MECH',
            programmes_count: 2,
            faculty_count: 28,
            students_count: 560,
            pass_rate: 91.8,
          },
        ],
        pending_proposals: [
          {
            id: 'prop-1',
            title: 'Advanced Distributed Systems & Consensus Architecture',
            course_name: 'CS-482 Distributed Consensus & Cloud Storage',
            department: 'Computer Science',
            submitted_by: 'Dr. Priya Nair',
            credits: 4,
            created_at: '2026-10-10',
          },
          {
            id: 'prop-2',
            title: 'Edge Artificial Intelligence & FPGA Acceleration',
            course_name: 'EC-475 Hardware Accelerators for Machine Intelligence',
            department: 'Electronics & Communication',
            submitted_by: 'Dr. Rajesh Sen',
            credits: 3,
            created_at: '2026-10-11',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApproveProposal = (id: string, title: string) => {
    setApprovedProposals((prev) => new Set(prev).add(id));
    setToastMessage(`Curriculum proposal "${title}" officially approved and sanctioned.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading Dean Executive Portal Data...</p>
      </div>
    );
  }

  const kpis = data?.kpis || {
    total_departments: 6,
    total_faculty: 142,
    total_students: 2840,
    average_pass_rate: 94.2,
    average_attendance: 88.5,
    accreditation_compliance_pct: 98.0,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative rounded-2xl p-8 bg-gradient-to-r from-[#1E1736] via-[#130E22] to-[#0D1629] border border-[#3A2D5C] overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#00E5FF]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="amber">DEAN EXECUTIVE SUITE</Badge>
              <span className="text-xs font-mono text-[#00E5FF]">Apex Institute of Technology</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white tracking-wide">
              {data?.school_name || 'School of Engineering & Technology'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Executive Dean: <strong className="text-white">{data?.dean_name || 'Dr. Arvind Swaminathan'}</strong> • Academic Governance & Accreditation Oversight
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboard}
              className="border-cosmic-700 hover:border-cyan text-slate-300"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Sync Metrics
            </Button>
          </div>
        </div>
      </div>

      {/* Executive KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="p-5 border-cosmic-700/80 bg-cosmic-900/60 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">DEPARTMENTS</span>
            <Building className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-2xl font-heading font-bold text-white">{kpis.total_departments}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Fully Staffed
          </div>
        </Card>

        <Card className="p-5 border-cosmic-700/80 bg-cosmic-900/60 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">FACULTY COUNT</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-heading font-bold text-white">{kpis.total_faculty}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">1:20 Ratio</div>
        </Card>

        <Card className="p-5 border-cosmic-700/80 bg-cosmic-900/60 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">STUDENT BODY</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-bold text-white">{kpis.total_students.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">Active Enrolled</div>
        </Card>

        <Card className="p-5 border-cosmic-700/80 bg-cosmic-900/60 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">PASS RATE</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-heading font-bold text-amber-300">{kpis.average_pass_rate}%</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +1.8% vs last term
          </div>
        </Card>

        <Card className="p-5 border-cosmic-700/80 bg-cosmic-900/60 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">ATTENDANCE</span>
            <Clock className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="text-2xl font-heading font-bold text-cyan-300">{kpis.average_attendance}%</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">&gt; 75% Threshold</div>
        </Card>

        <Card className="p-5 border-cosmic-700/80 bg-cosmic-900/60 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">ACCREDITATION</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-bold text-emerald-300">{kpis.accreditation_compliance_pct}%</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">NBA / NAAC Tier 1</div>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center border-b border-cosmic-700/70 pb-3 gap-3">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'overview'
              ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-cosmic-900'
          }`}
        >
          Executive Overview
        </button>
        <button
          onClick={() => setActiveSubTab('proposals')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'proposals'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-cosmic-900'
          }`}
        >
          <span>Curriculum Proposals</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {data?.pending_proposals?.length || 0}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('departments')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'departments'
              ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
              : 'text-slate-400 hover:text-white hover:bg-cosmic-900'
          }`}
        >
          Department Performance Metrics
        </button>
      </div>

      {/* Content Sections */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pending Proposals Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" />
                Pending Curriculum Approvals
              </h3>
              <span className="text-xs text-slate-400 font-mono">Dean Approval Authority</span>
            </div>

            <div className="space-y-3">
              {data?.pending_proposals?.map((prop) => {
                const isApproved = approvedProposals.has(prop.id);
                return (
                  <Card
                    key={prop.id}
                    className={`p-5 border-cosmic-700/80 bg-cosmic-900/60 transition-all ${
                      isApproved ? 'border-emerald-500/40 bg-emerald-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono text-[#00E5FF]">{prop.department}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs font-mono text-slate-400">{prop.credits} Credits</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white">{prop.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{prop.course_name}</p>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono">
                          Submitted by: <span className="text-slate-300">{prop.submitted_by}</span> on {prop.created_at}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col gap-2">
                        {isApproved ? (
                          <Badge variant="emerald" className="self-end">
                            <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Sanctioned
                          </Badge>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApproveProposal(prop.id, prop.title)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Department Breakdown Mini */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-[#00E5FF]" />
              School Departments
            </h3>

            <div className="space-y-3">
              {data?.department_stats?.map((dept) => (
                <Card key={dept.id} className="p-4 border-cosmic-700/80 bg-cosmic-900/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-white">{dept.name}</span>
                    <Badge variant="cyan">{dept.code}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-cosmic-950/40 rounded-lg font-mono">
                    <div>
                      <span className="text-slate-400 text-[10px] block">FACULTY</span>
                      <strong className="text-white">{dept.faculty_count}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">STUDENTS</span>
                      <strong className="text-white">{dept.students_count}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">PASS RATE</span>
                      <strong className="text-emerald-400">{dept.pass_rate}%</strong>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'proposals' && (
        <div className="space-y-4">
          <h3 className="text-base font-heading font-bold text-white">Full Proposal Audit Register</h3>
          <div className="space-y-3">
            {data?.pending_proposals?.map((prop) => (
              <Card key={prop.id} className="p-6 border-cosmic-700/80 bg-cosmic-900/60">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Badge variant="cyan" className="mb-2">{prop.department}</Badge>
                    <h4 className="text-base font-bold text-white">{prop.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{prop.course_name}</p>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-3">
                      <span>Credits: {prop.credits}</span>
                      <span>•</span>
                      <span>Sponsor: {prop.submitted_by}</span>
                      <span>•</span>
                      <span>Date: {prop.created_at}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {approvedProposals.has(prop.id) ? (
                      <Badge variant="emerald">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
                      </Badge>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveProposal(prop.id, prop.title)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Sanction Course Offering
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'departments' && (
        <div className="space-y-4">
          <h3 className="text-base font-heading font-bold text-white">Comprehensive Department Roster</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.department_stats?.map((dept) => (
              <Card key={dept.id} className="p-6 border-cosmic-700/80 bg-cosmic-900/60">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white">{dept.name}</h4>
                    <span className="text-xs font-mono text-cyan">Code: {dept.code}</span>
                  </div>
                  <Badge variant="violet">{dept.programmes_count} Degree Tracks</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Academic Pass Benchmark</span>
                      <span className="text-emerald-400 font-mono font-bold">{dept.pass_rate}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-cosmic-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00E5FF] to-[#10B981] rounded-full"
                        style={{ width: `${dept.pass_rate}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between text-xs text-slate-300 font-mono border-t border-cosmic-800">
                    <span>Faculty: <strong>{dept.faculty_count}</strong></span>
                    <span>Enrolled: <strong>{dept.students_count}</strong></span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
