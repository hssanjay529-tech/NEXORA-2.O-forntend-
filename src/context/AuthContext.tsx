import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, UserRole, BackendHealth } from '../types';
import { api } from '../api/endpoints';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: UserProfile;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  backendHealth: BackendHealth;
  login: (email: string, password?: string, tenantSlug?: string, rememberMe?: boolean) => Promise<{ success: boolean; user?: any; error?: string }>;
  logout: () => void;
  refreshHealth: () => Promise<void>;
}

const defaultProfiles: Record<UserRole, UserProfile> = {
  STUDENT: {
    id: 'eeeeeeee-0000-0000-0000-000000000001',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    email: 'student.aarav.reddy1@apex.edu',
    first_name: 'Aarav',
    last_name: 'Reddy',
    role: 'STUDENT',
    roll_number: '2024CSE001',
    department_name: 'Department of Computer Science & Engineering',
    programme_name: 'B.Tech Computer Science & Engineering',
    current_semester: 5,
    cgpa: 3.84,
    is_active: true,
  },
  FACULTY: {
    id: 'aaaaaaaa-0000-0000-0000-000000000012',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    email: 'prof.priya@apex.edu',
    first_name: 'Dr. Priya',
    last_name: 'Nair',
    role: 'FACULTY',
    employee_id: 'FAC-CSE-002',
    department_name: 'Department of Computer Science & Engineering',
    is_active: true,
  },
  DEAN: {
    id: '2acee541-1735-4d62-ad94-602130299b4f',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    email: 'dean.engineering@apex.edu',
    first_name: 'Dr. Arvind',
    last_name: 'Swaminathan',
    role: 'DEAN',
    employee_id: 'DEAN-ENG-001',
    department_name: 'School of Engineering',
    is_active: true,
  },
  ADMIN: {
    id: 'aaaaaaaa-0000-0000-0000-000000000001',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@apex.edu',
    first_name: 'Dr. Rajesh',
    last_name: 'Sharma',
    role: 'ADMIN',
    employee_id: 'ADM-001',
    department_name: 'Institutional Governance',
    is_active: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const savedRole = sessionStorage.getItem('nexora_auth_role') || localStorage.getItem('nexora_auth_role');
      if (savedRole === 'ADMIN' || savedRole === 'FACULTY' || savedRole === 'STUDENT' || savedRole === 'DEAN') {
        return savedRole as UserRole;
      }
    } catch {
      // ignore
    }
    return 'STUDENT';
  });

  const [user, setUser] = useState<UserProfile>(() => defaultProfiles[role] || defaultProfiles.STUDENT);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('nexora_auth_token') || localStorage.getItem('nexora_auth_token');
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('nexora_auth_authenticated') === 'true' ||
             localStorage.getItem('nexora_auth_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [backendHealth, setBackendHealth] = useState<BackendHealth>({
    online: false,
    message: 'Checking FastAPI connection...',
  });

  const checkHealth = async () => {
    const health = await api.getHealth();
    setBackendHealth(health);
  };

  useEffect(() => {
    checkHealth();

    const storedToken = sessionStorage.getItem('nexora_auth_token') || localStorage.getItem('nexora_auth_token');
    if (storedToken) {
      apiClient.setAuthToken(storedToken);
      setToken(storedToken);
      api.auth
        .getMe()
        .then((profile) => {
          if (profile) {
            setUser((prev) => ({
              ...prev,
              ...profile,
            }));
            const authenticRole = (profile.role || 'STUDENT') as UserRole;
            setRoleState(authenticRole);
            sessionStorage.setItem('nexora_auth_role', authenticRole);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          // Token invalid or expired - force sign-in
          logout();
        });
    } else {
      setIsAuthenticated(false);
    }

    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const login = async (
    email: string,
    password?: string,
    tenantSlug?: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
      const res = await api.auth.login(email, password || 'Password123!', tenantSlug, rememberMe);
      if (res && res.access_token) {
        setToken(res.access_token);
        apiClient.setAuthToken(res.access_token);
        setIsAuthenticated(true);

        const authenticRole = (res.user?.role || 'STUDENT') as UserRole;
        setRoleState(authenticRole);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('nexora_auth_authenticated', 'true');
        storage.setItem('nexora_auth_token', res.access_token);
        storage.setItem('nexora_auth_role', authenticRole);

        const baseProfile = defaultProfiles[authenticRole] || defaultProfiles.STUDENT;
        const profileUpdate: UserProfile = {
          ...baseProfile,
          id: res.user?.id || baseProfile.id,
          email: res.user?.email || email,
          first_name: res.user?.first_name || baseProfile.first_name,
          last_name: res.user?.last_name || baseProfile.last_name,
          role: authenticRole,
          roll_number: res.user?.identifier,
          employee_id: res.user?.identifier,
          department_name: res.user?.department_name || baseProfile.department_name,
          programme_name: res.user?.programme_name || baseProfile.programme_name,
        };
        setUser(profileUpdate);

        // Fetch deep profile from backend asynchronously
        try {
          const me = await api.auth.getMe();
          if (me) {
            setUser((prev) => ({ ...prev, ...me }));
            if (me.role) {
              setRoleState(me.role as UserRole);
              storage.setItem('nexora_auth_role', me.role);
            }
          }
        } catch {
          // ignore deep profile fetch error
        }
        return { success: true, user: res.user };
      }
      return { success: false, error: 'Authentication failed. Please check credentials.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication failed. Please check credentials.' };
    }
  };

  const logout = () => {
    setToken(null);
    apiClient.setAuthToken(null);
    setIsAuthenticated(false);
    api.auth.logout().catch(() => {});
    try {
      sessionStorage.removeItem('nexora_auth_authenticated');
      sessionStorage.removeItem('nexora_auth_token');
      sessionStorage.removeItem('nexora_auth_role');
      localStorage.removeItem('nexora_auth_authenticated');
      localStorage.removeItem('nexora_auth_token');
      localStorage.removeItem('nexora_auth_role');
    } catch {
      // ignore storage error
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        backendHealth,
        login,
        logout,
        refreshHealth: checkHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
