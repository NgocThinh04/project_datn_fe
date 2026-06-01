// api/axios.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Tạo instance axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tự động thêm token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.MODE === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Log lỗi chi tiết
    console.log('🔍 Error response:', {
      status: error.response?.status,
      url: originalRequest?.url,
      message: error.message
    });
    
    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // KIỂM TRA: Nếu là request đăng ký hoặc login, KHÔNG xử lý refresh token
      const isAuthRequest = originalRequest.url?.includes('/auth/login') ||
                           originalRequest.url?.includes('/auth/register') ||
                           originalRequest.url?.includes('/auth/register-company') ||
                           originalRequest.url?.includes('/auth/refresh-token');
      
      if (isAuthRequest) {
        console.log('🔐 Auth request failed, no refresh needed');
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        console.log('⏳ Waiting for token refresh...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('🔄 Refresh token attempt, has refreshToken:', !!refreshToken);
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        // QUAN TRỌNG: Dùng axiosInstance thay vì axios để có baseURL
        const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
        console.log('📡 Refresh response:', response.data);
        
        const newToken = response.data.token || response.data.accessToken;
        
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          
          console.log('✅ Token refreshed successfully');
          processQueue(null, newToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('No token in refresh response');
        }
      } catch (refreshError: any) {
        console.error('❌ Refresh token failed:', refreshError.response?.data || refreshError.message);
        processQueue(refreshError as Error, null);
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('companyId');
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    const errorMessage = (error.response?.data as any)?.message || error.message || 'An error occurred';
    console.error('[API Error]', errorMessage);
    
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const removeAuthToken = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export default axiosInstance;