import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Mail,
  Building2,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Search,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../api/endpoints';
import type { PublicTenant, UserRole } from '../../types';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

interface VerifiedPreview {
  name: string;
  role: UserRole;
  identifier: string;
  department_name: string;
  institution_name: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const { tenant, setTenantId } = useTenant();

  const [tenants, setTenants] = useState<PublicTenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<PublicTenant | null>(null);
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [tenantSearchQuery, setTenantSearchQuery] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedPreview, setVerifiedPreview] = useState<VerifiedPreview | null>(null);

  // Load public tenants list
  useEffect(() => {
    let mounted = true;
    api.tenants.getPublic().then((list) => {
      if (mounted && list && list.length > 0) {
        setTenants(list);
        // Default to active tenant or first tenant
        const matching = list.find((t) => t.id === tenant?.id || t.slug === 'apex-institute');
        setSelectedTenant(matching || list[0]);
      }
    });
    return () => {
      mounted = false;
    };
  }, [tenant?.id]);

  // Auto-detect institution domain from email input
  const handleEmailChange = (val: string) => {
    setEmail(val);
    setErrorMessage(null);
    if (val.includes('@') && tenants.length > 0) {
      const domainPart = val.split('@')[1]?.toLowerCase();
      if (domainPart) {
        const detected = tenants.find(
          (t) =>
            (t.domain && domainPart.includes(t.domain.toLowerCase())) ||
            (t.slug && domainPart.includes(t.slug.toLowerCase())) ||
            (domainPart.includes('apex') && t.slug.includes('apex')) ||
            (domainPart.includes('metro') && t.slug.includes('metro'))
        );
        if (detected && detected.id !== selectedTenant?.id) {
          setSelectedTenant(detected);
          setTenantId(detected.id);
        }
      }
    }
  };

  const handleSelectTenant = (t: PublicTenant) => {
    setSelectedTenant(t);
    setTenantId(t.id);
    setIsTenantDropdownOpen(false);
  };

  const filteredTenants = useMemo(() => {
    if (!tenantSearchQuery.trim()) return tenants;
    const q = tenantSearchQuery.toLowerCase();
    return tenants.filter(
      (t) => t.name.toLowerCase().includes(q) || (t.domain && t.domain.toLowerCase().includes(q))
    );
  }, [tenants, tenantSearchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await login(
        email.trim(),
        password,
        selectedTenant?.slug || selectedTenant?.id,
        rememberMe
      );

      if (res.success && res.user) {
        const user = res.user;
        const role = (user.role || 'STUDENT') as UserRole;
        setVerifiedPreview({
          name: user.full_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Verified Member',
          role,
          identifier: user.identifier || (role === 'STUDENT' ? 'STU-AUTH-01' : 'EMP-AUTH-01'),
          department_name: user.department_name || user.programme_name || 'Institutional Operations',
          institution_name: selectedTenant?.name || user.tenant?.name || 'Apex Institute of Technology',
        });

        // Trigger smooth transition after badge animation
        setTimeout(() => {
          onLoginSuccess();
        }, 850);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your institutional email and password.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check credentials or tenant domain.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'violet';
      case 'DEAN':
        return 'amber';
      case 'FACULTY':
        return 'cyan';
      default:
        return 'emerald';
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-8">
      {/* Ambient Volumetric Light Pillar Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#7C3AED]/20 via-[#00E5FF]/20 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Form Column */}
        <div className="lg:col-span-7 glass-card p-8 border-[#3A2D5C] shadow-2xl relative">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 via-cyan-400 to-transparent opacity-40 blur-md rounded-full pointer-events-none" />
              <img
                src="/assets/nexora-logo-mark.png"
                alt="NEXORA Logo"
                className="relative w-12 h-12 object-contain drop-shadow-[0_0_14px_rgba(34,211,238,0.45)]"
              />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-white tracking-wide">
                NEXORA
              </h1>
              <p className="text-xs text-[#9E9AA8]">Multi-Tenant College Operations Portal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Searchable Institution Dropdown */}
            <div className="relative">
              <label className="block text-xs font-medium text-white mb-1.5 flex items-center justify-between">
                <span>Target Institution / Tenant Domain</span>
                {selectedTenant?.domain && (
                  <span className="text-[10px] text-[#00E5FF] font-mono">@{selectedTenant.domain}</span>
                )}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTenantDropdownOpen((prev) => !prev)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white text-left flex items-center justify-between hover:border-[#00E5FF]/60 transition-all focus:outline-none"
                >
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00E5FF]" />
                  <span className="truncate">
                    {selectedTenant ? selectedTenant.name : 'Select Institution...'}
                  </span>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9AA8]" />
                </button>

                {isTenantDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl bg-[#130E22] border border-[#3A2D5C] shadow-2xl p-2 backdrop-blur-md">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E9AA8]" />
                      <input
                        type="text"
                        placeholder="Search institution..."
                        value={tenantSearchQuery}
                        onChange={(e) => setTenantSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#1C1533] border border-[#2A2240] text-xs text-white placeholder-[#9E9AA8] focus:border-[#00E5FF] focus:outline-none"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                      {filteredTenants.length > 0 ? (
                        filteredTenants.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleSelectTenant(t)}
                            className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                              t.id === selectedTenant?.id
                                ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-medium'
                                : 'text-gray-300 hover:bg-[#1C1533] hover:text-white'
                            }`}
                          >
                            <span className="truncate">{t.name}</span>
                            {t.domain && (
                              <span className="text-[10px] text-[#9E9AA8] font-mono ml-2 shrink-0">
                                {t.domain}
                              </span>
                            )}
                          </button>
                        ))
                      ) : (
                        <p className="p-2 text-xs text-[#9E9AA8] text-center">No institutions found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9AA8]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. your.id@apex.edu"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#5D5770] focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9AA8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-xs text-white placeholder-[#5D5770] focus:border-[#00E5FF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E9AA8] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#9E9AA8] hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#130E22] border border-[#2A2240] text-[#00E5FF] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[#00E5FF] hover:underline transition-all"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-crimson/15 border border-crimson/30 text-xs text-rose-300 flex items-center gap-2">
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Unified Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center text-sm font-semibold mt-3"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign in to Workspace'}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>

        {/* Right Column: ReactBits 3D Lanyard ID Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 text-center">
          {/* Lanyard Strap */}
          <div
            className={`w-4 h-16 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.4)] mb-[-8px] z-20 transition-all duration-500 ${
              verifiedPreview
                ? 'bg-gradient-to-b from-[#10B981] to-[#00E5FF]'
                : 'bg-gradient-to-b from-[#7C3AED] to-[#00E5FF]'
            }`}
          />
          <div className="w-8 h-3 bg-[#1C1533] border border-[#3A2D5C] rounded-md z-20 mb-[-4px]" />

          {/* Interactive ID Badge Card */}
          <div
            className={`w-full max-w-xs rounded-2xl p-6 bg-gradient-to-br from-[#16102B] via-[#120D24] to-[#0B0813] border-2 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-left relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
              verifiedPreview
                ? 'border-[#10B981] ring-2 ring-[#10B981]/30 shadow-[0_0_35px_rgba(16,185,129,0.3)]'
                : 'border-[#00E5FF]/40'
            }`}
          >
            {/* Top Gloss Highlight */}
            <div
              className={`absolute top-0 inset-x-0 h-[2px] transition-all duration-500 ${
                verifiedPreview
                  ? 'bg-gradient-to-r from-transparent via-[#10B981] to-transparent'
                  : 'bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent'
              }`}
            />

            <div className="flex items-center justify-between pb-3 border-b border-[#2A2240] mb-4">
              <span className="font-heading font-extrabold text-sm text-[#00E5FF] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                NEXORA ID
              </span>
              {verifiedPreview ? (
                <Badge variant={getRoleBadgeVariant(verifiedPreview.role)}>
                  {verifiedPreview.role}
                </Badge>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 animate-pulse">
                  PENDING AUTH
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-xl p-[2px] transition-all duration-500 ${
                    verifiedPreview
                      ? 'bg-gradient-to-tr from-[#10B981] to-[#00E5FF]'
                      : 'bg-gradient-to-tr from-[#7C3AED]/50 to-[#2A2240]'
                  }`}
                >
                  <div className="w-full h-full bg-[#130E22] rounded-[10px] flex items-center justify-center font-heading font-bold text-white text-lg">
                    {verifiedPreview
                      ? verifiedPreview.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : '••'}
                  </div>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    {verifiedPreview ? verifiedPreview.name : 'Your NEXORA ID'}
                  </h4>
                  <p className="text-[11px] text-[#9E9AA8]">
                    {verifiedPreview
                      ? verifiedPreview.department_name
                      : 'Institutional Account Workspace'}
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#130E22] border border-[#2A2240] text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#9E9AA8]">Identifier:</span>
                  <span className="text-white font-mono font-medium">
                    {verifiedPreview ? verifiedPreview.identifier : '••••••••••'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9AA8]">Institution:</span>
                  <span className="text-[#00E5FF] truncate max-w-[150px]">
                    {verifiedPreview
                      ? verifiedPreview.institution_name
                      : selectedTenant?.name || 'Apex Institute'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#2A2240] text-[10px] text-[#9E9AA8]">
                <span>
                  Status:{' '}
                  {verifiedPreview ? (
                    <strong className="text-[#10B981] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 inline" /> VERIFIED
                    </strong>
                  ) : (
                    <strong className="text-[#9E9AA8]">AWAITING SIGN-IN</strong>
                  )}
                </span>
                <QrCode
                  className={`w-6 h-6 transition-colors ${
                    verifiedPreview ? 'text-[#10B981]' : 'text-[#5D5770]'
                  }`}
                />
              </div>
            </div>
          </div>

          <span className="text-[11px] text-[#9E9AA8] mt-4 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" /> Dynamic 3D Lanyard Preview (ReactBits)
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={email}
        tenantSlug={selectedTenant?.slug}
      />
    </div>
  );
};
