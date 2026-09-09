import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Sync auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      let message;
      if (!err.response) {
        message = 'Cannot connect to backend server. Please make sure Spring Boot is running on port 8081.';
      } else if (err.response.status === 500 || err.response.status === 502 || err.response.status === 504) {
        message = err.response.data?.message || 'Backend server is offline on port 8081 (Proxy Error ' + err.response.status + '). Please start Spring Boot.';
      } else if (err.response.status === 401 || err.response.status === 400) {
        message = err.response.data?.message || 'Invalid email or password. Please check your credentials.';
      } else {
        message = err.response.data?.message || 'Authentication failed (HTTP ' + err.response.status + ').';
      }
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        const { token: jwtToken, ...userInfo } = res.data;
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setToken(jwtToken);
        setUser(userInfo);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      let message;
      if (!err.response) {
        message = 'Cannot connect to backend server. Please make sure Spring Boot is running on port 8081.';
      } else if (err.response.status === 500 || err.response.status === 502 || err.response.status === 504) {
        message = err.response.data?.message || 'Backend server is offline on port 8081 (Proxy Error ' + err.response.status + '). Please start Spring Boot.';
      } else {
        message = err.response.data?.message || 'Registration failed (' + (err.response.data?.error || 'HTTP ' + err.response.status) + ')';
      }
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
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

export default AuthContext;
