import React, { useState } from 'react';
import { ShieldCheck, Award, Mail, Phone, Sparkles } from 'lucide-react';
import type { UserProfile } from '../../types';

interface ProfileCardProps {
  user: Partial<UserProfile>;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, className = '' }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -y / 15,
      y: x / 15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const roleGlow =
    user.role === 'ADMIN'
      ? 'from-[#7C3AED] via-[#9333EA] to-[#C084FC]'
      : user.role === 'FACULTY'
      ? 'from-[#06B6D4] via-[#0284C7] to-[#38BDF8]'
      : 'from-[#00E5FF] via-[#10B981] to-[#34D399]';

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#16102B]/90 via-[#120D24]/85 to-[#090611] border border-[#3A2D5C]/60 shadow-[0_16px_40px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Holographic foil shimmer reflection */}
      <div
        className="pointer-events-none absolute -inset-full opacity-20 bg-gradient-to-tr from-transparent via-[#00E5FF]/30 to-transparent"
        style={{
          transform: `translate(${rotate.y * 5}%, ${rotate.x * 5}%)`,
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar with dynamic glow ring */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${roleGlow} p-[2.5px] shadow-[0_0_20px_rgba(0,229,255,0.3)]`}>
              <div className="w-full h-full bg-[#0B0813] rounded-[14px] flex items-center justify-center font-heading font-extrabold text-2xl text-white">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#130E22] border border-[#2A2240] text-[#00E5FF] flex items-center gap-1 shadow">
              <Sparkles className="w-2.5 h-2.5 text-[#00E5FF]" />
              <span>{user.role}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-heading font-extrabold text-xl text-white tracking-wide">
                {user.first_name} {user.last_name}
              </h2>
              <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
            </div>

            <p className="text-xs text-[#9E9AA8] mt-0.5">
              {user.department_name || 'Department of Computer Science & Engineering'}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#1C1533] border border-[#2A2240] text-white font-mono font-medium">
                {user.roll_number || user.employee_id || 'ID: APEX-2026-X'}
              </span>
              {user.current_semester && (
                <span className="px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 font-medium">
                  Semester {user.current_semester}
                </span>
              )}
              {user.cgpa && (
                <span className="px-2.5 py-1 rounded-lg bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20 font-medium flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  CGPA: {user.cgpa.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact metadata */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[#2A2240] md:pl-6 text-xs text-[#9E9AA8]">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-white font-mono text-[11px]">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>+1 (555) 304-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
