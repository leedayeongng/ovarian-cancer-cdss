'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type UserRole = 'doctor' | 'nurse';

interface AuthState {
  role: UserRole | null;
  isLoaded: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  role: null,
  isLoaded: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user-role');
    if (stored === 'doctor' || stored === 'nurse') setRole(stored);
    setIsLoaded(true);
  }, []);

  const login = (r: UserRole) => {
    setRole(r);
    localStorage.setItem('user-role', r);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('user-role');
  };

  return (
    <AuthContext.Provider value={{ role, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
