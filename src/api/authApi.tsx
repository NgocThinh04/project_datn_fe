import axiosInstance from './axios';
import type {
    LoginRequest,
    LoginResponse,
    RegisterCompanyRequest,
    RegisterResponse,
    UserData,
    ChangePasswordRequest,
    UpdateProfileRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ApiResponse,
    RegisterRequest
} from '../types';

const authApi = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(`/auth/login`, credentials);
    return response.data;
  },
  
  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Xóa token khỏi headers của axios
    delete axiosInstance.defaults.headers.common['Authorization'];
  },
  
  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: (): UserData | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
      }
    }
    return null;
  },
  
  // Lấy thông tin user từ API (cập nhật mới nhất)
  fetchCurrentUser: async (): Promise<UserData> => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  },
  
  // Đăng ký công ty
  registerCompany: async (data: RegisterCompanyRequest): Promise<RegisterResponse> => {
    try {
      const response = await axiosInstance.post('/auth/register-company', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },
  
  // Đăng ký user thường (không có company)
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },
  
  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post('/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Change password failed' };
    }
  },
  
  // Quên mật khẩu - gửi email reset
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Request failed' };
    }
  },
  
  // Reset mật khẩu với token
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Reset password failed' };
    }
  },
  
  // Cập nhật thông tin profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserData> => {
    try {
      const response = await axiosInstance.put('/users/profile', data);
      // Cập nhật lại user trong localStorage
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      throw error.response?.data || { error: 'Update profile failed' };
    }
  },
  
  // Refresh token (lấy token mới khi token cũ hết hạn)
  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
      const { token } = response.data;
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { token };
    } catch (error: any) {
      throw error.response?.data || { error: 'Refresh token failed' };
    }
  },
  
  // Xác thực email
  verifyEmail: async (token: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post(`/auth/verify-email?token=${token}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Verification failed' };
    }
  },
  
  // Gửi lại email xác thực
  resendVerificationEmail: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Resend failed' };
    }
  },
  
  // Set token cho axios instance
  setAuthToken: (token: string | null) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },
  
  // Kiểm tra token có hợp lệ không
  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.get('/auth/verify-token');
      return response.data.valid === true;
    } catch (error) {
      return false;
    }
  },
  
  // Lấy danh sách users (chỉ Admin)
  getAllUsers: async (): Promise<UserData[]> => {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Get users failed' };
    }
  },
  
  // Lấy user theo ID (chỉ Admin)
  getUserById: async (userId: string): Promise<UserData> => {
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Get user failed' };
    }
  },
  
  // Cập nhật user (chỉ Admin)
  updateUserByAdmin: async (userId: string, data: Partial<UserData>): Promise<UserData> => {
    try {
      const response = await axiosInstance.put(`/admin/users/${userId}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Update user failed' };
    }
  },
  
  // Xóa user (chỉ Admin)
  deleteUser: async (userId: string): Promise<ApiResponse> => {
    try {
      const response = await axiosInstance.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Delete user failed' };
    }
  }
};

export default authApi;