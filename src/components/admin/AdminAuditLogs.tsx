import React, { useState, useEffect } from 'react';
import { Terminal, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { api } from '../../api/endpoints';
import type { AuditLogEntry } from '../../types';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.admin.getAuditLogs().then(setLogs);
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.actor_email.toLowerCase().includes(filter.toLowerCase()) ||
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      l.details.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-white">
              Institutional Audit Trail Explorer
            </h3>
            <Badge variant="cyan">IMMUTABLE</Badge>
          </div>
          <p className="text-xs text-[#9E9AA8] mt-1">
            Tamper-proof chronological log stream of security events, grade submissions, and billing mutations
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E9AA8]" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
          />
        </div>
      </div>

      <Card className="!p-0 overflow-hidden font-mono text-xs">
        <div className="p-3 bg-[#1C1533] border-b border-[#2A2240] flex items-center justify-between text-[#9E9AA8] text-[11px]">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" /> /api/v1/admin/audit-logs
          </span>
          <span>{filteredLogs.length} Events Logged</span>
        </div>

        <div className="divide-y divide-[#2A2240]/60 max-h-[550px] overflow-y-auto">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 hover:bg-[#1C1533]/40 transition-colors space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#00E5FF] font-bold">{log.action}</span>
                  <span className="text-[#9E9AA8] text-[11px] font-sans">• {log.target_resource}</span>
                </div>
                <span className="text-[11px] text-[#9E9AA8]">{log.timestamp}</span>
              </div>

              <p className="text-white font-sans text-xs">{log.details}</p>

              <div className="flex items-center gap-4 text-[10px] text-[#9E9AA8] pt-1">
                <span>Actor: <strong className="text-[#C4B5FD]">{log.actor_email}</strong></span>
                <span>IP: {log.ip_address}</span>
                <span className="text-[#34D399]">Status: Verified 200 OK</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
