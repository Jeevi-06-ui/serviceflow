'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { Repository } from '@/lib/api/repository';
import { initializeStorage, resetDemoData as performReset } from '@/lib/mock/storage';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User;
  role: UserRole;
  demoUsers: User[];
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  resetAllDemoData: () => void;
  isAuthenticated: boolean;
  logout: () => void;
  login: (email: string, role?: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => Repository.auth.getCurrentUser());
  const [demoUsers, setDemoUsers] = useState<User[]>(() => Repository.auth.getAllDemoUsers());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    initializeStorage();
    const currentUser = Repository.auth.getCurrentUser();
    setUser(currentUser);
    setDemoUsers(Repository.auth.getAllDemoUsers());

    const handleStorageUpdate = () => {
      setUser(Repository.auth.getCurrentUser());
      setDemoUsers(Repository.auth.getAllDemoUsers());
    };

    window.addEventListener('serviceflow-storage-updated', handleStorageUpdate);
    return () => window.removeEventListener('serviceflow-storage-updated', handleStorageUpdate);
  }, []);

  const switchRole = (role: UserRole) => {
    const updatedUser = Repository.auth.demoLogin(role);
    setUser(updatedUser);
    setIsAuthenticated(true);

    // Route to the role's primary dashboard
    switch (role) {
      case 'customer':
        router.push('/customer/dashboard');
        break;
      case 'center':
        router.push('/center/dashboard');
        break;
      case 'technician':
        router.push('/technician/dashboard');
        break;
      case 'admin':
        router.push('/admin/dashboard');
        break;
    }
  };

  const switchUser = (userId: string) => {
    const updatedUser = Repository.auth.setCurrentUser(userId);
    setUser(updatedUser);
    setIsAuthenticated(true);
  };

  const login = (email: string, role?: UserRole) => {
    const loggedUser = Repository.auth.login(email, role);
    setUser(loggedUser);
    setIsAuthenticated(true);
    router.push(`/${loggedUser.role}/dashboard`);
  };

  const logout = () => {
    Repository.auth.logout();
    setIsAuthenticated(false);
    router.push('/login?logout=1');
  };

  const resetAllDemoData = () => {
    performReset();
    const currentUser = Repository.auth.getCurrentUser();
    setUser(currentUser);
    setIsAuthenticated(true);
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        demoUsers,
        switchRole,
        switchUser,
        resetAllDemoData,
        isAuthenticated,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
