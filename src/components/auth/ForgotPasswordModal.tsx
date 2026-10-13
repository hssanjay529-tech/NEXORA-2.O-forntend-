import React, { useState } from 'react';
import { Mail, KeyRound, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { api } from '../../api/endpoints';
import { Button } from '../ui/Button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  tenantSlug?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  tenantSlug,
}) => {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState(defaultEmail);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api.auth.forgotPassword(email, tenantSlug);
      setMessage(res.message || 'Password reset instructions dispatched.');
      if (res.demo_reset_token) {
        setToken(res.demo_reset_token);
        setStep('reset');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.resetPassword(token, newPassword);
      setMessage(res.message || 'Password successfully updated.');
      setTimeout(() => {
        onClose();
        setStep('request');
      }, 1800);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#130E22] border border-[#2A2240] p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-[#9E9AA8] hover:text-white hover:bg-[#1E1736] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-[#00E5FF]">
            {step === 'request' ? <Mail className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              {step === 'request' ? 'Institutional Account Recovery' : 'Set New Password'}
            </h3>
            <p className="text-xs text-[#9E9AA8]">
              {step === 'request'
                ? 'Enter your registered email to receive a recovery token'
                : 'Enter recovery token and choose a strong password'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Registered Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9AA8]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@apex.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1C1533] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading}>
                <span>Send Recovery Token</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCompleteReset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white mb-1.5">Recovery Token</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste recovery token"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1533] border border-[#2A2240] text-xs text-white font-mono focus:border-[#00E5FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1533] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1533] border border-[#2A2240] text-xs text-white focus:border-[#00E5FF] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setStep('request')}
              >
                Back
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading}>
                <span>Update Password</span>
                <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
