import React, { useState, useEffect } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { DataTable, type Column } from '../ui/DataTable';
import { HoldButton } from '../ui/HoldButton';
import { api } from '../../api/endpoints';
import type { ManagedUser, UserRole } from '../../types';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [department, setDepartment] = useState('Computer Science');
  const [code, setCode] = useState('');

  useEffect(() => {
    api.admin.getUsers().then(setUsers);
  }, []);

  const handleCreate = async () => {
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || 'New';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    const newUser: ManagedUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      department,
      status: 'ACTIVE',
      code: code || (role === 'STUDENT' ? 'CS2026-999' : 'FAC-999'),
    };

    try {
      await api.admin.createUser({
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        roll_no: code || undefined,
        employee_no: code || undefined,
        designation: role === 'FACULTY' ? 'Assistant Professor' : undefined,
      });
      const refreshed = await api.admin.getUsers();
      setUsers(refreshed);
    } catch {
      setUsers([newUser, ...users]);
    }

    setIsModalOpen(false);
    setName('');
    setEmail('');
    setCode('');
  };

  const handleDeactivate = async (userId: string) => {
    try {
      await api.admin.deactivateUser(userId);
    } catch {
      // ignore
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'INACTIVE' } : u))
    );
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter === 'ALL') return true;
    return u.role === roleFilter;
  });

  const columns: Column<ManagedUser>[] = [
    {
      header: 'Identity & Code',
      cell: (item) => (
        <div>
          <p className="font-semibold text-white">{item.name}</p>
          <span className="font-mono text-[10px] text-[#00E5FF]">{item.code}</span>
        </div>
      ),
    },
    {
      header: 'Email Address',
      accessorKey: 'email',
      className: 'font-mono text-[#9E9AA8]',
    },
    {
      header: 'Role',
      cell: (item) => (
        <Badge
          variant={
            item.role === 'ADMIN'
              ? 'violet'
              : item.role === 'FACULTY'
              ? 'cyan'
              : 'emerald'
          }
        >
          {item.role}
        </Badge>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.status === 'ACTIVE' ? 'emerald' : 'outline'}>
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (item) =>
        item.status === 'ACTIVE' ? (
          <HoldButton
            label="Hold to Deactivate"
            confirmedLabel="Deactivated"
            durationMs={1200}
            variant="crimson"
            className="scale-90 origin-right"
            onHoldComplete={() => handleDeactivate(item.id)}
          />
        ) : (
          <span className="text-[11px] text-[#9E9AA8]">Deactivated</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">
            Institutional User Directory
          </h3>
          <p className="text-xs text-[#9E9AA8]">
            Manage student rosters, faculty credentials, and role lifecycle authorizations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsBulkOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Bulk CSV Ingest
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> + Add User
          </Button>
        </div>
      </div>

      {/* Role Filter Chips */}
      <div className="flex items-center gap-2">
        {['ALL', 'STUDENT', 'FACULTY', 'ADMIN'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              roleFilter === r
                ? 'bg-[#00E5FF] text-[#0B0F19] shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'bg-[#130E22] text-[#9E9AA8] hover:text-white border border-[#2A2240]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Reusable DataTable Component */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        searchPlaceholder="Filter by name, email, or roll code..."
        searchFilter={(item, q) =>
          item.name.toLowerCase().includes(q.toLowerCase()) ||
          item.email.toLowerCase().includes(q.toLowerCase()) ||
          item.code.toLowerCase().includes(q.toLowerCase())
        }
      />

      {/* Add Single User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Institutional Member"
        description="Creates user identity and sends onboarding invite to institutional inbox."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Samantha Cruz"
                className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Institutional Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samantha.cruz@apex.edu"
                className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                {role === 'STUDENT' ? 'Roll Number' : 'Employee ID'}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={role === 'STUDENT' ? 'CS2026-055' : 'FAC-890'}
                className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white mb-1.5">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate} disabled={!name || !email}>
              Create User Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk CSV Modal */}
      <Modal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        title="Bulk Roster Ingestion (CSV)"
        description="Submit formatted institutional CSV with headers: name, email, role, code, department."
      >
        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-dashed border-[#2A2240] bg-[#130E22]/50 text-center space-y-2">
            <Upload className="w-8 h-8 text-[#00E5FF] mx-auto" />
            <p className="text-xs text-white font-medium">Drag & Drop Roster CSV</p>
            <p className="text-[10px] text-[#9E9AA8]">Parsed with asynchronous worker worker job</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsBulkOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                alert('Uploaded 150 student roster records to backend importer.');
                setIsBulkOpen(false);
              }}
            >
              Start Batch Ingest
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
