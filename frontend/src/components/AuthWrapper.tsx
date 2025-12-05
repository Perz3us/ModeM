'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/services/api';

interface User {
  id: string;
  email: string;
  nickName: string;
  mobileNumber?: string;
}

interface AuthContextType {
  user: User | null;
  authorized: boolean;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authorized: false,
  loading: true,
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

import { TimerProvider } from '@/context/TimerContext';
import FloatingTimer from './FloatingTimer';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/login', '/register', '/'];

    if (!token) {
      if (!publicPaths.includes(pathname)) {
        setAuthorized(false);
        router.push('/login');
      } else {
        setAuthorized(true);
      }
      setLoading(false);
      return;
    }

    if (!authorized) setLoading(true);

    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
      setAuthorized(true);
      if (publicPaths.includes(pathname)) {
        router.push('/dashboard'); 
      }
    } catch (error) {
      if (!authorized) {
         // alert(`Session verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      localStorage.removeItem('token');
      setAuthorized(false);
      setUser(null);
      if (!publicPaths.includes(pathname)) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [router, pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthorized(false);
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // Prevent flashing of protected content
  const publicPaths = ['/login', '/register', '/'];
  if (!authorized && !publicPaths.includes(pathname)) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, authorized, loading, logout, refreshUser }}>
      <TimerProvider>
        {children}
        <FloatingTimer />
      </TimerProvider>
    </AuthContext.Provider>
  );
}
