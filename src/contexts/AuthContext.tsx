import { useRouter } from 'next/router';
import { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthSession {
  accessToken: string;
  user: User;
}

export const AuthContext = createContext<AuthSession | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthSession>();

  useEffect(() => {
    setLoading(true);
    async function fetchUser() {
      const resp = await fetch('/api/auth/session');

      if (resp.status === 200) {
        setAuth((await resp.json()).session);
        setLoading(false);
      }

      if (resp.status === 401) router.push('/auth/login');
    }
    fetchUser();
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
