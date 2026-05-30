import axiosInstance from './axios';
import type {
    LoginRequest,
    LoginResponse,
    RegisterCompanyRequest,
    RegisterResponse
} from '../types';

const authApi = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Đăng ký công ty
  registerCompany: async (data: RegisterCompanyRequest): Promise<RegisterResponse> => {
    try {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authApi;