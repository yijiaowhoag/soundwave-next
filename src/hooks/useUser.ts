import { useState, useEffect } from 'react';
import Router from 'next/router';

interface User {
  isAuthenticated: boolean;
}

const useUser = ({
  redirectTo = '',
  redirectIfFound = false,
}: {
  redirectTo: string;
  redirectIfFound?: boolean;
}) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    fetch('/api/auth/user')
      .then((res) => res.json())
      .then((user) => setUser(user))
      .catch((err) => console.error(err));
  });

  useEffect(() => {
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isAuthenticated) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isAuthenticated)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, setUser };
};

export default useUser;
