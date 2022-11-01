import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthSession } from '../lib/authSession';

export const AuthContext = createContext<AuthSession | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    setLoading(true);
    async function fetchUser() {
      const resp = await fetch('/api/auth/user');

      if (resp.status === 200) {
        setUser((await resp.json()).user);
        setLoading(false);
      }

      if (resp.status === 401) router.push('/auth/login');
    }
    fetchUser();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
