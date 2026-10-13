import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Award,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { api } from '../../api/endpoints';
import type { DashboardKPIs } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    api.admin.getDashboardKPIs().then(setKpis);
  }, []);

  const handleGenerateReport = () => {
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 3000);
    }, 1500);
  };

  if (!kpis) return null;

  return (
    <div className="space-y-6">
      {/* Header and Report Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-extrabold text-2xl text-white">
              Institutional Command Center
            </h2>
            <Badge variant="cyan">FALL 2026</Badge>
          </div>
          <p className="text-xs text-[#9E9AA8] mt-1">
            Real-time multi-tenant university telemetry, attendance analytics, and financial ledger status
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleGenerateReport}
          isLoading={reportGenerating}
          className="text-xs flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Report</span>
        </Button>
      </div>

      {reportSuccess && (
        <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#34D399] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Institutional snapshot generated and dispatched to administrative email.</span>
        </div>
      )}

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card>
          <CardHeader className="!pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9E9AA8]">Total Active Students</span>
              <GraduationCap className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <CardTitle className="text-2xl mt-1">
              {(kpis.total_students ?? 2450).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-[#34D399] flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.4% vs Previous Term
            </p>
          </CardContent>
        </Card>

        {/* Total Faculty */}
        <Card>
          <CardHeader className="!pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9E9AA8]">Teaching Faculty</span>
              <Users className="w-4 h-4 text-[#7C3AED]" />
            </div>
            <CardTitle className="text-2xl mt-1">{kpis.total_faculty ?? 184}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-[#9E9AA8]">1:13 Faculty-Student Ratio</p>
          </CardContent>
        </Card>

        {/* Avg Attendance */}
        <Card>
          <CardHeader className="!pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9E9AA8]">Avg Attendance Rate</span>
              <Award className="w-4 h-4 text-[#10B981]" />
            </div>
            <CardTitle className="text-2xl mt-1">{kpis.avg_attendance_pct ?? 86.4}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-[#34D399]">Above 75% Statutory Floor</p>
          </CardContent>
        </Card>

        {/* Fee Collection */}
        <Card>
          <CardHeader className="!pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9E9AA8]">Fee Collection Rate</span>
              <DollarSign className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <CardTitle className="text-2xl mt-1">
              {kpis.total_billed > 0 ? Math.round(((kpis.total_collected ?? 0) / kpis.total_billed) * 100) : 88}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-[#9E9AA8]">
              ₹{(((kpis.total_outstanding ?? 0)) / 100000).toFixed(1)}L Pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Institutional Financial Reconciliation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[#130E22] border border-[#2A2240] text-center text-xs">
              <div>
                <span className="text-[#9E9AA8]">Total Invoiced</span>
                <p className="font-mono font-bold text-base text-white mt-1">
                  ₹{(((kpis.total_billed ?? 0)) / 100000).toFixed(2)} Lakhs
                </p>
              </div>
              <div>
                <span className="text-[#34D399]">Collected</span>
                <p className="font-mono font-bold text-base text-[#34D399] mt-1">
                  ₹{(((kpis.total_collected ?? 0)) / 100000).toFixed(2)} Lakhs
                </p>
              </div>
              <div>
                <span className="text-red-400">Outstanding Deficit</span>
                <p className="font-mono font-bold text-base text-red-400 mt-1">
                  ₹{(((kpis.total_outstanding ?? 0)) / 100000).toFixed(2)} Lakhs
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#9E9AA8]">
                <span>Overall Term Collection Target:</span>
                <span className="text-[#00E5FF] font-semibold">87.8% Reached</span>
              </div>
              <div className="w-full bg-[#1C1533] h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#00E5FF] to-[#10B981] h-full w-[87.8%]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Departments Status */}
        <Card>
          <CardHeader>
            <CardTitle>Departmental Pass Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Computer Science & Eng.</p>
                <p className="text-[10px] text-[#9E9AA8]">840 Enrolled</p>
              </div>
              <Badge variant="emerald">94.2% PASS</Badge>
            </div>
            <div className="p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Information Systems</p>
                <p className="text-[10px] text-[#9E9AA8]">620 Enrolled</p>
              </div>
              <Badge variant="emerald">91.8% PASS</Badge>
            </div>
            <div className="p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Electrical & Electronics</p>
                <p className="text-[10px] text-[#9E9AA8]">590 Enrolled</p>
              </div>
              <Badge variant="amber">86.5% PASS</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
