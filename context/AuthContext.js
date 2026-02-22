import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_id');
    const savedName = localStorage.getItem('user_name');
    const savedEmail = localStorage.getItem('user_email');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser({
        id: savedUser,
        name: savedName,
        email: savedEmail,
      });
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_id', userData.id);
    localStorage.setItem('user_name', userData.name);
    localStorage.setItem('user_email', userData.email);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
