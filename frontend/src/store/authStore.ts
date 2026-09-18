import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'SUPER_ADMIN' | 'INVESTIGATION_ADMIN' | 'INVESTIGATOR' | 'ANALYST' | 'EVIDENCE_REVIEWER' | 'VIEWER';

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  role: Role;
  department: string;
  organization: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'network-hunter-auth',
    }
  )
);
