import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Search, Bell, AlertTriangle, LogOut } from 'lucide-react';

export default function TopHeader() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-14 bg-panel border-b border-border flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search entities, cases..." 
            className="h-8 w-64 bg-elevated border border-border rounded pl-9 pr-3 text-sm text-text-main focus:outline-none focus:border-primary placeholder-text-secondary"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Synthetic Data Warning */}
        <div className="flex items-center px-3 py-1 bg-status-flagged/10 border border-status-flagged/30 rounded text-status-flagged text-xs font-medium font-mono uppercase tracking-wider">
          <AlertTriangle className="w-3 h-3 mr-2" />
          Synthetic Artifact — Unverified for Court Submission
        </div>

        {/* Actions */}
        <button className="text-text-secondary hover:text-text-main relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center pl-4 border-l border-border space-x-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-text-main leading-none">{user?.full_name}</span>
            <span className="text-xs text-text-secondary font-mono mt-1">{user?.role}</span>
          </div>
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
            {user?.full_name.charAt(0)}
          </div>
          <button onClick={logout} className="ml-2 text-text-secondary hover:text-status-flagged" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
