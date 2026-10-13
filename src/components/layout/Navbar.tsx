import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/endpoints';
import type { PortalNotification } from '../../types';

export const Navbar: React.FC = () => {
  const { role, backendHealth, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);

  useEffect(() => {
    const loadNotifs = () => api.notifications.getList().then(setNotifications);
    loadNotifs();

    window.addEventListener('nexora_notification_update', loadNotifs);
    return () => window.removeEventListener('nexora_notification_update', loadNotifs);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-cosmic-700/60 bg-cosmic-950/70 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      {/* Search Input with Command Bar Shortcut */}
      <div className="relative w-72 md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Search subjects, faculty, schedule (e.g. CS-301)..." 
          readOnly
          className="w-full bg-cosmic-900/80 border border-cosmic-700 text-xs rounded-xl pl-9 pr-14 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/30 cursor-default"
        />
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
          <kbd className="text-[10px] font-mono bg-cosmic-800 text-slate-400 border border-cosmic-700 px-1.5 py-0.5 rounded shadow-sm">⌘K</kbd>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Backend Online status pill */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cosmic-900 border border-cosmic-700 text-xs text-slate-300">
          <span className={`w-2 h-2 rounded-full ${backendHealth.online ? 'bg-mint animate-pulse' : 'bg-crimson'}`} />
          <span className="font-mono text-[11px] text-slate-300">
            {backendHealth.online ? 'FastAPI Online' : 'FastAPI Offline'}
          </span>
        </div>

        {/* User Role Badge (Static based on authenticated JWT session) */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cosmic-900 border border-cosmic-700 text-xs shadow-sm">
          <span className="text-[11px] text-slate-400 font-mono">Role:</span>
          <span
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold tracking-wide ${
              role === 'ADMIN'
                ? 'bg-gradient-to-r from-cyan to-violet text-white shadow-glow-cyan'
                : role === 'DEAN'
                ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                : role === 'FACULTY'
                ? 'bg-violet text-white shadow-glow-violet'
                : 'bg-cyan text-black shadow-glow-cyan'
            }`}
          >
            {role}
          </span>
        </div>

        {/* Semester Badge Selector */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cosmic-900 border border-cosmic-700 text-xs text-slate-300">
          <svg className="w-3.5 h-3.5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-slate-200">Spring Term 2026</span>
          <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-1 rounded">Sem 4</span>
        </div>

        {/* BellToggle Notification Micro-Component */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-cosmic-900 border border-cosmic-700 hover:border-cyan/50 text-slate-300 hover:text-cyan transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-cosmic-900 border border-cosmic-700 shadow-glass-elevated p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-cosmic-700/60 mb-3">
                <span className="font-display font-bold text-sm text-white">Portal Alerts</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan/10 text-cyan">
                  {unreadCount} New
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {notifications.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-cosmic-950/70 border border-cosmic-700/60">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Fee Settlement Alert Pill */}
        <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-cosmic-700">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber/15 text-amber border border-amber/30 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            <span>Fee Due: ₹24,500</span>
          </span>
        </div>

        {/* Logout Action */}
        <button
          type="button"
          onClick={logout}
          className="p-1.5 rounded-xl bg-cosmic-900 border border-cosmic-700 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all text-xs flex items-center gap-1.5 px-3 cursor-pointer"
          title="Sign Out of Portal"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-mono text-[11px] font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};
