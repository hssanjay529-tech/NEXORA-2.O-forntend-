import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginView } from './LoginView';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, token, logout } = useAuth();

  // Double check token expiration or tampering
  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      // Decode JWT payload without external library
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const exp = payload.exp;
        if (exp && Date.now() >= exp * 1000) {
          // Token expired: immediately trigger logout
          logout();
        }
      }
    } catch {
      // Corrupted token
      logout();
    }
  }, [token, isAuthenticated, logout]);

  // 1. Strict Authentication Guard: Unauthenticated users NEVER receive child DOM elements
  if (!isAuthenticated || !token) {
    return <LoginView />;
  }

  // 2. Strict Role-Based Access Control (RBAC) Guard
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-cosmic-900/60 border border-crimson/30 rounded-3xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-crimson/15 border border-crimson/30 flex items-center justify-center mb-6 text-crimson">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-8a4 4 0 10-8 0v4h8V7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-wide">
          403 — Restricted Workspace
        </h2>
        <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          Your current authenticated role (<span className="text-cyan font-mono font-bold">{role}</span>) does not possess institutional authorization to access this sector.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-cosmic-800 border border-cosmic-700 hover:border-cyan text-slate-200 hover:text-cyan text-xs font-mono transition-all"
        >
          Return to Assigned Workspace
        </button>
      </div>
    );
  }

  // 3. User is authenticated and authorized: render protected component tree
  return <>{children}</>;
};
