import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Users, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HoldButton } from '../ui/HoldButton';
import { Button } from '../ui/Button';

export const AdminFinance: React.FC = () => {
  const [batchSuccess, setBatchSuccess] = useState(false);

  const handleBatchGenerate = () => {
    setBatchSuccess(true);
    setTimeout(() => setBatchSuccess(false), 4000);
  };

  const defaulters = [
    { id: 'DEF-1', name: 'Rohan Verma', roll: 'CS2026-003', due: 55000, term: 'Fall 2026', daysOverdue: 14 },
    { id: 'DEF-2', name: 'Kavya Nair', roll: 'CS2026-005', due: 28000, term: 'Fall 2026', daysOverdue: 9 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            Financial Structures & Batch Invoicing Runner
          </h3>
          <p className="text-xs text-[#9E9AA8]">
            Configure programme fee components, calculate scholarship offsets, and dispatch term billing
          </p>
        </div>
        <Badge variant="cyan">INSTITUTIONAL BILLING</Badge>
      </div>

      {batchSuccess && (
        <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#34D399] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            Batch Invoicing Dispatched! 2,450 student invoices generated with automated scholarship deductions.
          </span>
        </div>
      )}

      {/* Batch Invoicing Runner Card with HoldButton */}
      <Card className="border-[#7C3AED]/40 bg-gradient-to-br from-[#16102B] via-[#120D24] to-[#0A0714]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#00E5FF]" />
              <CardTitle>Batch Generate Term Invoices</CardTitle>
            </div>
            <Badge variant="violet">Fall Semester 2026</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-[#9E9AA8] leading-relaxed">
            This will pre-compute all tuition, laboratory, and library components across 12 academic
            programmes, auto-apply verified merit scholarships, and release bills to student portals.
          </p>

          <div className="p-4 rounded-xl bg-[#130E22] border border-[#2A2240] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <Users className="w-5 h-5 text-[#00E5FF]" />
              <div>
                <span className="font-semibold text-white">2,450 Eligible Student Accounts</span>
                <p className="text-[11px] text-[#9E9AA8]">Estimated Net Billing: ₹4.50 Crores</p>
              </div>
            </div>

            {/* High stakes HoldButton */}
            <HoldButton
              label="Hold to Batch Generate (1.5s)"
              confirmedLabel="Invoices Dispatched"
              variant="cyan"
              onHoldComplete={handleBatchGenerate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Defaulter Ledger */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Overdue Fee Accounts (Defaulter Ledger)</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Broadcast payment reminders dispatched to 2 student accounts.')}
              className="text-xs"
            >
              Send Payment Reminders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {defaulters.map((d) => (
              <div
                key={d.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#1C1533]/70 border border-[#2A2240] text-xs gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{d.name}</span>
                    <span className="font-mono text-[11px] text-[#00E5FF]">{d.roll}</span>
                  </div>
                  <p className="text-[11px] text-red-400 mt-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {d.daysOverdue} days past due date ({d.term})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#9E9AA8]">Unpaid Dues</span>
                  <p className="font-mono font-bold text-white text-sm">₹{d.due.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
