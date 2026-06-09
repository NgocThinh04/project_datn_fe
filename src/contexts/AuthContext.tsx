import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';
import type { User, LoginRequest, LoginResponse } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token và user khi load app
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Optional: Set token cho axios interceptor
          authApi.setAuthToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Nếu có lỗi, xóa dữ liệu trong localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  setLoading(true);
  try {
    const response: LoginResponse = await authApi.login(credentials);
    
    // Lưu token (BE trả về field "token", không phải "accessToken")
    const accessToken = response.token;  // BE trả về token
    const refreshToken = response.refreshToken;
     console.log('companyId from response:', response.companyId);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user_id',response.user_id);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
      if (response.companyId) {
    localStorage.setItem('companyId', response.companyId);
  }
    // Set token cho axios interceptor
    authApi.setAuthToken(accessToken);
    
    // Lưu toàn bộ thông tin user
    const userData: User = {
      username: response.username,
      role: response.role,
      position: response.position,
      companyId: response.companyId,
      companyCode: response.companyCode,
      email: response.email,
      address: response.address,
      number_phone: response.number_phone,
      create_at: response.create_at,
      name: response.name || response.username
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(accessToken);
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};
  
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Clear axios token
    authApi.logout();
    
    // Clear state
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'Admin' || user?.role === 'admin';
  const isUser = user?.role === 'USER' || user?.role === 'User' || user?.role === 'user';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated,
      isAdmin,
      isUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};