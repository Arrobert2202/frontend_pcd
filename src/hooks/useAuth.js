import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
      } else {
        setIsLoggedIn(true);
        setUser(decoded);
      }
    } catch {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  return { user, isLoggedIn, loading };
}