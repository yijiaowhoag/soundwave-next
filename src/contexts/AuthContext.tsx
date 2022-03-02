import { createContext, useEffect, useState } from 'react';
import { getAccessTokenFromLocalCookie } from '../lib/cookies';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const token = getAccessTokenFromLocalCookie();
    setToken(token);
    setLoading(false);
  }, [loading]);

  if (loading) return <span>Loading...</span>;

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
};
