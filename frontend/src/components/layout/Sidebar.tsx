import React from 'react';
import { useAuthStore, Role } from '../../store/authStore';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Network, Clock, FolderLock, Bot, BarChart, FileText, Users, Database, ShieldAlert, History, Settings, ListTodo } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN', 'INVESTIGATOR', 'ANALYST', 'EVIDENCE_REVIEWER', 'VIEWER'] },
  { name: 'User Management', path: '/users', icon: Users, roles: ['SUPER_ADMIN'] },
  { name: 'Case Management', path: '/cases', icon: Briefcase, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN'] },
  { name: 'My Cases', path: '/cases', icon: Briefcase, roles: ['INVESTIGATOR', 'ANALYST'] },
  { name: 'Approved Cases', path: '/cases', icon: Briefcase, roles: ['VIEWER'] },
  { name: 'Review Queue', path: '/review', icon: ListTodo, roles: ['EVIDENCE_REVIEWER'] },
  { name: 'Dataset Management', path: '/datasets', icon: Database, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN'] },
  { name: 'Upload Evidence', path: '/upload', icon: Database, roles: ['INVESTIGATOR'] },
  { name: 'Network Graph', path: '/graph', icon: Network, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN', 'INVESTIGATOR', 'ANALYST', 'VIEWER'] },
  { name: 'Timeline', path: '/timeline', icon: Clock, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN', 'INVESTIGATOR', 'ANALYST', 'VIEWER'] },
  { name: 'Evidence Locker', path: '/evidence', icon: FolderLock, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN', 'INVESTIGATOR', 'EVIDENCE_REVIEWER', 'VIEWER'] },
  { name: 'Hacker AI', path: '/hacker-ai', icon: Bot, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN', 'INVESTIGATOR', 'ANALYST'] },
  { name: 'Analytics', path: '/analytics', icon: BarChart, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN', 'ANALYST'] },
  { name: 'Reports', path: '/reports', icon: FileText, roles: ['SUPER_ADMIN', 'INVESTIGATION_ADMIN', 'INVESTIGATOR', 'ANALYST', 'EVIDENCE_REVIEWER', 'VIEWER'] },
  { name: 'Audit Logs', path: '/audit', icon: History, roles: ['SUPER_ADMIN', 'EVIDENCE_REVIEWER'] },
  { name: 'System Settings', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
];

export default function Sidebar() {
  const user = useAuthStore(state => state.user);
  
  if (!user) return null;

  const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-panel border-r border-border flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-border">
        <h2 className="font-heading font-bold tracking-wide text-text-main">NETWORK HUNTER</h2>
        <p className="text-xs text-text-secondary font-mono mt-1">v2.0 / {user.role.replace('_', ' ')}</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {allowedItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-text-secondary hover:bg-elevated hover:text-text-main"
                  )
                }
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
